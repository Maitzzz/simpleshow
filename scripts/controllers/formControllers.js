var NO_IMAGE = 'files/image/noimage.png';
app.controller('showEditFormCtrl', function ($scope, $modalInstance, showService, dataFactory, formData) {
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    function loadShow() {
        var showPromise = showService.getShow(formData.ImdbID);
        showPromise.then(function (data) {
            dataFactory.setShow(data.data);
        });
    }

    $scope.show2 = formData;

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
        if (_.has(show, 'ShowImage')) {
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
        } else {
            var ImdbID = traktTcService.getImages(show.ImdbID);
            ImdbID.then(function (data) {
                if (data.data.message != false) {
                    show.ShowImage = data.data.images.poster.medium;
                } else {
                    show.ShowImage = NO_IMAGE;
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
            })
        }
    };
});

app.controller('episodeAddFormCtrl', function ($scope, $modalInstance, episodeService, dataFactory, traktTcService, ep) {
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
        console.log(episode)
        var episodeImage = traktTcService.getEpisodeImages(episode.ShowImdbId, episode.SeasonNr, episode.EpisodeNr);
        episodeImage.then(function (imageData) {
            if (!_.has(episode, 'EpisodeImage')) {
                if(_.has(imageData.data, 'images')) {
                    episode.EpisodeImage = imageData.data.images.screenshot.medium;
                } else {
                    episode.EpisodeImage = NO_IMAGE;
                }
            }

            episode.EpImdbID = imageData.data.ids.imdb;
            var addEpisodePromise = episodeService.addShow(episode);
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
        });
    };

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
});

function notify(type, message) {
    $.notify({
        message: message
    }, {
        type: type
    });
}
