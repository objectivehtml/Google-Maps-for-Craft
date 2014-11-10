(function() {

	"use strict";

	GoogleMaps.Views.RouteMarkerForm = GoogleMaps.Views.MarkerForm.extend({

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

			if(this.model.get('icon')) {
				this.model.get('location').icon = this.model.get('icon');
				this.model.setIcon(this.model.get('icon'));
			}
			else {
				this.model.get('location').icon = null;
				this.model.setIcon(false);
			}

			// this.model.get('infowindow').open(this.map.api, this.model.get('api'));
		}

	});

}());