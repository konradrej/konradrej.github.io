//support features
var supportsPassive = false;
try {
  var opts = Object.defineProperty({}, 'passive', {
    get: function() {
      supportsPassive = true;
    }
  });
  window.addEventListener("testPassive", null, opts);
  window.removeEventListener("testPassive", null, opts);
} catch (e) {}

document.getScroll = function() {
    if (window.pageYOffset != undefined) {
        return [pageXOffset, pageYOffset];
    } else {
        var sx, sy, d = document,
            r = d.documentElement,
            b = d.body;
        sx = r.scrollLeft || b.scrollLeft || 0;
        sy = r.scrollTop || b.scrollTop || 0;
        return [sx, sy];
    }
}

//variables
var lastScrollTop = 0;
var passiveIfSupported = false;
var totalHeight, locationWidth;
var logoElement = document.querySelector(".logo img");
var st = document.getScroll();

//functions
function loadFeatured(){
	if(document.querySelector("section#projects").offsetTop - 0.75*window.innerHeight < document.getScroll()[1]){
		document.querySelector("div.container--desktop").style.animationPlayState = "running";
		document.querySelector("div.container--mobile").style.animationPlayState = "running";
		document.querySelector("div.container--info").style.animationPlayState = "running";

		window.removeEventListener("scroll", loadFeatured);
	}
}

function adjustLogo(scrollY){
	if(scrollY == 0){
		logoElement.style.transform = "scale(1.5)";
	}else{
		logoElement.style.transform = "scale(1)";
	}
}

function scrollToAnchor(hash) {
	var target = $(hash);
	history.pushState(null, null, hash);

	target = target.length ? target : $('[name=' + hash.slice(1) +']');

	if (target.length){
		$('html,body').stop().animate({
			scrollTop: target.offset().top - 83
		}, 500);
		return false;
	}
}

function adjustScrollIndicator(){
	locationWidth = st[1]/totalHeight*100;
	document.querySelector("div.location").style.width = (locationWidth+"%");
}

//eventlisteners
window.addEventListener("scroll", loadFeatured);
window.addEventListener("scroll", function(){
	st = document.getScroll();
	adjustLogo(st[1]);

	adjustScrollIndicator();
});

window.onresize = function(){
	totalHeight = document.documentElement.scrollHeight - window.innerHeight;

	adjustScrollIndicator();
}

document.querySelectorAll("a[href*=\\#]:not([href=\\#])").forEach(function(el){
		el.addEventListener('click', function(event){
			if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') || location.hostname == this.hostname){
				event.preventDefault();

				scrollToAnchor(this.hash);
				document.querySelector("#toggle--checkbox").checked = false;
			}
		});
	}
);

//on DOM finished
(function(){
	document.querySelector("div.container--desktop").style.animationPlayState = "paused";
	document.querySelector("div.container--mobile").style.animationPlayState = "paused";
	document.querySelector("div.container--info").style.animationPlayState = "paused";

	totalHeight = document.documentElement.scrollHeight - window.innerHeight;

	adjustScrollIndicator();
	adjustLogo(st[1]);

	if ( "onhashchange" in window ) {
	    var hashHandler = function(){
	        var hash = window.location.hash.substring( 1 );
	        if ( !hash )
	            return;

	        var offset = 83;
	        var sel = '[id="' + hash + '"], a[name="' + hash + '"]';
	        var currentOffset = $( sel ).offset().top;

	        $( window ).scrollTop( currentOffset - offset );
	    };
	    window.addEventListener("hashchange", hashHandler, false);
	    window.addEventListener("load", hashHandler, false);
	}
})();

if("serviceWorker" in navigator){
	window.addEventListener("load", function(){
		navigator.serviceWorker.register("/sw.js").then(function(registration){
			//Success
			console.log("ServiceWorker registration succesful with scope: ", registration.scope);
		}, function(err){
			//Failure
			console.log("ServiceWorker registration failed: ", err);
		});
	});
}