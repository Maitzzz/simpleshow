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

app.controller('episodeAddFormCtrl', function ($scope, $modalInstance, episodeService, dataFactory) {
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    function loadEpisodes() {
        var promise = episodeService.getEpisodes();
        promise.then(function (data) {
            dataFactory.setEpisodes(data.data);
        }), function (error) {
            $log.error('Error', error)
        };
    }

    var addShowPromise = episodeService.addShow(show);

    addShowPromise.then(function(data) {
        if(data.status == 201) {
            loadEpisodes();
           $modalInstance.dismiss('cancel');
        }
    });



});
