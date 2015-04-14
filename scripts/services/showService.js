var apiurl = 'http://localhost:56037';

app.service('showService', function ($http) {
   this.getData = function() {
       return $http.get(apiurl + '/api/show');
   };

    this.getShow = function (id) {
        return $http.get(apiurl + '/api/show/' + id);
    };

    this.getShowEpisodes = function (id) {
      return $http.get(apiurl + '/api/episode/' + id);
    };

});