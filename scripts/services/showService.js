var apiurl = 'http://localhost:56037';

app.service('showService', function ($http) {
   this.getData = function() {
       return $http.get(apiurl + '/api/show');
   }
});