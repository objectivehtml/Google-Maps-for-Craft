(function() {

	"use strict";

	GoogleMaps.Views.Map = GoogleMaps.Views.LayoutView.extend({

		template: GoogleMaps.Template('map'),

  		api: false,

  		fieldname: false,

  		geocoder: false,

  		mapOptions: {
  			zoom: 8,
  			disableDefaultUI: true
  		},

  		regions: {
  			buttonBar: '.oh-google-map-controls',
  			modal: '.oh-google-map-window' 
  		},

  		markers: [],

  		className: 'oh-google-map-relative',

  		initialize: function(options) {
  			this.markers = [];

  			GoogleMaps.Views.LayoutView.prototype.initialize.call(this, options);

  			if(!this.model) {
  				this.model = new Backbone.Model();
  			}

  			this.model.set('fieldname', this.fieldname);
  			this.model.set('savedData', this.savedData);
  		},

  		updateHiddenField: function() {
  			var data = {
  				markers: []
  			};

  			_.each(this.markers, function(marker, i) {
  				var obj = {
  					lat: marker.getPosition().lat(),
  					lng: marker.getPosition().lng(),
  					title: marker.title,
  					content: marker.content,
  					customContent: marker.customContent ? true : false,
  					address: marker.address,
  					addressComponents: marker.addressComponents,
  					isNew: marker.isNew ? true : false
  				};

  				if(marker.deleted) {
  					obj.deleted = true;
  				}

  				if(marker.elementId) {
  					obj.elementId = marker.elementId;
  				}

  				if(marker.locationId) {
  					obj.locationId = marker.locationId;
  				}

  				data.markers.push(obj);
  			});

  			console.log(data);

  			this.$el.find('.field-data').val(JSON.stringify(data));
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

 			if(this.savedData) {
	 			if(this.savedData.markers) {
		 			_.each(this.savedData.markers, function(marker) {
		 				t.addMarker(marker, marker.isNew);
		 			});
		 		}
		 	}
		},

		buildButtonBar: function() {
			var t = this;

			this.buttonBar.show(new GoogleMaps.Views.ButtonBar({
 				buttons: [{
 					icon: 'list',
 					click: function(e) {
 						var view = new GoogleMaps.Views.MapList({
 							map: t,
 							model: new Backbone.Model({
 								markers: t.markers
 							})
 						});

 						t.showModal(view);

 						e.preventDefault();
 					}
 				},{
 					name: 'Add Marker',
 					click: function(e) {
 						var view = new GoogleMaps.Views.Geocoder({
							cancel: function() {
								t.hideModal(this);
							},
							responseHandler: function(response) {
								console.log(response);

								var marker = t.addMarker({
									lat: response.geometry.location.lat(), 
									lng: response.geometry.location.lng(),
									address: response.formatted_address,
									addressComponents: response.address_components
								});

								t.closeInfoWindows();

								marker.infowindow.open(t.api, marker);
							}
 						});

 						t.showModal(view);

 						e.preventDefault();
 					}
 				}]
 			}));
		},

		closeInfoWindows: function() {
			_.each(this.markers, function(marker) {
				marker.infowindow.close();
			});
		},

		showModal: function(view) {
			this.modal.show(view);
			this.modal.$el.addClass('show');
			this.buttonBar.$el.addClass('hide');
		},

		hideModal: function(view) {
			this.modal.$el.removeClass('show');
			this.buttonBar.$el.removeClass('hide');
			this.center();
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

		buildInfoWindowContent: function(marker, content) {
			var _return = ['<div>', (_.isArray(content) ? content.join('') : content)];
			var t = this, latLng = marker.getPosition();

			_return.push([
					'<div class="oh-google-map-infowindow-actions">',
						'<a href="#" class="edit">Edit</a> | ',
						'<a href="#" class="delete">Delete</a>',
					'</div>',
				'</div>'
			].join(''));

			var $content = $(_return.join(''));

			$content.find('.edit').click(function(e) {

				t.api.setCenter(latLng);
				t.api.panBy(0, -150);

				var view = new GoogleMaps.Views.BaseForm({
					model: new Backbone.Model({
						title: marker.title,
						content: marker.content
					}),
					template: GoogleMaps.Template('edit-marker-form'),								
					onShow: function() {
						var t = this;

						setTimeout(function() {
							t.$el.find('input').focus();
						}, 250);
					},
					submit: function() {
						marker.title = t.$el.find('input').val();
						marker.content = t.$el.find('textarea').val();
						marker.customContent = true;

						marker.infowindow.setContent(t.buildInfoWindowContent(marker, marker.content));

						t.hideModal();
						t.updateHiddenField();
					},
					cancel: function() {
						t.hideModal();
					}
				});

				t.showModal(view);

				e.preventDefault();
			});

			$content.find('.delete').click(function(e) {
				t.api.setCenter(latLng);
				t.api.panBy(0, -150);

				var view = new GoogleMaps.Views.BaseForm({
					template: GoogleMaps.Template('delete-marker-form'),
					submit: function() {
						marker.setMap(null);
						marker.deleted = true;

						t.hideModal();
						t.updateHiddenField();
					},
					cancel: function() {
						t.hideModal();
					}
				});

				t.showModal(view);

				e.preventDefault();
			});

			return $content.get(0);
		},

		addMarker: function(data, isNewMarker) {
			var t = this, latLng = new google.maps.LatLng(data.lat, data.lng);

			if(_.isUndefined(isNewMarker)) {
				isNewMarker = true;
			}

			var marker = new google.maps.Marker({
				map: this.api,
				position: latLng,
				draggable: true,
				customContent: false
			});

			google.maps.event.addListener(marker, 'click', function() {
				t.closeInfoWindows();
				infowindow.open(t.api, marker);
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

					t.updateHiddenField();
				});
			});

			var content = data.content ? data.content : data.address.split(',').join('<br>');

			var infowindow = new google.maps.InfoWindow({
				content: this.buildInfoWindowContent(marker, content)
			});

			marker.title = data.title ? data.title : null;
			marker.content = content;
			marker.customContent = data.customContent ? true : false;
			marker.infowindow = infowindow;
			marker.address = data.address;
			marker.addressComponents = data.addressComponents;
			marker.isNew = isNewMarker ? true : false;

			if(data.locationId) {
				marker.locationId = data.locationId;
			}

			if(data.elementId) {
				marker.elementId = data.elementId;
			}
	
			this.markers.push(marker);

			this.center();
			this.hideModal();
			this.updateHiddenField();

			return marker;
		},

		center: function() {
			var bounds = new google.maps.LatLngBounds();
			var boundsChanged = false;

			_.each(this.markers, function(marker) {
				if(!marker.deleted) {
					bounds.extend(marker.getPosition());
					boundsChanged = true;
				}
			});

			if(boundsChanged) {
				this.api.fitBounds(bounds);
			}
		},

		getCanvas: function() {
			return this.$el.find('.oh-google-map').get(0);
		},

		getMapOptions: function() {
			return _.extend({
	    		center: new google.maps.LatLng(0, 0)
	  		}, this.mapOptions);
		}

	});

}());