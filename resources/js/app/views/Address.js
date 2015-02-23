(function() {

	"use strict";

	GoogleMaps.Views.Address = GoogleMaps.Views.LayoutView.extend({

  		regions: {
  			modal: '.oh-google-map-window' 
  		},

		template: GoogleMaps.Template('address-fields'),

		initialize: function(options) {
			GoogleMaps.Views.LayoutView.prototype.initialize.call(this, options);

			if(!this.model && this.getOption('savedData')) {
				this.model = new GoogleMaps.Models.Address(this.getOption('savedData'));
			}

			if(this.getOption('fieldname')) {
				this.model.set('fieldname', this.getOption('fieldname'));
			}
		},

		onDomRefresh: function() {
			var t = this, value = false, geocoderResults = false, modal = false;

			this.$el.find('.view-all').click(function(e) {
				t.geocode(function(results, status) {
					var list = new GoogleMaps.Views.GeocoderList({
						model: new GoogleMaps.Models.Base({
							locations: results
						})
					});

					list.render();
 					
					list.$el.find('.modal-cancel').click(function(e) {
						modal.hide();
					});

 					modal = new Garnish.Modal(list.$el)

					list.on('select', function(model) {
						t.setLatitude(model.geometry.location.lat());
						t.setLongitude(model.geometry.location.lng());
							
						modal.hide();
					});
				});

				e.preventDefault();
			});

			this.$el.find('input').focus(function() {
				value = $(this).val();
			});

			this.$el.find('input').blur(function() {
				if(value != $(this).val()) {
					t.geocode(function(results, status) {
						if(status == google.maps.GeocoderStatus.OK) {
							geocoderResults = results;

							t.setLatitude(results[0].geometry.location.lat());
							t.setLongitude(results[0].geometry.location.lng());
							t.setResponse(results[0]);

							t.$el.find('.view-all').removeClass('hidden');
						}
						else {
							t.$el.find('.view-all').addClass('hidden');
						}
					});
				}
			});

			if(this.hasAddress()) {
				this.$el.find('.view-all').removeClass('hidden');
			}
		},

		getLatitude: function() {
			return this.$el.find('.latitude').val();
		},

		setLatitude: function(latitude) {
			this.$el.find('.latitude').val(latitude);
		},

		getLongitude: function() {
			return this.$el.find('.longitude').val();
		},

		setLongitude: function(latitude) {
			this.$el.find('.longitude').val(latitude);
		},

		getResponse: function() {
			return this.$el.find('.response').val();
		},

		setResponse: function(response) {
			if(!_.isString(response)) {
				response = JSON.stringify(response);
			}

			this.$el.find('.response').val(response).html(response);
		},

		hasAddress: function() {
			return this.getAddress() != '';
		},

		getAddress: function() {
			return [
				this.$el.find('.line1').val(),
				this.$el.find('.line2').val(),
				this.$el.find('.city').val(),
				this.$el.find('.state').val(),
				this.$el.find('.zipcode').val(),
				this.$el.find('.country').val()
			].join(' ').trim();
		},

		geocode: function(callback) {			
 			var api = new google.maps.Geocoder();
 			var address = this.getAddress();

			api.geocode({address: address}, function(results, status) {
				if(_.isFunction(callback)) {
					callback(results, status);
				};
			});
		},

		showModal: function(view) {
			this.modal.empty();
			this.modal.show(view);
			this.modal.$el.addClass('show');
		},

		hideModal: function(center) {
			this.modal.$el.removeClass('show');
			this.modal.empty();
		}

	});

}());