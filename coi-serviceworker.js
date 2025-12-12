// coi-serviceworker.js - This script sets the COOP/COEP headers
// It is intentionally simple and designed to be registered by coi-serviceworker.min.js

self.addEventListener('fetch', function (event) {
  event.respondWith(
    fetch(event.request)
      .then(function (response) {
        // Only modify successful, same-origin HTML requests
        if (response.status === 200 && response.type === 'basic' && response.headers.get('content-type')?.includes('text/html')) {
          
          const newHeaders = new Headers(response.headers);
          
          // Set the required Cross-Origin-Opener-Policy header
          newHeaders.set('Cross-Origin-Opener-Policy', 'same-origin'); 
          
          // Set the required Cross-Origin-Embedder-Policy header
          // 'require-corp' is mandatory for using shared memory, WASM files, etc.
          newHeaders.set('Cross-Origin-Embedder-Policy', 'require-corp'); 
          
          // Return the response with the new headers
          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders,
          });
        }
        return response; // Pass through other requests unchanged
      })
      .catch(function (error) {
        console.error('Service Worker fetch error:', error);
        return new Response('Service Worker Fetch Error: ' + error.message, { status: 500 });
      })
  );
});
