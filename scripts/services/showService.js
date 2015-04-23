var apiurl = 'http://localhost:56037';

app.service('showService', function ($http) {
    this.getData = function () {
        return $http.get(apiurl + '/api/show');
    };

    this.getShow = function (id) {
        return $http.get(apiurl + '/api/show/' + id);
    };

    this.addShow = function (show) {
        return $http.post(apiurl + '/api/show', show);
    };

    this.removeShow = function (imdbid) {
        return $http.delete(apiurl + '/api/show/' + imdbid);
    };

    this.updateShow = function (data, id) {
        return $http.put(apiurl + '/api/show/' + id, data)
    };

    //user Show service

    this.addUserShow = function (data) {
        return $http.post(apiurl + '/api/usershow', data)
    };

    //user Episode Stuff

    this.addUserEpisode = function (data) {
        return $http.post(apiurl + '/api/userep', data);
    };

    // User Show

    this.getUserShows = function (uid) {
        return $http.get(apiurl + '/api/UserShow/' + uid);
    };

    this.getUserEpisodes = function (uid, show) {
        return $http.get(apiurl + '/api/userep/' + uid + '/' + show);
    };

    this.getShowEpisodesById = function (id) {
        return $http.get(apiurl + '/api/episode/id/' + id);
    };

    this.getUserData = function (id) {
        return $http.get(apiurl + '/api/userdata/' + id);
    };

    this.getShowById = function (id) {
        return $http.get(apiurl + '/api/show/id/' + id);
    };

    this.userRegister = function(user) {
        return $http.post(apiurl + '/api/account/register', user);
    };
    
    this.getToken = function (password, username) {
        // grant_type=password&username=mait@fenomen.ee&password=Kala.Maja1
      return $http({
            method: 'POST',
            url: apiurl + '/Token',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: {username: username, password: password}
        });
    }


});