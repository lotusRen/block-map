var cacheNM = "map-cache-v077";
var urlsToCache=[
	'/public.index.html',
	'/src/App.js',
	'/src/App.css',
	'/src/filter.css',
	'/src/filter.js',
	'/src/index.css',
	'/src/index.js',
	'src/list.js'	
];

self.addEventListener('install',function(event){	
	event.waitUntil(
		caches.open(cacheNM).then(function(cache){
			var url='https://maps.googleapis.com/maps/api/js?key=AIzaSyCVkVzXys5TdQXFmn_V-_j6V0rDp41rrhM&v=3';
			fetchData(url,cache);
			
			return cache.addAll(urlsToCache);			
		}).catch(function(err){
			console.log(err);
		})
		
	);
	
});

self.addEventListener('activate',function(event){
		
	event.waitUntil(
		caches.keys().then(function(cacheNames){
			return Promise.all(				
				cacheNames.filter(function(cacheName){                  //删掉所有缓存文件中以map开头但是又不予当前缓存文件同名的文件
					return cacheName.startsWith('map-') && cacheName !== cacheNM;
				}).map(function(cacheName){
					return caches.delete(cacheName);
				})
			);
			
		}).catch(function(err){
			console.log(err);
		})
		
	);
	
});

self.addEventListener('fetch',function(event){
	event.respondWith(
	    caches.match(event.request).then(function(response) {	    		
	    			return response || fetch(event.request);
			
	    })
	  );
});


function fetchData(url,cache){
	fetch(url,{mode:'no-cors'}).then(function(res){                  
				return res;
			}).then(function(data){
				cache.put(url,data);
			}).catch(function(e){
				console.log(e)
			});
}


