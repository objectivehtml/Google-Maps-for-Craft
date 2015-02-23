(function() {

	"use strict";

	GoogleMaps.Views.GeocoderList = GoogleMaps.Views.ItemView.extend({

		template: GoogleMaps.Template('geocoder-list'),

		className: 'oh-google-map-native-modal modal elementselectormodal',

		initialize: function(options) {
			GoogleMaps.Views.ItemView.prototype.initialize.call(this, options);
		},

		events: {
			'click tbody tr': 'onClick'
		},

		onClick: function(e) {
			var index = $(e.target).index();
			var model = this.model.get('locations')[index];

			this.trigger('select', model);

			e.preventDefault();
		}

	});

}());