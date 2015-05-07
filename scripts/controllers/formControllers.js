var NO_IMAGE = 'files/image/noimage.png';
app.controller('showEditFormCtrl', function ($scope, $modalInstance, showService, dataFactory, formData) {
    console.log(formData)
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    function loadShow() {
        var showPromise = showService.getShow(formData.ImdbID);
        showPromise.then(function (data) {
            dataFactory.setShow(data.data);
        });
    }

    $scope.show = formData;

    $scope.updateShow = function (data, id) {
        var updatePromise = showService.updateShow(data, id);

        updatePromise.then(function (data) {
            if (data.status == 204) {
                loadShow();
                $modalInstance.dismiss('cancel');
            }
        });
    };
});

//todo separate controller file
app.controller('showFormCtrl', function ($scope, $modalInstance, showService, dataFactory, traktTcService) {
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

    //todo add controll if data is set
    $scope.addShow = function (show) {
        var error = [];

        if(!_.has(show, 'Name')) {
            error.push('Name');
        }

        if(!_.has(show, 'Description')) {
            error.push('Description')
        }

        if(!_.has(show, 'ImdbID')) {
            error.push('ImdbID');
        }

        if(!_.has(show, 'ShowImage')) {
            error.push('ShowImage');
            //todo Add NO_IMAGE or form error? Validate url perhaps ?
        }

        if(!_.has(show, 'Rating')) {
            error.push('Rating');
        }

        if(error.length > 0) {
            notify('danger', 'Form error, check inputs!');
            return;
        }

        var postShow = showService.addShow(show);
        postShow.then(function (data) {
            if (data.status == 201) {
                loadData();
                $modalInstance.dismiss('cancel');
                notify('success', 'Show ' + data.data.Name + ' Added')
            }

            if (data.statusText == 'Conflict') {
                $modalInstance.dismiss('cancel');
                notify('danger', data.data)
            }
        }), function (error) {
            console.error(error);
        };
    };
});

app.controller('episodeAddFormCtrl', function ($scope, $modalInstance, episodeService, dataFactory, traktTcService, ep, $moment) {
    $scope.show = ep;
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    function getEpisodes() {
        var episodePromise = episodeService.getShowEpisodes(ep.ShowImdbId);
        episodePromise.then(function (data) {
            dataFactory.setEpisodes(data.data);
        });
    }

    $scope.addEpisode = function (episode) {
        var error = [];
        episode.ShowImdbId = ep.ShowImdbId;
        if (!_.has(episode, 'EpisodeImage')) {
            episode.EpisodeImage = NO_IMAGE_EP;
        }

        if(!_.has(episode, 'Name')) {
            error.push('Name');
        }

        if(!_.has(episode,'Description')) {
            error.push('Description');
        }

        if(!_.has(episode, 'EpImdbID')) {
            error.push('EpImdbID');
        }

        if(!_.has(episode,'SeasonNr' )) {
            error.push('SeasonNr');

        }
        if(!_.has(episode,'Date' )) {
            error.push('Date');

        }
        if(!_.has(episode,'Rating' )) {
            error.push('Rating');
        }

        if(error.length > 0) {
            notify('danger', 'Check input');
            return;
        }

        //episode.Date = $moment(episode.Date).format('DD/MM/YYYY');
        //console.log($.date('dd/mm/yyy', episode.Date));
        console.log(episode)
        var addEpisodePromise = episodeService.addEpisode(episode);
        addEpisodePromise.then(function (data) {
            if (data.status == 201) {
                getEpisodes();
                $modalInstance.dismiss('cancel');
                $scope.episode = [];
                notify('success', 'Episode ' + data.data.Name + ' Added')
            }

            if (data.statusText == 'Conflict') {
                $modalInstance.dismiss('cancel');
                notify('danger', data.data)
            }
        });
    };
    //01/08/2008
    $scope.formats = ['dd/MM/yyyy'];

    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };
});

app.controller('editEpisodeFormCtrl', function ($scope, $modalInstance, episodeService, dataFactory, episode) {
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    function loadData() {
        var ep = episodeService.getEpisodeByImdbId(episode.EpImdbId);
        ep.then(function (data) {
            dataFactory.setEpisode(data.data)
        });
    }

    $scope.episode = episode;

    $scope.updateEpisode = function (data, id) {
        var updatePromise = episodeService.updateEpisode(data, id);
        updatePromise.then(function (data) {
            if (data.status == 204) {
                loadData();
                $modalInstance.dismiss('cancel');
            }
        });
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];

    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };
});
