const STATIC_CACHE_NAME = "static-version";
const DYNAMIC_CACHE_NAME = "dynamic-version";

const addToStaticCache = async (...resources) => {
    const staticCache = await caches.open(STATIC_CACHE_NAME);
    await staticCache.addAll(resources);
}

const addToDynamicCache = async (...resources) => {
    const dynamicCache = await caches.open(DYNAMIC_CACHE_NAME);
    await dynamicCache.addAll(resources);
}

const cacheFirst = async (event) => {
    try {
        const res = await caches.match(event.request);
        if (res) {
            return res
        } else {
            if (event.request.destination === "script" || event.request.destination === "style") {
                await addToDynamicCache(event.request);
            }
            return fetch(event.request);
        }
    } catch (err) {
        console.log(err);
    }
}

self.addEventListener("install", (event) => {
    console.log("-----[ service worker installed ]-----");

    event.waitUntil((async () => {
            await addToStaticCache(
                "/",
                "/fonts/dana-black.woff2",
                "/fonts/dana-fanum-bold.woff2",
                "/fonts/dana-fanum-medium.woff2",
                "/images/logo.svg",
            );
            // Force the waiting service worker to become the active service worker.
            await self.skipWaiting(); // returned promise can be ignored safely
        })()
    )
});

self.addEventListener("activate", event => {

    console.log("-----[ service worker activated ]-----");

    event.waitUntil((async () => {
            const keys = await caches.keys();
            keys.forEach(key => {
                if (key !== STATIC_CACHE_NAME && key !== DYNAMIC_CACHE_NAME) {
                    caches.delete(key);
                }
            })
            // Tell the active service worker to take control of the page immediately.
            await self.clients.claim();
        })()
    )
});


self.addEventListener("fetch", (event) => {
    event.respondWith(cacheFirst(event));
});


self.addEventListener("message", (event) => {
    console.log(event.data);

})