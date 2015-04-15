app.factory('dataFactory', function () {
    var shows = {};
    var show = {};
    return {
        getShows: function () {
            return shows;
        },
        setShows: function (data) {
            shows = data;
        },
        getShow: function() {
            return show;
        },
        setShow: function(data) {
            show = data;
        }

    };
});