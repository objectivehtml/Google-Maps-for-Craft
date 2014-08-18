(function() {

	'use strict';

    Handlebars.registerHelper('forEach', function(context, options) {
    	var ret = [];

    	if(_.isObject(context)) {
	    	_.each(context, function(value, i) {
	    		var parse = _.extend(value, {
	    			index: i,
	    			count: i + 1
	    		});

	    		ret.push(options.fn(parse));
	    	});
	    }

    	return ret.join("\n");
    });

}());

