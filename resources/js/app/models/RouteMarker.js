(function() {

	"use strict";

	GoogleMaps.Models.RouteMarker = GoogleMaps.Models.Marker.extend({

		originalMarker: false,

		initialize: function(options) {
			this.set('draggable', false);
			this.set('isSavedToMap', true);

			GoogleMaps.Models.Marker.prototype.initialize.call(this, options);

			this.originalMarker = $.extend(true, {}, this.toJSON());
		},

		edit: function() {	
			var view = new GoogleMaps.Views.RouteForm({
				model: this.get('route'),
				map: this.get('map')
			});

			this.get('map').showModal(view);
		},

		delete: function() {	
			var t = this;

			var view = new GoogleMaps.Views.BaseForm({
				template: GoogleMaps.Template('delete-route-form'),
				submit: function() {
					t.get('route').remove();
					t.get('map').hideModal();
					t.get('map').updateHiddenField();
				},
				cancel: function() {
					t.onCancelDeleteMarker();
				}
			});

			this.get('map').showModal(view);
		},

		toJSON: function() {
			var json = GoogleMaps.Models.Marker.prototype.toJSON.call(this);

			delete json.route;

			return json;
		},

		revert: function() {
			this.set(this.originalMarker);
			this.setPosition(new google.maps.LatLng(this.get('lat'), this.get('lng')));
		},

		onDragend: function(e, callback) {
			var t = this;

			GoogleMaps.Models.Marker.prototype.onDragend.call(this, e, function() {
				t.set('lat', e.latLng.lat());
				t.set('lng', e.latLng.lng());

				t.get('location').lat = e.latLng.lat();
				t.get('location').lng = e.latLng.lng();
				t.get('location').address = t.get('address');
				t.get('route').render();

				if(_.isFunction(callback)) {
					callback(e);
				}
			});
		}

		/*
		,

		onClick: function() {
			_.each(this.get('route').getMarkers(), function(marker) {
				marker.get('infowindow').close();
			});

			this.get('infowindow').open(this.get('map').api, this.get('api'));
		}
		*/
	});

}());