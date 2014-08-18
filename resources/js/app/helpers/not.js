(function() {

    Handlebars.registerHelper('not', function(value, options) {
    	return !value || value == 0 ? options.fn(value) : false;
    });

    Handlebars.registerHelper('undefined', function(value, options) {
    	return _.isUndefined(value) ? true : false;
    });

}());