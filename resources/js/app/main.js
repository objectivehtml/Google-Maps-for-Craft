var GoogleMaps = {
	Views: {},
	Models: {}
};

(function() {
	
	"use strict";

	Backbone.Marionette.TemplateCache.prototype.compileTemplate = function(rawTemplate) {
        return Handlebars.compile(rawTemplate);
    };

	GoogleMaps.Template = function(name) {
		var template;

		if(Handlebars.templates[name]) {
			return Handlebars.templates[name];
		}
		else {
			return false;
		}
	};

	GoogleMaps.addScript = function(url, callback) {
		if(typeof google === "undefined") {
		    var script = document.createElement('script');
		    if(callback) script.onload = callback;
		    script.type = 'text/javascript';
		    script.src = url;
		    document.body.appendChild(script);
		}
		else {
			GoogleMaps.googleApiCallback();
		}
	};

	GoogleMaps.Fieldtype = function($el, options) {

		var App = new Backbone.Marionette.Application();

		App.options = options;

		App.addRegions({
			content: $el
		});
	
		var coord = options.center.split(',');

		App.addInitializer(function() {
			var map = new GoogleMaps.Views.Map({
				fieldname: options.fieldname,
				savedData: options.savedData,
				width: options.width,
				height: options.height,
				position: new google.maps.LatLng(parseFloat(coord[0]), parseFloat(coord[1])),
				zoom: options.zoom,
				showButtons: options.showButtons,
				addressFields: options.addressFields
			});

			setTimeout(function() {
				map.redraw();
				map.updateHiddenField();
			}, 100);

			App.content.show(map);
		});

		App.start();
	};


}());

/*

(function() {

	

	GoogleMaps.App = new Backbone.Marionette.Application();
	
	GoogleMaps.App.addRegions({
		content: ".oh-google-maps-wrapper"
	});

	GoogleMaps.App.start();

}());
*/