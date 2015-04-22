app.controller('import', function ($scope, traktTcService, showService, episodeService) {

    $scope.import = function (id) {
        traktTcService.traktGetShow(id).then(function (data) {
            var showdata = data.data;
            console.log('=======  trakt ======');
            console.log(data.data);
            $scope.show = data.data.Name;

            var show = {
                Name: showdata.title,
                Description: showdata.overview,
                imdbId: showdata.ids.imdb,
                ShowImage: showdata.images.poster.medium
            };

            showService.addShow(show).then(function (newShow) {
                traktTcService.traktGetEpisodes(id).then(function (data) {
                    var seasons = data.data;
                    seasons.forEach(function (season) {
                        var episodes = season.episodes;
                        var promiseArray = [];
                        episodes.forEach(function (episode) {
                            if (episode.season == 1) {
                                var episode = {
                                    ShowId: newShow.data.ShowID,
                                    Name: episode.title,
                                    Description: episode.overview,
                                    Rating: episode.rating,
                                    EpImdbId: episode.ids.imdb,
                                    SeasonNr: episode.season,
                                    EpisodeNr: episode.number,
                                    ShowImdbId: episode.imdb,
                                    EpisodeImage: episode.images.screenshot.medium
                                };

                                promiseArray.push(episodeService.addEpisode(episode))
                            }
                        });
                    });
                });
            });
        })
    }
});