(function() {

	function link(path, text, options) {
		var attrs = [];

		path = new Timeblocker.Path(path);

		attrs.push('href="'+path.string()+'"');

		_.each(options.hash, function(value, name) {
			attrs.push(name+'="'+value+'"');
		});

		return '<a '+attrs.join(' ')+'>'+text+'</a>';
	}

    Handlebars.registerHelper('path', function() {
        return new Timeblocker.Path(arguments).string();        
    });

    Handlebars.registerHelper('url', function() {
        if(arguments[0] && !_.isObject(arguments[0])) {
            return new Timeblocker.Path(arguments).url();
        }
        else {
            return arguments[0];
        }
    });

    Handlebars.registerHelper('image', function() {
        return new Timeblocker.Path(arguments).account();
    });

    Handlebars.registerHelper('link', function(url, text, options) {
    	if(_.isObject(text)) {
    		options = text;
    		text = options.fn ? options.fn(this) : '';
    	}

    	return new Handlebars.SafeString(link(url, text, options));
    });

}());