//var user = localStorage.getItem('loggedIn');
var user = localStorage.getItem('uid');
var userName = localStorage.getItem('userName');
var access_token = localStorage.getItem('access_token');

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

app.controller('myShowController', function ($scope, showService, dataFactory) {
    if (!user) {
        $location.path('home');
    }

    loadData();
    function loadData() {
        var myshows = [];
        var promise = showService.getUserShows(user);
        promise.then(function (data) {
            var showPromise = showService.getData();
            showPromise.then(function (allShows) {
                $.each(data.data, function (key, value) {
                    $.each(allShows.data, function (sKey, show) {
                        if (value.ShowID == show.ShowId) {
                            myshows.push(show);
                        }
                    });
                });
                dataFactory.setMyShows(myshows);
            });
        }), function (error) {
            $log.error('Error', error)
        };
    }

    $scope.$watch(function () {
        return dataFactory.getMyShows();
    }, function (data, oldValue) {
        if (data) {
            $scope.shows = data;
        }
    });

    $scope.showCheck = function (showId) {
        var userShow = {
            'UserID': user,
            'ShowID': showId
        };

        var showCheck = showService.addUserShow(userShow);
        showCheck.then(function (data) {
            var show = data.data.Show;

            if (data.data.Show != null) {
                notify('success', 'Show ' + show.Name + ' added to My Shows');
                loadData();

            } else {
                notify('danger', 'Show removed from My shows');
                loadData();
            }
        });
    };


});

app.controller('showsController', function ($scope, showService, $modal, dataFactory, $location) {
    if (!user) {
        $location.path('home');
    }

    loadData();
    function loadData() {
        var promise = showService.getData();
        promise.then(function (data) {
            dataFactory.setShows(data.data);
        }), function (error) {
            $log.error('Error', error)
        };
    }

    var userShows = showService.getUserShows(user);
    var ushowData = [];

    $scope.$watch(function () {
        return dataFactory.getShows();
    }, function (data, oldValue) {

        //selle porri peaks ära lahendama ?!?!?!??!?!
        if (data) {
            userShows.then(function (userShowdata) {
                $.each(data, function (key, value) {
                    $.each(userShowdata.data, function (ukey, showData) {
                        if (value.ShowId == showData.ShowID) {
                            ushowData.push(showData.ShowID);
                        }
                    })
                });
                $scope.shows = data;
            });
        }
    });

    $scope.open = function (size) {
        var modalInstance = $modal.open({
            templateUrl: 'views/forms/show.html',
            controller: 'showFormCtrl',
            size: size
        });
    };

    $scope.isThisUserShow = function (show) {
        var ret = _.indexOf(ushowData, show);

        if (ret != -1) {
            return true;
        }
        return false;
    };

//todo check data.status
    $scope.removeShow = function (imdbid) {
        var deletePromise = showService.removeShow(imdbid);
        deletePromise.then(function (data) {
            loadData();
            notify('success', 'Show Removes');
        });
    };

    $scope.showCheck = function (showId) {
        var userShow = {
            'UserID': user,
            'ShowID': showId
        };

        var showCheck = showService.addUserShow(userShow);
        showCheck.then(function (data) {
            var show = data.data.Show;

            if (data.data.Show != null) {
                notify('success', 'Show ' + show.Name + ' added to My Shows');
            } else {
                notify('danger', 'Show removed from My shows');
            }
        })
    };
});

app.controller('homeController', function ($scope, showService, $location) {
    if (user) {
        $location.path('user');
    } else {
        $location.path('welcome');
    }

    $scope.message = 'Angular message!';
});

