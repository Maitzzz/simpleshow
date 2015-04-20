/**
 * Created by L2pakas on 13.04.2015.
 */
app.config(function ($routeProvider) {
   $routeProvider
       .when('/shows', {
           templateUrl: 'views/allshows.html',
           controller: 'showsController'
       })

       .when('/myshows', {
           templateUrl: 'views/myshows.html',
           controller: 'myShowController'
       })

       .when('/home', {
           templateUrl: 'views/home.html',
           controller: 'homeController'
       })

       .when('/show/:id', {
           templateUrl: 'views/show.html',
           controller: 'showController'
       })

       .when('/show/:id/:season', {
           templateUrl: 'views/showSeason.html',
           controller: 'seasonController'
       })

       .when('/show/:id/:season/:episode', {
           templateUrl: 'views/episode.html',
           controller: 'episodeController'
       })

       .when('/log-in', {
           templateUrl: 'views/log-in.html',
           controller: 'loginController'
       })

       .when('/welcome', {
           templateUrl: 'views/welcome.html',
           controller: 'welcomeController'
       })

       .when('/user', {
           templateUrl: 'views/logged-in.html',
           controller: 'userController'
       })

       .otherwise({redirectTo: '/home'})
});