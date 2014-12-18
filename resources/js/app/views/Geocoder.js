(function() {

	"use strict";

	GoogleMaps.Views.Geocoder = GoogleMaps.Views.BaseForm.extend({

		className: 'oh-google-map-form oh-google-map-geocoder',

		template: GoogleMaps.Template('geocoder'),

		api: false,

		lastResponse: false,

		dblclickEvent: false,

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

			this.map.api.setOptions({disableDoubleClickZoom: true});

			this.dblclickEvent = google.maps.event.addListener(this.map.api, 'dblclick', function(e) {
				t.geocode({location: e.latLng}, function(results, status) {
					if(results[0]) {
						results[0].geometry.location = e.latLng;
						t.responseHandler(results[0]);
					}
					else {
						t.responseHandler({
							formatted_address: '',
							addressComponents: [],
							geometry: {
								location: e.latLng
							}
						});
					}

					t.lastResponse = results[0];
				});				
			});
		},

		onDestroy: function() {
			this.map.api.setOptions({disableDoubleClickZoom: true});

			if(this.dblclickEvent) {
				this.dblclickEvent.remove();
			}
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

			this.geocode(this.getLocation(), function(results, status, location) {
				if(status == "OK") {
					if(results.length > 1 || location.location) {
						/*
						if(!location.location) {
							var coord = location.split(',');

							coord = new google.maps.LatLng(coord[0], coord[1]);
						}
						*/

						if(location.location) {
							results.unshift({
								types: [],
								formatted_address: t.getLocation(),
								address_components: [],
								partial_match: false,
								geometry: {
									location: location.location ? location.location : coord,
									location_type: false,
									viewport: false,
									bounds: false
								}
							});
						}

						t.model.set('locations', results);
						t.render();
					}
					else {
						t.responseHandler(results[0]);
						t.lastResponse = results[0];
					}
				}
				else if(_.isObject(location)) {
					if(location.location) {
						var response = {
							types: [],
							formatted_address: t.getLocation(),
							address_components: [],
							partial_match: false,
							geometry: {
								location: location.location,
								location_type: false,
								viewport: false,
								bounds: false
							}
						};

						t.responseHandler(response);
						t.lastResponse = response;
					}
				}
			});
		},

		isCoordinate: function(coord) {
			return _.isString(coord) ? coord.match(/^([-\d.]+),(\s+)?([-\d.]+)$/) : false;
		},

		geocode: function(location, callback) {

			if(this.isCoordinate(location)) {
				var coord = location.split(',');

				location = {
					location: new google.maps.LatLng(
						parseFloat(coord[0]), 
						parseFloat(coord[1])
					)
				};
			}
			else if(_.isString(location)) {
				location = {address: location};
			}

			this.api.geocode(location, function(results, status) {
				if(_.isFunction(callback)) {
					callback(results, status, location);
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