app.factory('dataFactory', function () {
    var shows = {};
    var show = {};
    var episodes = {};
    var episode = {};
    var myshows = {};
    var loader;
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
        },
        setLoader: function (data) {
            console.log('=====================')
            console.log(data);
            loader = data;
        },
        getLoader: function() {
            return loader;
        }

    };
});