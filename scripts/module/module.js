var app = angular.module('simpleshow', ['ngRoute']);
// allow DI for use in controllers, unit tests
app.constant('_', window._);
    // use in views, ng-repeat="x in _.range(3)"
app.run(function ($rootScope) {
        $rootScope._ = window._;

});
