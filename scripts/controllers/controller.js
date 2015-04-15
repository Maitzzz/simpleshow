app.controller('simpleShowController', function ($scope, showService) {
    loadData();

    function loadData() {
        var promise = showService.getData();

        promise.then(function (data) {
            $scope.data = data.data;
        }), function (error) {
            $log.error('Error', error)
        };


    }
});

app.controller('myShowController', function ($scope, showService) {
    loadData();

    function loadData() {
        var promise = showService.getData();

        promise.then(function (data) {
            $scope.shows = data.data;
        }), function (error) {
            $log.error('Error', error)
        };
    }
});

app.controller('showsController', function ($scope, showService, $modal, dataFactory) {
    loadData();
    function loadData() {
        var promise = showService.getData();
        promise.then(function (data) {
            dataFactory.setShows(data.data);
        }), function (error) {
            $log.error('Error', error)
        };
    }

    $scope.$watch(function () {
        return dataFactory.getShows();
    }, function (data, oldValue) {
        if (data) {
            $scope.shows = data;
        }
    });

    $scope.open = function (size) {
        var modalInstance = $modal.open({
            templateUrl: 'views/forms/show.html',
            controller: 'showFormCtrl',
            size: size
        });
    };

    $scope.removeShow = function (imdbid) {
        var deletePromise = showService.removeShow(imdbid);
        deletePromise.then(function (data) {
            loadData();
        });
    };
});

app.controller('homeController', function ($scope, showService) {
    $scope.message = 'Angular message!';
});

app.controller('showController', function ($scope, showService, $routeParams, $modal, dataFactory, episodeService) {
    var showId = $routeParams.id;
    $scope.showId = showId;
    getEpisodes();
    function getEpisodes() {
        var episodePromise = episodeService.getShowEpisodes(showId);
        episodePromise.then(function (data) {
            dataFactory.setEpisodes(data.data);
        });
    }

    getShowData();
    function getShowData() {
        var showPromise = showService.getShow(showId);
        showPromise.then(function (data) {
            dataFactory.setShow(data.data);
            $scope.formData = data.data;
        });
    }

    $scope.$watch(function () {
        return dataFactory.getShow();
    }, function (data, oldValue) {
        if (data) {
            $scope.show = data;
        }
    });

    $scope.$watch(function () {
        return dataFactory.getEpisodes();
    }, function (data, oldValue) {
        if (data) {
            $scope.episodes = data;
        }
    });


    $scope.open = function (size) {
        var editShowModalInstance = $modal.open({
            templateUrl: 'views/forms/editshow.html',
            controller: 'showEditFormCtrl',
            size: size,
            resolve: {
                formData: function () {
                    return $scope.formData;
                }
            }
        });
    };

    $scope.addShowModal = function (size) {
        var addShowModalInstance = $modal.open({
            templateUrl: 'views/forms/episode.html',
            controller: 'episodeAddFormCtrl',
            size: size,
            resolve: {
                showId: function () {
                    return $scope.showId;
                }
            }
        });
    };


    //Episodes stuff

    $scope.$watch(function () {
        return dataFactory.getEpisodes();
    }, function (data, oldValue) {
        if (data) {
            $scope.episodes = data;
        }
    });

    $scope.removeEpisode = function (imdbId) {
        var deletePromise = episodeService.removeEpisode(imdbId);
        deletePromise.then(function (data) {
            console.log(data)
            if(data.status = 204) {
                getEpisodes();
            }
        })
    }
});

app.controller('seasonController', function ($scope, showService, $routeParams, episodeService) {
    var episodePromise = episodeService.getShowEpisodes($routeParams.id);
    episodePromise.then(function (data) {

        var episodes = _.filter(data.data, function (array) {
            return array.SeasonNr == $routeParams.season;
        });
        $scope.episodes = episodes;
    });

});

