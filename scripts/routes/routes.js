/**
 * Created by L2pakas on 13.04.2015.
 */
app.config(function ($routeProvider) {
   $routeProvider
       .when('/shows', {
           templateUrl: 'views/allshows.html',
           controller: 'showsController',
           className: 'allshows'
       })

       .when('/myshows', {
           templateUrl: 'views/myshows.html',
           controller: 'myShowController',
           className: 'myshows'
       })

       .when('/home', {
           templateUrl: 'views/home.html',
           controller: 'homeController',
           className: 'home'
       })

       .when('/show/:id', {
           templateUrl: 'views/show.html',
           controller: 'showController',
           className: 'show'
       })

       .when('/show/:id/:season', {
           templateUrl: 'views/showSeason.html',
           controller: 'seasonController',
           className: 'showSeason'
       })

       .when('/show/:id/:season/:episode', {
           templateUrl: 'views/episode.html',
           controller: 'episodeController',
           className: 'episode'
       })

       .when('/log-in', {
           templateUrl: 'views/log-in.html',
           controller: 'loginController',
           className: 'log-in'
       })

       .when('/welcome', {
           templateUrl: 'views/welcome.html',
           controller: 'welcomeController',
           className: 'welcome'

       })

       .when('/user', {
           templateUrl: 'views/logged-in.html',
           controller: 'userController',
           className: 'logged-in-view'
       })

       .when('/import', {
           templateUrl: 'views/import.html',
           controller: 'import',
           className: 'import'
       })

       .when('/register', {
           templateUrl: 'views/register.html',
           controller: 'registerController',
           className: 'register'
       })

       .otherwise({redirectTo: '/home'})
});