var apiurl = 'http://localhost:56037';

app.service('episodeService', function ($http) {
    this.getShows = function () {
        return $http.get(apiurl + '/api/episode');
    };

    this.addEpisode = function(episode) {
        return $http.post(apiurl + '/api/episode', episode);
    };

    this.getShowEpisodes = function (id) {
        return $http.get(apiurl + '/api/episode/' + id);
    };

    this.removeEpisode = function (id) {

        console.log(apiurl + '/api/episode/' + id);
        return $http.delete(apiurl + '/api/episode/' + id)
    };

    this.getEpisodeById = function (id) {
        return $http.get(apiurl + '/api/episode/' + id);
    };

    this.updateEpisode = function (data, id ) {
        return $http.put(apiurl + '/api/episode/' + id, data);
    };

    this.getEpisodeByImdbId = function(id) {
      return $http.get(apiurl + '/api/episode/imdbid/' +id);
    };

});