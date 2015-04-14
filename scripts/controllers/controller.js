app.controller('simpleShowController', function($scope, showService) {
    loadData();

    function loadData (){
        var promise = showService.getData();

        promise.then(function(data){
            $scope.data = data.data;
        }), function (error) {
            $log.error('Error', error)
        };


    }
});

app.controller('myShowController', function ($scope, showService) {
    loadData();

    function loadData () {
        var promise = showService.getData();

        promise.then(function (data) {
            $scope.shows = data.data;
        }), function (error) {
            $log.error('Error', error)
        };
    }
});

app.controller('showsController', function ($scope, showService) {
    loadData();

    function loadData () {
        var promise = showService.getData();

        promise.then(function (data) {
            $scope.shows = data.data;
        }), function (error) {
            $log.error('Error', error)
        };
    }
})

app.controller('homeController', function ($scope, showService) {
    $scope.message = 'Angular message!';
});

app.controller('showController', function($scope, showService, $routeParams) {
    var showId = $routeParams.id;
    $scope.showId = showId;

    var showPromise = showService.getShow(showId);
    showPromise.then(function (data) {
        $scope.show = data.data;
    });

    var episodePromise = showService.getShowEpisodes(showId);

    episodePromise.then(function (data) {
        $scope.episodes = data.data;
    })
});

app.controller('seasonController', function ($scope, showService, $routeParams) {
    var episodePromise = showService.getShowEpisodes($routeParams.id);
    episodePromise.then(function (data) {

      var episodes = _.filter(data.data, function(array){
          return array.SeasonNr == $routeParams.season;
      });
        $scope.episodes = episodes;
    });
});

