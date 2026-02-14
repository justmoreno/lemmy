const CACHE_NAME = "lemmy-cache-v1";

const FILES_TO_CACHE = [
  "index.html",
  "styles.css",
  "script.js",

  "agregar.html",
  "agregar.css",
  "agregar.js",

  "vender.html",
  "vender.css",
  "vender.js",

  "reporte.html",
  "reporte.css",
  "reporte.js",

  "dashboard.html",
  "dashboard.css",
  "dashboard.js",

  "manifest.json"
];

// Instalar
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Activar
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

// Fetch offline
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
