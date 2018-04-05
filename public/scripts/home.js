
// JavaScript Document

$(window).ready(function() {
	'use strict';
	
	$('#sideitems > li > a').click(function() {
		var links = this;
		console.log(links);
		update();
		links.className += " active";
	});
	
	$('.post-container').click(function() {
		console.log("Show");
		var str = $('this > p');
		console.log(str.text().name);
		$('#image-info').toggleClass("minimize");
		$('#image-info').toggleClass("expand");
	});

	
});
	
function update() {
	'use strict';
	$('#sideitems > li > a').removeClass("active");
}


