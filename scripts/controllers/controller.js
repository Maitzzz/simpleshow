//var user = localStorage.getItem('loggedIn');
var user = localStorage.getItem('uid');
var userName = localStorage.getItem('userName');
var access_token = localStorage.getItem('access_token');

app.controller('mainController', function ($scope, $route) {
    $scope.$on('$routeChangeSuccess', function (newVal, oldVal) {
        if (oldVal !== newVal) {
            $scope.routeClassName = $route.current.className;
        }
    });
});

/*
 General controller for testing porpuses.
 */
app.controller('simpleShowController', function ($scope, showService, dataFactory) {
    function loadData() {
        var promise = showService.getData();
        promise.then(function (data) {
            $scope.data = data.data;
        }).catch(function (error) {
            notify('danger', error)
        })
    }
});

/*
 Controller for my shows, displays user shows.
 */
app.controller('myShowController', function ($scope, showService, dataFactory, $location, $window) {

    if (!user) {
        $location.path('home');
    }

    loadData();
    /*
     Collects user and shows data from api and parses it to set it in dataFactory
     */
    function loadData() {
        var myshows = [];
        var promise = showService.getUserShows(user);
        promise.then(function (data) {
            var showPromise = showService.getData();
            showPromise.then(function (allShows) {
                if(data.status == 401) {
                    logout();
                    console.log('logout, 401 error!');
                    $window.location.reload();
                }

                $.each(data.data, function (key, value) {
                    $.each(allShows.data, function (sKey, show) {
                        if (value.ShowID == show.ShowId) {
                            myshows.push(show);
                        }
                    });
                });
                dataFactory.setMyShows(myshows);
            });
        });
    }

    /*
     Watcher for show data
     */
    $scope.$watch(function () {
        return dataFactory.getMyShows();
    }, function (data, oldValue) {
        if (data) {
            $scope.shows = data;
        }
    });

    /*
     User interraction with show. Adds show record to api
     */
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

/*
 Controller to show all imported shows.
 */
app.controller('showsController', function ($scope, showService, $modal, dataFactory, $location, $q, episodeService,$window) {
    if (!user) {
        $location.path('home');
    }

    /*
     Loads data from api.
     */

    loadShows();
    function loadShows() {
        var userShows = showService.getUserShows(user);
        userShows.then(function (userShowdata) {
            if(userShowdata.status == 401) {
                logout();
                console.log('logout, 401 error!');
                $window.location.reload();
            }
            dataFactory.setShows(userShowdata.data);
        });
    }

    var ushowData = [];

    /*
     Watcher for shows, parses data to display shows and get user shows
     */

    $scope.$watch(function () {
        return dataFactory.getShows();
    }, function (data, oldVal) {
        ushowData = [];
        var promise = showService.getData();
        promise.then(function (showData) {
            $.each(showData.data, function (key, val) {
                $.each(data, function (ueKey, ueVal) {
                    if (ueVal.ShowID == val.ShowId) {
                        ushowData.push(val.ShowId);
                    }
                });
            });
            $scope.shows = showData.data;
        });
    });

    /*
     Opens Add show modal
     */
    $scope.open = function (size) {
        $modal.open({
            templateUrl: 'views/forms/show.html',
            controller: 'showFormCtrl',
            size: size
        });
    };

    /*
     Check function. Is this show at user shows.
     */
    $scope.isThisUserShow = function (show) {
        var ret = _.indexOf(ushowData, show);
        if (ret != -1) {
            return true;
        }
        return false;
    };

    /*
     Removes show from user show list
     */
    //todo check data.status Kas tagasi tulbe 204?
    $scope.removeShow = function (imdbid) {
        console.log('test');
        var deletePromise = showService.removeShow(imdbid);
        deletePromise.then(function (data) {
            notify('success', 'Show Removed');
            loadShows();
        });
    };

    /*
     Adds show to user shows
     */
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
                loadShows();
            } else {
                notify('danger', 'Show removed from My shows');
                loadShows();
            }
        })
    };
});

/*
 Test and location controller
 */
app.controller('homeController', function ($scope, showService, $location, $moment) {
    if (user) {
        $location.path('user');
    } else {
        $location.path('welcome');
    }

    $scope.message = 'Angular message!';
});

/*
 Controller for show. Displays show and it's episodes.
 */
