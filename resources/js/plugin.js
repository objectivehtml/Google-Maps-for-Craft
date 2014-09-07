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

		clustering: false,

		clusteringOptions: {},

		markers: [],

		polygons: [],

		polylines: [],

		routes: [],

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

			this.polylines = [];

			this.routes = [];
			
			this.base(options);

			this.options = _.extend({}, defaultMapOptions, this.options);

			this.api = new google.maps.Map(node, this.options);

			if(this.clustering) {
				this.clusterer = new MarkerClusterer(this.api, this.markers, this.clusteringOptions);
			}

			this.bindEvents();

			if(this.center) {
				this.setCenter(this.center);
			}
		},

		bindEvents: function() {
			var t = this;

			google.maps.event.addListener(this.api, 'bounds_changed', function() {
				t.onBoundsChanged.apply(t, arguments);
			});

			google.maps.event.addListener(this.api, 'center_changed', function() {
				t.onCenterChanged.apply(t, arguments);
			});

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

			google.maps.event.addListener(this.api, 'heading_changed', function() {
				t.onHeadingChanged.apply(t, arguments);
			});

			google.maps.event.addListener(this.api, 'idle', function() {
				t.onIdle.apply(t, arguments);
			});

			google.maps.event.addListener(this.api, 'maptypeid_changed', function() {
				t.onMaptypeidChanged.apply(t, arguments);
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

			google.maps.event.addListener(this.api, 'project_changed', function() {
				t.onProjectChanged.apply(t, arguments);
			});

			google.maps.event.addListener(this.api, 'resize', function() {
				t.onResize.apply(t, arguments);
			});

			google.maps.event.addListener(this.api, 'rightclick', function() {
				t.onRightclick.apply(t, arguments);
			});

			google.maps.event.addListener(this.api, 'tilesloaded', function() {
				t.onTilesloaded.apply(t, arguments);
			});

			google.maps.event.addListener(this.api, 'tilt_changed', function() {
				t.onTiltChanged.apply(t, arguments);
			});

			google.maps.event.addListener(this.api, 'zoom_changed', function() {
				t.onZoomChanged.apply(t, arguments);
			});
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

		addPolyline: function(polyline, fitBounds) {
			var t = this;

			this.polylines.push(polyline);
			
			if(_.isUndefined(fitBounds) || fitBounds) {
				_.each(polyline.getPath().getArray(), function(path) {
					t.bounds.extend(path);
				});
			}
		},

		addRoute: function(route, fitBounds) {
			var t = this;

			this.routes.push(route);
			
			if(_.isUndefined(fitBounds) || fitBounds) {
				_.each(route.getLocations(), function(location) {
					t.bounds.extend(new google.maps.LatLng(location.lat, location.lng));
				});
			}
			
			this.fitBounds(this.bounds);
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

		clustering: false,

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

		iconSize: false,

		constructor: function(map, options) {
			var t = this;

			this.geocoder = new google.maps.Geocoder();

			this.map = map;

			this.base(options);

			if(this.lat && this.lng) {
				this.api = new google.maps.Marker(_.extend({
					map: !this.shouldCluster() ? this.map.api : null,
					position: new google.maps.LatLng(this.lat, this.lng)
				}, this.options));

				if(this.shouldCluster()) {
					this.map.clusterer.addMarker(this.api);
				}

				this.map.addMarker(this, this.fitBounds);

				this.createInfoWindow();
			}
			else if(this.address) {
				this.geocoder.geocode({address: this.address}, function(results, status) {
					if(status == 'OK') {
						t.api = new google.maps.Marker(_.extend({
							map: !t.shouldCluster() ? t.map.api : null,
							position: new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng())
						}, t.options));

						if(t.shouldCluster()) {
							t.map.clusterer.addMarker(t.api);
						}

						t.map.addMarker(t, t.fitBounds);

						t.createInfoWindow();
					}
				});
			}
		},

		shouldCluster: function() {
			return this.clustering && this.map.clusterer;
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

		getAnimation: function() {
			return this.api.getAnimation();
		},

		getClickable: function() {
			return this.api.getClickable();
		},

		getCursor: function() {
			return this.api.getCursor();
		},

		getDraggable: function() {
			return this.api.getDraggable();
		},

		getIcon: function() {
			return this.api.getIcon();
		},

		getMap: function() {
			return this.api.getMap();
		},

		getOpacity: function() {
			return this.api.getOpacity();
		},

		getPosition: function() {
			return this.api.getPosition();
		},

		getShape: function() {
			return this.api.getShape()
		},

		getTitle: function() {
			return this.api.getTitle();
		},

		getVisible: function() {
			return this.api.getVisible();
		},

		getZIndex: function() {
			return this.api.getZIndex();
		},

		setAnimation: function(value) {
			this.api.setAnimation(value);
		},

		setClickable: function(value) {
			this.api.setClickable(value);
		},
		
		setCursor: function(value) {
			this.api.setCursor(value);
		},
		
		setDraggable: function(value) {
			this.api.setDraggable(value);
		},
		
		setIcon: function(value) {
			if(this.iconSize) {
				var icon = {
					scaledSize: new google.maps.Size(this.iconSize[0], this.iconSize[1]),
					url: value
				};
				
				this.api.setIcon(icon);
			}
			else {
				this.api.setIcon(value);
			}
		},
		
		setMap: function(value) {
			this.api.setMap(value);
		},
		
		setOpacity: function(value) {
			this.api.setOpacity(value);
		},
		
		setOptions: function(value) {
			this.api.setOptions(value);
		},
		
		setPosition: function(value) {
			this.api.setPosition(value);
		},
		
		setShape: function(value) {
			this.api.setShape(value);
		},
		
		setTitle: function(value) {
			this.api.setTitle(value);
		},
		
		setVisible: function(value) {
			this.api.setVisible(value);
		},
		
		setZIndex: function(value) {
			this.api.setZIndex(value);
		},

		bindEvents: function() {
			var t = this;

			google.maps.event.addListener(this.api, 'animation_changed', function() {
				t.onAnimationChanged.apply(t, arguments);
			});

			google.maps.event.addListener(this.api, 'click', function() {
				t.onClick.apply(t, arguments);
			});

			google.maps.event.addListener(this.api, 'cursor_changed', function() {
				t.onCursorChanged.apply(t, arguments);
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
			
			google.maps.event.addListener(this.api, 'draggable_changed', function() {
				t.onDraggableChanged.apply(t, arguments);
			});

			google.maps.event.addListener(this.api, 'dragstart', function() {
				t.onDragstart.apply(t, arguments);
			});
			
			google.maps.event.addListener(this.api, 'flat_changed', function() {
				t.onFlatChanged.apply(t, arguments);
			});
			
			google.maps.event.addListener(this.api, 'icon_changed', function() {
				t.onIconChanged.apply(t, arguments);
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
			
			google.maps.event.addListener(this.api, 'position_changed', function() {
				t.onPositionChanged.apply(t, arguments);
			});
			
			google.maps.event.addListener(this.api, 'rightclick', function() {
				t.onRightclick.apply(t, arguments);
			});
			
			google.maps.event.addListener(this.api, 'shape_changed', function() {
				t.onShapeChanged.apply(t, arguments);
			});
			
			google.maps.event.addListener(this.api, 'tilt_changed', function() {
				t.onTiltChanged.apply(t, arguments);
			});
			
			google.maps.event.addListener(this.api, 'visible_changed', function() {
				t.onVisibleChanged.apply(t, arguments);
			});

			google.maps.event.addListener(this.api, 'zindex_changed', function() {
				t.onZindexChanged.apply(t, arguments);
			});
		},

		onAnimationChanged: function() {},

		onClick: function() {
			this.get('map').closeInfoWindows();
			this.get('infowindow').open(this.get('map').api, this.api);
		},

		onCursorChanged: function() {},

		onDblclick: function() {},

		onDrag: function() {},

		onDragend: function(e, callback) {
			var t = this;

			t.set({
				lat: e.latLng.lat(),
				lng: e.latLng.lng()
			});

			this.get('map').geocoder.geocode({location: e.latLng}, function(results, status) {
				if(status == 'OK') {
					t.set('address', results[0].formatted_address);
					t.set('addressComponents', results[0].address_components);
				}
				else {
					t.set('address', null);
					t.set('addressComponents', null);
				}

				if(!t.get('customContent')) {
					if(!t.isCoordinate(t.get('address'))) {
						t.set('content', t.get('address').split(',').join('<br>'));
					}
					else {
						t.set('content', t.get('address'));
					}

					t.get('infowindow').setContent(t.buildInfoWindowContent());
				}

				t.get('map').updateHiddenField();
				
				if(_.isFunction(callback)) {
					callback(e);
				}
			});
		},

		onDraggableChanged: function() {},

		onDragstart: function() {},

		onFlatChanged: function() {},

		onIconChanged: function() {},

		onMousemove: function() {},

		onMouseout: function() {},

		onMouseover: function() {},

		onMouseup: function() {},

		onPositionChanged: function() {},

		onRightclick: function() {},

		onShapeChanged: function() {},

		onTiltChanged: function() {},

		onVisibleChanged: function() {},

		onZindexChanged: function() {}


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

			this.path = [];

			this.map = map;

			this.base(options);

			_.each(points, function(point) {
				if(_.isArray(point)) {
					t.path.push(new google.maps.LatLng(point[0], point[1]));
				}
				else if(point.lat && point.lng) {
					t.path.push(new google.maps.LatLng(point.lat, point.lng));
				}
				else if(_.isObject(point)) {
					t.path.push(point)
				}

				if(t.fitBounds) {
					map.bounds.extend(t.path[t.path.length - 1]);
				}
			});

			this.initializeApi(map);
			this.createInfoWindow();
			this.bindEvents();
			this.saveToMap();
		},

		saveToMap: function() {
			this.map.addPolygon(this, this.fitBounds);
		},

		initializeApi: function(map) {			
			var defaultOptions = {
				map: map.api,
				paths: this.path
			};

			this.api = new google.maps.Polygon(_.extend({}, defaultOptions, this.options));
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

	GoogleMaps.Polyline = GoogleMaps.Polygon.extend({

		initializeApi: function(map) {
			var defaultOptions = {
				map: map.api,
				path: this.path
			};

			this.api = new google.maps.Polyline(_.extend({}, defaultOptions, this.options));
		},

		saveToMap: function() {
			this.map.addPolyline(this, this.fitBounds);
		}

	});

	GoogleMaps.Route = GoogleMaps.BaseClass.extend({

		locations: [],

		map: false,

		markers: [],

		directionsRequestOptions: {},

		directionsRendererOptions: {},

		fitBounds: true,

		lastResponse: false,

		lastResponseStatus: false,

		iconSize: [22, 40],

		constructor: function(map, options) {
			if(!options) {
				options = {};
			}

			this.map = map;

			this.bounds = new google.maps.LatLngBounds();

			this.locations = [];

			this.markers = [];

			this.directionsRequestOptions = {};

			this.directionsRendererOptions = {};
			
			this.base(options);

			this.initializeApi();
			this.bindEvents();
			this.map.addRoute(this, this.fitBounds);
		},

		initializeApi: function() {
			var t = this;

			this.directionsRenderer = new google.maps.DirectionsRenderer(this.directionsRendererOptions);

			this.directionsService = new google.maps.DirectionsService();

			var markers = [];

			_.each(this.getMarkers(), function(marker) {
				var icon = marker.icon;

				marker = new GoogleMaps.Marker(map, {
					lat: marker.lat,
					lng: marker.lng,
					content: marker.content,
					fitBounds: t.fitBounds,
					iconSize: marker.scaledWidth && marker.scaledHeight ? [marker.scaledWidth, marker.scaledHeight] : false
				});

				if(t.iconSize) {
					marker.iconSize = t.iconSize;
				}

				if(icon) {
					marker.setIcon(icon);
				}

				markers.push(marker);
			});

			this.markers = markers;

			this.directionsRequest();
		},
		
		addLocation: function(location) {
			var t = this;
			var locations = this.getLocations();
			var i = locations.length;

			if(!locations) {
				locations = [];
			}

			locations.push(location);

			this.locations = locations;

			var marker = new GoogleMaps.Marker(this.map, {
				iconSize: this.iconSize,
				lat: location.lat,
				lng: location.lng,
				address: location.address,
				draggable: false,
				content: location.address.split(',').join('<br>'),
				fitBounds: this.fitBounds
			});

			this.addMarker(marker);
			this.directionsRequest();
		},

		removeLocation: function(index) {
			var locations = this.getLocations();

			if(locations[index]) {
				locations.splice(index, 1);
			}

			this.locations = locations;

			this.removeMarker(index);
			this.directionsRequest();
		},

		addMarker: function(marker) {
			var markers = this.getMarkers();

			if(!markers) {
				markers = [];
			}

			markers.push(marker);

			this.markers = markers;
			this.updateMarkerIcons();
		},

		removeMarker: function(index) {
			var markers = this.getMarkers();

			if(markers[index]) {
				markers[index].setMap(null);
				markers.splice(index, 1);
			}

			this.markers = markers;
			this.updateMarkerIcons();
		},

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

				marker.setIcon(icon);
			});
		},

		directionsRequest: function(callback) {
			var t = this, request = {
				origin: this.getOrigin(),
				destination: this.getDestination(),
				waypoints: this.getWaypoints()
			};

			request = _.extend(this.directionsRequestOptions, request);

			this.directionsService.route(request, function(response, status) {
				t.lastResponse = response;
				t.lastResponseStatus = status;
				t.setDirections(response);
				t.setMap(t.map.api);

				if(_.isFunction(callback)) {
					callback.call(t, response, status);
				}
			});
		},

		bindEvents: function() {
			var t = this;

			google.maps.event.addListener(this.directionsRenderer, 'directions_changed', function() {
				t.onDirectionsChanged.call(t);
			});
		},

		getLocations: function() {
			return this.locations;
		},

		getLocation: function(i) {
			var locations = this.getLocations();

			if(locations[i]) {
				return locations[i];
			}

			return null;
		},

		getMarkers: function() {
			return this.markers;
		},

		getMarker: function(i) {
			var markers = this.getMarkers();

			if(markers[i]) {
				return markers[i];
			}

			return null;
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

		onDirectionsChanged: function() {},

		getDirections: function() {
			return this.directionsRenderer.getDirections();
		},
		
		getMap: function() {
			return this.directionsRenderer.getMap();
		},
		
		getPanel: function() {
			return this.directionsRenderer.getPanel();
		},
		
		getRouteIndex: function() {
			return this.directionsRenderer.getRouteIndex();
		},

		setDirections: function(value) {
			this.directionsRenderer.setDirections(value);
		},

		setMap: function(value) {
			this.directionsRenderer.setMap(value);
		},

		setOptions: function(value) {
			this.directionsRendererOptions = value;
			this.directionsRenderer.setOptions(value);
		},

		setPanel: function(value) {
			this.directionsRenderer.setPanel(value);
		},

		setRouteIndex: function(value) {
			this.directionsRenderer.setRouteIndex(value);
		}

	});

	GoogleMaps.MapData = GoogleMaps.BaseClass.extend({

		bounds: false,

		clustering: false,

		fitBounds: true,

		markers: [],

		iconSize: false,

		objects: ['markers', 'polygons', 'polylines', 'routes'],

		constructor: function(map, data, options) {
			var t = this;

			this.bounds = new google.maps.LatLngBounds();

			this.base(options);

			if(data.markers && this.objects.indexOf('markers') >= 0) {
				_.each(data.markers, function(marker, i) {
					var icon = marker.icon;

					marker = new GoogleMaps.Marker(map, {
						lat: marker.lat,
						lng: marker.lng,
						content: marker.content,
						fitBounds: t.fitBounds,
						clustering: t.clustering,
						iconSize: t.iconSize
					});

					if(t.iconSize) {
						marker.iconSize = t.iconSize;
					}

					if(icon) {
						marker.setIcon(icon);
					}
				});
			}

			if(data.polygons && this.objects.indexOf('polygons') >= 0) {
				_.each(data.polygons, function(polygon, i) {

					polygon = new GoogleMaps.Polygon(map, polygon.points, {
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

			if(data.polylines && this.objects.indexOf('polylines') >= 0) {
				_.each(data.polylines, function(polyline, i) {

					polyline = new GoogleMaps.Polyline(map, polyline.points, {
						title: polyline.title,
						content: polyline.content,
						fitBounds: t.fitBounds,
						infoWindowOptions: options.infoWindowOptions ? options.infoWindowOptions : {},
						options: {
							strokeColor: polyline.strokeColor,
							strokeOpacity: polyline.strokeOpacity,
							strokeWeight: polyline.strokeWeight
						}
					});
				});
			}

			if(data.routes && this.objects.indexOf('routes') >= 0) {
				_.each(data.routes, function(route, i) {

					route = new GoogleMaps.Route(map, {
						title: route.title,
						content: route.content,
						fitBounds: t.fitBounds,
						locations: route.locations,
						markers: route.markers,
						directionsRendererOptions: {
							suppressMarkers: true,
							suppressInfoWindows: true,
							preserveViewport: true
						},
						directionsRequestOptions: {
							avoidFerries: route.avoidFerries,
							avoidHighways: route.avoidHighways,
							avoidTolls: route.avoidTolls,
							durationInTraffic: route.durationInTraffic,
							optimizeWaypoints: route.optimizeWaypoints,
							provideRouteAlternatives: route.provideRouteAlternatives,
							transitOptions: route.transitOptions,
							travelMode: route.travelMode,
							unitSystem: route.unitSystem
						}
					});
				});
			}
		}

	});

	GoogleMaps.CurrentLocation = GoogleMaps.BaseClass.extend({

		fitBounds: true,

		circleOptions: {},

		markerOptions: {},

		map: false,

		constructor: function(map, options) {
			this.map = map;

			this.map.currentLocation = this;

			this.circleOptions = {};
			this.markerOptions = {};

			this.base(options);

			this.api = new GeolocationMarker(this.map.api, this.circleOptions, this.markerOptions);

			this.bindEvents();
		},

		bindEvents: function() {
			var t = this;

			google.maps.event.addListener(this.api, 'accuracy_changed', function() {
				t.onAccuracyChanged.apply(t, arguments);
			});

			google.maps.event.addListener(this.api, 'geolocation_error', function() {
				t.onGeolocationError.apply(t, arguments);
			});

			google.maps.event.addListener(this.api, 'position_changed', function() {
				t.onPositionChanged.apply(t, arguments);
			});
		},

		getAccuracy: function() {
			return this.api.getAccuracy();
		},
		
		getBounds: function() {
			return this.api.getBounds();
		},
		
		getMap: function() {
			return this.api.getMap();
		},
		
		getMinimumAccuracy: function() {
			return this.api.getMinimumAccuracy();
		},
		
		getPosition: function() {
			return this.api.getPosition();
		},
		
		getPositionOptions: function() {
			return this.api.getPositionOptions();
		},

		setCircleOptions: function(value) {
			this.api.setCircleOptions(value);
		},
		
		setMap: function(value) {
			this.api.setMap(value);
		},
		
		setMarkerOptions: function(value) {
			this.api.setMarkerOptions(value);
		},
		
		setMinimumAccuracy: function(value) {
			this.api.setMinimumAccuracy(value);
		},
		
		setPositionOptions: function(value) {
			this.api.setPositionOptions(value);
		},

		onAccuracyChanged: function() {},
		
		onGeolocationError: function() {},

		onPositionChanged: function() {
			if(this.fitBounds) {
				this.map.bounds.extend(this.getPosition());
				this.map.fitBounds(this.map.bounds);
			}
		}

	});

}());