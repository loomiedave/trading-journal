// public/sw.js
const CACHE = "app-shell-v1";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request).then((res) => {
        if (res.ok)
          caches.open(CACHE).then((c) => c.put(event.request, res.clone()));
        return res;
      });
      return cached || fetchPromise;
    }),
  );
});