app.controller('showController', function ($scope, showService, $routeParams, $modal, dataFactory, episodeService, $q, $location, $window) {
    if (!user) {
        $location.path('home');
    }
    var showId = $routeParams.id;
    var episode = {
        "ShowImdbId": showId
    };

    $scope.episode = episode;

    var userShows = [];
    getUserShows();
    function getUserShows() {
        userShows = [];
        if(user) {
            showService.getUserShows(user).then(function(data) {
                $.each(data.data, function(key, val) {
                    userShows.push(val.ShowID);
                })
            });
        }
    }

    getEpisodes();
    /*
     Updates/adds data to dataFactory
     */
    function getEpisodes() {
        var userEpisodePromise = showService.getUserEpisodes(user, showId);
        userEpisodePromise.then(function (data) {
            if(data.status == 401) {
                logout();
                console.log('logout, 401 error!');
                $window.location.reload();
            }
            dataFactory.setEpisodes(data.data);
        });
    }

    getShowData();
    /*
     Returns show data from api
     */
    function getShowData() {
        var showPromise = showService.getShow(showId);
        showPromise.then(function (data) {
            dataFactory.setShow(data.data);
            $scope.formData = _.cloneDeep(data.data);
        });
    }

    /*
     Watcher for show data;
     */
    $scope.$watch(function () {
        return dataFactory.getShow();
    }, function (data, oldValue) {
        if (data) {
            $scope.show = data;
        }
    });

    /*
     Opens edit show modal
     */
    $scope.open = function (size) {
        $modal.open({
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

    /*
     Opens Add episode modal
     */
    $scope.addEpModal = function (size) {
        $modal.open({
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

    /*
        Check if this is use show
     */
    $scope.isThisUserShow = function (show) {
        if(_.indexOf(userShows, show) != -1) {
            return true;
        }
      return false;
    };

    /*
     User interraction with show. Adds show record to api
     */
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
                getUserShows();
                getShowData();

            } else {
                notify('danger', 'Show removed from My shows');
                getUserShows();
                getShowData();
            }
        });
    };

    //Episodes stuff
    var epdata = [];
    var episodes = [];

    /*
     Episode watcher, parses data and gets user watched shows.
     */
    $scope.$watch(function () {
        return dataFactory.getEpisodes();
    }, function (data, oldValue) {

        if (data) {
            episodeService.getShowEpisodes(showId).then(function (episodeData) {
                $.each(episodeData.data, function (key, value) {
                    if (Date.parse(value.Date) > Date.now()) {
                        episodeData.data[key].upcoming = 'upcoming';
                        episodeData.data[key].timeLeft = convertMS(Date.parse(value.Date) - Date.now());
                    }

                    $.each(data, function (ekey, epData) {
                        if (value.EpisodeId == epData.EpisodeId) {
                            epdata.push(epData.EpisodeId);
                        }
                    });
                });

                $scope.episodes = episodeData.data;
                var ret = _.groupBy(episodeData.data, function (a) {
                    return a.SeasonNr;
                });

                $.each(ret, function (key, seasons) {
                    seasons.sort(sort_by('EpisodeNr', false, parseInt()));
                });
                $scope.data = ret;
            });

        }
    });

    /*
     Removes episode form watched state
     */
    $scope.removeEpisode = function (imdbId) {
        var deletePromise = episodeService.removeEpisode(imdbId);
        deletePromise.then(function (data) {
            if (data.status = 204) {
                getEpisodes();
                notify('success', 'Episode Removed');
            }
        })
    };

    /*
     Check function for cheking if user has watched current show
     */
    $scope.isThisUserEpisode = function (episode) {
        var ret = _.indexOf(epdata, episode);

        if (ret != -1) {
            return true;
        }
        return false;
    };

    /*
     Adds episode to user episodes
     */
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
            getShowData();
        });
    };

    /*
     Checks if every episode in this show is watched.
     */
    $scope.isShowWatched = function () {
        if (_.has($scope, 'episodes')) {
            if (epdata.length == $scope.episodes.length) {
                return true;
            }
        }

        return false;
    };

    /*
     Mark all show epsodes as watched.
     */
    $scope.showWatched = function () {
        var promiseArray = [];
        epdata = [];
        episodeService.getShowEpisodes(showId).then(function (epsData) {
            $.each(epsData.data, function (key, value) {
                if (_.indexOf(epdata, value.EpisodeId) == -1 || epdata.length == $scope.episodes.length) {
                    var userEp = {
                        "UserID": user,
                        "EpisodeID": value.EpisodeId
                    };
                    promiseArray.push(showService.addUserEpisode(userEp));
                }
            });
            $q.all(promiseArray).then(function (data) {
                var error = [];
                $.each(data, function (key, promise) {
                    if (promise.status != 201) {
                        error.push(promise);
                    }
                });
                if (error.length == 0) {
                    epData = [];
                    notify('success', 'Updated ' + data.length + ' episodes.');
                    getEpisodes();
                }
            });
        })
    }
});

