async function fetchIfOnline(event) {
  try {
    const response = await fetch(event.request);
    await addToCache(event, response);
    return response;
  } catch (error) {
    const cached = await caches.match(event.request);
    return cached || error;
  }
}

async function addToCache(event, response) {
  if (event.request.url.indexOf('chrome-extension') !== -1) {
    return;
  }

  const cache = await caches.open('v1');
  cache.put(event.request, response.clone());
}

self.addEventListener('fetch', async (event) => event.respondWith(fetchIfOnline(event)));

