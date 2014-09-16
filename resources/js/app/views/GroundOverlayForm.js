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