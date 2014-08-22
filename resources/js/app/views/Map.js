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

  		className: 'oh-google-map-relative',

  		initialize: function(options) {
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
 							polygons: [],
 							polylines: [],
 							routes: []
 						};

 						_.each(t.markers, function(marker) {
 							data.markers.push(marker.toJSON());
 						});

 						_.each(t.polygons, function(polygon) {
 							data.polygons.push(polygon.toJSON());
 						});

 						_.each(t.polylines, function(polyline) {
 							data.polylines.push(polyline.toJSON());
 						});

 						_.each(t.routes, function(route) {
 							data.routes.push(route.toJSON());
 						});

 						var view = new GoogleMaps.Views.MapList({
 							map: t,
 							model: new Backbone.Model(data)
 						});

 						t.showModal(view);

 						e.preventDefault();
 					}
 				}, {
 					icon: 'refresh',
 					click: function(e) {
 						t.center();

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
 					name: 'Add Route',
 					click: function(e) {
 						var view = new GoogleMaps.Views.RouteForm({
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
 				},{
 					name: 'Add Polyline',
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