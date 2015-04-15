var apiurl = 'http://localhost:56037';

app.service('episodeService', function ($http) {
    this.getShows = function () {
        return $http.get(apiurl + '/api/episode');
    };

    this.addShow = function(episode) {
        return $http.post(apiurl + '/api/episode', episode);
    }

});