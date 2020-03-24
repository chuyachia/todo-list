
workbox.routing.registerRoute(
    new RegExp('http://localhost:8088/api/todo'),
    new workbox.strategies.NetworkFirst({
        plugins: [
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200]
            })
        ]
    }),
);