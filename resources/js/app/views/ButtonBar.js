(function() {

	"use strict";

	GoogleMaps.Views.ButtonBar = GoogleMaps.Views.ItemView.extend({

		className: 'oh-google-map-button-bar',

		template: GoogleMaps.Template('button-bar'),

		initialize: function(options) {
			if(!this.model) {
				this.model = new Backbone.Model();
			}

			Backbone.Marionette.ItemView.prototype.initialize.call(this, options);
		
			if(this.options.buttons) {
				this.model.set('buttons', this.options.buttons);
			}
		},

		onRender: function() {
			var t = this;

			if(this.options.buttons) {
				_.each(this.options.buttons, function(button, i) {
					if(button.click) {
						t.$el.find('a').eq(i).click(function(e) {
							button.click.call(this, e);
						});
					}
				});
			}
		}

	});

}());