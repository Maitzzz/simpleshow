/**
 * Created by L2pakas on 13.04.2015.
 */
app.config(function ($routeProvider) {
   $routeProvider
       .when('/shows', {
           templateUrl: 'views/shows.html',
           controller: 'showController'
       })

       .when('/home', {
           templateUrl: 'views/home.html',
           controller: 'homeController'
       })

       .otherwise({redirectTo: '/home'})
});