(function() {

	"use strict";

	GoogleMaps.Views.Geocoder = GoogleMaps.Views.BaseForm.extend({

		className: 'oh-google-map-form oh-google-map-geocoder',

		template: GoogleMaps.Template('geocoder'),

		api: false,

		lastResponse: false,

		initialize: function(options) {
			GoogleMaps.Views.BaseForm.prototype.initialize.call(this, options);

			if(!this.model) {
				this.model = new Backbone.Model();
			}

 			this.api = new google.maps.Geocoder();
		},

		onShow: function() {
			var t = this;

			setTimeout(function() {
				t.$el.find('input').focus();
			}, 250);
		},

		onRender: function() {
			GoogleMaps.Views.BaseForm.prototype.onRender.call(this);

			var t = this;

			this.$el.find('.oh-google-map-highlight-list a').click(function(e) {
				var response = t.model.get('locations')[$(this).parent().index()];

				t.responseHandler(response);
				t.lastResponse = response;

				e.preventDefault();
			});
		},

		responseHandler: function(location) {
			
		},

		submit: function() {
			var t = this;

			this.model.set('location', this.getLocation());
 
			this.geocode(this.getLocation(), function(results, status) {
				if(status == "OK") {
					if(results.length > 1) {
						t.model.set('locations', results);
						t.render();
					}
					else {
						t.responseHandler(results[0]);
						t.lastResponse = results[0];
					}
				}
			});
		},

		geocode: function(location, callback) {
			if(_.isString(location)) {
				location = {'address': location};
			}

			this.api.geocode(location, function(results, status) {
				if(_.isFunction(callback)) {
					callback(results, status);
				};
			});
		},

		getLocation: function() {
			return this.$el.find('input').val();
		},

		setLocation: function(location) {
			this.$el.find('input').val(location);
		}

	});

}());