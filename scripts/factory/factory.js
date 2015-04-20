app.factory('dataFactory', function () {
    var shows = {};
    var show = {};
    var episodes = {};
    var episode = {};
    var myshows = {};
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
        },
        setEpisode: function (data) {

            episode = data;
        },
        getEpisode: function () {
            return episode;
        },
        getMyShows: function () {
            return myshows;
        },
        setMyShows: function(data) {
            myshows = data;
        }
    };
});