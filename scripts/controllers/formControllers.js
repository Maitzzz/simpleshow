app.controller('showEditFormCtrl', function ($scope, $modalInstance, showService, dataFactory, formData) {
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.show = formData;

    $scope.updateShow = function (data, id) {
        var updatePromise = showService.updateShow(data, id);

        updatePromise.then(function (data) {
            console.log(data);
            if(data.status == 204) {
                $modalInstance.dismiss('cancel');
            }
        });
    };

});

//todo separate controller file
app.controller('showFormCtrl', function ($scope, $modalInstance, showService, dataFactory) {
    function loadData() {
        var promise = showService.getData();
        promise.then(function (data) {
            dataFactory.setShows(data.data);
        }), function (error) {
            $log.error('Error', error)
        };
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.addShow = function (show) {
        var postShow = showService.addShow(show);
        postShow.then(function (data) {
            if (data.status == 201) {
                loadData();
                $modalInstance.dismiss('cancel');
            }
        }), function (error) {
            console.error(error);
        };
    };
});

app.controller('episodeAddFormCtrl', function ($scope, $modalInstance, episodeService, dataFactory, showId) {
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    function getEpisodes() {
        var episodePromise = episodeService.getShowEpisodes(showId);
        episodePromise.then(function (data) {
            dataFactory.setEpisodes(data.data);
        });
    }

    $scope.addEpisode = function (episode) {
        episode.ShowImdbId = showId;
        console.log(episode);
        var addEpisodePromise = episodeService.addShow(episode);
        addEpisodePromise.then(function(data) {
            if(data.status == 201) {
                getEpisodes();
                $modalInstance.dismiss('cancel');
            }
        });
    };

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };
});
