(function() {

    Handlebars.registerHelper('hasAddon', function(addon, options) {
    	if(Account.hasAddon(addon)) {
	        return options.fn();
	    }
    });

    Handlebars.registerHelper('hasNoAddon', function(addon, options) {
    	if(!Account.hasAddon(addon)) {
	        return options.fn();
	    }
    });

}());