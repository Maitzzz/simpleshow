var NO_IMAGE = 'files/image/noimage.png';
app.controller('showEditFormCtrl', function ($scope, $modalInstance, showService, dataFactory, formData) {
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.show = formData;

    $scope.updateShow = function (data, id) {
        var updatePromise = showService.updateShow(data, id);

        updatePromise.then(function (data) {
            if(data.status == 204) {
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
        if(_.has(show, 'ShowImage')) {
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
        } else {
            var ImdbID = traktTcService.getImages(show.ImdbID);
            ImdbID.then(function (data) {
                if(data.data.message != false) {
                    show.ShowImage = data.data.images.poster.full;
                } else {
                    show.ShowImage = NO_IMAGE;
                }

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
            })
        }
        /*var postShow = showService.addShow(show);
        postShow.then(function (data) {
            if (data.status == 201) {
                loadData();
                $modalInstance.dismiss('cancel');
                notify('success','Show '+ data.data.Name +' Added')
            }
        }), function (error) {
            console.error(error);
        };*/
    };
});

app.controller('episodeAddFormCtrl', function ($scope, $modalInstance, episodeService, dataFactory, traktTcService, ep) {
    $scope.episode = ep;
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
        if(_.has(episode, 'EpisodeImage')) {
            var addEpisodePromise = episodeService.addShow(episode);
            addEpisodePromise.then(function(data) {
                if(data.status == 201) {
                    getEpisodes();
                    $modalInstance.dismiss('cancel');
                    notify('success','Episode '+ data.data.Name +' Added')
                }
            });
        } else {
            var episodeImage = traktTcService.getEpisodeImages(episode.ShowImdbId, episode.SeasonNr, episode.EpisodeNr);
            episodeImage.then(function(imageData){
                episode.EpisodeImage = imageData.data.images.screenshot.medium;
                var addEpisodePromise = episodeService.addShow(episode);
                addEpisodePromise.then(function(data) {
                    if(data.status == 201) {
                        getEpisodes();
                        $modalInstance.dismiss('cancel');

                        notify('success','Episode '+ data.data.Name +' Added')
                    }

                });
            });
        }
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
        var updatePromise = episodeService.updateEpisode(data, id);

        updatePromise.then(function (data) {
            if(data.status == 204) {
                $modalInstance.dismiss('cancel');
            }
        });
    };


});

function notify(type, message) {
    $.notify({
        message: message
    },{
        type: type
    });
}
