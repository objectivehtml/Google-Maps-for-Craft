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