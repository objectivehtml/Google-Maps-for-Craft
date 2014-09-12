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