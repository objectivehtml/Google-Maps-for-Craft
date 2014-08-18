(function() {

	"use strict";

	GoogleMaps.Views.MarkerForm = GoogleMaps.Views.Geocoder.extend({

		map: false,

		responseHandler: function(response) {
			var marker = this.addMarker({
				lat: response.geometry.location.lat(), 
				lng: response.geometry.location.lng(),
				address: response.formatted_address,
				addressComponents: response.address_components
			});

			this.map.closeInfowindows();

			marker.get('infowindow').open(this.map.api, marker.get('api'));
		},
		
		addMarker: function(data, isNewMarker) {
			var t = this, latLng = new google.maps.LatLng(data.lat, data.lng);

			if(_.isUndefined(isNewMarker)) {
				isNewMarker = true;
			}

			/*
			google.maps.event.addListener(marker, 'click', function() {
				t.map.closeInfoWindows();
				infowindow.open(t.map.api, marker);
			});

			google.maps.event.addListener(marker, 'dragend', function(e) {
				t.geocoder.geocode({location: e.latLng}, function(results, status) {
					var content = data.content ? data.content : data.address.split(',').join('<br>');

					if(status == 'OK') {
						marker.address = results[0].formatted_address;
						marker.addressComponents = results[0].address_components;
					}
					else {
						marker.address = '';
						marker.addressComponents = [];
					}

					if(!marker.customContent) {
						marker.content = marker.address.split(',').join('<br>');
						marker.infowindow.setContent(t.buildInfoWindowContent(marker, marker.content));
					}

					t.map.updateHiddenField();
				});
			});

			var content = data.content ? data.content : data.address.split(',').join('<br>');

			var infowindow = new google.maps.InfoWindow({
				content: this.buildInfoWindowContent(marker, content)
			});
			*/

			/*
			marker.title = data.title ? data.title : null;
			marker.content = content;
			marker.customContent = data.customContent ? true : false;
			marker.infowindow = infowindow;
			marker.address = data.address;
			marker.addressComponents = data.addressComponents;
			marker.isNew = isNewMarker ? true : false;
			*/

			/*
			if(data.locationId) {
				marker.locationId = data.locationId;
			}

			if(data.elementId) {
				marker.elementId = data.elementId;
			}
			*/

			var marker = new GoogleMaps.Models.Marker({
				map: this.map,
				api: new google.maps.Marker({
					position: latLng,
					draggable: true
				}),
				title: data.title ? data.title : null,
				content: data.content ? data.content : data.address.split(',').join('<br>'),
				customContent: data.customContent ? true : false,
				address: data.address,
				addressComponents: data.addressComponents,
				// infowindow: infowindow,
				isNew: isNewMarker ? true : false,
				icon: data.icon ? data.icon : null,
				elementId: data.elementId ? data.elementId : null,
				locationId: data.locationId ? data.locationId : null
			});

			this.map.markers.push(marker);

			this.map.center();
			this.map.hideModal();
			this.map.updateHiddenField();

			return marker;
		},

		cancel: function() {
			this.map.hideModal();
		}

	});

}());