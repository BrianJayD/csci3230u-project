// JavaScript Document
$(window).ready(function() {
	'use strict';
	console.log("Hello");
	
	$('#sideitems > li > a').click(function() {
		var links = this;
		console.log(links);
		update();
		links.className += " active";
	});
	
	$('p').click(function() {
		console.log("Show");
		$('#image-info').toggleClass("minimize");
	});
	
});
	
function update() {
	'use strict';
	$('#sideitems > li > a').removeClass("active");
}
