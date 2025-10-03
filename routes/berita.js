const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/db');
const { connection } = require('../config/db');
const { last } = require('lodash');
const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');

const parser = new Parser();
// List all feed URLs you want to pull from
const FEED_URLS = [
    'https://www.cnbcindonesia.com/rss', // Example: finance news
    // add more as needed
];

// Cache settings
const CACHE_FILE = path.join(__dirname, '../cache/berita_cache.json');
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// In-memory cache
let memoryCache = null;
let memoryCacheTime = 0;

// Check in-memory cache validity
function isMemoryCacheValid(ttl) {
    return memoryCache && (Date.now() - memoryCacheTime < ttl);
}

// Check file cache validity
function isFileCacheValid(filePath, ttl) {
    try {
        const stats = fs.statSync(filePath);
        const age = Date.now() - new Date(stats.mtime).getTime();
        return age < ttl;
    } catch {
        return false;
    }
}

// Read cache file safely
function readCacheSafe(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8').trim();
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
}

// Save cache file safely
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
        let allFeeds;

        // 1. Serve from memory cache if valid
        if (isMemoryCacheValid(CACHE_TTL)) {
            console.log('Serving berita from memory cache...');
            allFeeds = memoryCache;
        }

        // 2. Serve from file cache if valid
        if (!allFeeds && isFileCacheValid(CACHE_FILE, CACHE_TTL)) {
            console.log('Serving berita from file cache...');
            allFeeds = readCacheSafe(CACHE_FILE);
            memoryCache = allFeeds;
            memoryCacheTime = Date.now();
        }

        // 3. Fetch from internet if no valid cache
        if (!allFeeds) {
            console.log('Fetching berita from RSS feeds...');

            const feedResults = await Promise.all(
                FEED_URLS.map(url =>
                    parser.parseURL(url).catch(err => {
                        console.error(`Error fetching ${url}`, err);
                        return null;
                    })
                )
            );

            allFeeds = [];

            // Flatten and normalize
            feedResults.forEach(feed => {
                if (feed && feed.items) {
                    feed.items.forEach(item => {
                        allFeeds.push({
                            source: feed.title || 'Unknown Source',
                            title: item.title,
                            link: item.link,
                            pubDate: new Date(item.pubDate),
                            contentSnippet: item.contentSnippet || '',
                            isoDate: item.isoDate || null
                        });
                    });
                }
            });

            // Sort newest first
            allFeeds.sort((a, b) => b.pubDate - a.pubDate);

            // Optional: limit to N latest articles for speed
            allFeeds = allFeeds.slice(0, 30);

            // Save to cache
            memoryCache = allFeeds;
            memoryCacheTime = Date.now();
            saveCacheSafe(CACHE_FILE, allFeeds);
        }

        // 4. Render page
        res.render('pages/blog', {
            messageContact: req.session.messageContact,
            title: 'E-Ibu Cerdas',
            type: 'website',
            canonical: 'E-Ibu Cerdas',
            author: 'E-Ibu Cerdas',
            description: 'E-Ibu Cerdas adalah platform edukasi dan investasi yang membantu ibu-ibu cerdas dalam mengelola keuangan keluarga.',
            keywords: 'E-Ibu Cerdas, Investasi, Edukasi',
            articles: allFeeds,
            breadcrumbs: [
                { name: 'Home', link: '/' },
                { name: 'Kontak', link: '/kontak' }
            ]
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to fetch feeds');
    }
});

router.get('/:slug', function (req, res) {
    const slug = req.params.slug;

    connection.query('SELECT * FROM blogs WHERE slug = ?', [slug], function (err, results) {
        if (err) throw err;
        if (!results.length) return res.status(404).render('404');

        const blog = results[0];

        connection.query('SELECT * FROM blogs WHERE slug != ? ORDER BY created_at DESC LIMIT 5', [slug], function (err, otherResults) {
            if (err) throw err;
            const blog_other = otherResults;

            connection.query('SELECT * FROM blogs ORDER BY id DESC LIMIT 1', [slug], function (err, lastArticle) {
                if (err) throw err;

                const blog_last = lastArticle;

                res.render('pages/blog-detail', {
                    blog: blog,
                    blogs_other: blog_other,
                    blog_last: blog_last
                });
            })
        });
    });
});


module.exports = router;
