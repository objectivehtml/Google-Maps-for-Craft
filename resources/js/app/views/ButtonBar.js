(function() {

	"use strict";

	GoogleMaps.Views.ButtonBar = GoogleMaps.Views.ItemView.extend({

		className: 'oh-google-map-button-bar oh-google-map-clearfix',

		template: GoogleMaps.Template('button-bar'),

		initialize: function(options) {
			var t = this;

			if(!this.model) {
				this.model = new Backbone.Model();
			}

			Backbone.Marionette.ItemView.prototype.initialize.call(this, options);
		
			var buttons = [];

			if(this.options.showButtons) {
				_.each(this.options.buttons, function(button, i) {
					if(t.options.showButtons.indexOf(button.name) >= 0) {
						buttons.push(button);
					}
				});
			}

			this.model.set('buttons', buttons);
		},

		onRender: function() {
			var t = this;

			if(this.model.get('buttons')) {
				_.each(this.model.get('buttons'), function(button, i) {
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