(function() {

	"use strict";

	GoogleMaps.Views.LayoutView = Backbone.Marionette.LayoutView.extend({

		initialize: function(options) {	
			Backbone.Marionette.LayoutView.prototype.initialize.call(this, options);
		
			if(this.options) {
				this.fill(this.options);
			}
		},

		fill: function(options) {
			_.extend(this, options);
		}

	});

}());