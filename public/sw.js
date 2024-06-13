const STATIC_CACHE_NAME = "static-v1";
const DYNAMIC_CACHE_NAME = "dynamic-v1";

const addToStaticCache = async (resources) => {
    const staticCache = await caches.open(STATIC_CACHE_NAME);
    await staticCache.addAll(resources);
}

const cacheFirst = async (event) => {
    try {
        const res = await caches.match(event.request);
        if (res) {
            return res
        } else {
            return fetch(event.request);
        }
    } catch (err) {
        console.log(err);
    }
}

self.addEventListener("install", (event) => {
    console.log("-----[ service worker installed ]-----");

    event.waitUntil(
        addToStaticCache(
            [
                "/",
                "/fonts/dana-black.woff2",
                "/fonts/dana-fanum-bold.woff2",
                "/fonts/dana-fanum-medium.woff2",
                "/images/logo.svg",
            ]))
    // Force the waiting service worker to become the active service worker.
    self.skipWaiting(); // returned promise can be ignored safely
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
        })()
    )
    // Tell the active service worker to take control of the page immediately.
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    // console.log(event.request.destination)
    // if (event.request.destination === "style") {
    //     addToDynamicCache([event.request]);
    // }
    event.respondWith(cacheFirst(event));
});


self.addEventListener("message",(event)=> {
    console.log(event.data);

})