var app = angular.module('simpleshow', ['ngRoute', 'ui.bootstrap','ui.bootstrap.datetimepicker']);
app.constant('_', window._);
app.run(function ($rootScope) {
        $rootScope._ = window._;
});

app.run(function($http) {
    $http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem('access_token') ;
});