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