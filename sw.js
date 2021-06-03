var CACHE_NAME = "portfolio_v1.3";
var urlsToCache = [
	'/',
	'/css/main.min.css',
	'/scripts/core.js',
	'/scripts/jquery-3.5.1.min.js',
	'/images/logo.svg',
	'/images/background.jpg',
	'/images/featured-desktop.png',
	'/images/featured-mobile.png',
	'/images/phone-mockup.png',
	'/images/photo.jpg',
	'/images/github_footer.png',
	'/images/linkedin_footer.png',
	'/images/noise.png',
	'/favicon.ico'
];

self.addEventListener("install", function(event){
	event.waitUntil(
		caches.open(CACHE_NAME)
		.then(function(cache){
			console.log("Opened cache");
			return cache.addAll(urlsToCache);
		})
	);
});

self.addEventListener("fetch", function(event){
	event.respondWith(
		caches.match(event.request)
			.then(function(response){
				//cache hit - return response
				if(response){
					return response;
				}

				return fetch(event.request).then(
					function(response){
						//check if valid
						if(!response || response.status !== 200 || response.type !== 'basic'){
							return response;
						}

						var responseToCache = response.clone();

						caches.open(CACHE_NAME)
							.then(function(cache){
								cache.put(event.request, responseToCache);
							}
						);

						return response;
					}
				);
			}
		)
	);
});

self.addEventListener("activate", function(event){
	var cacheWhitelist = [
		'portfolio_v1.3'
	];

	event.waitUntil(
		caches.keys().then(function(cacheNames){
			return Promise.all(
				cacheNames.map(function(cacheName){
					if(cacheWhitelist.indexOf(cacheName) === -1){
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
});

