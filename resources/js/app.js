var GoogleMaps = {
	Views: {},
	Models: {}
};

(function() {
	
	"use strict";

	Backbone.Marionette.TemplateCache.prototype.compileTemplate = function(rawTemplate) {
        return Handlebars.compile(rawTemplate);
    };

	GoogleMaps.Template = function(name) {
		var template;

		if(Handlebars.templates[name]) {
			return Handlebars.templates[name];
		}
		else {
			return false;
		}
	};

	GoogleMaps.addScript = function(url, callback) {
		if(typeof google === "undefined") {
		    var script = document.createElement('script');
		    if(callback) script.onload = callback;
		    script.type = 'text/javascript';
		    script.src = url;
		    document.body.appendChild(script);
		}
		else {
			GoogleMaps.googleApiCallback();
		}
	};

	GoogleMaps.Fieldtype = function($el, options) {

		var App = new Backbone.Marionette.Application();

		App.options = options;

		App.addRegions({
			content: $el
		});
	
		App.addInitializer(function() {
			var map = new GoogleMaps.Views.Map({
				fieldname: options.fieldname,
				savedData: options.savedData
			});

			App.content.show(map);
		});

		App.start();
	};


}());

/*

(function() {

	

	GoogleMaps.App = new Backbone.Marionette.Application();
	
	GoogleMaps.App.addRegions({
		content: ".oh-google-maps-wrapper"
	});

	GoogleMaps.App.start();

}());
*/
(function() {

	"use strict";

	GoogleMaps.Views.ItemView = Backbone.Marionette.ItemView.extend({

		initialize: function(options) {	
			Backbone.Marionette.ItemView.prototype.initialize.call(this, options);

			if(this.options) {
				this.fill(this.options);
			}
		},

		fill: function(options) {
			_.extend(this, options);
		}

	});

}());
(function() {

	"use strict";

	GoogleMaps.Views.LayoutView = Backbone.Marionette.LayoutView.extend({

		initialize: function(options) {	
			Backbone.Marionette.LayoutView.prototype.initialize.call(this, options);
		
			if(this.options) {
				this.fill(this.options);
			}
		},

		fill: function(options) {
			_.extend(this, options);
		}

	});

}());
(function() {

	"use strict";

	GoogleMaps.Views.BaseForm = GoogleMaps.Views.ItemView.extend({

		className: 'oh-google-map-form',

		tagName: 'form',

		onRender: function() {
			var t = this;

			this.$el.off('submit').submit(function(e) {
				t.submit();

				e.preventDefault();
			});

			this.$el.find('.cancel').click(function(e) {
				t.cancel();

				e.preventDefault();
			});
		},

		submit: function() {

		},

		cancel: function() {
			this.$el.parent().removeClass('show');
		}

	});

}());
(function() {

	"use strict";

	GoogleMaps.Views.Button = GoogleMaps.Views.ItemView.extend({

		className: 'oh-google-map-control-button',

		tagName: 'a'

	});

}());
(function() {

	"use strict";

	GoogleMaps.Views.ButtonBar = GoogleMaps.Views.ItemView.extend({

		className: 'oh-google-map-button-bar',

		template: GoogleMaps.Template('button-bar'),

		initialize: function(options) {
			if(!this.model) {
				this.model = new Backbone.Model();
			}

			Backbone.Marionette.ItemView.prototype.initialize.call(this, options);
		
			if(this.options.buttons) {
				this.model.set('buttons', this.options.buttons);
			}
		},

		onRender: function() {
			var t = this;

			if(this.options.buttons) {
				_.each(this.options.buttons, function(button, i) {
					if(button.click) {
						t.$el.find('a').eq(i).click(function(e) {
							button.click.call(this, e);
						});
					}
				});
			}
		}

	});

}());
(function() {

	"use strict";

	GoogleMaps.Views.Geocoder = GoogleMaps.Views.BaseForm.extend({

		className: 'oh-google-map-form oh-google-map-geocoder',

		template: GoogleMaps.Template('geocoder'),

		api: false,

		lastResponse: false,

		initialize: function(options) {
			GoogleMaps.Views.BaseForm.prototype.initialize.call(this, options);

			if(!this.model) {
				this.model = new Backbone.Model();
			}

 			this.api = new google.maps.Geocoder();
		},

		onShow: function() {
			var t = this;

			setTimeout(function() {
				t.$el.find('input').focus();
			}, 250);
		},

		onRender: function() {
			GoogleMaps.Views.BaseForm.prototype.onRender.call(this);

			var t = this;

			this.$el.find('.oh-google-map-highlight-list a').click(function(e) {
				var response = t.model.get('locations')[$(this).parent().index()];

				t.responseHandler(response);
				t.lastResponse = response;

				e.preventDefault();
			});
		},

		responseHandler: function(location) {
			
		},

		submit: function() {
			var t = this;

			this.model.set('location', this.getLocation());
 
			this.geocode(this.getLocation(), function(results, status) {
				if(status == "OK") {
					if(results.length > 1) {
						t.model.set('locations', results);
						t.render();
					}
					else {
						t.responseHandler(results[0]);
						t.lastResponse = results[0];
					}
				}
			});
		},

		geocode: function(location, callback) {
			if(_.isString(location)) {
				location = {'address': location};
			}

			this.api.geocode(location, function(results, status) {
				if(_.isFunction(callback)) {
					callback(results, status);
				};
			});
		},

		getLocation: function() {
			return this.$el.find('input').val();
		},

		setLocation: function(location) {
			this.$el.find('input').val(location);
		}

	});

}());
(function() {

	"use strict";

	GoogleMaps.Views.Map = GoogleMaps.Views.LayoutView.extend({

		template: GoogleMaps.Template('map'),

  		api: false,

  		fieldname: false,

  		geocoder: false,

  		mapOptions: {
  			zoom: 8,
  			disableDefaultUI: true
  		},

  		regions: {
  			buttonBar: '.oh-google-map-controls',
  			modal: '.oh-google-map-window' 
  		},

  		markers: [],

  		className: 'oh-google-map-relative',

  		initialize: function(options) {
  			this.markers = [];

  			GoogleMaps.Views.LayoutView.prototype.initialize.call(this, options);

  			if(!this.model) {
  				this.model = new Backbone.Model();
  			}

  			this.model.set('fieldname', this.fieldname);
  			this.model.set('savedData', this.savedData);
  		},

  		updateHiddenField: function() {
  			var data = {
  				markers: []
  			};

  			_.each(this.markers, function(marker, i) {
  				var obj = {
  					lat: marker.getPosition().lat(),
  					lng: marker.getPosition().lng(),
  					title: marker.title,
  					content: marker.content,
  					customContent: marker.customContent ? true : false,
  					address: marker.address,
  					addressComponents: marker.addressComponents,
  					isNew: marker.isNew ? true : false
  				};

  				if(marker.deleted) {
  					obj.deleted = true;
  				}

  				if(marker.elementId) {
  					obj.elementId = marker.elementId;
  				}

  				if(marker.locationId) {
  					obj.locationId = marker.locationId;
  				}

  				data.markers.push(obj);
  			});

  			console.log(data);

  			this.$el.find('.field-data').val(JSON.stringify(data));
  		},

		onRender: function() {
 			var t = this;

 			this.geocoder = new google.maps.Geocoder();
	 		
 			this.api = new google.maps.Map(this.getCanvas(), this.getMapOptions());

 			this.buildButtonBar();

 			this.$el.find('.oh-google-map-zoom-in').click(function(e) {
 				t.zoomIn();

 				e.preventDefault();
 			});

 			this.$el.find('.oh-google-map-zoom-out').click(function(e) {
 				t.zoomOut();

 				e.preventDefault();
 			});

 			if(this.savedData) {
	 			if(this.savedData.markers) {
		 			_.each(this.savedData.markers, function(marker) {
		 				t.addMarker(marker, marker.isNew);
		 			});
		 		}
		 	}
		},

		buildButtonBar: function() {
			var t = this;

			this.buttonBar.show(new GoogleMaps.Views.ButtonBar({
 				buttons: [{
 					icon: 'list',
 					click: function(e) {
 						var view = new GoogleMaps.Views.MapList({
 							map: t,
 							model: new Backbone.Model({
 								markers: t.markers
 							})
 						});

 						t.showModal(view);

 						e.preventDefault();
 					}
 				},{
 					name: 'Add Marker',
 					click: function(e) {
 						var view = new GoogleMaps.Views.Geocoder({
							cancel: function() {
								t.hideModal(this);
							},
							responseHandler: function(response) {
								console.log(response);

								var marker = t.addMarker({
									lat: response.geometry.location.lat(), 
									lng: response.geometry.location.lng(),
									address: response.formatted_address,
									addressComponents: response.address_components
								});

								t.closeInfoWindows();

								marker.infowindow.open(t.api, marker);
							}
 						});

 						t.showModal(view);

 						e.preventDefault();
 					}
 				}]
 			}));
		},

		closeInfoWindows: function() {
			_.each(this.markers, function(marker) {
				marker.infowindow.close();
			});
		},

		showModal: function(view) {
			this.modal.show(view);
			this.modal.$el.addClass('show');
			this.buttonBar.$el.addClass('hide');
		},

		hideModal: function(view) {
			this.modal.$el.removeClass('show');
			this.buttonBar.$el.removeClass('hide');
			this.center();
		},

		zoomIn: function() {
			this.setZoom(this.getZoom() + 1);
		},

		zoomOut: function() {
			this.setZoom(this.getZoom() - 1);
		},

		getZoom: function() {
			return this.api.getZoom();
		},

		setZoom: function(x) {
			if(x < 0) {
				x = 0;
			}

			if(x > 20) {
				x = 20;
			}

			this.api.setZoom(x);
		},

		buildInfoWindowContent: function(marker, content) {
			var _return = ['<div>', (_.isArray(content) ? content.join('') : content)];
			var t = this, latLng = marker.getPosition();

			_return.push([
					'<div class="oh-google-map-infowindow-actions">',
						'<a href="#" class="edit">Edit</a> | ',
						'<a href="#" class="delete">Delete</a>',
					'</div>',
				'</div>'
			].join(''));

			var $content = $(_return.join(''));

			$content.find('.edit').click(function(e) {

				t.api.setCenter(latLng);
				t.api.panBy(0, -150);

				var view = new GoogleMaps.Views.BaseForm({
					model: new Backbone.Model({
						title: marker.title,
						content: marker.content
					}),
					template: GoogleMaps.Template('edit-marker-form'),								
					onShow: function() {
						var t = this;

						setTimeout(function() {
							t.$el.find('input').focus();
						}, 250);
					},
					submit: function() {
						marker.title = t.$el.find('input').val();
						marker.content = t.$el.find('textarea').val();
						marker.customContent = true;

						marker.infowindow.setContent(t.buildInfoWindowContent(marker, marker.content));

						t.hideModal();
						t.updateHiddenField();
					},
					cancel: function() {
						t.hideModal();
					}
				});

				t.showModal(view);

				e.preventDefault();
			});

			$content.find('.delete').click(function(e) {
				t.api.setCenter(latLng);
				t.api.panBy(0, -150);

				var view = new GoogleMaps.Views.BaseForm({
					template: GoogleMaps.Template('delete-marker-form'),
					submit: function() {
						marker.setMap(null);
						marker.deleted = true;

						t.hideModal();
						t.updateHiddenField();
					},
					cancel: function() {
						t.hideModal();
					}
				});

				t.showModal(view);

				e.preventDefault();
			});

			return $content.get(0);
		},

		addMarker: function(data, isNewMarker) {
			var t = this, latLng = new google.maps.LatLng(data.lat, data.lng);

			if(_.isUndefined(isNewMarker)) {
				isNewMarker = true;
			}

			var marker = new google.maps.Marker({
				map: this.api,
				position: latLng,
				draggable: true,
				customContent: false
			});

			google.maps.event.addListener(marker, 'click', function() {
				t.closeInfoWindows();
				infowindow.open(t.api, marker);
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

					t.updateHiddenField();
				});
			});

			var content = data.content ? data.content : data.address.split(',').join('<br>');

			var infowindow = new google.maps.InfoWindow({
				content: this.buildInfoWindowContent(marker, content)
			});

			marker.title = data.title ? data.title : null;
			marker.content = content;
			marker.customContent = data.customContent ? true : false;
			marker.infowindow = infowindow;
			marker.address = data.address;
			marker.addressComponents = data.addressComponents;
			marker.isNew = isNewMarker ? true : false;

			if(data.locationId) {
				marker.locationId = data.locationId;
			}

			if(data.elementId) {
				marker.elementId = data.elementId;
			}
	
			this.markers.push(marker);

			this.center();
			this.hideModal();
			this.updateHiddenField();

			return marker;
		},

		center: function() {
			var bounds = new google.maps.LatLngBounds();
			var boundsChanged = false;

			_.each(this.markers, function(marker) {
				if(!marker.deleted) {
					bounds.extend(marker.getPosition());
					boundsChanged = true;
				}
			});

			if(boundsChanged) {
				this.api.fitBounds(bounds);
			}
		},

		getCanvas: function() {
			return this.$el.find('.oh-google-map').get(0);
		},

		getMapOptions: function() {
			return _.extend({
	    		center: new google.maps.LatLng(0, 0)
	  		}, this.mapOptions);
		}

	});

}());
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
(function() {

	"use strict";

	/*
	GoogleMaps.App.addInitializer(function() {

		GoogleMaps.addScript = function(url, callback) {
			if(typeof google === "undefined") {
			    var script = document.createElement('script');
			    if(callback) script.onload = callback;
			    script.type = 'text/javascript';
			    script.src = url;
			    document.body.appendChild(script);
			}
			else {
				GoogleMaps.googleApiCallback();
			}
		};

		GoogleMaps.googleApiCallback = function() {
			var map = new GoogleMaps.Views.Map();

			GoogleMaps.App.content.show(map);
		};

		$(document).ready(function() {
			GoogleMaps.addScript('https://maps.googleapis.com/maps/api/js?&sensor=false&callback=GoogleMaps.googleApiCallback');
		});
		
	});
	*/

}());