app.controller('showController', function ($scope, showService, $routeParams, $modal, dataFactory, episodeService) {
    if (!user) {
        $location.path('home');
    }
    var showId = $routeParams.id;
    var episode = {
        "ShowImdbId": showId
    };
    $scope.episode = episode;

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
            $scope.formData = _.cloneDeep(data.data);
        });
    }

    $scope.$watch(function () {
        return dataFactory.getShow();
    }, function (data, oldValue) {
        if (data) {
            $scope.show = data;
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
                ep: function () {
                    return $scope.episode;
                }
            }
        });
    };

    //Episodes stuff

    var episodePromise = showService.getUserEpisodes(user, showId);
    var epData = [];
    var episodes = [];

    $scope.$watch(function () {
        return dataFactory.getEpisodes();
    }, function (data, oldValue) {
        if (data) {

            episodePromise.then(function (episodeData) {
                $.each(data, function (key, value) {
                    $.each(episodeData.data, function (ekey, episodeData) {
                        if (value.EpisodeId == episodeData.EpisodeId) {
                            epData.push(episodeData.EpisodeId);
                        }
                    });
                });
                $scope.episodes = data;

                var rer = _.groupBy(data, function (a) {
                    return a.SeasonNr;
                });

                $.each(rer, function (key, seasons) {
                    seasons.sort(sort_by('EpisodeNr', false, parseInt()));
                });
                $scope.data = rer;
            });
        }
    });

    $scope.removeEpisode = function (imdbId) {
        var deletePromise = episodeService.removeEpisode(imdbId);
        deletePromise.then(function (data) {
            if (data.status = 204) {
                getEpisodes();
                notify('success', 'Episode Removed');
            }
        })
    };

    $scope.isThisUserEpisode = function (episode) {
        var ret = _.indexOf(epData, episode);

        if (ret != -1) {
            return true;
        }
        return false;
    };

    $scope.episodeCheck = function (showId) {
        var userEp = {
            "UserID": user,
            "EpisodeID": showId
        };

        var episodeCheck = showService.addUserEpisode(userEp);

        episodeCheck.then(function (data) {
            var episode = data.data.Episode;
            if (data.data.Episode != null) {
                notify('success', 'Watched episode ' + episode.Name)
            } else {
                notify('danger', 'Removed from watchlist')
            }
        }), function (error) {

        };
    };
});

app.controller('seasonController', function ($scope, showService, $routeParams, episodeService, dataFactory, $modal) {
    if (!user) {
        $location.path('home');
    }
    var showId = $routeParams.id;

    var ep = {
        'SeasonNr': parseInt($routeParams.season),
        'ShowImdbId': showId
    };

    getEpisodes();
    function getEpisodes() {
        var episodePromise = episodeService.getShowEpisodes(showId);
        episodePromise.then(function (data) {
            var episodes = data.data;
            dataFactory.setEpisodes(episodes.sort(sort_by('EpisodeNr', false, parseInt())));
        });
    }

    var epdata = [];

    $scope.$watch(function () {
        return dataFactory.getEpisodes();
    }, function (data, oldValue) {
        if (data) {
            epdata = [];
            var userEpisodePromise = showService.getUserEpisodes(user, showId);
            userEpisodePromise.then(function (episodeData) {
                $.each(data, function (key, value) {
                    $.each(episodeData.data, function (ekey, episodeData) {
                        if (value.EpisodeId == episodeData.EpisodeId) {
                            epdata.push(episodeData.EpisodeId);
                        }
                    });
                });

                var ret = _.groupBy(data, function (a) {
                    return a.SeasonNr;
                });
                $scope.data = ret;
            });

            var episodes = _.filter(data, function (array) {
                return array.SeasonNr == $routeParams.season;
            });
            $scope.episodes = episodes;
        }
    });

    $scope.isThisUserEpisode = function (show) {
        var ret = _.indexOf(epdata, show);

        if (ret != -1) {
            return true;
        }
        return false;
    };

    $scope.addEpisodeModal = function (size) {
        $modal.open({
            templateUrl: 'views/forms/episode.html',
            controller: 'episodeAddFormCtrl',
            size: size,
            resolve: {
                ep: function () {
                    return ep;
                }
            }
        });
    };

    $scope.episodeCheck = function (showId) {
        var userEp = {
            "UserID": user,
            "EpisodeID": showId
        };

        var episodeCheck = showService.addUserEpisode(userEp);

        episodeCheck.then(function (data) {
            var episode = data.data.Episode;
            if (data.data.Episode != null) {
                notify('success', 'Watched episode ' + episode.Name)
            } else {
                notify('danger', 'Removed from watchlist')
            }
        }), function (error) {

        };
    };

});

