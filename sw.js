const CACHE="waves-lab-v6";
const ASSETS=[
  "./","./index.html","./styles.css","./advanced-features.css","./detail-upgrades.css","./course-upgrades-v3.css","./extended-response-v4.css","./waves-data.js","./textbook-data.js","./app.js","./textbook.js","./advanced-features.js","./integration-patches.js","./textbook-expansion.js","./simulation-upgrades-v2.js","./simulation-upgrades-v3.js","./textbook-interactives-v3.js","./question-engine-v3.js","./extended-response-v4.js","./physics-icon.svg","./manifest.webmanifest"
];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r;}).catch(()=>cached)));});