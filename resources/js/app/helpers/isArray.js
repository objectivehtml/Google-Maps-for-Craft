(function() {

    Handlebars.registerHelper('isArray', function(variable, options) {
        if(_.isArray(variable)) {
            return options.fn();
        }
    });

    Handlebars.registerHelper('notArray', function(variable, options) {
        if(!_.isArray(variable)) {
            return options.fn();
        }
    });

}());