(function() {

    Handlebars.registerHelper('inArray', function(needle, haystack, options) {
        if( typeof haystack == "object" && haystack.indexOf(needle) >= 0) {
        	return options.fn();
        }
    });

}());