jQuery(window).load(function() {
		if(jQuery('#slider') > 0) {
        jQuery('.nivoSlider').nivoSlider({
        	effect:'fade',
    });
		} else {
			jQuery('#slider').nivoSlider({
        	effect:'fade',
    });
		}
});
	
jQuery(document).ready(function() {
var words = jQuery(".services_rightpart h3").text().split(' ');
jQuery(".services_rightpart h3").html(words.slice(0, words.length - 2).join(' ') + " " + "<span>" + words.slice(words.length - 2, words.length).join(' ') + "</span>");

});