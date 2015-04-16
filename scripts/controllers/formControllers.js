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
//todo
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
                notify('success','Show '+ data.data.Name +' Added')
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
                data
                getEpisodes();
                $modalInstance.dismiss('cancel');

                notify('success','Episode '+ data.data.Name +' Added')
            }
        });
    };

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };
});

app.controller('editEpisodeAddFormCtrl', function ($scope, $modalInstance, episodeService, dataFactory, episode) {
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    //todo peaks nime muutma? siis ei muutu andmemudel.
    $scope.episode = episode;

    $scope.updateEpisode = function (data, id) {
       /* var updatePromise = episodeService.updateEpisode(data, id);

        updatePromise.then(function (data) {
            console.log(data);
            if(data.status == 204) {
                $modalInstance.dismiss('cancel');
            }
        });*/
        console.log(data)
        console.log(id);
    };


});

function notify(type, message) {
    $.notify({
        message: message
    },{
        type: type
    });
}

