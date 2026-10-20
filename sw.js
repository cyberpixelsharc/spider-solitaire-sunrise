const CACHE = "spider-sunrise-v6";

const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./i18n.js",
  "./version.js",
  "./icons/favicon.svg",
  "./icons/favicon-32.png",
  "./icons/favicon-192.png",
  "./icons/apple-touch-icon.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      try {
        const init = request.mode === "navigate" ? { cache: "no-store" } : undefined;
        const response = await fetch(request, init);
        if (response && response.ok) cache.put(request, response.clone());
        return response;
      } catch (err) {
        const cached = await cache.match(request);
        if (cached) return cached;
        if (request.mode === "navigate") {
          const fallback = await cache.match("./index.html");
          if (fallback) return fallback;
        }
        throw err;
      }
    })
  );
});
