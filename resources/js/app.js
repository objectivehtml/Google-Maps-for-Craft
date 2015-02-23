var GoogleMaps = {
	Views: {},
	Models: {},
	addressFieldData: [],
	mapFieldData: [],
	instances: [],
	init: function() {
		var t = this;

		_.each(this.addressFieldData, function(data) {
			t.initAddressField(data);
		});

		_.each(this.mapFieldData, function(data) {
			t.initMapField(data);
		});
	},
	initAddressField: function(data) {
		var t = this;

		if(data) {
			new GoogleMaps.AddressFieldType(data[0], data[1]);
		}
		else {
			_.each(this.addressFieldData, function(data) {
				t.instances.push(new GoogleMaps.AddressFieldType(data[0], data[1]));
			});

			this.addressFieldData = [];
		}
	},
	initMapField: function(data) {
		var t = this;

		if(data) {
			new GoogleMaps.MapFieldType(data[0], data[1]);
		}
		else {
			_.each(this.mapFieldData, function(data) {
				t.instances.push(new GoogleMaps.MapFieldType(data[0], data[1]));
			});

			this.mapFieldData = [];
		}
	}
};

(function() {
	
	"use strict";

	Backbone.Marionette.TemplateCache.prototype.compileTemplate = function(rawTemplate) {
        return Handlebars.compile(rawTemplate);
    };

	GoogleMaps.Template = function(name) {
		var template;

		if(Handlebars.templates[name]) {
			return Handlebars.templates[name];
		}
		else {
			return false;
		}
	};

	GoogleMaps.addScript = function(url, callback) {
		if(typeof google === "undefined") {
		    var script = document.createElement('script');
		    if(callback) script.onload = callback;
		    script.type = 'text/javascript';
		    script.src = url;
		    document.body.appendChild(script);
		}
		else {
			GoogleMaps.googleApiCallback();
		}
	};

	GoogleMaps.MapFieldType = Garnish.Base.extend({

		init: function($el, options) {
			var t = this;

			this.$container = $($el);

			var App = new Backbone.Marionette.Application();

			this.App = App;

			App.options = options;

			App.addRegions({
				content: $el
			});
		
			var coord = options.center.split(',');

			var map = new GoogleMaps.Views.Map({
				fieldname: options.fieldname,
				savedData: options.savedData,
				width: options.width,
				height: options.height,
				mapOptions: {
					center: new google.maps.LatLng(parseFloat(coord[0]), parseFloat(coord[1])),
					zoom: options.zoom
				},
				showButtons: options.showButtons,
				availableButtons: options.availableButtons,
				addressFields: options.addressFields
			});

			this.map = map;

			App.addInitializer(function() {

				setTimeout(function() {
					map.redraw();
					map.updateHiddenField();
				}, 100);

				App.content.show(map);

			});

			t.addListener(window, 'resize', function(ev) {
				if(map.$el.parents('.field').parent().css('display') == 'block') {
                	map.redraw();
                	map.center();

                	t.removeListener(window, 'resize');
                }
            });

			App.start();
		}

	});

	GoogleMaps.AddressFieldType = Garnish.Base.extend({

		init: function($el, options) {
			var t = this;

			this.$container = $($el);

			var App = new Backbone.Marionette.Application();

			this.App = App;

			App.options = options;

			App.addRegions({
				content: $el
			});

			var address = new GoogleMaps.Views.Address({
				savedData: options.savedData,
				fieldname: options.fieldname
			});

			App.content.show(address);
		}

	});


}());
(function() {

	"use strict";

	GoogleMaps.Models.Base = Backbone.Model.extend({

		initialize: function(options) {
			var t = this;

			_.each(options, function(option, i) {
				if(_.isFunction(option)) {
					t[i] = option;
				}
			});

			this.set(options);			
		},

		toJSON: function() {
			var json = Backbone.Model.prototype.toJSON.call(this);

			delete json.api;
			delete json.map;
			delete json.infowindow;

			return json;
		},

		isCoordinate: function(coord) {
			return coord.match(/^([-\d.]+),(\s+)?([-\d.]+)$/);
		}

	});

}());
(function() {

	"use strict";

	GoogleMaps.Models.Address = GoogleMaps.Models.Base.extend({

	});

}());
(function() {

	"use strict";

	GoogleMaps.Models.BaseMapObject = GoogleMaps.Models.Base.extend({

		initializeApi: function() {},

		edit: function(showMapList) {},

		delete: function(showMapList) {},

		bindEvents: function() {},

		// Reset map object to original settings when an object form is cancelled
		reset: function() {},

		getInfoWindowPosition: function() {
			return this.getPosition();
		},

		buildInfoWindowContent: function() {
			var content = this.get('content');
			var _return = ['<div>', (_.isArray(content) ? content.join('') : content)];

			var t = this, latLng = this.getInfoWindowPosition();

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

		remove: function() {
			this.get('infowindow').close();
			this.set('deleted', true);
			this.setMap(null);
		},

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
		}

	});

}());
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
(function() {

	"use strict";

	GoogleMaps.Models.GroundOverlay = GoogleMaps.Models.BaseMapObject.extend({

		initialize: function(options) {
			
			GoogleMaps.Models.Base.prototype.initialize.call(this, options);

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

		initializeApi: function(options) {
			if(!_.isObject(options)) {
				options = {};
			}

			options = _.extend({}, options, {
				map: this.get('map').api,
				opacity: 1
			});

			if(this.get('sw') && this.get('ne')) {
				options.bounds = new google.maps.LatLngBounds(
					new google.maps.LatLng(this.get('sw').lat, this.get('sw').lng),
					new google.maps.LatLng(this.get('ne').lat, this.get('ne').lng)
				);
			}

			if(this.get('url')) {
				options.url = this.get('url');
			}

			if(this.get('opacity')) {
				options.opacity = this.get('opacity');
			}

			var bounds = new google.maps.LatLngBounds(
				new google.maps.LatLng(0, 0),
				new google.maps.LatLng(0, 10)
			);

			this.set('api', new google.maps.GroundOverlay(this.get('url'), bounds, options));
		},

		hasLocation: function() {
			return true;
		},

		getInfoWindowPosition: function() {
			return new google.maps.LatLng(0, 0);
		},

		edit: function(showMapList) {				
			var t = this, view = new GoogleMaps.Views.GroundOverlayForm({
				model: this,
				map: this.get('map'),
				cancel: function() {
					GoogleMaps.Views.GroundOverlayForm.prototype.cancel.call(view);

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
				template: GoogleMaps.Template('delete-ground-overlay-form'),
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

		getMap: function() {
			return this.get('api').getMap();
		},

		getOpacity: function() {
			return this.get('api').getOpacity();
		},

		getUrl: function() {
			return this.get('api').getUrl();
		},

		setMap: function(value) {
			this.get('api').setMap(value);
		},
		
		setOpacity: function(value) {
			this.get('api').setOpacity(value);
		},

		setOptions: function(value) {
			this.get('api').setOptions(value);
		},
		
		bindEvents: function() {
			var t = this;

			google.maps.event.addListener(this.get('api'), 'click', function() {
				t.onClick.apply(t, arguments);
			});

			google.maps.event.addListener(this.get('api'), 'dblclick', function() {
				t.onDblclick.apply(t, arguments);
			});
		},

		onClick: function(e) {
			this.get('map').closeInfoWindows();
			this.get('infowindow').open(this.get('map').api);
			this.get('infowindow').setPosition(e.latLng);
		},

		onDblclick: function() {}

	});

}());
(function() {

	"use strict";

	GoogleMaps.Models.Marker = GoogleMaps.Models.Base.extend({

		initialize: function(options) {
			GoogleMaps.Models.Base.prototype.initialize.call(this, options);

			if(!this.get('api')) {
				this.initializeApi(options);
			}
			else {
				this.get('api').setMap(this.get('map').api);
			}

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
		},
		
		initializeApi: function(options) {
			if(!_.isObject(options)) {
				options = {};
			}

			this.set('api', new google.maps.Marker(_.extend({}, options, {
				map: this.get('map').api,
				position: new google.maps.LatLng(this.get('lat'), this.get('lng')),
				draggable: this.get('draggable') === false ? false : true
			})));
		},

		isCoordinate: function(coord) {
			return coord.match(/^([-\d.]+),(\s+)?([-\d.]+)$/);
		},

		edit: function(showMapList) {
			var t = this, view = new GoogleMaps.Views.MarkerForm({
				model: this,
				map: this.get('map'),
				cancel: function() {
					GoogleMaps.Views.MarkerForm.prototype.cancel.call(view);

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
				template: GoogleMaps.Template('delete-marker-form'),
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

		buildInfoWindowContent: function() {
			var content = this.get('content');
			var _return = ['<div>', (_.isArray(content) ? content.join('') : content)];

			var t = this, latLng = this.get('api').getPosition();

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

		remove: function() {
			this.get('infowindow').close();
			this.set('deleted', true);
			this.setMap(null);
		},

		getAnimation: function() {
			return this.get('api').getAnimation();
		},

		getClickable: function() {
			return this.get('api').getClickable();
		},

		getCursor: function() {
			return this.get('api').getCursor();
		},

		getDraggable: function() {
			return this.get('api').getDraggable();
		},

		getIcon: function() {
			return this.get('api').getIcon();
		},

		getMap: function() {
			return this.get('api').getMap();
		},

		getOpacity: function() {
			return this.get('api').getOpacity();
		},

		getPosition: function() {
			return this.get('api').getPosition();
		},

		getShape: function() {
			return this.get('api').getShape()
		},

		getTitle: function() {
			return this.get('api').getTitle();
		},

		getVisible: function() {
			return this.get('api').getVisible();
		},

		getZIndex: function() {
			return this.get('api').getZIndex();
		},

		setAnimation: function(value) {
			this.get('api').setAnimation(value);
		},

		setClickable: function(value) {
			this.get('api').setClickable(value);
		},
		
		setCursor: function(value) {
			this.get('api').setCursor(value);
		},
		
		setDraggable: function(value) {
			this.get('api').setDraggable(value);
		},
		
		setIcon: function(value) {
			if(value) {
				var width = this.get('scaledWidth') ? this.get('scaledWidth') : 32;
				var height = this.get('scaledHeight') ? this.get('scaledHeight') : 32;

				var icon = {
					scaledSize: new google.maps.Size(width, height),
					url: value
				};
				
				if(this.get('scaleIcons') === false) {
					this.get('api').setIcon(value);
				}
				else {
					this.get('api').setIcon(icon);
				}
			}
			else {
				this.get('api').setIcon(null);
			}
		},
		
		setMap: function(value) {
			this.get('api').setMap(value);
		},
		
		setOpacity: function(value) {
			this.get('api').setOpacity(value);
		},
		
		setOptions: function(value) {
			this.get('api').setOptions(value);
		},
		
		setPosition: function(value) {
			this.get('api').setPosition(value);
		},
		
		setShape: function(value) {
			this.get('api').setShape(value);
		},
		
		setTitle: function(value) {
			this.get('api').setTitle(value);
		},
		
		setVisible: function(value) {
			this.get('api').setVisible(value);
		},
		
		setZIndex: function(value) {
			this.get('api').setZIndex(value);
		},

		bindEvents: function() {
			var t = this;

			google.maps.event.addListener(this.get('api'), 'animation_changed', function() {
				t.onAnimationChanged.apply(t, arguments);
			});

			google.maps.event.addListener(this.get('api'), 'click', function() {
				t.onClick.apply(t, arguments);
			});

			google.maps.event.addListener(this.get('api'), 'cursor_changed', function() {
				t.onCursorChanged.apply(t, arguments);
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
			
			google.maps.event.addListener(this.get('api'), 'draggable_changed', function() {
				t.onDraggableChanged.apply(t, arguments);
			});

			google.maps.event.addListener(this.get('api'), 'dragstart', function() {
				t.onDragstart.apply(t, arguments);
			});
			
			google.maps.event.addListener(this.get('api'), 'flat_changed', function() {
				t.onFlatChanged.apply(t, arguments);
			});
			
			google.maps.event.addListener(this.get('api'), 'icon_changed', function() {
				t.onIconChanged.apply(t, arguments);
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
			
			google.maps.event.addListener(this.get('api'), 'position_changed', function() {
				t.onPositionChanged.apply(t, arguments);
			});
			
			google.maps.event.addListener(this.get('api'), 'rightclick', function() {
				t.onRightclick.apply(t, arguments);
			});
			
			google.maps.event.addListener(this.get('api'), 'shape_changed', function() {
				t.onShapeChanged.apply(t, arguments);
			});
			
			google.maps.event.addListener(this.get('api'), 'tilt_changed', function() {
				t.onTiltChanged.apply(t, arguments);
			});
			
			google.maps.event.addListener(this.get('api'), 'visible_changed', function() {
				t.onVisibleChanged.apply(t, arguments);
			});

			google.maps.event.addListener(this.get('api'), 'zindex_changed', function() {
				t.onZindexChanged.apply(t, arguments);
			});
		},

		onAnimationChanged: function() {},

		onClick: function() {
			this.get('map').closeInfoWindows();
			this.get('infowindow').open(this.get('map').api, this.get('api'));
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

}());
(function() {

	"use strict";

	GoogleMaps.Models.Polygon = GoogleMaps.Models.Base.extend({

		api: false,

		map: false,

		infowindow: false,

		editable: false,

		draggable: false,

		title: null,

		content: null,

		points: [],

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

			var points = [];

			_.each(this.get('points'), function(point) {
				points.push(new google.maps.LatLng(point.lat, point.lng));
			});
			
			if(!this.get('api')) {	
				this.initializeApi(points, options);
			}

			if(!this.get('infowindow')) {
				this.set('infowindow', new google.maps.InfoWindow({
					maxWidth: 300,
					content: this.buildInfoWindowContent()
				}));
			}

			this.bindEvents();
		},

		initializeApi: function(points, options) {

			options.strokeColor = this.get('strokeColor');
			options.strokeWeight = this.get('strokeWeight');
			options.strokeOpacity = this.get('strokeOpacity');
			options.fillColor = this.get('fillColor');
			options.fillOpacity = this.get('fillOpacity');
			options.paths = points;
			options.map = this.get('map').api;
			options.zIndex = this.get('map').polygons.length;

			if(!this.get('api')) {
				this.set('api', new google.maps.Polygon(options));
			}
		},	

		edit: function(showMapList) {
			var t = this, view = new GoogleMaps.Views.PolygonForm({
				api: this.get('api'),
				map: this.get('map'),
				model: this,
				cancel: function() {
					GoogleMaps.Views.PolygonForm.prototype.cancel.call(view);

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
				template: GoogleMaps.Template('delete-polygon-form'),
				submit: function() {
					t.get('api').setMap(null);
					t.get('infowindow').close();
					t.set('deleted', true);
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

			t.get('map').showModal(view);
		},

		remove: function() {
			this.set('deleted', true);
			this.setMap(null);
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

				/*
				t.get('map').api.setCenter(latLng);
				t.get('map').api.panBy(0, -150);

				var view = new GoogleMaps.Views.BaseForm({
					model: new Backbone.Model({
						title: t.get('title'),
						content: t.get('content')
					}),
					template: GoogleMaps.Template('edit-marker-form'),								
					onShow: function() {
						setTimeout(function() {
							view.$el.find('input').focus();
						}, 250);
					},
					submit: function() {
						t.set('title', view.$el.find('input').val());
						t.set('content', view.$el.find('textarea').val());
						t.set('customContent', true);
						t.get('infowindow').setContent(t.buildInfoWindowContent());
						t.get('map').hideModal();
						t.get('map').updateHiddenField();
					},
					cancel: function() {
						t.get('map').hideModal();
					}
				});

				t.get('map').showModal(view);
				*/

				e.preventDefault();
			});

			$content.find('.delete').click(function(e) {
				t.delete();

				e.preventDefault();
			});

			return $content.get(0);
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

		getPath: function() {
			return this.get('api').getPath();
		},

		getPaths: function() {
			return this.get('api').getPaths();
		},

		getVisible: function() {
			return this.get('api').getVisible();
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
		
		setPath: function(value) {
			this.get('api').setPath(value);
		},
		
		setPaths: function(value) {
			this.get('api').setPaths(value);
		},

		setPoints: function(value) {
			var points = [];

			_.each(value, function(point) {
				points.push(new google.maps.LatLng(point.lat, point.lng));
			});

			this.setPath(points);
		},
		
		setVisible: function(value) {
			this.get('api').setVisible(value);
		},
		
		toJSON: function() {
			var json = GoogleMaps.Models.Base.prototype.toJSON.call(this);
			var points = [];


			if(this.get('api').getPath()) {
				_.each(this.get('api').getPath().getArray(), function(latLng) {
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
			
			google.maps.event.addListener(this.get('api'), 'rightclick', function() {
				t.onRightclick.apply(t, arguments);
			});
		},

		onClick: function(e) {
			if(!this.get('api').getEditable()) {
				this.get('map').closeInfoWindows();
				this.get('infowindow').open(this.get('map').api);
				this.get('infowindow').setPosition(e.latLng);
			}
		},

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

}());
(function() {

	"use strict";

	GoogleMaps.Models.Polyline = GoogleMaps.Models.Polygon.extend({

		initializeApi: function(points, options) {

			options.strokeColor = this.get('strokeColor');
			options.strokeWeight = this.get('strokeWeight');
			options.strokeOpacity = this.get('strokeOpacity');
			options.path = points;
			options.map = this.get('map').api;
			options.zIndex = this.get('map').polygons.length;

			this.set('api', new google.maps.Polyline(options));
		},	

		getPaths: function() {
			return;
		},

		edit: function(showMapList) {
			var t = this, view = new GoogleMaps.Views.PolylineForm({
				api: this.get('api'),
				map: this.get('map'),
				model: this,
				cancel: function() {
					GoogleMaps.Views.PolylineForm.prototype.cancel.call(view);

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
				template: GoogleMaps.Template('delete-polyline-form'),
				submit: function() {
					t.get('api').setMap(null);
					t.get('infowindow').close();
					t.set('deleted', true);
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

	});

}());
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
(function() {

	"use strict";

	GoogleMaps.Models.RouteMarker = GoogleMaps.Models.Marker.extend({

		originalMarker: false,

		initialize: function(options) {
			this.set('draggable', false);
			this.set('isSavedToMap', true);

			GoogleMaps.Models.Marker.prototype.initialize.call(this, options);

			this.originalMarker = $.extend(true, {}, this.toJSON());
		},

		edit: function() {	
			var view = new GoogleMaps.Views.RouteForm({
				model: this.get('route'),
				map: this.get('map')
			});

			this.get('map').showModal(view);
		},

		delete: function() {
			this.get('route').delete();
		},

		toJSON: function() {
			var json = GoogleMaps.Models.Marker.prototype.toJSON.call(this);

			delete json.route;

			return json;
		},

		revert: function() {
			this.set(this.originalMarker);
			this.setPosition(new google.maps.LatLng(this.get('lat'), this.get('lng')));
		},

		onDragend: function(e, callback) {
			var t = this;

			GoogleMaps.Models.Marker.prototype.onDragend.call(this, e, function() {
				t.set('lat', e.latLng.lat());
				t.set('lng', e.latLng.lng());

				t.get('location').lat = e.latLng.lat();
				t.get('location').lng = e.latLng.lng();
				t.get('location').address = t.get('address');
				t.get('route').render();

				if(_.isFunction(callback)) {
					callback(e);
				}
			});
		}
	});

}());
(function() {

	"use strict";

	GoogleMaps.Views.ItemView = Backbone.Marionette.ItemView.extend({

		initialize: function(options) {	
			Backbone.Marionette.ItemView.prototype.initialize.call(this, options);

			if(this.options) {
				this.fill(this.options);
			}
		},

		fill: function(options) {
			_.extend(this, options);
		}

	});

}());
(function() {

	"use strict";

	GoogleMaps.Views.LayoutView = Backbone.Marionette.LayoutView.extend({

		initialize: function(options) {	
			Backbone.Marionette.LayoutView.prototype.initialize.call(this, options);
		
			if(this.options) {
				this.fill(this.options);
			}
		},

		fill: function(options) {
			_.extend(this, options);
		}

	});

}());
(function() {

	"use strict";

	GoogleMaps.Views.Address = GoogleMaps.Views.LayoutView.extend({

  		regions: {
  			modal: '.oh-google-map-window' 
  		},

		template: GoogleMaps.Template('address-fields'),

		initialize: function(options) {
			GoogleMaps.Views.LayoutView.prototype.initialize.call(this, options);

			if(!this.model && this.getOption('savedData')) {
				this.model = new GoogleMaps.Models.Address(this.getOption('savedData'));
			}

			if(this.getOption('fieldname')) {
				this.model.set('fieldname', this.getOption('fieldname'));
			}
		},

		onDomRefresh: function() {
			var t = this, value = false, geocoderResults = false, modal = false;

			this.$el.find('.view-all').click(function(e) {
				t.geocode(function(results, status) {
					var list = new GoogleMaps.Views.GeocoderList({
						model: new GoogleMaps.Models.Base({
							locations: results
						})
					});

					list.render();
 					
					list.$el.find('.modal-cancel').click(function(e) {
						modal.hide();
					});

 					modal = new Garnish.Modal(list.$el)

					list.on('select', function(model) {
						t.setLatitude(model.geometry.location.lat());
						t.setLongitude(model.geometry.location.lng());
							
						modal.hide();
					});
				});

				e.preventDefault();
			});

			this.$el.find('input').focus(function() {
				value = $(this).val();
			});

			this.$el.find('input').blur(function() {
				if(value != $(this).val()) {
					t.geocode(function(results, status) {
						if(status == google.maps.GeocoderStatus.OK) {
							geocoderResults = results;

							t.setLatitude(results[0].geometry.location.lat());
							t.setLongitude(results[0].geometry.location.lng());
							t.setResponse(results[0]);

							t.$el.find('.view-all').removeClass('hidden');
						}
						else {
							t.$el.find('.view-all').addClass('hidden');
						}
					});
				}
			});

			if(this.hasAddress()) {
				this.$el.find('.view-all').removeClass('hidden');
			}
		},

		getLatitude: function() {
			return this.$el.find('.latitude').val();
		},

		setLatitude: function(latitude) {
			this.$el.find('.latitude').val(latitude);
		},

		getLongitude: function() {
			return this.$el.find('.longitude').val();
		},

		setLongitude: function(latitude) {
			this.$el.find('.longitude').val(latitude);
		},

		getResponse: function() {
			return this.$el.find('.response').val();
		},

		setResponse: function(response) {
			if(!_.isString(response)) {
				response = JSON.stringify(response);
			}

			this.$el.find('.response').val(response).html(response);
		},

		hasAddress: function() {
			return this.getAddress() != '';
		},

		getAddress: function() {
			return [
				this.$el.find('.line1').val(),
				this.$el.find('.line2').val(),
				this.$el.find('.city').val(),
				this.$el.find('.state').val(),
				this.$el.find('.zipcode').val(),
				this.$el.find('.country').val()
			].join(' ').trim();
		},

		geocode: function(callback) {			
 			var api = new google.maps.Geocoder();
 			var address = this.getAddress();

			api.geocode({address: address}, function(results, status) {
				if(_.isFunction(callback)) {
					callback(results, status);
				};
			});
		},

		showModal: function(view) {
			this.modal.empty();
			this.modal.show(view);
			this.modal.$el.addClass('show');
		},

		hideModal: function(center) {
			this.modal.$el.removeClass('show');
			this.modal.empty();
		}

	});

}());
(function() {

	"use strict";

	GoogleMaps.Views.BaseForm = GoogleMaps.Views.ItemView.extend({

		className: 'oh-google-map-form',

		tagName: 'form',

		onRender: function() {

			var t = this;

			this.$el.off('submit').submit(function(e) {
				t.submit();

				e.preventDefault();
			});

			this.$el.find('.cancel').click(function(e) {
				t.cancel();

				e.preventDefault();
			});

			this.$el.find('.oh-google-map-tab-trigger').click(function(e) {
				var selector = $(this).attr('href');

				t.$el.find('.oh-google-map-tab.active').removeClass('active');
				t.$el.find('.oh-google-map-tab-trigger').removeClass('active');

				t.$el.find(selector).addClass('active');
				$(this).addClass('active');

				e.preventDefault();
			});

			this.$el.find('[href="#oh-points-tab"]').click(function() {
				t.$el.find('[name="point"]').focus();				
			});

			this.$el.find('.oh-google-map-tab-trigger.active').click();
		},

		submit: function() {

		},

		cancel: function() {
			this.$el.parent().removeClass('show');
		}

	});

}());
(function() {

	"use strict";

	GoogleMaps.Views.Button = GoogleMaps.Views.ItemView.extend({

		className: 'oh-google-map-control-button',

		tagName: 'a'

	});

}());
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
(function() {

	"use strict";

	GoogleMaps.Views.CircleForm = GoogleMaps.Views.BaseForm.extend({

		geocoder: false,

		template: GoogleMaps.Template('circle-form'),

		map: false,

		api: false,

		originalCircle: {},

		initialize: function(options) {
			var t = this;

			this.model = false;

			this.geocoder = new google.maps.Geocoder();

			GoogleMaps.Views.BaseForm.prototype.initialize.call(this, options);

			this.initializeApi();

			this.model.get('infowindow').close();
			this.model.get('api').setDraggable(true);
			this.model.get('api').setEditable(true);

			this.api = this.model.get('api');
		},

		initializeApi: function() {
			if(!this.model) {
				this.model = new GoogleMaps.Models.Circle({
					map: this.map,
					hideDetails: true,
					isNew: true,
					isSavedToMap: false,
					metric: 'miles',
					radius: 100
				});
			}

			this.originalCircle = this.model.toJSON();
		},

		onRender: function() {
			var t = this;

			GoogleMaps.Views.BaseForm.prototype.onRender.call(this);

			this.model.onRadiusChanged = function() {
				GoogleMaps.Models.Circle.prototype.onRadiusChanged.call(this);

				if(!t.isDestroyed) {
					//t.map.updateHiddenField();
					t.render();
				}
			};

			this.model.onCenterChanged = function() {
				GoogleMaps.Models.Circle.prototype.onCenterChanged.call(this);

				if(!t.isDestroyed) {
					t.render();
				}
			};

			this.model.onDragend = function(e) {
				GoogleMaps.Models.Circle.prototype.onDragend.call(this, e, function() {	
					if(!t.isDestroyed) {
						//t.map.updateHiddenField();
						t.render();
					}
				});			
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
					t.$el.find('.add-point').click();
					e.preventDefault();
				}
			}).focus();

			this.$el.find('.set-location').click(function(e) {
				var view = new GoogleMaps.Views.Geocoder({
					map: t.map,
					responseHandler: function(response) {
						t.model.set({
							address: response.formatted_address,
							addressComponents: response.address_components,
							lat: response.geometry.location.lat(),
							lng: response.geometry.location.lng(),
							isSavedToMap: false
						});

						t.model.setCenter(response.geometry.location);

						t.isDestroyed = false;
						t.map.showModal(t);
					},
					cancel: function() {
						t.isDestroyed = false;
						t.map.showModal(t);
					}
				});

				t.map.showModal(view);
				t.model.setMap(t.map.api);

				e.preventDefault();
			});

			this.$el.find('[name="radius"]').blur(function() {
				if(t.model.get('radius') != parseFloat($(this).val())) {
					t.model.setRadius($(this).val());
				}
			});

			this.$el.find('[name="metric"]').change(function() {
				t.model.set('metric', $(this).val());
				t.model.setRadius(t.model.get('radius'));
			});

			this.$el.find('[name="metric"]').val(this.model.get('metric'));

			this.$el.find('.oh-google-map-tag a').click(function(e) {
				var index = $(this).parent().index();

				t.removePoint(index);

				e.preventDefault();
			});

			this.$el.find('.simple-color-picker').simpleColorPicker().blur(function() {
				t.updatePolygonOptions();
			})
			.blur();

			this.$el.find('.slider').each(function() {
				var value = $(this).data('value');
				var start = $(this).data('start');
				var step = $(this).data('step');
				var min = $(this).data('min');
				var max = $(this).data('max');

				$(this).noUiSlider({
					start: parseFloat(value ? value : start),
					step: parseFloat(step),
					range: {
						'min': parseFloat(min),
						'max': parseFloat(max)
					}
				})
				.change(function(e, value) {
					$(this).next().val(value);
					t.updatePolygonOptions();
				});

				$(this).next().val($(this).val());
			});

			t.updatePolygonOptions();
		},

		updatePolygonOptions: function() {
			var options = {
				strokeColor: this.$el.find('[name="strokeColor"]').val(),
				strokeOpacity: this.$el.find('[name="strokeOpacity"]').val(),
				strokeWeight: this.$el.find('[name="strokeWeight"]').val(),
				fillColor: this.$el.find('[name="fillColor"]').val(),
				fillOpacity: this.$el.find('[name="fillOpacity"]').val(),
				title: this.$el.find('[name="title"]').val(),
				content: this.$el.find('[name="content"]').val()
			};

			this.model.set(options);
			this.api.setOptions(options);
		},

		onShow: function() {
			var t = this;

			this.map.closeInfoWindows();

			this.map.api.setOptions({
				disableDoubleClickZoom: true
			});

			setTimeout(function() {
				t.$el.find('input').focus();
			}, 250);
		},

		onDestroy: function() {

			if(!this.model.get('isSavedToMap') && this.model.get('isNew')) {
				this.api.setMap(null);
			}

			this.map.api.setOptions({
				disableDoubleClickZoom: false
			});
		},

		isCoordinate: function(coord) {
			return coord.match(/^([-\d.]+),(\s+)?([-\d.]+)$/);
		},

		saveToMap: function() {
			if(!this.model.get('isSavedToMap')) {
				this.map.circles.push(this.model);
				this.model.set('isSavedToMap', true);
			}
		},

		submit: function() {
			this.api.setDraggable(false);
			this.api.setEditable(false);

			this.model.set({
				title: this.$el.find('[name="title"]').val(),
				content: this.$el.find('[name="content"]').val()
			});

			this.saveToMap();
			this.updatePolygonOptions();

			if(this.model.get('infowindow')) {
				this.model.get('infowindow').setOptions({
					content: this.model.buildInfoWindowContent()
				});
			}

			this.map.hideModal();
			this.map.updateHiddenField();
		},

		reset: function() {
			this.model.setRadius(this.originalCircle.radius);
			this.model.setCenter(new google.maps.LatLng(this.originalCircle.lat, this.originalCircle.lng));
			this.model.set(this.originalCircle);

			this.model.setOptions({
				strokeOpacity: this.originalCircle.strokeOpacity,
				strokeColor: this.originalCircle.strokeColor,
				strokeWeight: this.originalCircle.strokeWeight,
				fillOpacity: this.originalCircle.fillOpacity,
				fillColor: this.originalCircle.fillColor
			});
		},

		cancel: function() {
			this.reset();
			this.model.setDraggable(false);
			this.model.setEditable(false);
			this.map.hideModal();
		}

	});

}());
(function() {

	"use strict";

	GoogleMaps.Views.DeleteRouteForm = GoogleMaps.Views.BaseForm.extend({
		
		template: GoogleMaps.Template('delete-route-form')

	});

}());
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
(function() {

	"use strict";

	GoogleMaps.Views.GeocoderList = GoogleMaps.Views.ItemView.extend({

		template: GoogleMaps.Template('geocoder-list'),

		className: 'oh-google-map-native-modal modal elementselectormodal',

		initialize: function(options) {
			GoogleMaps.Views.ItemView.prototype.initialize.call(this, options);
		},

		events: {
			'click tbody tr': 'onClick'
		},

		onClick: function(e) {
			var index = $(e.target).index();
			var model = this.model.get('locations')[index];

			this.trigger('select', model);

			e.preventDefault();
		}

	});

}());
(function() {

	"use strict";

	GoogleMaps.Views.GroundOverlayForm = GoogleMaps.Views.BaseForm.extend({

		template: GoogleMaps.Template('ground-overlay-form'),

		map: false,

		api: false,

		originalOverlay: {},

		initialize: function(options) {
			var t = this;

			this.model = false;

			GoogleMaps.Views.BaseForm.prototype.initialize.call(this, options);

			this.initializeApi();

			this.model.get('infowindow').close();
			// this.model.get('api').setDraggable(true);
			// this.model.get('api').setEditable(true);

			this.api = this.model.get('api');
		},

		initializeApi: function() {
			if(!this.model) {
				this.model = new GoogleMaps.Models.GroundOverlay({
					map: this.map,
					hideDetails: true,
					isNew: true,
					isSavedToMap: false,
					opacity: 100
				});
			}

			this.originalOverlay = this.model.toJSON();
		},

		updateGroundOverlay: function() {
			if(this.model.get('url')) {
				this.model.setOptions({url: this.model.get('url')});
			}

			if(this.model.get('ne') && this.model.get('sw')) {
				var bounds = new google.maps.LatLngBounds(
					new google.maps.LatLng(this.model.get('sw').lat, this.model.get('sw').lng), 
					new google.maps.LatLng(this.model.get('ne').lat, this.model.get('ne').lng)
				);

				this.model.setOptions({bounds: bounds});
			}

			this.model.setOpacity(this.model.get('opacity'));

			this.model.setMap(this.map.api);
		},

		onRender: function() {
			var t = this;

			GoogleMaps.Views.BaseForm.prototype.onRender.call(this);

			this.$el.find('.set-location').click(function(e) {
				var prop = $(this).data('prop');
				
				var view = new GoogleMaps.Views.Geocoder({
					map: t.map,
					responseHandler: function(response) {
						t.model.set(prop, {
							address: response.formatted_address,
							addressComponents: response.address_components,
							lat: response.geometry.location.lat(),
							lng: response.geometry.location.lng(),
							isSavedToMap: false
						});

						t.isDestroyed = false;
						t.map.showModal(t);
						t.updateGroundOverlay();
					},
					cancel: function() {
						t.isDestroyed = false;
						t.map.showModal(t);
					}
				});

				t.model.setMap(t.map.api);
				t.map.showModal(view);

				e.preventDefault();
			});

			this.$el.find('.set-image').click(function(e) {

				var modal = Craft.createElementSelectorModal('Asset', {
				    multiSelect: false,
				    storageKey: 'googleMapsPlugin',
				    criteria: { kind: 'image' },
				    onSelect: function(entries) {
				    	t.model.set('url', entries[0].url);
				    	t.render();
						t.updateGroundOverlay();
				    }
				});
				
				e.preventDefault();
			});
			
			this.$el.find('.slider').each(function() {
				var value = $(this).data('value');
				var start = $(this).data('start');
				var step = $(this).data('step');
				var min = $(this).data('min');
				var max = $(this).data('max');

				$(this).noUiSlider({
					start: parseFloat(value ? value : start),
					step: parseFloat(step),
					range: {
						'min': parseFloat(min),
						'max': parseFloat(max)
					}
				})
				.change(function(e, value) {
					$(this).next().val(value);

					t.model.set('opacity', parseFloat(value));
					t.updateGroundOverlay();
				});

				$(this).next().val($(this).val());
			});

			/*
			this.model.onRadiusChanged = function() {
				GoogleMaps.Models.Circle.prototype.onRadiusChanged.call(this);

				if(!t.isDestroyed) {
					//t.map.updateHiddenField();
					t.render();
				}
			};

			this.model.onCenterChanged = function() {
				GoogleMaps.Models.Circle.prototype.onCenterChanged.call(this);

				if(!t.isDestroyed) {
					t.render();
				}
			};

			this.model.onDragend = function(e) {
				GoogleMaps.Models.Circle.prototype.onDragend.call(this, e, function() {	
					if(!t.isDestroyed) {
						//t.map.updateHiddenField();
						t.render();
					}
				});			
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
					t.$el.find('.add-point').click();
					e.preventDefault();
				}
			}).focus();

			this.$el.find('.set-location').click(function(e) {
				var view = new GoogleMaps.Views.Geocoder({
					map: t.map,
					responseHandler: function(response) {
						t.model.set({
							address: response.formatted_address,
							addressComponents: response.address_components,
							lat: response.geometry.location.lat(),
							lng: response.geometry.location.lng(),
							isSavedToMap: false
						});

						t.model.setCenter(response.geometry.location);

						t.isDestroyed = false;
						t.map.showModal(t);
					},
					cancel: function() {
						t.isDestroyed = false;
						t.map.showModal(t);
					}
				});

				t.map.showModal(view);
				t.model.setMap(t.map.api);

				e.preventDefault();
			});

			this.$el.find('[name="radius"]').blur(function() {
				if(t.model.get('radius') != parseFloat($(this).val())) {
					t.model.setRadius($(this).val());
				}
			});

			this.$el.find('[name="metric"]').change(function() {
				t.model.set('metric', $(this).val());
				t.model.setRadius(t.model.get('radius'));
			});

			this.$el.find('[name="metric"]').val(this.model.get('metric'));

			this.$el.find('.oh-google-map-tag a').click(function(e) {
				var index = $(this).parent().index();

				t.removePoint(index);

				e.preventDefault();
			});

			this.$el.find('.simple-color-picker').simpleColorPicker().blur(function() {
				t.updatePolygonOptions();
			})
			.blur();

			this.$el.find('.slider').each(function() {
				var value = $(this).data('value');
				var start = $(this).data('start');
				var step = $(this).data('step');
				var min = $(this).data('min');
				var max = $(this).data('max');

				$(this).noUiSlider({
					start: parseFloat(value ? value : start),
					step: parseFloat(step),
					range: {
						'min': parseFloat(min),
						'max': parseFloat(max)
					}
				})
				.change(function(e, value) {
					$(this).next().val(value);
					t.updatePolygonOptions();
				});

				$(this).next().val($(this).val());
			});

			t.updatePolygonOptions();
			*/
		},

		/*
		updatePolygonOptions: function() {
			var options = {
				strokeColor: this.$el.find('[name="strokeColor"]').val(),
				strokeOpacity: this.$el.find('[name="strokeOpacity"]').val(),
				strokeWeight: this.$el.find('[name="strokeWeight"]').val(),
				fillColor: this.$el.find('[name="fillColor"]').val(),
				fillOpacity: this.$el.find('[name="fillOpacity"]').val(),
				title: this.$el.find('[name="title"]').val(),
				content: this.$el.find('[name="content"]').val()
			};

			this.model.set(options);
			this.api.setOptions(options);
		},
		*/

		onShow: function() {
			var t = this;

			this.map.closeInfoWindows();

			this.map.api.setOptions({
				disableDoubleClickZoom: true
			});

			setTimeout(function() {
				t.$el.find('input').focus();
			}, 250);
		},

		onDestroy: function() {
			if(!this.model.get('isSavedToMap') && this.model.get('isNew')) {
				this.api.setMap(null);
			}

			this.map.api.setOptions({
				disableDoubleClickZoom: false
			});
		},

		saveToMap: function() {
			if(!this.model.get('isSavedToMap')) {
				this.map.groundOverlays.push(this.model);
				this.model.set('isSavedToMap', true);
			}
		},

		submit: function() {
			this.updateGroundOverlay();

			this.model.set({
				title: this.$el.find('[name="title"]').val(),
				content: this.$el.find('[name="content"]').val()
			});

			this.saveToMap();
		
			if(this.model.get('infowindow')) {
				this.model.get('infowindow').setOptions({
					content: this.model.buildInfoWindowContent()
				});
			}

			this.map.hideModal();
			this.map.updateHiddenField();
		},

		reset: function() {
			this.model.set(this.originalOverlay);
			this.updateGroundOverlay();
		},

		cancel: function() {
			this.reset();
			this.map.hideModal();
		}

	});

}());
(function() {

	"use strict";

	GoogleMaps.Views.Map = GoogleMaps.Views.LayoutView.extend({

		availableButtons: [],

		template: GoogleMaps.Template('map'),

  		api: false,

  		fieldname: false,

  		geocoder: false,

  		width: false,

  		height: false,

  		position: false,

  		zoom: false,

  		savedData: false,

  		mapOptions: {},

  		regions: {
  			buttonBar: '.oh-google-map-controls',
  			modal: '.oh-google-map-window' 
  		},

  		markers: [],

  		polygons: [],

  		polylines: [],

  		routes: [],

  		circles: [],

  		groundOverlays: [],

  		showButtons: false,

  		className: 'oh-google-map-relative',

  		initialize: function(options) {
  			var t = this;

  			this.markers = [];
  			this.polygons = [];
  			this.polylines = [];
  			this.routes = [];
  			this.circles = [];
  			this.groundOverlays = [];

  			GoogleMaps.Views.LayoutView.prototype.initialize.call(this, options);

  			this.mapOptions = _.extend({}, {
	  			zoom: 8,
	  			disableDefaultUI: true,
	  			mapType: google.maps.MapTypeId.ROADMAP,
	  			center: new google.maps.LatLng(0, 0)
	  		}, (options.mapOptions ? options.mapOptions : {}));

  			if(!this.model) {
  				this.model = new Backbone.Model();
  			}

  			this.model.set({
  				fieldname: this.fieldname,
  				savedData: this.savedData,
  				width: this.width,
  				height: this.height
  			});

  			this.$el.css({
  				width: this.width,
  				height: this.height
  			}); 
  		},

		redraw: function() {
			google.maps.event.trigger(this.api, 'resize');
		},
		
  		updateHiddenField: function() {
  			var data = {
  				markers: [],
  				polygons: [],
  				polylines: [],
  				routes: [],
  				circles: [],
  				groundOverlays: []
  			};

  			_.each(this.markers, function(marker, i) {
  				data.markers.push(marker.toJSON());
  			});

  			_.each(this.polygons, function(polygon, i) {
  				data.polygons.push(polygon.toJSON());
  			});

  			_.each(this.polylines, function(polyline, i) {
  				data.polylines.push(polyline.toJSON());
  			});

  			_.each(this.routes, function(route, i) {
  				data.routes.push(route.toJSON());
  			});

  			_.each(this.circles, function(circle, i) {
  				data.circles.push(circle.toJSON());
  			});

  			_.each(this.groundOverlays, function(overlay, i) {
  				data.groundOverlays.push(overlay.toJSON());
  			});

  			data = JSON.stringify(data);

  			this.$el.parents('.oh-google-map-fieldtype').next('.field-data').val(data).html(data);
  		},

		onRender: function() {
 			var t = this;

 			this.geocoder = new google.maps.Geocoder();
	 		
 			this.api = new google.maps.Map(this.getCanvas(), this.getMapOptions());

 			this.buildButtonBar();

 			this.$el.find('.oh-google-map-zoom-in').click(function(e) {
 				t.zoomIn();

 				e.preventDefault();
 			});

 			this.$el.find('.oh-google-map-zoom-out').click(function(e) {
 				t.zoomOut();

 				e.preventDefault();
 			});

			this.mapTypeMenu = new Garnish.Menu(this.$el.find('#oh-google-map-map-type-menu'), {
				attachToElement: this.$el.find('.oh-google-map-map-type')
			});

			this.$el.find('.oh-google-map-map-type').click(function(e) {
				var $t = $(this);

				if($t.hasClass('active')) {
					$t.removeClass('active');
					t.mapTypeMenu.hide();
				}
				else {
					$t.addClass('active');
					t.mapTypeMenu.show();
				}

				e.preventDefault();
			});

			this.$el.find('#oh-google-map-map-type-menu a').click(function(e) {
				var $t = $(this);
				var type = $t.data('type').toUpperCase();

				if(google.maps.MapTypeId[type]) {
					t.mapOptions.mapType = google.maps.MapTypeId[type];
					t.setMapTypeId(google.maps.MapTypeId[type]);
				}
				else {
					t.mapOptions.mapType = google.maps.MapTypeId.ROADMAP;
					t.setMapTypeId(google.maps.MapTypeId.ROADMAP);
				}

				$('#oh-google-map-map-type-menu .sel').removeClass('sel');

				t.$el.find('.oh-google-map-map-type').removeClass('active');

				$t.addClass('sel');

				e.preventDefault();
			});

			this.$el.find('#oh-google-map-map-type-menu a[data-type="'+t.mapOptions.mapType+'"]').addClass('sel');

 			// this.$el.find('.oh-google-map-window').css('max-height', parseInt(this.height.replace('px', '')) - 50);

 			if(this.savedData) {
	 			if(this.savedData.markers && this.savedData.markers.length) {
		 			_.each(this.savedData.markers, function(marker) {
						var options = {
							map: t,
							isNew: false,
							isSavedToMap: true
						};

		 				t.markers.push(new GoogleMaps.Models.Marker(_.extend({}, options, marker)));
		 			});
		 		}

	 			if(this.savedData.polygons && this.savedData.polygons.length) {
		 			_.each(this.savedData.polygons, function(polygon) {
						var options = {
							map: t,
							isSavedToMap: true
						};

		 				t.polygons.push(new GoogleMaps.Models.Polygon(_.extend({}, options, polygon)));
		 			});
		 		}

	 			if(this.savedData.polylines && this.savedData.polylines.length) {
		 			_.each(this.savedData.polylines, function(polyline) {
						var options = {
							map: t,
							isSavedToMap: true
						};

		 				t.polylines.push(new GoogleMaps.Models.Polyline(_.extend({}, options, polyline)));
		 			});
		 		}

	 			if(this.savedData.routes && this.savedData.routes.length) {
		 			_.each(this.savedData.routes, function(route) {
						var options = {
							map: t,
							isSavedToMap: true
						};

		 				t.routes.push(new GoogleMaps.Models.Route(_.extend({}, options, route)));
		 			});
		 		}

	 			if(this.savedData.circles && this.savedData.circles.length) {
		 			_.each(this.savedData.circles, function(circle) {
						var options = {
							map: t,
							isSavedToMap: true
						};

		 				t.circles.push(new GoogleMaps.Models.Circle(_.extend({}, options, circle)));
		 			});
		 		}

	 			if(this.savedData.groundOverlays && this.savedData.groundOverlays.length) {
		 			_.each(this.savedData.groundOverlays, function(overlay) {
						var options = {
							map: t,
							isSavedToMap: true
						};

		 				t.groundOverlays.push(new GoogleMaps.Models.GroundOverlay(_.extend({}, options, overlay)));
		 			});
		 		}

		 		this.center();
		 		this.updateHiddenField();
		 	}

  			var addressFields = this.getOption('addressFields');
  			var addressValues = {};

  			if(addressFields) {
  				var updateMap = function(fields) {
  					var address = [];

  					_.each(fields, function(value, field) {
  						if(value) {
  							address.push(value)
  						}
  					});

  					if(address.length) {

						var marker = t.markers[0];

	  					if(!marker) {
	  						marker = new GoogleMaps.Models.Marker({
	  							map: t
	  						});

	  						t.markers.push(marker);
	  					}

	  					t.geocoder.geocode({address: address.join(' ')}, function(results, status) {
	  						if(status == 'OK') {
	  							marker.set({
	  								lat: results[0].geometry.location.lat(),
	  								lng: results[0].geometry.location.lng(),
	  								address: results[0].formatted_address,
	  								addressComponents: results[0].address_components
	  							});

	  							if(!marker.get('customContent')) {
	  								marker.set('content', marker.get('address').split(',').join('<br>'));
	  							}

	  							marker.setPosition(new google.maps.LatLng(marker.get('lat'), marker.get('lng')));

	  							t.updateHiddenField();
	  							t.center();
	  						}
	  					});
					}
  				};

  				_.each(addressFields, function(field) {
  					var $field = $('#fields-'+field);

  					addressValues[field] = $field.val() != "" ? $field.val() : false;

  					$field.blur(function() {
  						if($(this).val() != '') {
  							addressValues[field] = $(this).val();
  						}
  						else {
  							addressValues[field] = false;
  						}

  						updateMap(addressValues);
  					});
  				});

  				updateMap(addressValues);
  			}
		},

		showMapList: function() {
			var data = {
 				markers: [],
				polygons: [],
				polylines: [],
				routes: [],
				circles: [],
				overlays: []
			};

			_.each(this.markers, function(marker) {
				data.markers.push(marker.toJSON());
			});

			_.each(this.polygons, function(polygon) {
				data.polygons.push(polygon.toJSON());
			});

			_.each(this.polylines, function(polyline) {
				data.polylines.push(polyline.toJSON());
			});

			_.each(this.routes, function(route) {
				data.routes.push(route.toJSON());
			});

			_.each(this.circles, function(circle) {
				data.circles.push(circle.toJSON());
			});

			_.each(this.groundOverlays, function(overlay) {
				data.overlays.push(overlay.toJSON());
			});

			var view = new GoogleMaps.Views.MapList({
				map: this,
				model: new Backbone.Model(data),
				showButtons: this.showButtons
			});

			this.showModal(view);
		},

		buildButtonBar: function() {
			var t = this;

			this.buttonBar.show(new GoogleMaps.Views.ButtonBar({
				showButtons: (this.showButtons != '*' ? this.showButtons : this.availableButtons),
 				buttons: [{
 					icon: 'list',
 					name: 'list',
 					click: function(e) {
 						t.showMapList();

 						e.preventDefault();
 					}
 				}, {
 					icon: 'refresh',
 					name: 'refresh',
 					click: function(e) {
 						t.center();

 						e.preventDefault();
 					}
 				},{
 					label: 'Add Marker',
 					name: 'markers',
 					click: function(e) {
 						var view = new GoogleMaps.Views.MarkerForm({
 							map: t
 						});

 						t.showModal(view);

 						e.preventDefault();
 					}
 				},{
 					label: 'Add Route',
 					name: 'routes',
 					click: function(e) {
 						var view = new GoogleMaps.Views.RouteForm({
 							map: t
 						});

 						t.showModal(view);

 						e.preventDefault(); 						
 					}
 				},{
 					label: 'Add Polygon',
 					name: 'polygons',
 					click: function(e) {
 						var view = new GoogleMaps.Views.PolygonForm({
 							map: t
 						});

 						t.showModal(view);

 						e.preventDefault();
 					}
 				},{
 					label: 'Add Polyline',
 					name: 'polylines',
 					click: function(e) {
 						var view = new GoogleMaps.Views.PolylineForm({
 							map: t
 						});

 						t.showModal(view);

 						e.preventDefault();
 					}
 				},{
 					label: 'Add Circle',
 					name: 'circles',
 					click: function(e) {
 						var view = new GoogleMaps.Views.CircleForm({
 							map: t
 						});

 						t.showModal(view);

 						e.preventDefault();
 					}
 				},{
 					label: 'Add Image',
 					name: 'images',
 					click: function(e) {
 						var view = new GoogleMaps.Views.GroundOverlayForm({
 							map: t
 						});

 						t.showModal(view);

 						e.preventDefault();
 					}
 				}]
 			}));
		},

		closeInfoWindows: function() {
			_.each(this.markers, function(marker) {
				marker.get('infowindow').close();
			});

			_.each(this.polygons, function(polygon) {
				polygon.get('infowindow').close();
			});

			_.each(this.polylines, function(polyline) {
				polyline.get('infowindow').close();
			});

			_.each(this.circles, function(circle) {
				circle.get('infowindow').close();
			});

			_.each(this.groundOverlays, function(overlay) {
				overlay.get('infowindow').close();
			});

			_.each(this.routes, function(route) {
				_.each(route.get('markers'), function(marker) {
					marker.get('infowindow').close();
				});
			});
		},

		showModal: function(view) {	
			this.modal.empty();
			this.modal.show(view);
			this.modal.$el.addClass('show');
			this.buttonBar.$el.addClass('hide');
		},

		hideModal: function(center) {
			this.modal.$el.removeClass('show');
			this.buttonBar.$el.removeClass('hide');
			this.modal.empty();

			if(_.isUndefined(center) || center === true) {	
				this.center();
			}
		},

		zoomIn: function() {
			this.setZoom(this.getZoom() + 1);
		},

		zoomOut: function() {
			this.setZoom(this.getZoom() - 1);
		},

		center: function() {
			var t = this, bounds = new google.maps.LatLngBounds();
			var boundsChanged = false;

			_.each(this.markers, function(marker) {
				if(!marker.get('deleted')) {
					bounds.extend(marker.getPosition());
					boundsChanged = true;
				}
			});

			_.each(this.polygons, function(polygon) {
				if(!polygon.get('deleted')) {
					_.each(polygon.getPath().getArray(), function(latLng) {
						bounds.extend(latLng);
						boundsChanged = true;
					});
				}
			});

			_.each(this.polylines, function(polyline) {
				if(!polyline.get('deleted')) {
					_.each(polyline.getPath().getArray(), function(latLng) {
						bounds.extend(latLng);
						boundsChanged = true;
					});
				}
			});

			_.each(this.circles, function(circle) {
				if(!circle.get('deleted')) {
					bounds.union(circle.getBounds());
					boundsChanged = true;
				}
			});

			_.each(this.groundOverlays, function(overlay) {
				if(!overlay.get('deleted')) {
					bounds.union(overlay.getBounds());
					boundsChanged = true;
				}
			});

			_.each(this.routes, function(route) {
				_.each(route.getLocations(), function(location) {
					bounds.extend(new google.maps.LatLng(location.lat, location.lng));
					boundsChanged = true;
				});
			});

			if(boundsChanged) {
				this.fitBounds(bounds);
			}
		},

		union: function(bounds) {
			this.fitBounds(bounds.union(this.getBounds()));
		},

		fitBounds: function(bounds) {
			this.api.fitBounds(bounds);
		},

		getBounds: function() {
			return this.api.getBounds();
		},

		getCenter: function() {
			return this.api.getCenter();
		},

		getCanvas: function() {
			return this.$el.find('.oh-google-map').get(0);
		},

		getMapOptions: function() {
			return this.mapOptions;
		},

		getDiv: function() {
			return this.api.getDiv()
		},

		getHeading: function() {
			return this.api.getHeading();
		},

		getMapTypeId: function() {
			return this.api.getMapTypeId();
		},

		getProjection: function() {
			return this.api.getProjection();
		},

		getStreetView: function() {
			return this.api.getStreetView();
		},

		getTilt: function() {
			return this.api.getCenter();
		},

		getZoom: function() {
			return this.api.getZoom();
		},

		panBy: function(x, y) {
			this.api.panBy(x, y);
		},

		panTo: function(value) {
			this.api.panTo(value);
		},

		panToBounds: function(value) {
			this.api.panToBounds(value);
		},

		setCenter: function(value) {
			this.api.setCenter(value);
		},

		setHeading: function(value) {
			this.api.setHeading(value);
		},

		setMapTypeId: function(value) {
			this.api.setMapTypeId(value);
		},

		setOptions: function(value) {
			this.api.setOptions(value);
		},

		setStreetView: function(value) {
			this.api.setStreetView(value);
		},

		setTilt: function(value) {
			this.api.setTilt(value);
		},

		setZoom: function(x) {
			if(x < 0) {
				x = 0;
			}

			if(x > 20) {
				x = 20;
			}

			this.api.setZoom(x);
		}

	});

}());
(function() {

	"use strict";

	GoogleMaps.Views.MapList = GoogleMaps.Views.ItemView.extend({

		map: false,

		template: GoogleMaps.Template('map-list'),

		initialize: function(options) {
			GoogleMaps.Views.ItemView.prototype.initialize.call(this, options);

			var t = this;

			if(this.getOption('showButtons')) {
				_.each(this.getOption('showButtons'), function(button) {
					t.model.set('show'+(button.charAt(0).toUpperCase() + button.slice(1)), true);
				});
			}
		},

		onRender: function() {
			var t = this;

			this.$el.find('.cancel').click(function(e) {
				t.map.hideModal(false);

				e.preventDefault();
			});

			this.$el.find('.edit').click(function(e) {
				var prop = $(this).data('property');
				var index = $(this).parents('li').index();
				var data = t.map[prop][index];

				data.edit(true);

				e.preventDefault();
			});

			this.$el.find('.delete').click(function(e) {
				var prop = $(this).data('property');
				var index = $(this).parents('li').index();
				var data = t.map[prop][index];

				data.delete(true);

				e.preventDefault();
			});

			this.$el.find('.marker-undo').click(function(e) {
				var index = $(this).parent().index();
				var marker = t.map.markers[index];

				marker.set('deleted', false);
				marker.get('api').setMap(t.map.api);

				t.model.get('markers')[index].deleted = false;

				t.map.center();
				t.map.updateHiddenField();
				t.render();
				
				e.preventDefault();
			});

			this.$el.find('.route-undo').click(function(e) {
				var index = $(this).parent().index();
				var route = t.map.routes[index];

				route.set('deleted', false);
				route.get('api').setMap(t.map.api);

				t.model.get('routes')[index].deleted = false;

				_.each(t.model.get('routes')[index].markers, function(marker) {
					marker.deleted = false;
					marker.setMap(t.map.api);
				});

				t.map.center();
				t.map.updateHiddenField();
				t.render();
				
				e.preventDefault();
			});

			this.$el.find('.polygon-undo').click(function(e) {
				var index = $(this).parent().index();
				var polygon = t.map.polygons[index];

				polygon.set('deleted', false);
				polygon.get('api').setMap(t.map.api);

				t.model.get('polygons')[index].deleted = false;

				t.map.center();
				t.map.updateHiddenField();
				t.render();
				
				e.preventDefault();
			});

			this.$el.find('.polyline-undo').click(function(e) {
				var index = $(this).parent().index();
				var polyline = t.map.polylines[index];

				polyline.set('deleted', false);
				polyline.get('api').setMap(t.map.api);

				t.model.get('polylines')[index].deleted = false;

				t.map.center();
				t.map.updateHiddenField();
				t.render();
				
				e.preventDefault();
			});

			this.$el.find('.circle-undo').click(function(e) {
				var index = $(this).parent().index();
				var circle = t.map.circles[index];

				circle.set('deleted', false);
				circle.get('api').setMap(t.map.api);

				t.model.get('circles')[index].deleted = false;

				t.map.center();
				t.map.updateHiddenField();
				t.render();
				
				e.preventDefault();
			});

			this.$el.find('.overlay-undo').click(function(e) {
				var index = $(this).parent().index();
				var overlay = t.map.groundOverlays[index];

				overlay.set('deleted', false);
				overlay.get('api').setMap(t.map.api);

				t.model.get('groundOverlays')[index].deleted = false;

				t.map.center();
				t.map.updateHiddenField();
				t.render();
				
				e.preventDefault();
			});

			this.$el.find('.marker-center').click(function(e) {
				var index = $(this).parent().index();
				var marker = t.map.markers[index];

				t.map.api.setZoom(14);
				t.map.api.setCenter(marker.getPosition());
				
				e.preventDefault();
			});

			this.$el.find('.route-center').click(function(e) {
				var index = $(this).parent().index();
				var route = t.map.routes[index];

				var bounds = new google.maps.LatLngBounds();

				_.each(route.getLocations(), function(location) {
					bounds.extend(new google.maps.LatLng(location.lat, location.lng));
				});

				t.map.fitBounds(bounds);

				e.preventDefault();
			});

			this.$el.find('.polygon-center').click(function(e) {
				var index = $(this).parent().index();
				var polygon = t.map.polygons[index];

				var bounds = new google.maps.LatLngBounds();

				polygon.getPath().forEach(function(latLng) {
					bounds.extend(latLng);
				});
				
				t.map.fitBounds(bounds);

				e.preventDefault();
			});

			this.$el.find('.polyline-center').click(function(e) {
				var index = $(this).parent().index();
				var polyline = t.map.polylines[index];

				var bounds = new google.maps.LatLngBounds();

				polyline.getPath().forEach(function(latLng) {
					bounds.extend(latLng);
				});
				
				t.map.fitBounds(bounds);

				e.preventDefault();
			});

			this.$el.find('.circle-center').click(function(e) {
				var index = $(this).parent().index();
				var circle = t.map.circles[index];

				t.map.fitBounds(circle.getBounds());

				e.preventDefault();
			});

			this.$el.find('.overlay-center').click(function(e) {
				var index = $(this).parent().index();
				var overlay = t.map.groundOverlays[index];

				t.map.fitBounds(overlay.getBounds());

				e.preventDefault();
			});
		}

	});

}());
(function() {

	"use strict";

	GoogleMaps.Views.MarkerForm = GoogleMaps.Views.BaseForm.extend({

		map: false,

		template: GoogleMaps.Template('marker-form'),

		originalModel: {},

		initialize: function(options) {
			GoogleMaps.Views.BaseForm.prototype.initialize.call(this, options);

			var t = this;

			if(!this.model) {
				this.model = new GoogleMaps.Models.Marker({
					map: this.map,
					isNew: true,
					isSavedToMap: false
				});
			}
			else {
				this.originalModel = this.model.toJSON();
			}

			/*
			this.model.onDragend = function(e) {
				GoogleMaps.Models.Marker.prototype.onDragend.call(this, e, function() {
					t.$el.find('.lat').html(e.latLng.lat());
					t.$el.find('.lng').html(e.latLng.lng());
					t.$el.find('.address').html(t.model.get('address'));

					if(!t.model.get('customContent')) {
						t.$el.find('[name="content"]').val(t.model.get('content'));
					}
				});
			};
			*/
		},

		submit: function() {
			this.model.set({
				title: this.$el.find('[name="title"]').val(),
				content: this.$el.find('[name="content"]').val(),
				scaledWidth: parseInt(this.$el.find('[name="scaledWidth"]').val()),
				scaledHeight: parseInt(this.$el.find('[name="scaledHeight"]').val())
			});

			if(this.model.get('content') != this.model.get('address').split(',').join('<br>')) {
				this.model.set('customContent', true);
			}

			var latLng = new google.maps.LatLng(this.model.get('lat'), this.model.get('lng'));

			this.model.get('infowindow').setOptions({content: this.model.buildInfoWindowContent()});
			this.model.get('api').setPosition(latLng);

			if(!this.model.get('isSavedToMap')) {
				this.map.markers.push(this.model);
			}

			if(this.model.get('icon')) {
				this.model.setIcon(this.model.get('icon'));
			}
			else {
				this.model.setIcon(false);
			}

			this.model.set('isSavedToMap', true);

			this.model.get('infowindow').open(this.map.api, this.model.get('api'));

			this.map.center();
			this.map.hideModal();
			this.map.updateHiddenField();
		},

		hasLocation: function() {
			return _.isUndefined(this.model.get('lat')) || _.isUndefined(this.model.get('lng')) ? false : true;
		},

		onRender: function() {
			var t = this;

			GoogleMaps.Views.BaseForm.prototype.onRender.call(this);

			this.$el.find('.edit-location').click(function(e) {
				t.showGeocoder();
				e.preventDefault();
			});

			this.$el.find('.change-icon').click(function(e) {
				
				var modal = Craft.createElementSelectorModal('Asset', {
				    multiSelect: false,
				    storageKey: 'googleMapsPlugin',
				    criteria: { kind: 'image' },
				    onSelect: function(entries) {
				    	t.model.set('icon', entries[0].url);
				    	t.$el.find('.oh-google-map-map-icon img').attr('src', entries[0].url);
				    }
				});
				
				e.preventDefault();
			});

			/*
			this.$el.find('[name="title"]').blur(function(e) {
				t.model.set('title', this.$el);				
			});
			*/
		},

		onShow: function() {
			var t = this;

			// GoogleMaps.Views.BaseForm.prototype.onShow.call(this);

			this.map.closeInfoWindows();

			if(this.model.get('isSavedToMap')) {
				this.model.get('infowindow').open(this.map.api, this.model.get('api'));
			}

			if(!this.hasLocation()) {
				this.showGeocoder();
			}
		},

		isCoordinate: function(coord) {
			return coord.match(/^([-\d.]+),(\s+)?([-\d.]+)$/);
		},

		showGeocoder: function() {
			var t = this;

			var view = new GoogleMaps.Views.Geocoder({
				map: this.map,
				responseHandler: function(response) {
					t.responseHandler(response);
				},
				cancel: function() {
					if(t.hasLocation()) {
						t.isDestroyed = false;
						t.map.showModal(t);
					}
					else {
						t.map.hideModal();
					}
				}
			});

			this.map.showModal(view);
		},

		responseHandler: function(response) {
			var t = this;
			
			t.model.set({
				address: response.formatted_address,
				addressComponents: response.address_components,
				lat: response.geometry.location.lat(),
				lng: response.geometry.location.lng()
			});

			if(!t.model.get('customContent')) {
				if(!t.model.isCoordinate(response.formatted_address)) {
					t.model.set('content', response.formatted_address.split(',').join('<br>'));
				}
				else {
					t.model.set('content', response.formatted_address);
				}
			}

			t.isDestroyed = false;
			t.map.showModal(t);
		},

		/*
		responseHandler: function(response) {
			var marker = this.addMarker({
				lat: response.geometry.location.lat(), 
				lng: response.geometry.location.lng(),
				address: response.formatted_address,
				addressComponents: response.address_components
			});

			this.map.closeInfoWindows();

			marker.get('infowindow').open(this.map.api, marker.get('api'));
		},
		*/
		
		addMarker: function(data, isNewMarker) {
			var t = this, latLng = new google.maps.LatLng(data.lat, data.lng);

			if(_.isUndefined(isNewMarker)) {
				isNewMarker = true;
			}

			/*
			google.maps.event.addListener(marker, 'click', function() {
				t.map.closeInfoWindows();
				infowindow.open(t.map.api, marker);
			});

			google.maps.event.addListener(marker, 'dragend', function(e) {
				t.geocoder.geocode({location: e.latLng}, function(results, status) {
					var content = data.content ? data.content : data.address.split(',').join('<br>');

					if(status == 'OK') {
						marker.address = results[0].formatted_address;
						marker.addressComponents = results[0].address_components;
					}
					else {
						marker.address = '';
						marker.addressComponents = [];
					}

					if(!marker.customContent) {
						marker.content = marker.address.split(',').join('<br>');
						marker.infowindow.setContent(t.buildInfoWindowContent(marker, marker.content));
					}

					t.map.updateHiddenField();
				});
			});

			var content = data.content ? data.content : data.address.split(',').join('<br>');

			var infowindow = new google.maps.InfoWindow({
				content: this.buildInfoWindowContent(marker, content)
			});
			*/

			/*
			marker.title = data.title ? data.title : null;
			marker.content = content;
			marker.customContent = data.customContent ? true : false;
			marker.infowindow = infowindow;
			marker.address = data.address;
			marker.addressComponents = data.addressComponents;
			marker.isNew = isNewMarker ? true : false;
			*/

			/*
			if(data.locationId) {
				marker.locationId = data.locationId;
			}

			if(data.elementId) {
				marker.elementId = data.elementId;
			}

			var marker = new GoogleMaps.Models.Marker({
				map: this.map,
				api: new google.maps.Marker({
					position: latLng,
					draggable: true
				}),
				title: data.title ? data.title : null,
				content: data.content ? data.content : data.address.split(',').join('<br>'),
				customContent: data.customContent ? true : false,
				address: data.address,
				addressComponents: data.addressComponents,
				// infowindow: infowindow,
				isNew: isNewMarker ? true : false,
				icon: data.icon ? data.icon : null,
				elementId: data.elementId ? data.elementId : null,
				locationId: data.locationId ? data.locationId : null
			});

			this.map.markers.push(marker);

			this.map.center();
			this.map.hideModal();
			this.map.updateHiddenField();

			return marker;

			*/
		},

		cancel: function() {
			if(this.model.get('isSavedToMap')) {
				var position = new google.maps.LatLng(
					this.originalModel.lat, 
					this.originalModel.lng
				);

				this.model.set(this.originalModel);
				this.model.get('api').setPosition(position);
				this.model.get('infowindow').setOptions({content: this.model.buildInfoWindowContent()});
			}

			this.map.hideModal();
		}

	});

}());
(function() {

	"use strict";

	GoogleMaps.Views.PolygonForm = GoogleMaps.Views.BaseForm.extend({

		geocoder: false,

		template: GoogleMaps.Template('polygon-form'),

		map: false,

		api: false,

		dblclickEvent: false,

		initialize: function(options) {
			var t = this;

			this.geocoder = new google.maps.Geocoder();

			GoogleMaps.Views.BaseForm.prototype.initialize.call(this, options);

			this.initializeApi();

			this.model.get('infowindow').close();
			this.model.get('api').setDraggable(true);
			this.model.get('api').setEditable(true);

			this.api = this.model.get('api');
		},

		initializeApi: function() {
			if(!this.model) {
				this.model = new GoogleMaps.Models.Polygon({
					map: this.map,
					points: [],
					hideDetails: true,
					isNew: true,
					isSavedToMap: false
				});
			}
		},

		onRender: function() {
			var t = this;

			GoogleMaps.Views.BaseForm.prototype.onRender.call(this);

			this.model.onMouseup = function() {
				setTimeout(function() {
					// t.model.set('points', t.api.getPath().getArray());
					t.render();
				}, 200);
			};

			this.model.onDragend = function() {
				// t.model.set('points', t.api.getPath().getArray());
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
					t.$el.find('.add-point').click();
					e.preventDefault();
				}
			}).focus();

			this.$el.find('.add-point').click(function(e) {
				t.addPoint(t.$el.find('input').val());

				e.preventDefault();
			});

			this.$el.find('.oh-google-map-tag a').click(function(e) {
				var index = $(this).parent().index();

				t.removePoint(index);

				e.preventDefault();
			});

			this.$el.find('.simple-color-picker').simpleColorPicker().blur(function() {
				t.updatePolygonOptions();
			})
			.blur();

			this.$el.find('.slider').each(function() {
				var value = $(this).data('value');
				var start = $(this).data('start');
				var step = $(this).data('step');
				var min = $(this).data('min');
				var max = $(this).data('max');

				$(this).noUiSlider({
					start: parseFloat(value ? value : start),
					step: parseFloat(step),
					range: {
						'min': parseFloat(min),
						'max': parseFloat(max)
					}
				})
				.change(function(e, value) {
					$(this).next().val(value);
					t.updatePolygonOptions();
				});

				$(this).next().val($(this).val());
			});

			t.updatePolygonOptions();
		},

		updatePolygonOptions: function() {
			var options = {
				strokeColor: this.$el.find('[name="strokeColor"]').val(),
				strokeOpacity: this.$el.find('[name="strokeOpacity"]').val(),
				strokeWeight: this.$el.find('[name="strokeWeight"]').val(),
				fillColor: this.$el.find('[name="fillColor"]').val(),
				fillOpacity: this.$el.find('[name="fillOpacity"]').val(),
				title: this.$el.find('[name="title"]').val(),
				content: this.$el.find('[name="content"]').val()
			};

			this.model.set(options);
			this.api.setOptions(options);
		},

		onShow: function() {
			var t = this;

			this.map.closeInfoWindows();

			this.map.api.setOptions({
				disableDoubleClickZoom: true
			});

			this.dblclickEvent = google.maps.event.addListener(this.map.api, 'dblclick', function(e) {
				t.addPoint(e.latLng);
			});

			setTimeout(function() {
				t.$el.find('input').focus();
			}, 250);

		},

		onDestroy: function() {

			this.model.onMouseup = function() {};

			this.model.onDragend = function() {};

			if(!this.model.get('isSavedToMap') && this.model.get('isNew')) {
				this.api.setMap(null);
			}

			this.map.api.setOptions({
				disableDoubleClickZoom: false
			});

			if(this.dblclickEvent) {
				this.dblclickEvent.remove();
			}
		},

		isCoordinate: function(coord) {
			return coord.match(/^([-\d.]+),(\s+)?([-\d.]+)$/);
		},

		addPoint: function(coord) {
			var t = this, path = this.api.getPath();

			if(!path) {
				path = [];
			}

			if(_.isObject(coord)) {
				path.push(coord);

				this.api.setPath(path);
				this.render();
			}
			else if(this.isCoordinate(coord)) {
				coord = coord.split(',');

				path.push(new google.maps.LatLng(parseFloat(coord[0]), parseFloat(coord[1])));

				this.api.setPath(path);
				this.render();
			}
			else {
				this.geocoder.geocode({address: coord}, function(results, status) {
					if(status == 'OK') {
						path.push(results[0].geometry.location);

						t.api.setPath(path);
					}

					t.render();
				});
			}
		},

		removePoint: function(index) {
			var path = this.api.getPath();

			path.removeAt(index);

			this.api.setPath(path);
			this.render();
		},

		saveToMap: function() {
			if(!this.model.get('isSavedToMap')) {
				this.map.polygons.push(this.model);
				this.model.set('isSavedToMap', true);
			}
		},

		submit: function() {
			this.api.setDraggable(false);
			this.api.setEditable(false);

			var points = [];

			this.api.getPath().forEach(function(path) {
				points.push({lat: path.lat(), lng: path.lng()});
			});

			this.model.set('points', points);

			this.saveToMap();
			this.updatePolygonOptions();

			if(this.model.get('infowindow')) {
				this.model.get('infowindow').setOptions({
					content: this.model.buildInfoWindowContent()
				});
			}

			this.map.hideModal();
			this.map.updateHiddenField();
		},

		cancel: function() {
			this.model.setPoints(this.model.get('points'));
			this.model.setDraggable(false);
			this.model.setEditable(false);
			this.map.hideModal();
		}

	});

}());
(function() {

	"use strict";

	GoogleMaps.Views.PolylineForm = GoogleMaps.Views.PolygonForm.extend({

		geocoder: false,

		template: GoogleMaps.Template('polyline-form'),

		initializeApi: function() {
			if(!this.model) {
				this.model = new GoogleMaps.Models.Polyline({
					map: this.map,
					points: [],
					hideDetails: true,
					isNew: true,
					isSavedToMap: false
				});
			}
		},

		saveToMap: function() {
			if(!this.model.get('isSavedToMap')) {
				this.map.polylines.push(this.model);
				this.model.set('isSavedToMap', true);
			}
		}			

	});

}());
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
(function() {

	"use strict";

	GoogleMaps.Views.RouteLocationForm = GoogleMaps.Views.Geocoder.extend({

		template: GoogleMaps.Template('route-location-form')

	});

}());
(function() {

	"use strict";

	GoogleMaps.Views.RouteMarkerForm = GoogleMaps.Views.MarkerForm.extend({

		submit: function() {
			this.model.set({
				title: this.$el.find('[name="title"]').val(),
				content: this.$el.find('[name="content"]').val(),
				scaledWidth: parseInt(this.$el.find('[name="scaledWidth"]').val()),
				scaledHeight: parseInt(this.$el.find('[name="scaledHeight"]').val())
			});

			if(this.model.get('content') != this.model.get('address').split(',').join('<br>')) {
				this.model.set('customContent', true);
			}

			var latLng = new google.maps.LatLng(this.model.get('lat'), this.model.get('lng'));

			this.model.get('infowindow').setOptions({content: this.model.buildInfoWindowContent()});
			this.model.get('api').setPosition(latLng);

			if(this.model.get('icon')) {
				this.model.get('location').icon = this.model.get('icon');
				this.model.setIcon(this.model.get('icon'));
			}
			else {
				this.model.get('location').icon = null;
				this.model.setIcon(false);
			}

			// this.model.get('infowindow').open(this.map.api, this.model.get('api'));
		}

	});

}());
(function() {

	"use strict";

	/*
	GoogleMaps.App.addInitializer(function() {

		GoogleMaps.addScript = function(url, callback) {
			if(typeof google === "undefined") {
			    var script = document.createElement('script');
			    if(callback) script.onload = callback;
			    script.type = 'text/javascript';
			    script.src = url;
			    document.body.appendChild(script);
			}
			else {
				GoogleMaps.googleApiCallback();
			}
		};

		GoogleMaps.googleApiCallback = function() {
			var map = new GoogleMaps.Views.Map();

			GoogleMaps.App.content.show(map);
		};

		$(document).ready(function() {
			GoogleMaps.addScript('https://maps.googleapis.com/maps/api/js?&sensor=false&callback=GoogleMaps.googleApiCallback');
		});
		
	});
	*/

}());
(function() {

    Handlebars.registerHelper('activeSegment', function(segment, match, options) {
        var _return = [];

        if(Timeblocker.Uri.segment(segment) == match) {
            return options.fn();
        }

        return false;
    });

}());
(function() {

    Handlebars.registerHelper('addon', function(addon, options) {
    	if(Account.hasAddon(addon)) {
	        return options.fn(Account.get('addons')[addon]);
	    }
        return null;
    });

}());
(function() {

    Handlebars.registerHelper('date', function(timestamp, format, options) {

      if(_.isObject(format)) {
        format = timestamp;
        timestamp = new Timeblocker.Date();
      }

      var time;

      if(_.isObject(timestamp) && _.isFunction(timestamp.timestamp)) {
        time = timestamp.timestamp();
      }
      else {
        time = new Timeblocker.Date(timestamp);
      }

      if(!time.date) {
        time = new Timeblocker.Date(time); 
      }
      
      return time.format(format);

    });

}());
(function() {

	'use strict';

    Handlebars.registerHelper('eachProperty', function(context, options) {
    	var ret = [];

    	if(_.isObject(context)) {
	    	_.each(context, function(value, property) {
	    		var parse = {
	    			property: property,
	    			value: value
	    		};

	    		ret.push(options.fn(parse));
	    	});
	    }

    	return ret.join("\n");
    });

}());


(function() {

	'use strict';

    Handlebars.registerHelper('forEach', function(context, options) {
    	var ret = [];

    	if(_.isObject(context)) {
	    	_.each(context, function(value, i) {
	    		var parse = _.extend(value, {
	    			index: i,
	    			count: i + 1
	    		});

	    		ret.push(options.fn(parse));
	    	});
	    }

    	return ret.join("\n");
    });

}());


(function() {

    Handlebars.registerHelper('hasAddon', function(addon, options) {
    	if(Account.hasAddon(addon)) {
	        return options.fn();
	    }
    });

    Handlebars.registerHelper('hasNoAddon', function(addon, options) {
    	if(!Account.hasAddon(addon)) {
	        return options.fn();
	    }
    });

}());
(function() {

    Handlebars.registerHelper('profile', function(options) {
        return options.fn(Profile.toJSON());
    });

    Handlebars.registerHelper('account', function(options) {
        return options.fn(Account.toJSON());
    });

    Handlebars.registerHelper('hasPermission', function(permission, options) {
    	if(Profile.hasPermission(permission)) {
	        return options.fn();
	    }
    });

    Handlebars.registerHelper('notPermitted', function(permission, options) {
     	if(!Profile.hasPermission(permission)) {
	        return options.fn();
	    }
    });

    Handlebars.registerHelper('canCancelAppointment', function(client, options) {
    	if( Profile.get('uid') == client.uid || 
            Profile.get('uid') == client.parent.uid ||
            Profile.hasPermission('manageAppointments') ) {
    		return options.fn();
    	}
    });

}());
(function() {

    Handlebars.registerHelper('inArray', function(needle, haystack, options) {
        if( typeof haystack == "object" && haystack.indexOf(needle) >= 0) {
        	return options.fn();
        }
    });

}());
(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory(require('handlebars'));
    } else if (typeof define === 'function' && define.amd) {
        define(['handlebars'], factory);
    } else {
        root.HandlebarsHelpersRegistry = factory(root.Handlebars);
    }
}(this, function (Handlebars) {

    var isArray = function(value) {
        return Object.prototype.toString.call(value) === '[object Array]';
    };

    var ExpressionRegistry = function() {
        this.expressions = [];
    };

    ExpressionRegistry.prototype.add = function (operator, method) {
        this.expressions[operator] = method;
    };

    ExpressionRegistry.prototype.call = function (operator, left, right) {
        if ( ! this.expressions.hasOwnProperty(operator)) {
            throw new Error('Unknown operator "'+operator+'"');
        }

        return this.expressions[operator](left, right);
    };

    var eR = new ExpressionRegistry();
    eR.add('not', function(left, right) {
        return left != right;
    });
    eR.add('>', function(left, right) {
        return left > right;
    });
    eR.add('<', function(left, right) {
        return left < right;
    });
    eR.add('>=', function(left, right) {
        return left >= right;
    });
    eR.add('<=', function(left, right) {
        return left <= right;
    });
    eR.add('==', function(left, right) {
        return left == right;
    });
    eR.add('===', function(left, right) {
        return left === right;
    });
    eR.add('!==', function(left, right) {
        return left !== right;
    });
    eR.add('in', function(left, right) {
        if ( ! isArray(right)) {
            right = right.split(',');
        }
        return right.indexOf(left) !== -1;
    });

    var isHelper = function() {
        var args = arguments,
            left = args[0],
            operator = args[1],
            right = args[2],
            options = args[3];

        if (args.length == 2) {
            options = args[1];
            if (left) return options.fn(this);
            return options.inverse(this);
        }

        if (args.length == 3) {
            right = args[1];
            options = args[2];
            if (left == right) return options.fn(this);
            return options.inverse(this);
        }

        if (eR.call(operator, left, right)) {
            return options.fn(this);
        }
        return options.inverse(this);
    };

    Handlebars.registerHelper('is', isHelper);

    /*
    Handlebars.registerHelper('nl2br', function(text) {
        var nl2br = (text + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');
        return new Handlebars.SafeString(nl2br);
    });

    Handlebars.registerHelper('log', function() {
        console.log(['Values:'].concat(
            Array.prototype.slice.call(arguments, 0, -1)
        ));
    });

    Handlebars.registerHelper('debug', function() {
        console.log('Context:', this);
        console.log(['Values:'].concat(
            Array.prototype.slice.call(arguments, 0, -1)
        ));
    });
	*/

    return eR;

}));
(function() {

    Handlebars.registerHelper('isArray', function(variable, options) {
        if(_.isArray(variable)) {
            return options.fn();
        }
    });

    Handlebars.registerHelper('notArray', function(variable, options) {
        if(!_.isArray(variable)) {
            return options.fn();
        }
    });

}());
(function() {

    Handlebars.registerHelper('isHost', function(options) {
        if(Profile.isHost()) {
            return options.fn();
        }
    });

    Handlebars.registerHelper('notHost', function(options) {
        if(!Profile.isHost()) {
            return options.fn();
        }
    });

    Handlebars.registerHelper('isClient', function(options) {
        if(Profile.isClient()) {
            return options.fn();
        }
    });

    Handlebars.registerHelper('notClient', function(options) {
        if(!Profile.isClient()) {
            return options.fn();
        }
    });

}());
(function() {

    Handlebars.registerHelper('localize', function() {
        var str = Timeblocker.localize(arguments[0].replace(/\s$/, ''));

        if(arguments.length > 1) {
            for(var i = 1; i <= arguments.length; i++) {
                var x = arguments[i];

                str = str.replace('{{$'+(i-1)+'}}', x);
            }
        }

        return new Handlebars.SafeString(str);
    });

}());
(function() {

    Handlebars.registerHelper('not', function(value, options) {
    	return !value || value == 0 ? options.fn(value) : false;
    });

    Handlebars.registerHelper('undefined', function(value, options) {
    	return _.isUndefined(value) ? true : false;
    });

}());
(function() {

	function link(path, text, options) {
		var attrs = [];

		path = new Timeblocker.Path(path);

		attrs.push('href="'+path.string()+'"');

		_.each(options.hash, function(value, name) {
			attrs.push(name+'="'+value+'"');
		});

		return '<a '+attrs.join(' ')+'>'+text+'</a>';
	}

    Handlebars.registerHelper('path', function() {
        return new Timeblocker.Path(arguments).string();        
    });

    Handlebars.registerHelper('url', function() {
        if(arguments[0] && !_.isObject(arguments[0])) {
            return new Timeblocker.Path(arguments).url();
        }
        else {
            return arguments[0];
        }
    });

    Handlebars.registerHelper('image', function() {
        return new Timeblocker.Path(arguments).account();
    });

    Handlebars.registerHelper('link', function(url, text, options) {
    	if(_.isObject(text)) {
    		options = text;
    		text = options.fn ? options.fn(this) : '';
    	}

    	return new Handlebars.SafeString(link(url, text, options));
    });

}());
(function() {

    Handlebars.registerHelper('segment', function(segment) {
        return Timeblocker.Uri.segment(segment);
    });

}());


(function() {

    Handlebars.registerHelper('swapFieldNameWithLabel', function(value, subject) {
     	_.each(subject, function(obj) {
    		if(obj.name == value) {
    			value = obj.label;
    		}
    	});

    	return value;
    });

}());