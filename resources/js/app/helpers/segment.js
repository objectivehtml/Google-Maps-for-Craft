(function() {

    Handlebars.registerHelper('segment', function(segment) {
        return Timeblocker.Uri.segment(segment);
    });

}());

