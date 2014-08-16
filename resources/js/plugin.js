var GoogleMaps = {
	instances: []
};

(function() {

	GoogleMaps.BaseClass = Base.extend({

		constructor: function(options) {
			this.fill(options);
		},

		fill: function(options) {
			_.extend(this, options);
		}

	});

	GoogleMaps.Map = GoogleMaps.BaseClass.extend({

		api: false,

		bounds: false,

		el: false,

		center: false,

		geocoder: false,

		options: {},

		markers: [],

		polygons: [],

		lat: 0,

		lng: 0,

		constructor: function(node, options) {
			var defaultMapOptions = {
				center: new google.maps.LatLng(
					(options.lat ? options.lat : 0), 
					(options.lng ? options.lng : 0)
				),
				zoom: 10
			};

			this.el = node;

			this.geocoder = new google.maps.Geocoder();

			this.bounds = new google.maps.LatLngBounds();

			this.markers = [];

			this.polygons = [];
			
			this.base(options);

			this.options = _.extend({}, defaultMapOptions, this.options);

			this.api = new google.maps.Map(node, this.options);

			if(this.center) {
				this.setCenter(this.center);
			}
		},

		redraw: function() {
			google.maps.event.trigger(this.api, 'resize');
		},

		setCenter: function(lat, lng) {
			var t = this;

			if(_.isString(lat)) {
				this.geocoder.geocode({address: lat}, function(results, status) {
					if(results.length) {
						t.api.setCenter(results[0].geometry.location);
					}
				});
			}
			else if(_.isObject(lat)) {
				this.api.setCenter(lat);
			}
			else {
				this.api.setCenter(new google.maps.LatLng(lat, lng));
			}
		},

		setZoom: function(zoom) {
			this.api.setZoom(zoom);
		},

		getZoom: function() {
			return this.api.getZoom();
		},

		fitBounds: function(bounds) {
			this.api.fitBounds(bounds);
		},

		addMarker: function(marker, fitBounds) {
			this.markers.push(marker);

			if(_.isUndefined(fitBounds) || fitBounds) {
				this.bounds.extend(marker.getPosition());
				this.fitBounds(this.bounds);
			}
		}

	});

	GoogleMaps.Marker = GoogleMaps.BaseClass.extend({

		content: false,

		geocoder: false,

		lat: false,

		lng: false,

		address: false,

		api: false,

		map: false,

		closeInfoWindows: true,

		infoWindowTrigger: 'click',

		openInfoWindowOnTrigger: true,

		infowindow: false,

		fitBounds: true,

		options: {},

		constructor: function(map, options) {
			var t = this;

			this.geocoder = new google.maps.Geocoder();

			this.map = map;

			this.base(options);

			if(this.address) {
				this.geocoder.geocode({address: this.address}, function(results, status) {
					t.api = new google.maps.Marker(_.extend({
						map: t.map.api,
						position: new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng())
					}, t.options));

					this.map.addMarker(t, t.fitBounds);

					t.createInfoWindow(t.api);
				});
			}

			if(this.lat && this.lng) {
				this.api = new google.maps.Marker(_.extend({
					map: this.map.api,
					position: new google.maps.LatLng(this.lat, this.lng)
				}, this.options));

				this.map.addMarker(this, this.fitBounds);

				this.createInfoWindow(this.api);
			}
		},

		createInfoWindow: function(marker) {
			var t = this;

			if(this.content) {
				this.infowindow = new google.maps.InfoWindow({
					content: this.content
				});
			}

			google.maps.event.addListener(this.api, this.infoWindowTrigger, function() {
				if(t.closeInfoWindows) {
					_.each(t.map.markers, function(marker) {
						if(marker.infowindow) {
							marker.infowindow.close();
						}
					});
				}

				if(t.infowindow && t.openInfoWindowOnTrigger) {
					t.infowindow.open(t.map.api, t.api);
				}
			});
		},

		getPosition: function() {
			return this.api.getPosition();
		}

	});

	GoogleMaps.Polygon = GoogleMaps.BaseClass.extend({

		paths: [],

		options: {},

		api: false,

		map: false,

		fitBounds: true,

		constructor: function(map, points, options) {
			var t = this;

			this.paths = [];

			this.map = map;

			this.base(options);

			_.each(points, function(point) {
				if(_.isArray(point)) {
					t.paths.push(new google.maps.LatLng(point[0], point[1]));
				}
				else if(point.lat && point.lng) {
					t.paths.push(new google.map.LatLng(point.lat, point.lng));
				}
				else if(_.isObject(point)) {
					t.paths.push(point)
				}

				if(t.fitBounds) {
					map.bounds.extend(t.paths[t.paths.length - 1]);
				}
			});

			var defaultOptions = {
				map: map.api,
				paths: t.paths
			};

			this.api = new google.maps.Polygon(_.extend({}, defaultOptions, this.options));

			if(this.fitBounds) {
				map.fitBounds(map.bounds)
			}
		}
	});

	GoogleMaps.MapData = GoogleMaps.BaseClass.extend({

		bounds: false,

		fitBounds: true,

		markers: [],

		constructor: function(map, data, options) {
			var t = this;

			this.bounds = new google.maps.LatLngBounds();

			this.base(options);

			if(data.markers) {
				_.each(data.markers, function(marker, i) {
					var marker = new GoogleMaps.Marker(map, {
						lat: marker.lat,
						lng: marker.lng,
						content: marker.content,
						fitBounds: t.fitBounds
					});
				});
			}
		}

	});

	/*
	GoogleMaps.Polygon = function(map, points, options) {
		
		var paths = [], bounds = new google.maps.LatLngBounds();

		_.each(points, function(point) {
			if(_.isArray(point)) {
				paths.push(new google.maps.LatLng(point[0], point[1]));
			}
			else if(point.lat && point.lng) {
				paths.push(new google.map.LatLng(point.lat, point.lng));
			}
			else if(_.isObject(point)) {
				paths.push(point)
			}

			bounds.extend(paths[paths.length - 1]);
		});

		var defaultMapOptions = {
			map: map.api,
			paths: paths,
			fitBounds: true
		};

		this.options = _.extend({}, defaultMapOptions, options);

		this.api = new google.maps.Polygon(this.options);

		if(this.options.fitBounds) {
			map.fitBounds(bounds)
		}

		return this;
	};
	*/

	/*
	GoogleMaps.MapData = function(map, data, options) {
		var defaultMapOptions = {
			fitBounds: true
		};

		options = _.extend({}, defaultMapOptions, options);

		var bounds = new google.maps.LatLngBounds();

		if(data.markers) {
			_.each(data.markers, function(marker, i) {
				var position = new google.maps.LatLng(marker.lat, marker.lng);

				var marker = new google.maps.Marker({
					map: map.api,
					title: marker.title,
					address: marker.address,
					addressComponents: marker.addressComponents,
					content: marker.content,
					position: position
				});

				marker.infowindow = new google.maps.InfoWindow({
					content: marker.content
				});

				google.maps.event.addListener(marker, 'click', function() {
					marker.infowindow.open(map.api, marker);
				});

				map.markers.push(marker);

				console.log(position);

				bounds.extend(position);
			});
		}

		if(options.fitBounds) {
			map.fitBounds(bounds);
		}
	};
	*/

}());