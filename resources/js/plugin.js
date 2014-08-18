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
			if(!options) {
				options = {};
			}

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

			this.bindEvents();

			if(this.center) {
				this.setCenter(this.center);
			}
		},

		bindEvents: function() {

			google.maps.event.addListener(this.api, 'bounds_changed', this.onBoundsChanged);

			google.maps.event.addListener(this.api, 'center_changed', this.onCenterChanged);

			google.maps.event.addListener(this.api, 'click', this.onClick);

			google.maps.event.addListener(this.api, 'dblclick', this.onDblclick);

			google.maps.event.addListener(this.api, 'drag', this.onDrag);

			google.maps.event.addListener(this.api, 'dragend', this.onDragend);

			google.maps.event.addListener(this.api, 'dragstart', this.onDragstart);

			google.maps.event.addListener(this.api, 'heading_changed', this.onHeadingChanged);

			google.maps.event.addListener(this.api, 'idle', this.onIdle);

			google.maps.event.addListener(this.api, 'maptypeid_changed', this.onMaptypeidChanged);

			google.maps.event.addListener(this.api, 'mousemove', this.onMousemove);

			google.maps.event.addListener(this.api, 'mouseout', this.onMouseout);

			google.maps.event.addListener(this.api, 'mouseover', this.onMouseover);

			google.maps.event.addListener(this.api, 'project_changed', this.onProjectChanged);

			google.maps.event.addListener(this.api, 'resize', this.onResize);

			google.maps.event.addListener(this.api, 'rightclick', this.onRightclick);

			google.maps.event.addListener(this.api, 'tilesloaded', this.onTilesloaded);

			google.maps.event.addListener(this.api, 'tilt_changed', this.onTiltChanged);

			google.maps.event.addListener(this.api, 'zoom_changed', this.onZoomChanged);

		},

		redraw: function() {
			google.maps.event.trigger(this.api, 'resize');
		},

		getCenter: function() {
			return this.api.getCenter();
		},

		setCenter: function(lat, lng) {
			var t = this;

			if(lat && lng) {
				this.api.setCenter(new google.maps.LatLng(lat, lng));
			}
			else if(_.isString(lat)) {
				this.geocoder.geocode({address: lat}, function(results, status) {
					if(results.length) {
						t.api.setCenter(results[0].geometry.location);
					}
				});
			}
			else if(_.isObject(lat)) {
				this.api.setCenter(lat);
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
		},

		addPolygon: function(polygon, fitBounds) {
			var t = this;

			this.polygons.push(polygon);

			if(_.isUndefined(fitBounds) || fitBounds) {

				_.each(polygon.getPath().getArray(), function(path) {
					t.bounds.extend(path);
				});

				this.fitBounds(this.bounds);
			}
		},

		closeinfoWindows: function() {

			_.each(this.markers, function(marker) {
				if(marker.infoWindow) {
					marker.infoWindow.close();
				}
			});

			_.each(this.polygons, function(polygon) {
				if(polygon.infoWindow) {
					polygon.infoWindow.close();
				}
			});
		},

		onBoundsChanged: function() {},

		onCenterChanged: function() {},

		onClick: function() {},

		onDblclick: function() {},

		onDrag: function() {},

		onDragend: function() {},

		onDragstart: function() {},

		onHeadingChanged: function() {},

		onIdle: function() {},

		onMaptypeidChanged: function() {},

		onMousemove: function() {},

		onMouseout: function() {},

		onMouseover: function() {},

		onProjectChanged: function() {},

		onResize: function() {},

		onRightclick: function() {},

		onTilesloaded: function() {},

		onTiltChanged: function() {},

		onZoomChanged: function() {}

	});

	GoogleMaps.Marker = GoogleMaps.BaseClass.extend({

		content: false,

		geocoder: false,

		lat: false,

		lng: false,

		address: false,

		api: false,

		map: false,

		closeinfoWindows: true,

		infoWindowTrigger: 'click',

		openinfoWindowOnTrigger: true,

		infoWindow: false,

		fitBounds: true,

		options: {},

		infoWindowOptions: {},

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

					t.createInfoWindow();
				});
			}

			if(this.lat && this.lng) {
				this.api = new google.maps.Marker(_.extend({
					map: this.map.api,
					position: new google.maps.LatLng(this.lat, this.lng)
				}, this.options));

				this.map.addMarker(this, this.fitBounds);

				this.createInfoWindow();
			}
		},

		createInfoWindow: function(marker) {
			var t = this, marker = this.api;

			if(this.content) {
				this.infoWindow = new google.maps.InfoWindow(_.extend({}, this.infoWindowOptions, {
					content: this.content
				}));
			}

			google.maps.event.addListener(this.api, this.infoWindowTrigger, function() {
				if(t.closeinfoWindows) {
					t.map.closeinfoWindows();
				}

				if(t.infoWindow && t.openinfoWindowOnTrigger) {
					t.infoWindow.open(t.map.api, t.api);
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

		infoWindowOptions: {},

		api: false,

		map: false,

		infoWindow: false,

		fitBounds: true,

		infoWindowTrigger: 'click',

		closeinfoWindows: true,

		openinfoWindowOnTrigger: true,

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
					t.paths.push(new google.maps.LatLng(point.lat, point.lng));
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
			this.createInfoWindow();
			this.bindEvents();

			map.addPolygon(this, this.fitBounds);
		},

		createInfoWindow: function(polygon) {
			var t = this, polygon = this.api;

			if(this.content) {
				this.infoWindow = new google.maps.InfoWindow(_.extend({}, this.infoWindowOptions, {
					content: this.content
				}));
			}
		},
		getDraggable: function() {
			return this.api.getDraggable();
		},

		getEditable: function() {
			return this.api.getEditable();
		},

		getMap: function() {
			return this.api.getMap();
		},

		getPath: function() {
			return this.api.getPath();
		},

		getPaths: function() {
			return this.api.getPaths();
		},

		getVisible: function() {
			return this.api.getVisible();
		},

		setDraggable: function(value) {
			this.api.setDraggable(value);
		},

		setEditable: function(value) {
			this.api.setEditable(value);
		},
		
		setMap: function(value) {
			//this.api.setMap(value);
		},
		
		setOptions: function(value) {
			this.api.setOptions(value);
		},
		
		setPath: function(value) {
			this.api.setPath(value);
		},
		
		setPaths: function(value) {
			this.api.setPaths(value);
		},

		setPoints: function(value) {
			var points = [];

			_.each(value, function(point) {
				points.push(new google.maps.LatLng(point.lat, point.lng));
			});

			this.setPath(points);
		},
		
		setVisible: function(value) {
			this.api.setVisible(value);
		},
		
		toJSON: function() {
			var json = GoogleMaps.Models.Base.prototype.toJSON.call(this);
			var points = [];


			if(this.api.getPath()) {
				_.each(this.api.getPath().getArray(), function(latLng) {
					points.push({
						lat: latLng.lat(),
						lng: latLng.lng()
					});
				});
			}

			json.points = points;

			return json;
		},

		bindEvents: function() {
			var t = this;

			if(this.infoWindow) {
				google.maps.event.addListener(this.api, this.infoWindowTrigger, function(e) {

					if(t.closeinfoWindows) {
						t.map.closeinfoWindows();
					}

					if(t.openinfoWindowOnTrigger) {
						t.infoWindow.open(t.map.api);
						t.infoWindow.setPosition(e.latLng);
					}
				});
			}

			google.maps.event.addListener(this.api, 'click', function() {
				t.onClick.apply(t, arguments);
			});

			google.maps.event.addListener(this.api, 'dblclick', function() {
				t.onDblclick.apply(t, arguments);
			});

			google.maps.event.addListener(this.api, 'drag', function() {
				t.onDrag.apply(t, arguments);
			});
			
			google.maps.event.addListener(this.api, 'dragend', function() {
				t.onDragend.apply(t, arguments);
			});
			
			google.maps.event.addListener(this.api, 'dragstart', function() {
				t.onDragstart.apply(t, arguments);
			});
			
			google.maps.event.addListener(this.api, 'mousedown', function() {
				t.onMousedown.apply(t, arguments);
			});
			
			google.maps.event.addListener(this.api, 'mousemove', function() {
				t.onMousemove.apply(t, arguments);
			});
			
			google.maps.event.addListener(this.api, 'mouseout', function() {
				t.onMouseout.apply(t, arguments);
			});
			
			google.maps.event.addListener(this.api, 'mouseover', function() {
				t.onMouseover.apply(t, arguments);
			});
			
			google.maps.event.addListener(this.api, 'mouseup', function() {
				t.onMouseup.apply(t, arguments);
			});
			
			google.maps.event.addListener(this.api, 'rightclick', function() {
				t.onRightclick.apply(t, arguments);
			});
		},

		onClick: function(e) {},

		onDblclick: function() {},

		onDrag: function() {},

		onDragend: function(e) {},

		onDragstart: function() {},

		onMousedown: function() {},

		onMousemove: function() {},

		onMouseout: function() {},

		onMouseover: function() {},

		onMouseup: function() {},

		onRightclick: function() {}

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

			if(data.polygons) {
				_.each(data.polygons, function(polygon, i) {

					var polygon = new GoogleMaps.Polygon(map, polygon.points, {
						title: polygon.title,
						content: polygon.content,
						fitBounds: t.fitBounds,
						infoWindowOptions: options.infoWindowOptions ? options.infoWindowOptions : {},
						options: {
							strokeColor: polygon.strokeColor,
							strokeOpacity: polygon.strokeOpacity,
							strokeWeight: polygon.strokeWeight,
							fillColor: polygon.fillColor,
							fillOpacity: polygon.fillOpacity
						}
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

				marker.infoWindow = new google.maps.InfoWindow({
					content: marker.content
				});

				google.maps.event.addListener(marker, 'click', function() {
					marker.infoWindow.open(map.api, marker);
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