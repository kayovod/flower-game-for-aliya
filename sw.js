const CACHE_NAME = 'fleur-atelier-v10';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './assets/icon.svg',
  './css/variables.css',
  './css/layout.css',
  './css/shop.css',
  './css/bouquet.css',
  './css/client.css',
  './css/phone.css',
  './css/home.css',
  './js/config.js',
  './js/state.js',
  './js/sound.js',
  './js/ai.js',
  './js/main.js',
  './js/graphics/flowersSvg.js',
  './js/graphics/avatarSvg.js',
  './js/graphics/shopScenerySvg.js',
  './js/graphics/homeDecorSvg.js',
  './js/ai/aiCore.js',
  './js/ai/clientGenerator.js',
  './js/ai/clientTemplates.js',
  './js/ai/jobsAi.js',
  './js/ai/socialAi.js',
  './js/ai/teamAi.js',
  './js/ai/franchiseAi.js',
  './js/screens/shopScreen.js',
  './js/screens/bouquetMaker.js',
  './js/screens/phoneScreen.js',
  './js/screens/homeScreen.js',
  './js/screens/financeSettingsScreen.js',
  './js/screens/franchiseVisitScreen.js',
  './js/screens/phone/phoneInsta.js',
  './js/screens/phone/phoneDirect.js',
  './js/screens/phone/phoneWholesale.js',
  './js/screens/phone/phoneDecor.js',
  './js/screens/phone/phoneRealtor.js',
  './js/screens/phone/phoneCanvasSnap.js',
  './js/screens/shop/shopClientZone.js',
  './js/screens/shop/shopInspector.js',
  './js/screens/shop/shopTeamZone.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});