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

			this.$el.find('.oh-google-map-tab-trigger').click(function(e) {
				var selector = $(this).attr('href');

				t.$el.find('.oh-google-map-tab.active').removeClass('active');
				t.$el.find('.oh-google-map-tab-trigger').removeClass('active');

				t.$el.find(selector).addClass('active');
				$(this).addClass('active');

				e.preventDefault();
			});

			this.$el.find('[href="#oh-points-tab"]').click(function() {
				t.$el.find('[name="point"]').focus();				
			});

			this.$el.find('.oh-google-map-tab-trigger.active').click();
		},

		submit: function() {

		},

		cancel: function() {
			this.$el.parent().removeClass('show');
		}

	});

}());