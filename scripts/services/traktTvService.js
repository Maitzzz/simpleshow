var imageapp = 'http://188.226.165.65:8081';

app.service('traktTcService', function ($http) {
    this.getImages = function(imdbid) {
        return $http.get(imageapp + '/show/'+ imdbid);
    };


    this.getEpisodeImages = function(imdbid, season, episode) {
        console.log(imageapp + '/episode/' + imdbid + '/' + season  + '/' + episode);
        return $http.get( imageapp + '/episode/' + imdbid + '/' + season  + '/' + episode);
    };
});