(function() {

    Handlebars.registerHelper('profile', function(options) {
        return options.fn(Profile.toJSON());
    });

    Handlebars.registerHelper('account', function(options) {
        return options.fn(Account.toJSON());
    });

    Handlebars.registerHelper('hasPermission', function(permission, options) {
    	if(Profile.hasPermission(permission)) {
	        return options.fn();
	    }
    });

    Handlebars.registerHelper('notPermitted', function(permission, options) {
     	if(!Profile.hasPermission(permission)) {
	        return options.fn();
	    }
    });

    Handlebars.registerHelper('canCancelAppointment', function(client, options) {
    	if( Profile.get('uid') == client.uid || 
            Profile.get('uid') == client.parent.uid ||
            Profile.hasPermission('manageAppointments') ) {
    		return options.fn();
    	}
    });

}());