app.controller('episodeController', function ($scope, showService, $routeParams, episodeService, dataFactory, $modal, traktTcService) {
    if (!user) {
        $location.path('home');
    }

    var showId = $routeParams.id;
    loadData();
    function loadData() {
        var episode = episodeService.getEpisodeByImdbId($routeParams.episode);
        episode.then(function (data) {
            dataFactory.setEpisode(data.data)
        });
    }

    loadShow();
    function loadShow() {
        var showPromise = showService.getShow($routeParams.id);
        showPromise.then(function (data) {
            dataFactory.setShow(data.data);
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
        return dataFactory.getEpisode();
    }, function (data, oldValue) {
        if (data) {
            data.Date = Date.parse(data.Date);
            $scope.episode = data;
        }
    });

    $scope.editShow = function (size) {
        $modal.open({
            templateUrl: 'views/forms/editEpisode.html',
            controller: 'editEpisodeFormCtrl',
            size: size,
            resolve: {
                episode: function () {
                    return _.cloneDeep($scope.episode);
                }
            }
        });
    };
});

app.controller('headerController', function ($scope, $location, $route, dataFactory) {
    console.log(userName);
    $scope.user = userName;
    $scope.logOut = function () {
        localStorage.removeItem('uid');
        localStorage.removeItem('access_token');
        localStorage.removeItem('userName');


        $location.path('home');
        // Todo Find better way to refresh data in headers, try not to use $watch
        location.reload();
    };

    $scope.logged = true;

    if (user) {
        $scope.logged = false;
    }

    $scope.$watch(function () {
        return dataFactory.getLoader();
    }, function (data, oldValue) {
        $scope.loader = data;
    });
});

app.controller('loginController', function ($scope, $location, $route, dataFactory, showService, $route) {
    if (isNumber(user) == true) {
        $location.path('home');
    }

    var errors = false;
    $scope.logIn = function (user) {
        if (!_.has(user, 'email')) {
            notify('warning', 'Email ei ole korrektne või puudub');
            errors = true;
        }

        if (!_.has(user, 'password')) {
            notify('warning', 'Parool ei ole korrektne või puudub');
            errors = true;
        }

        if (!errors) {
            showService.getToken(user.password, user.email).then(function (data) {
                console.log(data.data);
                if (_.has(data.data, 'access_token')) {
                    localStorage.setItem('uid', data.data.userId);
                    localStorage.setItem('userName', data.data.userName);
                    localStorage.setItem('access_token', data.data.access_token);
                    // Todo Find better way to refresh data in headers, try not to use $watch
                    //$route.reload();
                    $location.path('home');
                    $route.reload();
                    location.reload();
                }
            });
        }
    };

    $scope.$watch(function () {
        return dataFactory.getEpisode();
    }, function (data, oldValue) {
        if (data) {
            $scope.episode = data;
        }
    });
});

app.controller('userController', function ($scope, traktTcService, episodeService, showService, $q) {
    var myshows = showService.getUserData(user);
    myshows.then(function (data) {
        $scope.shows = data.data;
        $.each(data.data, function (key, obj) {

            if (obj.Value == 'NaN') {
                obj.Value = 0;
            } else {
                obj.Value = Math.floor(obj.Value)
            }
        });
    });
});

app.controller('registerController', function ($scope, showService, $location) {

    $scope.register = function (user) {
        var error = false;

        if (!_.has('Email', user) && !_.has('Password', user) && !_.has('ConfirmPassword', user) && user.Password != user.ConfirmPassword) {
            error = true;
            notify('danger', 'Wrong input !');
        }

        if (!error) {
            showService.userRegister(user).then(function (data) {
                if (data.status == 200) {
                    showService.getToken(user.Password, user.Email).then(function (tokenData) {
                        console.log(tokenData.data.access_token);
                        localStorage.setItem('uid', data.data.Id)
                        localStorage.setItem('userName', data.data.userName);
                        localStorage.setItem('access_token', tokenData.data.access_token);
                        $location.path('home');
                        location.reload();
                    });
                } else {
                    notify('danger', 'register Incorrect')
                }
            }).catch(function (response) {
                console.error('Error', response.status, response.data);


                $.each(response.data.ModelState, function(key, data) {
                    if(!isNumber(data)) {
                        notify('danger',data[0]);
                    }

                });

            });
        }
    };
});

app.controller('welcomeController', function ($scope) {
    $scope.message = 'data'
});

function notify(type, message) {
    $.notify({
        message: message
    }, {
        type: type
    });
}
function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

var sort_by = function (field, reverse, primer) {

    var key = primer ?
        function (x) {
            return primer(x[field])
        } :
        function (x) {
            return x[field]
        };

    reverse = !reverse ? 1 : -1;

    return function (a, b) {
        return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    }
};