app.controller('seasonController', function ($scope, showService, $routeParams, episodeService, dataFactory, $modal, $q, $location, $window) {
    dataFactory.setEpisodes({});

    if (!user) {
        $location.path('home');
    }

    $scope.season = $routeParams.season;
    var showId = $routeParams.id;

    var ep = {
        'SeasonNr': parseInt($routeParams.season),
        'ShowImdbId': showId
    };

    $scope.ep = ep;


    /*
     Gets user episodes from api and adds/updates data in dataFactory
     */
    getUserEpisodes();
    function getUserEpisodes() {
        var userEpisodePromise = showService.getUserEpisodes(user, showId);
        userEpisodePromise.then(function (data) {
            if(data.status == 401) {
                logout();
                console.log('logout, 401 error!');
                $window.location.reload();
            }
            dataFactory.setEpisodes(data.data);
        });
    }

    var epdata = [];

    /*
     Watcher for Episode data.
     */
    $scope.$watch(function () {
        return dataFactory.getEpisodes();
    }, function (data, oldValue) {
        if (data) {
            episodeService.getShowEpisodes(showId).then(function (episodeData) {
                $.each(episodeData.data, function (key, value) {
                    $.each(data, function (ekey, epData) {
                        if (Date.parse(value.Date) > Date.now()) {
                            episodeData.data[key].upcoming = 'upcoming';
                        }

                        if (value.EpisodeId == epData.EpisodeId && value.SeasonNr == $routeParams.season) {
                            epdata.push(epData.EpisodeId);
                        }
                    });
                });

                var episodes = _.filter(episodeData.data, function (array) {
                    return array.SeasonNr == $routeParams.season;
                });

                $scope.episodes = episodes.sort(sort_by('EpisodeNr', false, parseInt()));
            });

        }
    });

    /*
     Check method for checking id user has watched this episode.
     */
    $scope.isThisUserEpisode = function (show) {
        var ret = _.indexOf(epdata, show);

        if (ret != -1) {
            return true;
        }
        return false;
    };

    /*
     Opens Add episode modal
     */
    $scope.addEpisodeModal = function (size) {
        console.log($scope.ep);
        $modal.open({
            templateUrl: 'views/forms/episode.html',
            controller: 'episodeAddFormCtrl',
            size: size,
            resolve: {
                ep: function () {
                    return $scope.ep;
                }
            }
        });
    };

    /*
     Adds episode to user Episodes
     */
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
                notify('danger', 'Removed from watchlist');
            }
        });
    };

    /*
     Get show data.
     */
    showService.getShow($routeParams.id).then(function (showData) {
        $scope.show = showData.data;
    });

    /*
     Mark all episodes in this season watched.
     */
    $scope.seasonWatched = function () {
        var promiseArray = [];
        $.each($scope.episodes, function (epKey, thisEpisode) {
            // läbi peab minema siis, kui episoodide arv on sama suur, kui vaadata
            if (_.indexOf(epdata, thisEpisode.EpisodeId) == -1 || epdata.length == $scope.episodes.length) {
                var userEp = {
                    "UserID": user,
                    "EpisodeID": thisEpisode.EpisodeId
                };
                if (userEp.EpisodeID != null) {
                    promiseArray.push(showService.addUserEpisode(userEp));
                }
            }
        });
        epdata = [];

        $q.all(promiseArray).then(function (qdata) {
            var error = [];
            $.each(qdata, function (key, promise) {
                if (promise.status != 201) {
                    error.push(promise);
                }
            });

            if (error.length > 0) {
                notify('danger', 'Probleem !');
                console.error(error);
                epdata = [];
            } else {
                notify('danger', 'Updated ' + qdata.length + ' episodes');
                getUserEpisodes();
            }
        });
    };

    /*
     Checks if user has watched this season-
     */
    $scope.isSeasonWatched = function () {
        if ($scope.episodes != null && epdata.length == $scope.episodes.length) {
            return true;
        }
        return false;
    };
});

