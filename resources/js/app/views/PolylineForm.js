(function() {

	"use strict";

	GoogleMaps.Views.PolylineForm = GoogleMaps.Views.PolygonForm.extend({

		geocoder: false,

		template: GoogleMaps.Template('polyline-form'),

		initializeApi: function() {
			if(!this.model) {
				this.model = new GoogleMaps.Models.Polyline({
					map: this.map,
					points: [],
					hideDetails: true,
					isNew: true,
					isSavedToMap: false
				});
			}
		},

		saveToMap: function() {
			if(!this.model.get('isSavedToMap')) {
				this.map.polylines.push(this.model);
				this.model.set('isSavedToMap', true);
			}
		}			

	});

}());