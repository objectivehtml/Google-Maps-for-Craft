(function() {

    Handlebars.registerHelper('activeSegment', function(segment, match, options) {
        var _return = [];

        if(Timeblocker.Uri.segment(segment) == match) {
            return options.fn();
        }

        return false;
    });

}());