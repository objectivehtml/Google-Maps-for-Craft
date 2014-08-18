(function() {

    Handlebars.registerHelper('date', function(timestamp, format, options) {

      if(_.isObject(format)) {
        format = timestamp;
        timestamp = new Timeblocker.Date();
      }

      var time;

      if(_.isObject(timestamp) && _.isFunction(timestamp.timestamp)) {
        time = timestamp.timestamp();
      }
      else {
        time = new Timeblocker.Date(timestamp);
      }

      if(!time.date) {
        time = new Timeblocker.Date(time); 
      }
      
      return time.format(format);

    });

}());