var app = angular.module('simpleshow', ['angular-momentjs','ngRoute', 'ui.bootstrap','ui.bootstrap.datetimepicker']);
app.constant('_', window._);
app.run(function ($rootScope) {
        $rootScope._ = window._;
});

app.run(function($http) {
    console.log('access token');
    $http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem('access_token') ;
});

app.filter('listfilter',[ function () {
    return function(items, searchText) {
        var filtered = [];

        if(typeof items != 'undefined' && typeof searchText != 'undefined' && searchText.length > 2) {
            searchText = searchText.toLowerCase();
            angular.forEach(items, function(item) {
               if( item.Name.toLowerCase().indexOf(searchText) >= 0 ) filtered.push(item);
            });
            return filtered;
        }
        return items;
    };
}]);
