(function() {

	"use strict";

	GoogleMaps.Models.BaseMapObject = GoogleMaps.Models.Base.extend({

		initializeApi: function() {},

		edit: function(showMapList) {},

		delete: function(showMapList) {},

		bindEvents: function() {},

		// Reset map object to original settings when an object form is cancelled
		reset: function() {},

		getInfoWindowPosition: function() {
			return this.getPosition();
		},

		buildInfoWindowContent: function() {
			var content = this.get('content');
			var _return = ['<div>', (_.isArray(content) ? content.join('') : content)];

			var t = this, latLng = this.getInfoWindowPosition();

			_return.push([
					'<div class="oh-google-map-infowindow-actions">',
						'<a href="#" class="edit">Edit</a> | ',
						'<a href="#" class="delete">Delete</a>',
					'</div>',
				'</div>'
			].join(''));

			var $content = $(_return.join(''));

			$content.find('.edit').click(function(e) {
				t.edit();

				e.preventDefault();
			});

			$content.find('.delete').click(function(e) {
				t.delete();

				e.preventDefault();
			});

			return $content.get(0);
		},

		remove: function() {
			this.get('infowindow').close();
			this.set('deleted', true);
			this.setMap(null);
		},

		onDragend: function(e, callback) {
			var t = this;

			t.set({
				lat: e.latLng.lat(),
				lng: e.latLng.lng()
			});

			this.get('map').geocoder.geocode({location: e.latLng}, function(results, status) {
				if(status == 'OK') {
					t.set('address', results[0].formatted_address);
					t.set('addressComponents', results[0].address_components);
				}
				else {
					t.set('address', null);
					t.set('addressComponents', null);
				}

				if(!t.get('customContent')) {
					if(!t.isCoordinate(t.get('address'))) {
						t.set('content', t.get('address').split(',').join('<br>'));
					}
					else {
						t.set('content', t.get('address'));
					}

					t.get('infowindow').setContent(t.buildInfoWindowContent());
				}

				t.get('map').updateHiddenField();
				
				if(_.isFunction(callback)) {
					callback(e);
				}
			});
		}

	});

}());