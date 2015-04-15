var apiurl = 'http://localhost:56037';

app.service('showService', function ($http) {
   this.getData = function() {
       return $http.get(apiurl + '/api/show');
   };

    this.getShow = function (id) {
        return $http.get(apiurl + '/api/show/' + id);
    };

    this.addShow =  function (show) {
      return $http.post(apiurl + '/api/show', show);
    };

    this.removeShow = function(imdbid) {
      return $http.delete(apiurl + '/api/show/'+ imdbid);
    };

    this.updateShow = function(data ,id) {
        return $http.put(apiurl + '/api/show/' + id, data)
    }
});