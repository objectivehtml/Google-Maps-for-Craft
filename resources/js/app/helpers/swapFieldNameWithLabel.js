(function() {

    Handlebars.registerHelper('swapFieldNameWithLabel', function(value, subject) {
     	_.each(subject, function(obj) {
    		if(obj.name == value) {
    			value = obj.label;
    		}
    	});

    	return value;
    });

}());