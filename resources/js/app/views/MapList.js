(function() {

	"use strict";

	GoogleMaps.Views.MapList = GoogleMaps.Views.ItemView.extend({

		map: false,

		template: GoogleMaps.Template('map-list'),

		initialize: function(options) {
			GoogleMaps.Views.ItemView.prototype.initialize.call(this, options);

			var t = this;

			if(this.getOption('showButtons')) {
				_.each(this.getOption('showButtons'), function(button) {
					t.model.set('show'+(button.charAt(0).toUpperCase() + button.slice(1)), true);
				});
			}
		},

		onRender: function() {
			var t = this;

			this.$el.find('.cancel').click(function(e) {
				t.map.hideModal(false);

				e.preventDefault();
			});

			this.$el.find('.edit').click(function(e) {
				var prop = $(this).data('property');
				var index = $(this).parents('li').index();
				var data = t.map[prop][index];

				data.edit(true);

				e.preventDefault();
			});

			this.$el.find('.delete').click(function(e) {
				var prop = $(this).data('property');
				var index = $(this).parents('li').index();
				var data = t.map[prop][index];

				data.delete(true);

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

			this.$el.find('.route-undo').click(function(e) {
				var index = $(this).parent().index();
				var route = t.map.routes[index];

				route.set('deleted', false);
				route.get('api').setMap(t.map.api);

				t.model.get('routes')[index].deleted = false;

				_.each(t.model.get('routes')[index].markers, function(marker) {
					marker.deleted = false;
					marker.setMap(t.map.api);
				});

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

			this.$el.find('.polyline-undo').click(function(e) {
				var index = $(this).parent().index();
				var polyline = t.map.polylines[index];

				polyline.set('deleted', false);
				polyline.get('api').setMap(t.map.api);

				t.model.get('polylines')[index].deleted = false;

				t.map.center();
				t.map.updateHiddenField();
				t.render();
				
				e.preventDefault();
			});

			this.$el.find('.circle-undo').click(function(e) {
				var index = $(this).parent().index();
				var circle = t.map.circles[index];

				circle.set('deleted', false);
				circle.get('api').setMap(t.map.api);

				t.model.get('circles')[index].deleted = false;

				t.map.center();
				t.map.updateHiddenField();
				t.render();
				
				e.preventDefault();
			});

			this.$el.find('.overlay-undo').click(function(e) {
				var index = $(this).parent().index();
				var overlay = t.map.groundOverlays[index];

				overlay.set('deleted', false);
				overlay.get('api').setMap(t.map.api);

				t.model.get('groundOverlays')[index].deleted = false;

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

			this.$el.find('.route-center').click(function(e) {
				var index = $(this).parent().index();
				var route = t.map.routes[index];

				var bounds = new google.maps.LatLngBounds();

				_.each(route.getLocations(), function(location) {
					bounds.extend(new google.maps.LatLng(location.lat, location.lng));
				});

				t.map.fitBounds(bounds);

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

			this.$el.find('.polyline-center').click(function(e) {
				var index = $(this).parent().index();
				var polyline = t.map.polylines[index];

				var bounds = new google.maps.LatLngBounds();

				polyline.getPath().forEach(function(latLng) {
					bounds.extend(latLng);
				});
				
				t.map.fitBounds(bounds);

				e.preventDefault();
			});

			this.$el.find('.circle-center').click(function(e) {
				var index = $(this).parent().index();
				var circle = t.map.circles[index];

				t.map.fitBounds(circle.getBounds());

				e.preventDefault();
			});

			this.$el.find('.overlay-center').click(function(e) {
				var index = $(this).parent().index();
				var overlay = t.map.groundOverlays[index];

				t.map.fitBounds(overlay.getBounds());

				e.preventDefault();
			});
		}

	});

}());