var GoogleMaps = {
	Views: {},
	Models: {},
	data: [],
	instances: [],
	init: function() {
		var t = this;
		
		_.each(this.data, function(data) {
			t.instances.push(new GoogleMaps.Fieldtype(data[0], data[1]));
		});
	}
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

	GoogleMaps.Fieldtype = Garnish.Base.extend({

		init: function($el, options) {
			var t = this;

			this.$container = $($el);

			var App = new Backbone.Marionette.Application();

			this.App = App;

			App.options = options;

			App.addRegions({
				content: $el
			});
		
			var coord = options.center.split(',');

			var map = new GoogleMaps.Views.Map({
				fieldname: options.fieldname,
				savedData: options.savedData,
				width: options.width,
				height: options.height,
				mapOptions: {
					center: new google.maps.LatLng(parseFloat(coord[0]), parseFloat(coord[1])),
					zoom: options.zoom
				},
				showButtons: options.showButtons,
				addressFields: options.addressFields
			});

			this.map = map;

			App.addInitializer(function() {

				setTimeout(function() {
					map.redraw();
					map.updateHiddenField();
				}, 100);

				App.content.show(map);

			});

			t.addListener(window, 'resize', function(ev) {
				if(map.$el.parents('.field').parent().css('display') == 'block') {
                	map.redraw();
                	map.center();

                	t.removeListener(window, 'resize');
                }
            });

			App.start();
		}

	});


}());