var GoogleMaps = {
	Views: {},
	Models: {},
	addressFieldData: [],
	mapFieldData: [],
	instances: [],
	init: function() {
		var t = this;

		_.each(this.addressFieldData, function(data) {
			t.initAddressField(data);
		});

		_.each(this.mapFieldData, function(data) {
			t.initMapField(data);
		});
	},
	initAddressField: function(data) {
		var t = this;

		if(data) {
			new GoogleMaps.AddressFieldType(data[0], data[1]);
		}
		else {
			_.each(this.addressFieldData, function(data) {
				t.instances.push(new GoogleMaps.AddressFieldType(data[0], data[1]));
			});

			this.addressFieldData = [];
		}
	},
	initMapField: function(data) {
		var t = this;

		if(data) {
			new GoogleMaps.MapFieldType(data[0], data[1]);
		}
		else {
			_.each(this.mapFieldData, function(data) {
				t.instances.push(new GoogleMaps.MapFieldType(data[0], data[1]));
			});

			this.mapFieldData = [];
		}
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

	GoogleMaps.MapFieldType = Garnish.Base.extend({

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
				availableButtons: options.availableButtons,
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

	GoogleMaps.AddressFieldType = Garnish.Base.extend({

		init: function($el, options) {
			var t = this;

			this.$container = $($el);

			var App = new Backbone.Marionette.Application();

			this.App = App;

			App.options = options;

			App.addRegions({
				content: $el
			});

			var address = new GoogleMaps.Views.Address({
				savedData: options.savedData,
				fieldname: options.fieldname
			});

			App.content.show(address);
		}

	});


}());