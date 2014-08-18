(function() {

    Handlebars.registerHelper('localize', function() {
        var str = Timeblocker.localize(arguments[0].replace(/\s$/, ''));

        if(arguments.length > 1) {
            for(var i = 1; i <= arguments.length; i++) {
                var x = arguments[i];

                str = str.replace('{{$'+(i-1)+'}}', x);
            }
        }

        return new Handlebars.SafeString(str);
    });

}());