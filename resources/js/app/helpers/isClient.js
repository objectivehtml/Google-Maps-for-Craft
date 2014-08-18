(function() {

    Handlebars.registerHelper('isHost', function(options) {
        if(Profile.isHost()) {
            return options.fn();
        }
    });

    Handlebars.registerHelper('notHost', function(options) {
        if(!Profile.isHost()) {
            return options.fn();
        }
    });

    Handlebars.registerHelper('isClient', function(options) {
        if(Profile.isClient()) {
            return options.fn();
        }
    });

    Handlebars.registerHelper('notClient', function(options) {
        if(!Profile.isClient()) {
            return options.fn();
        }
    });

}());