(function() {

	"use strict";

	GoogleMaps.Views.MapList = GoogleMaps.Views.ItemView.extend({

		map: false,

		template: GoogleMaps.Template('map-list'),

		onRender: function() {
			var t = this;

			this.$el.find('.cancel').click(function(e) {
				t.map.hideModal(false);

				e.preventDefault();
			});

			this.$el.find('.marker-undo').click(function(e) {
				var index = $(this).parent().index();
				var marker = t.map.markers[index];

				marker.set('deleted', false);
				marker.get('api').setMap(t.map.api);

				t.model.get('markers')[index].deleted = false;

				t.map.center();
				t.map.updateHiddenField();
				t.render();
				
				e.preventDefault();
			});

			this.$el.find('.polygon-undo').click(function(e) {
				var index = $(this).parent().index();
				var polygon = t.map.polygons[index];

				polygon.set('deleted', false);
				polygon.get('api').setMap(t.map.api);

				t.model.get('polygons')[index].deleted = false;

				t.map.center();
				t.map.updateHiddenField();
				t.render();
				
				e.preventDefault();
			});

			this.$el.find('.marker-center').click(function(e) {
				var index = $(this).parent().index();
				var marker = t.map.markers[index];

				t.map.api.setZoom(14);
				t.map.api.setCenter(marker.getPosition());
				
				e.preventDefault();
			});

			this.$el.find('.polygon-center').click(function(e) {
				var index = $(this).parent().index();
				var polygon = t.map.polygons[index];

				var bounds = new google.maps.LatLngBounds();

				polygon.getPath().forEach(function(latLng) {
					bounds.extend(latLng);
				});
				
				t.map.fitBounds(bounds);

				e.preventDefault();
			});
		}

	});

}());