const cacheName = 'v1';

const cacheAssets = [
  'index.html',
  '/css/main.min.css',
  '/main.js',
  '/image/undraw_Ride_a_bicycle_2yok.svg',
  '/image/app_icon_256x256.png',
  'https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap',
  'https://use.fontawesome.com/releases/v5.15.2/css/all.css',
];

self.addEventListener('install', (e) => {
  console.log('Service Worker: Installed');

  e.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        console.log('Service Worker: Caching Files');
        cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  console.log('Service Worker: Activated');

  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cache) => cache !== cacheName)
          .map((cache) => caches.delete(cache))
      );
    })
  );
});
