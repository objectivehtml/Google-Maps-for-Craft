(function() {

	"use strict";

	GoogleMaps.Views.RouteForm = GoogleMaps.Views.BaseForm.extend({

		geocoder: false,

		template: GoogleMaps.Template('route-form'),

		map: false,

		api: false,

		dblclickEvent: false,

		originalRoute: false,

		initialize: function(options) {
			var t = this;

			this.geocoder = new google.maps.Geocoder();

			GoogleMaps.Views.BaseForm.prototype.initialize.call(this, options);

			this.initializeApi();

			this.originalRoute = $.extend(true, {}, this.model.toJSON());

			/*
			this.model.get('infowindow').close();
			this.model.get('api').setDraggable(true);
			this.model.get('api').setEditable(true);
			*/

			this.api = this.model.get('api');
		},

		initializeApi: function() {
			if(!this.model) {
				this.model = new GoogleMaps.Models.Route({
					map: this.map,
					locations: [],
					hideDetails: true,
					isNew: true,
					isSavedToMap: false,		
					onDragend: function(e) {
						view.render();
					}
				});
			}
		},

		onRender: function() {
			var t = this;

			GoogleMaps.Views.BaseForm.prototype.onRender.call(this);

			/*
			this.model.onMouseup = function() {
				setTimeout(function() {
					// t.model.set('points', t.api.getPath().getArray());
					t.render();
				}, 200);
			};

			*/

			this.model.onDragend = function() {
				t.render();
			};

			this.$el.find('.toggle-details').click(function(e) {
				var $panel = t.$el.find('.details');

				if($panel.css('display') == 'none') {
					$panel.show();			
					t.model.set('hideDetails', false);		
					$(this).html('Hide Details');
				}
				else {
					$panel.hide();
					t.model.set('hideDetails', true);
					$(this).html('Show Details');
				}

				t.$el.find('input').focus();

				e.preventDefault();
			});

			this.$el.find('input').keypress(function(e) {
				if(e.keyCode == 13) {
					t.$el.find('.add-location').click();
					e.preventDefault();
				}
			}).focus();

			this.$el.find('.edit-location').click(function(e) {
				var index = $(this).parents('li').index();
				var markers = t.model.getMarkers();

				if(markers[index]) {
					var view = new GoogleMaps.Views.RouteMarkerForm({
						map: t.map,
						model: markers[index],
						submit: function() {

							GoogleMaps.Views.RouteMarkerForm.prototype.submit.call(this);

							this.model.get('location').lat = this.model.get('lat');
							this.model.get('location').lng = this.model.get('lng');
							this.model.get('location').address = this.model.get('address');
							this.model.get('location').icon = this.model.get('icon');

							t.model.render();

							t.isDestroyed = false;
							t.map.showModal(t);
						},
						cancel: function() {
							t.isDestroyed = false;
							t.map.showModal(t);
						}
					});

					t.map.showModal(view);
				}

				e.preventDefault();
			});

			this.$el.find('.remove-location').click(function(e) {
				var index = $(this).parents('li').index();

				t.model.removeLocation(index);

				if(t.model.getLocations().length > 1) {
					t.model.render();
				}
				else {
					t.model.setMap(null);	
				}

				t.render();

				e.preventDefault();
			});

			this.$el.find('.add-location').click(function(e) {
				var view = new GoogleMaps.Views.Geocoder({
					map: t.map,
					responseHandler: function(response) {
						t.model.addLocation({
							address: response.formatted_address,
							lat: response.geometry.location.lat(),
							lng: response.geometry.location.lng(),
							isSavedToMap: false
						});

						t.isDestroyed = false;
						t.model.render(t.getOptions());
						t.model.updateMarkerIcons();
						t.map.showModal(t);
					},
					cancel: function() {
						t.isDestroyed = false;
						t.map.showModal(t);
					}
				});

				t.map.showModal(view);

				e.preventDefault();
			});

			this.$el.find('.lightswitch').lightswitch({
				onChange: function() {
					t.model.render(t.getOptions());
				}
			});

			this.$el.find('[name="travelMode"]').click(function(e) {
				t.model.render(t.getOptions());
			});

			this.$el.find('select').change(function() {
				t.model.render(t.getOptions());
			});
		},

		getSwitchOption: function(name) {
			var value = this.$el.find('[name="'+name+'"]').val();

			return value != "" ? true : false;
		},

		getOptions: function() {
			return {
				avoidFerries: this.getSwitchOption('avoidFerries'),
				avoidHighways: this.getSwitchOption('avoidHighways'),
				avoidTolls: this.getSwitchOption('avoidTolls'),
				durationInTraffic: this.getSwitchOption('durationInTraffic'),
				optimizeWaypoints: this.getSwitchOption('optimizeWaypoints'),
				provideRouteAlternatives: this.getSwitchOption('provideRouteAlternatives'),
				transitOptions: {},
				travelMode: this.$el.find('[name="travelMode"]:checked').val(),
				unitSystem: google.maps.UnitSystem.IMPERIAL
			};
		},

		onShow: function() {
			var t = this;

			_.each(this.model.getMarkers(), function(marker, i) {
				marker.setDraggable(true);
			});

			this.map.closeInfoWindows();

			this.map.api.setOptions({
				disableDoubleClickZoom: true
			});

			this.dblclickEvent = google.maps.event.addListener(this.map.api, 'dblclick', function(e) {
				t.geocoder.geocode({location: e.latLng}, function(results, status) {
					t.model.addLocation({
						address: status == 'OK' ? results[0].formatted_address : '',
						lat: e.latLng.lat(),
						lng: e.latLng.lng(),
						isSavedToMap: false
					});
					t.model.render(t.getOptions());
					t.model.updateMarkerIcons();
					t.render();
				});				
			});

			setTimeout(function() {
				t.$el.find('input').focus();
			}, 250);

		},

		onDestroy: function() {

			_.each(this.model.getMarkers(), function(marker, i) {
				marker.setDraggable(false);
			});

			if(this.dblclickEvent) {
				this.dblclickEvent.remove();
			}

			this.map.api.setOptions({disableDoubleClickZoom: false});

			/*
			this.model.onMouseup = function() {};

			this.model.onDragend = function() {};

			if(!this.model.get('isSavedToMap') && this.model.get('isNew')) {
				this.api.setMap(null);
			}

			this.map.api.setOptions({
				disableDoubleClickZoom: false
			});

			*/
		},

		isCoordinate: function(coord) {
			return coord.match(/^([-\d.]+),(\s+)?([-\d.]+)$/);
		},

		saveToMap: function() {
			if(!this.model.get('isSavedToMap')) {
				this.map.routes.push(this.model);
				this.model.set('isSavedToMap', true);
			}

			_.each(this.model.getLocations(), function(location, i) {
				location.isSavedToMap = true;
			});
		},

		submit: function() {
			var t = this;

			this.saveToMap();

			this.model.set(this.getOptions());
			this.model.set({
				title: this.$el.find('[name="title"]').val(),
				content: this.$el.find('[name="content"]').val()
			});

			this.model.setDraggable(false);

			if(this.model.get('infowindow')) {
				this.model.get('infowindow').setOptions({
					content: this.model.buildInfoWindowContent()
				});
			}

			_.each(this.model.getLocations(), function(location, i) {
				var marker = t.model.getMarker(i);

				/*
				marker.set('lat', location.lat);
				marker.set('lng', location.lng);
				marker.set('location', location);
				*/

				marker.originalMarker = $.extend(true, {}, marker.toJSON());
			});

			this.originalRoute = $.extend(true, {}, this.model.toJSON());

			this.map.hideModal();
			this.map.updateHiddenField();
		},

		cancel: function() {
			var t = this, locations = [], markers = [];

			_.each(this.model.getLocations(), function(location, i) {
				if(location.isSavedToMap !== false) {
					locations.push(location);
					markers.push(t.model.getMarker(i));
				}
				else {
					t.model.getMarker(i).setMap(null);
				}
			});

			this.model.set('locations', locations);
			this.model.set('markers', markers);

			_.each(markers, function(marker, i) {
				marker.revert();
				marker.set('location', t.originalRoute.locations[i]);
			});

			this.model.set(this.originalRoute);

			if(!this.model.getLocations().length) {
				this.model.setMap(null);
			}
			else {
				this.model.render();
			}

			this.model.updateMarkerIcons();
			this.map.updateHiddenField();
			this.map.hideModal();
		}

	});

}());