const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/db');
const { connection } = require('../config/db');
const { last } = require('lodash');
const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');

const parser = new Parser();
const FEED_URLS = [
   'https://www.cnbcindonesia.com/rss',
   'https://finance.detik.com/rss',
   'https://www.antaranews.com/rss/ekonomi',
   'http://rss.tempo.co/bisnis',
   'https://www.cnnindonesia.com/ekonomi/rss'
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

      res.render('index', {
         title: 'E-Ibu Cerdas',
         type: 'website',
         canonical: 'E-Ibu Cerdas',
         author: 'E-Ibu Cerdas',
         description: 'E-Ibu Cerdas adalah platform edukasi dan investasi yang membantu ibu-ibu cerdas dalam mengelola keuangan keluarga.',
         keywords: 'E-Ibu Cerdas, Investasi, Edukasi',
         breadcrumbs: [
            { name: 'Home', link: '/' }
         ],
         articles: allFeeds,
      });

   } catch (err) {
      console.error(err);
      res.status(500).send('Failed to fetch feeds');
   }
});

module.exports = router;
