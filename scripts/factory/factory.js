app.factory('dataFactory', function () {
    var shows = {};
    var show = {};
    var episodes = {};
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
        },
        setEpisodes: function (data) {
            episodes = data;
        },
        getEpisodes: function () {
            return episodes;
        }

    };
});