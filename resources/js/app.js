var GoogleMaps = {
	Views: {},
	Models: {}
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

	GoogleMaps.Fieldtype = function($el, options) {

		var App = new Backbone.Marionette.Application();

		App.options = options;

		App.addRegions({
			content: $el
		});
	
		var coord = options.center.split(',');

		App.addInitializer(function() {
			var map = new GoogleMaps.Views.Map({
				fieldname: options.fieldname,
				savedData: options.savedData,
				width: options.width,
				height: options.height,
				position: new google.maps.LatLng(parseFloat(coord[0]), parseFloat(coord[1])),
				zoom: options.zoom
			});

			App.content.show(map);
		});

		App.start();
	};


}());

/*

(function() {

	

	GoogleMaps.App = new Backbone.Marionette.Application();
	
	GoogleMaps.App.addRegions({
		content: ".oh-google-maps-wrapper"
	});

	GoogleMaps.App.start();

}());
*/
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
		}

	});

}());
(function() {

	"use strict";

	GoogleMaps.Models.Marker = GoogleMaps.Models.Base.extend({

		initialize: function(options) {
			GoogleMaps.Models.Base.prototype.initialize.call(this, options);

			if(!this.get('api')) {
				this.set('api', new google.maps.Marker(_.extend({}, options, {
					map: this.get('map').api,
					position: new google.maps.LatLng(this.get('lat'), this.get('lng')),
					draggable: true
				})));
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
		
		isCoordinate: function(coord) {
			return coord.match(/^([-\d.]+),(\s+)?([-\d.]+)$/);
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

				var view = new GoogleMaps.Views.MarkerForm({
					model: t,
					map: t.get('map')
				});

				t.get('map').showModal(view);

				e.preventDefault();
			});

			$content.find('.delete').click(function(e) {

				/*
				t.get('map').api.setCenter(latLng);
				t.get('map').api.panBy(0, -150);
				*/

				var view = new GoogleMaps.Views.BaseForm({
					template: GoogleMaps.Template('delete-marker-form'),
					submit: function() {
						t.get('api').setMap(null);
						t.set('deleted', true);
						t.get('map').hideModal();
						t.get('map').updateHiddenField();
					},
					cancel: function() {
						t.get('map').hideModal();
					}
				});

				t.get('map').showModal(view);

				e.preventDefault();
			});

			return $content.get(0);
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
			this.get('api').setIcon(value);
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
					if(!t.isCoodinate(t.get('address'))) {
						t.model.set('content', t.get('address').split(',').join('<br>'));
					}
					else {
						t.model.set('content', t.get('address'));
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
			
			if(!this.get('infowindow')) {
				this.set('infowindow', new google.maps.InfoWindow({
					maxWidth: 300,
					content: this.buildInfoWindowContent()
				}));
			}

			this.bindEvents();
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
				
				var view = new GoogleMaps.Views.PolygonForm({
					api: t.get('api'),
					map: t.get('map'),
					model: t
				});


				t.get('map').showModal(view);

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
				/*
				t.get('map').api.setCenter(latLng);
				t.get('map').api.panBy(0, -150);

				*/

				var view = new GoogleMaps.Views.BaseForm({
					template: GoogleMaps.Template('delete-polygon-form'),
					submit: function() {
						t.get('api').setMap(null);
						t.get('infowindow').close();
						t.set('deleted', true);
						t.get('map').hideModal();
						t.get('map').updateHiddenField();
					},
					cancel: function() {
						t.get('map').hideModal();
					}
				});

				t.get('map').showModal(view);

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
			//this.get('api').setMap(value);
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

		className: 'oh-google-map-button-bar',

		template: GoogleMaps.Template('button-bar'),

		initialize: function(options) {
			if(!this.model) {
				this.model = new Backbone.Model();
			}

			Backbone.Marionette.ItemView.prototype.initialize.call(this, options);
		
			if(this.options.buttons) {
				this.model.set('buttons', this.options.buttons);
			}
		},

		onRender: function() {
			var t = this;

			if(this.options.buttons) {
				_.each(this.options.buttons, function(button, i) {
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
			return coord.match(/^([-\d.]+),(\s+)?([-\d.]+)$/);
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

	GoogleMaps.Views.Map = GoogleMaps.Views.LayoutView.extend({

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

  		className: 'oh-google-map-relative',

  		initialize: function(options) {
  			this.markers = [];
  			this.polygons = [];

  			this.mapOptions = _.extend({}, {
	  			zoom: 8,
	  			disableDefaultUI: true
	  		});

  			GoogleMaps.Views.LayoutView.prototype.initialize.call(this, options);

  			if(!this.model) {
  				this.model = new Backbone.Model();
  			}

  			if(this.position) {
  				this.mapOptions.center = this.position;
  			}

  			if(this.zoom) {
  				this.mapOptions.zoom = this.zoom;
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

  		updateHiddenField: function() {
  			var data = {
  				markers: [],
  				polygons: []
  			};

  			_.each(this.markers, function(marker, i) {
  				data.markers.push(marker.toJSON());
  			});

  			_.each(this.polygons, function(polygon, i) {
  				data.polygons.push(polygon.toJSON());
  			});

  			data = JSON.stringify(data);

  			this.$el.find('.field-data').val(data).html(data);
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

 			this.$el.find('.oh-google-map-window').css('max-height', parseInt(this.height.replace('px', '')) - 100);

 			if(this.savedData) {
	 			if(this.savedData.markers.length) {
		 			_.each(this.savedData.markers, function(marker) {
						var options = {
							map: t,
							isNew: false,
							isSavedToMap: true
						};

		 				t.markers.push(new GoogleMaps.Models.Marker(_.extend({}, options, marker)));
		 			});
		 		}

	 			if(this.savedData.polygons.length) {
		 			_.each(this.savedData.polygons, function(polygon) {

		 				/*
		 				polygon.map = t;

		 				polygon = ;

		 				var points = [];

		 				_.each(polygon.points, function(point) {
		 					points.push(new google.maps.LatLng(point.lat, point.lng));
		 				});

		 				polygon.map = t.api;
		 				polygon.points = points;

		 				polygon = new google.maps.Polygon(polygon);

		 				polygon.infowindow = new google.maps.InfoWindow({
		 					content: polygon.content
		 				});

		 				google.maps.event.addListener(polygon, 'click', function(e) {
		 					polygon.infowindow.open(t.api);
		 					polygon.infowindow.setPosition(e.latLng);
		 					//polygon.infowindow.open(t.api, e.latLng);
		 				});
						*/

						var options = {
							map: t,
							isSavedToMap: true
						};

		 				t.polygons.push(new GoogleMaps.Models.Polygon(_.extend({}, options, polygon)));
		 			});
		 		}

		 		this.center();
		 		this.updateHiddenField();
		 	}
		},

		buildButtonBar: function() {
			var t = this;

			this.buttonBar.show(new GoogleMaps.Views.ButtonBar({
 				buttons: [

 				{
 					icon: 'list',
 					click: function(e) {
 						var data = {
 							markers: [],
 							polygons: []
 						};

 						_.each(t.markers, function(marker) {
 							data.markers.push(marker.toJSON());
 						});

 						_.each(t.polygons, function(polygon) {
 							data.polygons.push(polygon.toJSON());
 						});

 						console.log(data);

 						var view = new GoogleMaps.Views.MapList({
 							map: t,
 							model: new Backbone.Model(data)
 						});

 						t.showModal(view);

 						e.preventDefault();
 					}
 				},{
 					name: 'Add Marker',
 					click: function(e) {

 						var view = new GoogleMaps.Views.MarkerForm({
 							map: t
 						});

 						t.showModal(view);

 						e.preventDefault();
 					}
 				},{
 					name: 'Add Polygon',
 					click: function(e) {
 						var view = new GoogleMaps.Views.PolygonForm({
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

		getZoom: function() {
			return this.api.getZoom();
		},

		setZoom: function(x) {
			if(x < 0) {
				x = 0;
			}

			if(x > 20) {
				x = 20;
			}

			this.api.setZoom(x);
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

			if(boundsChanged) {
				this.fitBounds(bounds);
			}
		},

		fitBounds: function(bounds) {
			this.api.fitBounds(bounds);
		},

		getCanvas: function() {
			return this.$el.find('.oh-google-map').get(0);
		},

		getMapOptions: function() {
			return this.mapOptions;
		}

	});

}());
(function() {

	"use strict";

	GoogleMaps.Views.MapList = GoogleMaps.Views.ItemView.extend({

		map: false,

		template: GoogleMaps.Template('map-list'),

		onRender: function() {
			var t = this;

			this.$el.find('.cancel').click(function(e) {
				t.map.hideModal(false);

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

			this.$el.find('.marker-center').click(function(e) {
				var index = $(this).parent().index();
				var marker = t.map.markers[index];

				t.map.api.setCenter(marker.getPosition());
				
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
		},

		submit: function() {
			this.model.set({
				title: this.$el.find('[name="title"]').val(),
				content: this.$el.find('[name="content"]').val()
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
				responseHandler: function(response) {
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

					var view = new GoogleMaps.Views.MarkerForm({
						model: t.model,
						map: t.map
					});

					t.map.showModal(view);
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

			if(!this.model) {
				this.model = new GoogleMaps.Models.Polygon({
					map: this.map,
					points: [],
					hideDetails: true,
					isNew: true,
					isSavedToMap: false
				});
			}

			this.model.get('infowindow').close();
			this.model.get('api').setDraggable(true);
			this.model.get('api').setEditable(true);

			this.api = this.model.get('api');
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

		submit: function() {
			this.api.setDraggable(false);
			this.api.setEditable(false);

			var points = [];

			this.api.getPath().forEach(function(path) {
				points.push({lat: path.lat(), lng: path.lng()});
			});

			this.model.set('points', points);

			this.updatePolygonOptions();

			if(!this.model.get('isSavedToMap')) {
				this.map.polygons.push(this.model);
				this.model.set('isSavedToMap', true);
			}

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
            console.log(arguments);

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