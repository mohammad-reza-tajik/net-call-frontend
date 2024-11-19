const STATIC_CACHE_NAME = "static-1732004644062";
const DYNAMIC_CACHE_NAME = "dynamic-1732004644062";

const serviceWorker = self as unknown as ServiceWorkerGlobalScope;

const addToStaticCache = async (...resources : string[]) => {
    try {
        const staticCache = await caches.open(STATIC_CACHE_NAME);
        await staticCache.addAll(resources);
    } catch (err) {
        console.error("Failed to add to static cache:", err);
    }
}

const addToDynamicCache = async (request : Request) => {
    try {
        const dynamicCache = await caches.open(DYNAMIC_CACHE_NAME);
        const response = await fetch(request);
        await dynamicCache.put(request, response.clone());
        return response;
    } catch (err) {
        console.error("Failed to add to dynamic cache:", err);
        throw err; // Re-throw the error to handle it in the calling function
    }
}

const cacheFirst = async (event : FetchEvent) => {
    try {
        const res = await caches.match(event.request);
        if (res) {
            return res;
        } else {

            /**
             * Check if the request is from the same origin as the service worker to avoid caching external resources
             * like Chrome extension scripts and ...
             */

            const { origin } = new URL(event.request.url);
            const isFromMySite = origin === serviceWorker.location.origin;

            if (isFromMySite && (event.request.destination === "script" || event.request.destination === "style")) {
                return await addToDynamicCache(event.request);
            }
            return await fetch(event.request);
        }
    } catch (err) {
        console.error("Fetch failed:", err);
        // Optionally, return a fallback response here
        return new Response("Failed to fetch resource", { status: 503 });
    }
}

serviceWorker.addEventListener("install", (event ) => {
    console.log("-----[ service worker installed ]-----");

    event.waitUntil((async () => {
        try {
            await addToStaticCache(
                "/",
                "/fonts/dana-black.woff2",
                "/fonts/dana-fanum-bold.woff2",
                "/fonts/dana-fanum-medium.woff2",
                "/images/logo.svg"
            );
            // Force the waiting service worker to become the active service worker.
            await serviceWorker.skipWaiting(); // returned promise can be ignored safely
        } catch (err) {
            console.error("Install event failed:", err);
        }
    })());
});

serviceWorker.addEventListener("activate", (event) => {
    console.log("-----[ service worker activated ]-----");

    event.waitUntil((async () => {
        try {
            const keys = await caches.keys();
            await Promise.all(
                keys.map(key => {
                    if (key !== STATIC_CACHE_NAME && key !== DYNAMIC_CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );

            const allClients = await serviceWorker.clients.matchAll({ includeUncontrolled: true });
            allClients.forEach(client => {
                client.postMessage("activated");
            });

            // Tell the active service worker to take control of the page immediately.
            await serviceWorker.clients.claim();
        } catch (err) {
            console.error("Activate event failed:", err);
        }
    })());
});

serviceWorker.addEventListener("fetch", (event ) => {
    event.respondWith(cacheFirst(event));
});

serviceWorker.addEventListener("message", (event) => {
    console.log(event.data);
});
