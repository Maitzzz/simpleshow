app.controller('showEditFormCtrl', function ($scope, $modalInstance, showService, dataFactory, formData) {
    function getShowData() {
        var showPromise = showService.getShow(showId);
        showPromise.then(function (data) {
            dataFactory.setShow(data.data);
            $scope.formData = data.data;
        });
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.show = formData;

    $scope.updateShow = function (data, id) {
        var updatePromise = showService.updateShow(data, id);

        updatePromise.then(function (data) {
            if(data.status == 201) {
                getShowData();
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

