(function() {

	"use strict";

	GoogleMaps.Models.Base = Backbone.Model.extend({

		initialize: function(options) {
			_.each(options, function(option, i) {
				if(_.isFunction(option)) {
					this[i] = option;
				}
			});

			this.set(options);			
		},

		toJSON: function() {
			var json = Backbone.Model.prototype.toJSON.call(this);

			delete json.api;
			delete json.map;
			delete json.infowindow;

			return json;
		}

	});

}());