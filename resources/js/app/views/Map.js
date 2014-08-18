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
	 			if(this.savedData.markers) {
	 				var view = new GoogleMaps.Views.MarkerForm({
	 					map: this
	 				});

		 			_.each(this.savedData.markers, function(marker) {
		 				view.addMarker(marker, marker.isNew);
		 			});
		 		}

	 			if(this.savedData.polygons) {
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

		 			t.center();
		 		}

		 		this.updateHiddenField();
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

		closeInfowindows: function() {
			_.each(this.markers, function(marker) {
				marker.get('infowindow').close();
			});

			_.each(this.polygons, function(polygon) {
				polygon.get('infowindow').close();
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
			this.modal.empty();
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
				this.api.fitBounds(bounds);
			}
		},

		getCanvas: function() {
			return this.$el.find('.oh-google-map').get(0);
		},

		getMapOptions: function() {
			return this.mapOptions;
		}

	});

}());