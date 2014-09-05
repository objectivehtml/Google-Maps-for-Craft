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

  		polylines: [],

  		routes: [],

  		showButtons: false,

  		className: 'oh-google-map-relative',

  		initialize: function(options) {
  			var t = this;

  			this.markers = [];
  			this.polygons = [];
  			this.polylines = [];
  			this.routes = [];

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

		redraw: function() {
			google.maps.event.trigger(this.api, 'resize');
		},
		
  		updateHiddenField: function() {
  			var data = {
  				markers: [],
  				polygons: [],
  				polylines: [],
  				routes: []
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
				routes: []
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

			var view = new GoogleMaps.Views.MapList({
				map: this,
				model: new Backbone.Model(data)
			});

			this.showModal(view);
		},

		buildButtonBar: function() {
			var t = this;


			this.buttonBar.show(new GoogleMaps.Views.ButtonBar({
				showButtons: this.showButtons,
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

			_.each(this.polylines, function(polyline) {
				if(!polyline.get('deleted')) {
					_.each(polyline.getPath().getArray(), function(latLng) {
						bounds.extend(latLng);
						boundsChanged = true;
					});
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