const VERSION = "dfxsignall-pwa-v1";
const STATIC_CACHE = VERSION + "-static";
const PUBLIC_CACHE = VERSION + "-public";
const STATIC_ASSETS = ["/icon.png", "/apple-icon.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)).catch(() => undefined).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith("dfxsignall-pwa-") && key !== STATIC_CACHE && key !== PUBLIC_CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Never cache authenticated, administrative, account, payment, or API responses.
  if (url.pathname.startsWith("/api/") || /^\/(admin|dashboard|login|register|forgot-password|reset-password|payment|account-management|auth|checkout|client)(\/|$)/.test(url.pathname)) return;

  if (request.destination === "image" || request.destination === "font" || request.destination === "style" || request.destination === "script") {
    event.respondWith(caches.open(STATIC_CACHE).then(async (cache) => {
      const cached = await cache.match(request);
      if (cached) return cached;
      const response = await fetch(request);
      if (response.ok && response.type === "basic") cache.put(request, response.clone());
      return response;
    }).catch(() => fetch(request)));
    return;
  }

  if (request.mode === "navigate" && url.pathname === "/") {
    event.respondWith(fetch(request).then((response) => {
      if (response.ok) caches.open(PUBLIC_CACHE).then((cache) => cache.put("/", response.clone()));
      return response;
    }).catch(async () => (await caches.match("/", { cacheName: PUBLIC_CACHE })) || Response.error()));
  }
});
