(function() {

	"use strict";

	GoogleMaps.Models.GroundOverlay = GoogleMaps.Models.BaseMapObject.extend({

		initialize: function(options) {
			
			GoogleMaps.Models.Base.prototype.initialize.call(this, options);

			if(!this.get('api')) {
				this.initializeApi(options);
			}
			else {
				this.get('api').setMap(this.get('map').api);
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

			options = _.extend({}, options, {
				map: this.get('map').api,
				opacity: 1
			});

			if(this.get('sw') && this.get('ne')) {
				options.bounds = new google.maps.LatLngBounds(
					new google.maps.LatLng(this.get('sw').lat, this.get('sw').lng),
					new google.maps.LatLng(this.get('ne').lat, this.get('ne').lng)
				);
			}

			if(this.get('url')) {
				options.url = this.get('url');
			}

			if(this.get('opacity')) {
				options.opacity = this.get('opacity');
			}

			var bounds = new google.maps.LatLngBounds(
				new google.maps.LatLng(0, 0),
				new google.maps.LatLng(0, 10)
			);

			this.set('api', new google.maps.GroundOverlay(this.get('url'), bounds, options));
		},

		hasLocation: function() {
			return true;
		},

		getInfoWindowPosition: function() {
			return new google.maps.LatLng(0, 0);
		},

		edit: function(showMapList) {				
			var t = this, view = new GoogleMaps.Views.GroundOverlayForm({
				model: this,
				map: this.get('map'),
				cancel: function() {
					GoogleMaps.Views.GroundOverlayForm.prototype.cancel.call(view);

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
				template: GoogleMaps.Template('delete-ground-overlay-form'),
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

					t.get('map').closeInfoWindows();
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

		getBounds: function() {
			return this.get('api').getBounds();
		},

		getMap: function() {
			return this.get('api').getMap();
		},

		getOpacity: function() {
			return this.get('api').getOpacity();
		},

		getUrl: function() {
			return this.get('api').getUrl();
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
		
		bindEvents: function() {
			var t = this;

			google.maps.event.addListener(this.get('api'), 'click', function() {
				t.onClick.apply(t, arguments);
			});

			google.maps.event.addListener(this.get('api'), 'dblclick', function() {
				t.onDblclick.apply(t, arguments);
			});
		},

		onClick: function(e) {
			this.get('map').closeInfoWindows();
			this.get('infowindow').open(this.get('map').api);
			this.get('infowindow').setPosition(e.latLng);
		},

		onDblclick: function() {}

	});

}());