/*
 Controller for displaying episode.
 */
app.controller('episodeController', function ($scope, showService, $routeParams, episodeService, dataFactory, $modal, $location, $window) {
    if (!user) {
        $location.path('home');
    }

    /*
     Loads episode data from api
     */
    loadData();
    function loadData() {
        var episode = episodeService.getEpisodeByImdbId($routeParams.episode);
        episode.then(function (data) {
            dataFactory.setEpisode(data.data)
        });
    }

    /*
     Loads episode data from api
     */
    loadShow();
    function loadShow() {
        var showPromise = showService.getShow($routeParams.id);
        showPromise.then(function (data) {
            if(data.status == 401) {
                logout();
                console.log('logout, 401 error!');
                $window.location.reload();
            }
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

    /*
     Watcher for episode data
     */
    $scope.$watch(function () {
        return dataFactory.getEpisode();
    }, function (data, oldValue) {
        if (data) {
            if (Date.parse(data.Date) > Date.now()) {
                data.upcoming = 'upcoming';
                data.timeLeft = convertMS(Date.parse(data.Date) - Date.now());
            }
            data.Date = Date.parse(data.Date);
            $scope.episode = data;
        }
    });

    /*
     Opens Edit show modal
     */
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

/*
 Controller for data header
 */
app.controller('headerController', function ($scope, $location, $route, dataFactory, showService, $window) {
    $scope.user = userName;

    /*
     Logout function
     */
    $scope.logOut = function () {
        localStorage.removeItem('uid');
        localStorage.removeItem('userName');
        localStorage.removeItem('access_token');
        showService.logOut().then(function (data) {
            if (data.status == 200) {
                // Todo Find better way to refresh data in headers, try not to use $watch
                $window.location.reload();
            }
        });

    };
    $scope.submitSearch = function (string) {
        $location.path('traktsearch/' + string);
    };

    $scope.logged = true;
    if (user) {
        $scope.logged = false;
    }

    /*
     Loader data watcher
     */
    $scope.$watch(function () {
        return dataFactory.getLoader();
    }, function (data, oldValue) {
        $scope.loader = data;
    });


    $scope.isActive = function (path) {
        if ($location.path().substr(1) == path) {
            return true;
        }
        return false;
    }
});

/*
 Controller for Login display
 */
app.controller('loginController', function ($scope, $location, $route, dataFactory, showService, $window) {
    dataFactory.setView('login');
    if (user != null) {
        $location.path('home');
    }

    var errors = false;

    /*
     Validates and logs user in-
     */
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
                if (_.has(data.data, 'access_token') && data.status == 200) {
                    localStorage.setItem('uid', data.data.userId);
                    localStorage.setItem('userName', data.data.userName);
                    localStorage.setItem('access_token', data.data.access_token);

                    $window.location.reload();
                    // Todo Find better way to refresh data in headers, try not to use $watch
                }
            });
        }
    };
});

/*
 Controller for displaying user data.
 Adds data to session and keeps user logged in
 */
app.controller('userController', function ($scope, traktTcService, episodeService, showService, $location, $window) {
    if (user == null) {
        $location.path('home');
    }

    var myshows = showService.getUserData(user);
    myshows.then(function (data) {
        if(data.status == 401) {
            logout();
            console.log('logout, 401 error!');
            $window.location.reload();
        }
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

/*
 Controller for register view.
 Register user, and logs created user in
 */
app.controller('registerController', function ($scope, showService, $location, $window) {

    //register user, get token and set it in localstorage.
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
                        localStorage.setItem('uid', data.data.Id);
                        localStorage.setItem('userName', data.data.userName);
                        localStorage.setItem('access_token', tokenData.data.access_token);
                        $location.path('home');
                        $window.location.reload();
                    });
                } else {
                    notify('danger', 'register Incorrect')
                }
            }).catch(function (response) {
                console.error('Error', response.status, response.data);
                $.each(response.data.ModelState, function (key, data) {
                    if (!isNumber(data)) {
                        notify('danger', data[0]);
                    }
                });
            });
        }
    };
});

app.controller('welcomeController', function ($scope, $location) {
    if (user) {
        $location.path('user');
    }

    $scope.message = 'data'
});

/*
 Controller for searching shows
 */
