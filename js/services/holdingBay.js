const BASEURL = 'http://api.outlawdesigns.io/LOE/';
var app = angular.module('HoldingBayService',[])
        .factory('HoldingBayService',function($http){
            return {
                getMovies:function(){
                    var url = BASEURL + 'holdingbay/movies';
                    return $http.get(url).then(function(response){
                        return response.data;
                    },function(err){
                        return err;
                    });
                },
                getSongs:function(){
                    var url = BASEURL + 'holdingbay/music';
                    return $http.get(url).then(function(response){
                        return response.data;
                    },function(err){
                        return err;
                    });
                },
                getTv:function(){
                    var url = BASEURL + 'holdingbay/tv';
                    return $http.get(url).then(function(response){
                        return response.data;
                    },function(err){
                        return err;
                    });
                },
                approveMovie:function(movieObj){
                    var url = BASEURL + 'movie';
                    return $http.post(url,movieObj).then(function(response){
                        return response.data;
                    },function(err){
                        return err;
                    });
                },
                approveSong:function(song){
                    var url = BASEURL + 'music';
                    return $http.post(url,song).then(function(response){
                        return response.data;
                    },function(err){
                        return err;
                    });
                },
                approveEpisode:function(episode){
                    var url = BASEURL + 'tv';
                    return $http.post(url,episode).then(function(response){
                        return response.data;
                    },function(err){
                        return err;
                    });
                },
                getCounts:function(){
                    var url = BASEURL + 'get/counts';
                    return $http.get(url).then(function(response){
                        return response.data
                    },function(err){
                        return err;
                    });
                }
            };
        });
