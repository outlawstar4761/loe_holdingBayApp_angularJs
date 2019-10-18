const BASEURL = 'http://api.outlawdesigns.io:9669/';
const AUTHURL = 'http://api.outlawdesigns.io:9661/';
var app = angular.module('HoldingBayService',[])
        .factory('HoldingBayService',function($http){
            return {
                handleResponse:function(response){
                    return response.data;
                },
                handleError:function(err){
                    return err;
                },
                buildAuthHeader:function(){
                    return {headers:{'auth_token': this.token}};
                },
                verifyToken:function(){
                    var url = AUTHURL + 'verify';
                    return $http.get(url,this.buildAuthHeader()).then(this.handleResponse,this.handleError);
                },
                authenticate:function(username,password){
                    var url = AUTHURL + 'authenticate';
                    var config = {headers:{"request_token": username,"password":password}};
                    return $http.get(url,config).then(this.handleResponse,this.handleError);
                },
                getMovies:function(){
                    var url = BASEURL + 'holdingbay/movies';
                    return $http.get(url,this.buildAuthHeader()).then(this.handleResponse,this.handleError);
                },
                getSongs:function(){
                    var url = BASEURL + 'holdingbay/music';
                    return $http.get(url,this.buildAuthHeader()).then(this.handleResponse,this.handleError);
                },
                getTv:function(){
                    var url = BASEURL + 'holdingbay/tv';
                    return $http.get(url,this.buildAuthHeader()).then(this.handleResponse,this.handleError);
                },
                approveMovie:function(movieObj){
                    var url = BASEURL + 'movie';
                    return $http.post(url,movieObj,this.buildAuthHeader()).then(this.handleResponse,this.handleError);
                },
                approveSong:function(song){
                    var url = BASEURL + 'song';
                    return $http.post(url,song,this.buildAuthHeader()).then(this.handleResponse,this.handleError);
                },
                approveEpisode:function(episode){
                    var url = BASEURL + 'episode';
                    return $http.post(url,episode,this.buildAuthHeader()).then(this.handleResponse,this.handleError);
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
