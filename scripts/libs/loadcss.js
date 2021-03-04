export function loadCSSURL (url) {
	// var file = location.pathname.split( "/" ).pop();

	var link = document.createElement( "link" );
	link.href = url;
	link.type = "text/css";
	link.rel = "stylesheet";
	link.media = "screen,print";

	document.getElementsByTagName( "head" )[0].appendChild( link );
} 
