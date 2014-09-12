(function() {

	"use strict";

	GoogleMaps.Models.Circle = GoogleMaps.Models.BaseMapObject.extend({

		strokeColor: '#000000',

		strokeWeight: 3,

		strokeOpacity: 0.6,

		fillColor: '#666666',

		fillOpacity: 0.6,

		initialize: function(options) {
			
			if(!options.strokeColor) {
				options.strokeColor = this.strokeColor;
			}

			if(!options.strokeOpacity) {
				options.strokeOpacity = this.strokeOpacity;
			}

			if(!options.strokeWeight) {
				options.strokeWeight = this.strokeWeight;
			}

			if(!options.fillColor) {
				options.fillColor = this.fillColor;
			}

			if(!options.fillOpacity) {
				options.fillOpacity = this.fillOpacity;
			}

			GoogleMaps.Models.Base.prototype.initialize.call(this, options);

			if(!this.get('radius')) {
				this.set('radius', 100);
			}

			if(!this.get('api')) {
				this.initializeApi(options);
			}
			else {
				this.get('api').setMap(this.get('map').api);
			}

			if(!this.get('infowindow')) {
				this.set('infowindow', new google.maps.InfoWindow({
					maxWidth: 300,
					content: this.buildInfoWindowContent()
				}));
			}

			this.bindEvents();
		},

		convertRadiusToMeters: function(radius, metric) {
			if(!radius) {
				radius = this.get('radius');
			}

			if(!metric) {
				metric = this.get('metric');
			}

			radius = parseFloat(radius);

			if(metric == 'miles') {
				radius *= 1609.34;
			}
			else if(metric == 'feet') {
				radius *= 0.3048;
			}
			else if(metric == 'kilometers') {
				radius *= 1000;
			}

			return radius;
		},

		convertRadiusFromMeters: function(radius, metric) {
			if(!radius) {
				radius = this.get('radius');
			}

			if(!metric) {
				metric = this.get('metric');
			}

			radius = parseFloat(radius);

			if(metric == 'miles') {
				radius *= 0.000621371;
			}
			else if(metric == 'feet') {
				radius *= 3.28084;
			}
			else if(metric == 'kilometers') {
				radius *= 0.001;
			}

			return radius;
		},

		hasLocation: function() {
			return !_.isUndefined(this.get('lat')) && !_.isUndefined(this.get('lng'));
		},
		
		initializeApi: function(options) {
			if(!_.isObject(options)) {
				options = {};
			}

			this.set('api', new google.maps.Circle(_.extend({}, options, {
				map: this.hasLocation() ? this.get('map').api : null,
				center: this.hasLocation() ? new google.maps.LatLng(this.get('lat'), this.get('lng')) : new google.maps.LatLng(0, 0),
				radius: this.convertRadiusToMeters(),
				draggable: this.get('draggable') ? true : false
			})));
		},

		edit: function(showMapList) {				
			var t = this, view = new GoogleMaps.Views.CircleForm({
				model: this,
				map: this.get('map'),
				cancel: function() {
					GoogleMaps.Views.CircleForm.prototype.cancel.call(view);

					if(showMapList) {
						t.get('map').showMapList();
					}
				}
			});

			this.get('map').showModal(view);
		},

		delete: function(showMapList) {
			var t = this;

			var view = new GoogleMaps.Views.BaseForm({
				template: GoogleMaps.Template('delete-circle-form'),
				submit: function() {
					t.get('api').setMap(null);
					t.set('deleted', true);
					t.get('map').updateHiddenField();
					
					if(showMapList) {
						t.get('map').showMapList();
					}
					else {
						t.get('map').hideModal();
					}

					t.get('map').closeInfoWindows();
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

		getBounds: function() {
			return this.get('api').getBounds();
		},

		getCenter: function() {
			return this.get('api').getCenter();
		},

		getPosition: function() {
			return this.get('api').getCenter();
		},

		getDraggable: function() {
			return this.get('api').getDraggable();
		},

		getEditable: function() {
			return this.get('api').getEditable();
		},

		getMap: function() {
			return this.get('api').getMap();
		},

		getRadius: function() {
			return this.get('api').getRadius();
		},

		getVisible: function() {
			return this.get('api').getVisible();
		},

		setAnimation: function(value) {
			this.get('api').setAnimation(value);
		},

		setClickable: function(value) {
			this.get('api').setClickable(value);
		},
		
		setCenter: function(value) {
			this.get('api').setCenter(value);
		},
		
		setDraggable: function(value) {
			this.get('api').setDraggable(value);
		},
				
		setEditable: function(value) {
			this.get('api').setEditable(value);
		},

		setMap: function(value) {
			this.get('api').setMap(value);
		},
		
		setOptions: function(value) {
			this.get('api').setOptions(value);
		},
		
		setRadius: function(value) {
			this.get('api').setRadius(this.convertRadiusToMeters(value));
		},
		
		setVisible: function(value) {
			this.get('api').setVisible(value);
		},
		
		bindEvents: function() {
			var t = this;

			google.maps.event.addListener(this.get('api'), 'center_changed', function() {
				t.onCenterChanged.apply(t, arguments);
			});

			google.maps.event.addListener(this.get('api'), 'click', function() {
				t.onClick.apply(t, arguments);
			});

			google.maps.event.addListener(this.get('api'), 'dblclick', function() {
				t.onDblclick.apply(t, arguments);
			});

			google.maps.event.addListener(this.get('api'), 'drag', function() {
				t.onDrag.apply(t, arguments);
			});
			
			google.maps.event.addListener(this.get('api'), 'dragend', function() {
				t.onDragend.apply(t, arguments);
			});
			
			google.maps.event.addListener(this.get('api'), 'dragstart', function() {
				t.onDragstart.apply(t, arguments);
			});
			
			google.maps.event.addListener(this.get('api'), 'mousedown', function() {
				t.onMousedown.apply(t, arguments);
			});
						
			google.maps.event.addListener(this.get('api'), 'mousemove', function() {
				t.onMousemove.apply(t, arguments);
			});
			
			google.maps.event.addListener(this.get('api'), 'mouseout', function() {
				t.onMouseout.apply(t, arguments);
			});
			
			google.maps.event.addListener(this.get('api'), 'mouseover', function() {
				t.onMouseover.apply(t, arguments);
			});

			google.maps.event.addListener(this.get('api'), 'mouseup', function() {
				t.onMouseup.apply(t, arguments);
			});
			
			google.maps.event.addListener(this.get('api'), 'radius_changed', function() {
				t.onRadiusChanged.apply(t, arguments);
			});
			
			google.maps.event.addListener(this.get('api'), 'rightclick', function() {
				t.onRightclick.apply(t, arguments);
			});
		},

		onCenterChanged: function() {
			var center = this.get('api').getCenter();

			this.set({
				lat: center.lat(),
				lng: center.lng()
			});
		},

		onClick: function(e) {
			this.get('map').closeInfoWindows();
			this.get('infowindow').open(this.get('map').api);
			this.get('infowindow').setPosition(e.latLng);
		},

		onDblclick: function() {},

		onDrag: function() {},

		onDragend: function() {
			GoogleMaps.Models.BaseMapObject.prototype.onDragend.apply(this, arguments);
		},

		onDragstart: function() {},

		onMousedown: function() {},

		onMousemove: function() {},

		onMouseover: function() {},

		onMouseout: function() {},

		onMouseup: function() {},

		onRadiusChanged: function() {

			this.set('radius', Math.round(this.convertRadiusFromMeters(this.get('api').getRadius()) * 100) / 100);
			// this.set('radius', this.get('api').getRadius());
		},

		onRightclick: function() {}

	});

}());