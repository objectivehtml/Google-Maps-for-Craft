(function() {

	"use strict";

	GoogleMaps.Models.Route = GoogleMaps.Models.Base.extend({

		initialize: function(options) {
			var t = this;

			GoogleMaps.Models.Base.prototype.initialize.call(this, options);

			if(!this.get('api')) {
				this.set('api', new google.maps.DirectionsRenderer(_.extend({}, options, {
					draggable: false,
					map: this.get('map').api,
					suppressInfoWindows: true,
					suppressMarkers: true,
					preserveViewport: true,
					infoWindow: new google.maps.InfoWindow({
						content: 'test'
					})
				})));
			}
			else {
				this.get('api').setMap(this.get('map').api);
			}

			if(this.get('markers')) {
				var markers = [];

				_.each(this.get('markers'), function(marker, i) {
					markers.push(new GoogleMaps.Models.RouteMarker(_.extend({}, marker, {
						location: t.getLocations()[i],
						route: t,
						map: t.get('map'),
						onDragend: function(e) {
							GoogleMaps.Models.RouteMarker.prototype.onDragend.call(this, e, function() {
								t.onDragend.call(t, e);
							});
						} 
					})));
				});

				this.set('markers', markers);
			}

			if(this.getLocations().length) {
				t.render(t.getDirectionsRequestObject());				
			}


			/*
			if(this.get('icon')) {
				this.setIcon(this.get('icon'));
			}

			if(!this.get('infowindow')) {
				this.set('infowindow', new google.maps.InfoWindow({
					maxWidth: 300,
					content: this.buildInfoWindowContent()
				}));
			}

			this.bindEvents();
			*/
		},

		remove: function() {
			this.get('api').setMap(null);
			this.set('deleted', true);

			_.each(this.getMarkers(), function(marker) {
				marker.remove();
			});
		},

		getDirectionsRequestObject: function() {
			return {
				origin: this.getOrigin(),
				destination: this.getDestination(),
				waypoints: this.getWaypoints(),
				avoidFerries: this.get('avoidFerries'),
				avoidHighways: this.get('avoidHighways'),
				avoidTolls: this.get('avoidTolls'),
				durationInTraffic: this.get('durationInTraffic'),
				optimizeWaypoints: this.get('optimizeWaypoints'),
				provideRouteAlternatives: this.get('provideRouteAlternatives'),
				transitOptions: this.get('transitOptions'),
				unitSystem: this.get('unitSystem')
			};
		},

		setDraggable: function(value) {
			this.get('api').setOptions({draggable: value});
		},

		getOrigin: function() {
			var locations = this.getLocations();
			var location = locations[0];

			if(location) {
				return new google.maps.LatLng(location.lat, location.lng);
			}

			return null;
		},

		getDestination: function() {
			var locations = this.getLocations();

			if(locations.length < 2) {
				return null;
			}

			var location = locations[locations.length - 1];

			if(location) {
				return new google.maps.LatLng(location.lat, location.lng);
			}

			return null;
		},

		render: function(request, callback) {
			var t = this; // , markers = [];

			if(!_.isObject(request)) {
				request = this.getDirectionsRequestObject();
			}

			this.directionsRequest(request, function(result, status) {
				if(status == 'OK') {
					t.setDirections(result);
					t.setMap(t.get('map').api);
				}
			});
		},

		getWaypoints: function() {
			var waypoints = [], locations = this.getLocations();

			if(locations.length < 3) {
				return [];
			}

			_.each(locations, function(location, i) {
				if(i > 0 && i < locations.length - 1) {
					waypoints.push({
						location: new google.maps.LatLng(location.lat, location.lng),
						stopover: true
					});
				}
			});

			return waypoints;
		},

		directionsRequest: function(request, callback) {
			if(_.isFunction(request)) {
				callback = request;
			}

			if(!_.isObject(request)) {
				request = {};
			}

			request = _.extend({}, request, {
				origin: this.getOrigin(),
				destination: this.getDestination(),
				waypoints: this.getWaypoints(),
				travelMode: this.get('travelMode') ? this.get('travelMode') : (request.travelMode ? request.travelMode : google.maps.TravelMode.DRIVING)
			});

			if(!request.origin || !request.destination) {
				return;
			}

			var t = this, service = new google.maps.DirectionsService();

			return service.route(request, function(result, status) {
				if(_.isFunction(callback)) {
					callback.call(t, result, status);
				}
			});
		},
		
		buildInfoWindowContent: function() {
			var content = this.get('content');
			var _return = ['<div>', (_.isArray(content) ? content.join('') : content)];

			var t = this;

			_return.push([
					'<div class="oh-google-map-infowindow-actions">',
						'<a href="#" class="edit">Edit</a> | ',
						'<a href="#" class="delete">Delete</a>',
					'</div>',
				'</div>'
			].join(''));

			var $content = $(_return.join(''));

			$content.find('.edit').click(function(e) {

				t.edit();

				e.preventDefault();
			});

			$content.find('.delete').click(function(e) {
				t.delete();

				e.preventDefault();
			});

			return $content.get(0);
		},

		edit: function(showMapList) {
			var t = this, view = new GoogleMaps.Views.RouteForm({
				model: this,
				map: this.get('map'),
				cancel: function() {
					GoogleMaps.Views.RouteForm.prototype.cancel.call(view);

					if(showMapList) {
						t.get('map').showMapList();
					}
				}
			});

			this.get('map').showModal(view);
		},

		delete: function(showMapList) {
			var t = this;

			var view = new GoogleMaps.Views.DeleteRouteForm({
				model: this,
				submit: function() {
					t.remove();
					t.get('map').updateHiddenField();
			
					if(showMapList) {
						t.get('map').showMapList();
					}
					else {
						t.get('map').hideModal();
					}
				},
				cancel: function() {
					if(showMapList) {
						t.get('map').showMapList();
					}
					else {
						t.get('map').hideModal();
					}
				}
			});

			this.get('map').showModal(view);
		},

		getDirections: function() {
			return this.get('api').getDirections();
		},

		addLocation: function(location) {
			var t = this;
			var locations = this.getLocations();
			var i = locations.length;

			if(!locations) {
				locations = [];
			}

			locations.push(location);

			this.set('locations', locations);

			var marker = new GoogleMaps.Models.RouteMarker({
				scaledWidth: 22,
				scaledHeight: 40,
				route: this,
				map: this.get('map'),
				lat: location.lat,
				lng: location.lng,
				address: location.address,
				draggable: true,
				content: location.address.split(',').join('<br>'),
				location: location,
				onDragend: function(e) {
					GoogleMaps.Models.RouteMarker.prototype.onDragend.call(this, e, function() {
						t.onDragend.call(t, e);
					});
				} 
			});

			this.addMarker(marker);
		},

		removeLocation: function(index) {
			var locations = this.getLocations();

			if(locations[index]) {
				locations.splice(index, 1);
			}

			this.set('locations', locations);

			this.removeMarker(index);
		},

		addMarker: function(marker) {
			var markers = this.getMarkers();

			if(!markers) {
				markers = [];
			}

			markers.push(marker);

			this.updateMarkerIcons();
			this.set('markers', markers);
		},

		removeMarker: function(index) {
			var markers = this.getMarkers();

			if(markers[index]) {
				markers[index].setMap(null);
				markers.splice(index, 1);
			}

			this.updateMarkerIcons();
			this.set('markers', markers);
		},

		onDragend: function(e) {},

		updateMarkerIcons: function() {
			var t = this;

			_.each(this.getMarkers(), function(marker, i) {
				if(i < t.getMarkers().length - 1) {
					var icon = 'http://mt.google.com/vt/icon/text='+String.fromCharCode(65 + i)+'&psize=16&font=fonts/arialuni_t.ttf&color=ff330000&name=icons/spotlight/spotlight-waypoint-a.png&ax=44&ay=48&scale=2';
				}
				else {
					var icon = 'http://mt.google.com/vt/icon/text='+String.fromCharCode(65 + i)+'&psize=16&font=fonts/arialuni_t.ttf&color=ff330000&name=icons/spotlight/spotlight-waypoint-b.png&ax=44&ay=48&scale=2';
				}
				
				t.getLocation(i).icon = icon;

				marker.set('icon', icon);
				marker.setIcon(icon);
			});
		},

		getLocations: function() {
			return this.get('locations');
		},

		getLocation: function(i) {
			var locations = this.getLocations();

			if(locations[i]) {
				return locations[i];
			}

			return null;
		},

		getMarkers: function() {
			return this.get('markers');
		},

		getMarker: function(i) {
			var markers = this.getMarkers();

			if(markers[i]) {
				return markers[i];
			}

			return null;
		},

		getMap: function() {
			return this.get('api').getMap();
		},

		getPanel: function() {
			return this.get('api').getPanel();
		},

		getRouteIndex: function() {
			return this.get('api').getRouteIndex();
		},

		setDirections: function(value) {
			this.get('api').setDirections(value);
		},
		
		setMap: function(value) {
			this.get('api').setMap(value);
		},
		
		setOptions: function(value) {
			this.get('api').setOptions(value);
		},
		
		setPosition: function(value) {
			this.get('api').setPosition(value);
		},
		
		setPanel: function(value) {
			this.get('api').setPanel(value);
		},
		
		setVisible: function(value) {
			this.get('api').setVisible(value);
		},
		
		setRouteIndex: function(value) {
			this.get('api').setRouteIndex(value);
		},

		bindEvents: function() {
			var t = this;

			google.maps.event.addListener(this.get('api'), 'directions_changed', function() {
				t.onDirectionsChanged.apply(t, arguments);
			});
		},

		onDirectionsChanged: function() {}

	});

}());