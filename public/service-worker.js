const CACHE_NAME = 'mypwa-static-v1';
const RUNTIME = 'mypwa-runtime-v1';
const OFFLINE_URL = '/offline.html';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  OFFLINE_URL,
  '/manifest.json',
  '/logo192.png',
  '/logo384.png',
  '/logo512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME && key !== RUNTIME).map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then(networkResponse => {
        const copy = networkResponse.clone();
        caches.open(RUNTIME).then(cache => cache.put(req, copy));
        return networkResponse;
      }).catch(() => {
        return caches.match(OFFLINE_URL);
      })
    );
    return;
  }

  // Static assets: cache-first strategy
  if (req.destination === 'style' || req.destination === 'script' || req.destination === 'image' || req.destination === 'font') {
    event.respondWith(
      caches.match(req).then(cached => {
        if (cached) return cached;
        return fetch(req).then(networkRes => {
          return caches.open(RUNTIME).then(cache => {
            try { cache.put(req, networkRes.clone()); } catch(e) {  }
            return networkRes;
          });
        }).catch(() => {
          if (req.destination === 'image') return caches.match('/logo192.png');
        });
      })
    );
    return;
  }

  event.respondWith(
    fetch(req).catch(() => caches.match(req))
  );
});
