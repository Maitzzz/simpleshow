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

app.controller('showController', function ($scope, showService) {
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

app.controller('homeController', function ($scope, showService) {
    $scope.message = 'Angular message!';
})
