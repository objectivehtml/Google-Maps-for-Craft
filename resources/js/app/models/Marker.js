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