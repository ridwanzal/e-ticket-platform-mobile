const express = require('express');
const router = express.Router();
const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');

const parser = new Parser();
const FEED_URL = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCE6Tp0JEZ6THr24ny5i-jfg';

// Cache settings
const CACHE_FILE = path.join(__dirname, '../cache/video_cache.json');
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// In-memory cache
let memoryCache = null;
let memoryCacheTime = 0;

function isMemoryCacheValid(ttl) {
    return memoryCache && (Date.now() - memoryCacheTime < ttl);
}

function isFileCacheValid(filePath, ttl) {
    try {
        const stats = fs.statSync(filePath);
        const age = Date.now() - new Date(stats.mtime).getTime();
        return age < ttl;
    } catch {
        return false;
    }
}

function readCacheSafe(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8').trim();
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
}

function saveCacheSafe(filePath, data) {
    try {
        const tmpPath = filePath + '.tmp';
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf8');
        fs.renameSync(tmpPath, filePath);
    } catch (err) {
        console.error('Failed to save cache:', err);
    }
}

router.get('/', async function (req, res) {
    try {
        let videos;

        // 1. Use in-memory cache if valid
        if (isMemoryCacheValid(CACHE_TTL)) {
            console.log('Serving videos from memory cache...');
            videos = memoryCache;
        }

        // 2. If no memory cache, try file cache
        if (!videos && isFileCacheValid(CACHE_FILE, CACHE_TTL)) {
            console.log('Serving videos from file cache...');
            videos = readCacheSafe(CACHE_FILE);
            memoryCache = videos; // store in memory
            memoryCacheTime = Date.now();
        }

        // 3. If no cache, fetch new data from YouTube
        if (!videos) {
            console.log('Fetching videos from YouTube RSS...');
            const feed = await parser.parseURL(FEED_URL);

            // Map items once, and maybe limit
            videos = feed.items.map(item => ({
                title: item.title,
                link: item.link,
                pubDate: item.pubDate,
                videoId: item.id.replace('yt:video:', '')
            }));

            // Optional: limit to latest N items for faster render
            videos = videos.slice(0, 20);

            // Save to both memory and file
            memoryCache = videos;
            memoryCacheTime = Date.now();
            saveCacheSafe(CACHE_FILE, videos);
        }

        // 4. Render videos
        res.render('pages/video', {
            title: 'Video List - E-Ibu Cerdas',
            description: 'Kumpulan video edukasi dan inspirasi dari E-Ibu Cerdas.',
            videos
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to fetch YouTube feed');
    }
});

module.exports = router;
