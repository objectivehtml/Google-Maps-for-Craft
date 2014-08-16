(function() {

	"use strict";

	GoogleMaps.Views.ItemView = Backbone.Marionette.ItemView.extend({

		initialize: function(options) {	
			Backbone.Marionette.ItemView.prototype.initialize.call(this, options);

			if(this.options) {
				this.fill(this.options);
			}
		},

		fill: function(options) {
			_.extend(this, options);
		}

	});

}());