app.controller('searchController', function ($scope, showService) {
    if (!user) {
        $location.path('home');
    }

    showService.getData().then(function (data) {
        $scope.shows = data.data;
    });

    $scope.dataInserted = function (searchText) {
        if (typeof searchText == "undefined") {
            return false;
        }
        if (searchText.length > 2) {
            return true;
        }
        else {
            return false;
        }
    };
});

/*
 Controller for trakt.tv search.
 Allows to import shows from trakt.
 */
app.controller('traktSearchController', function (traktTcService, $scope, dataFactory, showService, episodeService, $q, $location, $routeParams) {
    if (!user) {
        $location.path('home');
    }

    $scope.hide = true;
    loadShows();
    var existingShows = [];

    function loadShows() {
        showService.getData().then(function (data) {
            $.each(data.data, function (key, val) {
                existingShows.push(val.ImdbID);
            });
        });
    }

    function search(string) {
        var res = [];
        traktTcService.traktSearch(string).then(function (data) {
            $scope.hide = true;
            if (data.data.length == 0) {
                $scope.hide = false;
                $scope.res = false;
            }
            $.each(data.data, function (key, result) {
                if (result.show.images.poster.thumb != null && result.show.ids.imdb != null) {
                    res.push(result);
                }
            });

            $scope.res = res;
        });
    }

    if ($routeParams.searchstring) {
        $scope.searchText = $routeParams.searchstring;
        search($routeParams.searchstring);
    }

    $scope.search = function (string) {
        search(string);
    };

    /*
     Check function for checking, if user had watched this episode.
     */
    $scope.showExists = function (imdbid) {
        var ret = _.indexOf(existingShows, imdbid);

        if (ret != -1) {
            return false;
        }

        return true;
    };

    /*
     Check if data is inserted in search box
     */
    $scope.dataInserted = function (searchText) {
        if (typeof searchText == "undefined") {
            return false;
        }
        if (searchText.length > 2) {
            return true;
        }
        else {
            return false;
        }
    };

    /*
     Import show from trakt.
     */
    // todo duplicate updated version to importcontroller.
    $scope.import = function (id) {
        dataFactory.setLoader(true);
        traktTcService.traktGetShow(id).then(function (data) {
            var showdata = data.data;
            $scope.show = data.data.Name;

            var show = {
                Name: showdata.title,
                Description: showdata.overview,
                imdbId: showdata.ids.imdb,
                ShowImage: showdata.images.poster.medium
            };
            var promiseArray = [];
            showService.addShow(show).then(function (newShow) {
                if (newShow.statusText == 'Conflict') {
                    notify('danger', newShow.data);
                    dataFactory.setLoader(false);
                    return;
                }
                traktTcService.traktGetEpisodes(id).then(function (data) {
                    var seasons = data.data;
                    seasons.forEach(function (season) {
                        var imdbid, description;
                        if (_.has(season, 'episodes')) {
                            var episodes = season.episodes;
                            episodes.forEach(function (ep) {
                                if (ep.season != 0) {
                                    if (ep.images.screenshot.thumb == null) {
                                        ep.image = NO_IMAGE_EP;
                                    } else {
                                        ep.image = ep.images.screenshot.thumb;
                                    }

                                    if (ep.ids.imdb == null || ep.ids.imdb == '') {
                                        imdbid = ep.ids.trakt;
                                    } else {
                                        imdbid = ep.ids.imdb;
                                    }

                                    if (ep.overview == null || ep.overview == '') {
                                        description = 'no Description';
                                    } else {
                                        description = ep.overview;
                                    }

                                    var episode = {
                                        ShowId: newShow.data.ShowID,
                                        Name: ep.title,
                                        Description: description,
                                        Rating: ep.rating,
                                        EpImdbId: imdbid,
                                        SeasonNr: ep.season,
                                        Date: ep.first_aired,
                                        EpisodeNr: ep.number,
                                        ShowImdbId: newShow.data.ImdbID,
                                        EpisodeImage: ep.image
                                    };
                                    if (_.has(episode, 'ShowImdbId') && episode.EpImdbId != null && episode.Name != null) {
                                        console.log(episode);
                                        promiseArray.push(episodeService.addEpisode(episode));
                                    }
                                }
                            });
                        }
                    });

                    $q.all(promiseArray).then(function (data) {
                        dataFactory.setLoader(false);
                        $location.path('show/' + newShow.data.ImdbID);
                    });
                });
            });
        })
    };
});
