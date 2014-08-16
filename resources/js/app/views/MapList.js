(function() {

	"use strict";

	GoogleMaps.Views.MapList = GoogleMaps.Views.ItemView.extend({

		map: false,

		template: GoogleMaps.Template('map-list'),

		onRender: function() {
			var t = this;

			this.$el.find('.cancel').click(function(e) {
				t.map.hideModal();

				e.preventDefault();
			});

			this.$el.find('.undo').click(function(e) {
				var index = $(this).parent().index();
				var marker = t.model.get('markers')[index];

				marker.deleted = false;
				marker.setMap(t.map.api);

				t.map.center();
				t.map.updateHiddenField();
				t.render();
				
				e.preventDefault();
			});

			this.$el.find('.center').click(function(e) {
				var index = $(this).parent().index();
				var marker = t.model.get('markers')[index];

				t.map.api.setCenter(marker.getPosition());
				
				e.preventDefault();
			});
		}

	});

}());