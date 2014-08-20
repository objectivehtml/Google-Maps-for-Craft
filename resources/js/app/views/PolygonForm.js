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