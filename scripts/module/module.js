var app = angular.module('simpleshow', ['ngRoute', 'ui.bootstrap','ui.bootstrap.datetimepicker']);
app.constant('_', window._);
app.run(function ($rootScope) {
        $rootScope._ = window._;

});
