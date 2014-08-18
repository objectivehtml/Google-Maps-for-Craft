(function() {

    Handlebars.registerHelper('addon', function(addon, options) {
    	if(Account.hasAddon(addon)) {
	        return options.fn(Account.get('addons')[addon]);
	    }
        return null;
    });

}());