var app = angular.module('simpleshow', ['angular-momentjs','ngRoute', 'ui.bootstrap','ui.bootstrap.datetimepicker']);
app.constant('_', window._);
app.run(function ($rootScope) {
        $rootScope._ = window._;
});

app.run(function($http) {
    console.log('access token');
    $http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem('access_token') ;
});