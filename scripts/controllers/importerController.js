var NO_IMAGE_EP = 'files/image/noimageepisode.jpg ';

//todo check if code is legit
app.controller('import', function ($scope, traktTcService, showService, episodeService, $q, dataFactory, $location, $moment) {

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
                if(newShow.statusText == 'Conflict') {
                    notify('danger', newShow.data);
                    dataFactory.setLoader(false);
                    return;
                }
                traktTcService.traktGetEpisodes(id).then(function (data) {
                    var seasons = data.data;
                    seasons.forEach(function (season) {
                        var episodes = season.episodes;
                        episodes.forEach(function (ep) {
                            if (ep.season != 0) {
                                if (ep.images.screenshot.medium == null) {
                                    ep.image = NO_IMAGE_EP;
                                } else {
                                    ep.image = ep.images.screenshot.medium;
                                }

                                var episode = {
                                    ShowId: newShow.data.ShowID,
                                    Name: ep.title,
                                    Description: ep.overview,
                                    Rating: ep.rating,
                                    EpImdbId: ep.ids.imdb,
                                    SeasonNr: ep.season,
                                    //Date: $moment(ep.first_aired).format('DD/MM/YYYY'),
                                    Date: ep.first_aired,
                                    EpisodeNr: ep.number,
                                    ShowImdbId: newShow.data.ImdbID,
                                    EpisodeImage: ep.image
                                };

                                if(episode.EpImdbId == null || episode.EpImdbId == '') {
                                    episode.EpImdbId = ep.ids.trakt;
                                }

                                if(episode.Description == null) {
                                    episode.Description == 'no Description'
                                }
                                if (_.has(episode, 'ShowImdbId') && _.has(episode, 'EpImdbId') && episode.Name != null) {
                                    promiseArray.push(episodeService.addEpisode(episode));
                                }
                            }
                        });
                    });

                    $q.all(promiseArray).then(function (data) {
                        dataFactory.setLoader(false);
                        $location.path('show/' + newShow.data.ImdbID);
                    });
                });
            });
        })
    }
});