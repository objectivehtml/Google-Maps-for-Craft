(function() {

	"use strict";

	GoogleMaps.Models.Polyline = GoogleMaps.Models.Polygon.extend({

		initializeApi: function(points, options) {

			options.strokeColor = this.get('strokeColor');
			options.strokeWeight = this.get('strokeWeight');
			options.strokeOpacity = this.get('strokeOpacity');
			options.path = points;
			options.map = this.get('map').api;
			options.zIndex = this.get('map').polygons.length;

			this.set('api', new google.maps.Polyline(options));
		},	

		getPaths: function() {
			return;
		},

		edit: function(showMapList) {
			var t = this, view = new GoogleMaps.Views.PolylineForm({
				api: this.get('api'),
				map: this.get('map'),
				model: this,
				cancel: function() {
					GoogleMaps.Views.PolylineForm.prototype.cancel.call(view);

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
				template: GoogleMaps.Template('delete-polyline-form'),
				submit: function() {
					t.get('api').setMap(null);
					t.get('infowindow').close();
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

	});

}());