var traktApi = 'http://188.226.165.65:8081';

app.service('traktTcService', function ($http) {
    this.traktGetShow = function (imdbid) {
        return $http.get(traktApi + '/show/' + imdbid);
    };

    this.getEpisodeImages = function (imdbid, season, episode) {
        console.log(traktApi + '/episode/' + imdbid + '/' + season + '/' + episode);
        return $http.get(traktApi + '/episode/' + imdbid + '/' + season + '/' + episode);
    };

    this.traktGetEpisodes = function (imdbid) {
        return $http.get(traktApi + '/test/' + imdbid);
    };

});