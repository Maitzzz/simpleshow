var NO_IMAGE = 'files/image/noimageepisode.jpg ';

app.controller('import', function ($scope, traktTcService, showService, episodeService, $q, dataFactory, $location) {

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
                        episodes.forEach(function (episode) {
                            if (episode.season != 0) {
                                if (episode.images.screenshot.medium == null) {
                                    episode.image = NO_IMAGE;
                                } else {
                                    episode.image = episode.images.screenshot.medium;
                                }

                                var episode = {
                                    ShowId: newShow.data.ShowID,
                                    Name: episode.title,
                                    Description: episode.overview,
                                    Rating: episode.rating,
                                    EpImdbId: episode.ids.imdb,
                                    SeasonNr: episode.season,
                                    EpisodeNr: episode.number,
                                    ShowImdbId: newShow.data.ImdbID,
                                    EpisodeImage: episode.image
                                };
                                if(episode.EpImdbId == null) {
                                    episode.EpImdbId == episode.ids.trakt;
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