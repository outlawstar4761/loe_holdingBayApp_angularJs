var app = angular.module('Tv',['HoldingBayService','toastr'])
        .controller('TvController',function($q,HoldingBayService,toastr){
            var self = this;
            self.getShows = function(){
                self.loading = true;
                HoldingBayService.getTv().then(function(data){
                    self.loading = false;
                    self.scanResults = data;
                    console.log(self.scanResults);
                });
            };
            self.getCtrlGenre = function(seasons){
                var seasonKeys = Object.keys(seasons);
                if(seasons[seasonKeys[0]][0].genre === null){
                    return "N/A";
                }
                return seasons[seasonKeys[0]][0].genre;
            };
            self.showSwap = function(show,showName){
                if(showName === undefined){
                    return show;
                }
                return showName;
            };
            self.updateSeason = function(episodes,update,episodeList){
                var titles = [];
                if(episodeList !== ''){
                    titles = episodeList.split("\n");
                    if(titles.length !== episodes.length){
                        toastr.error('Title/Episode counts do not match!','Uh oh!');
                        return;
                    }
                }
                for(var i = 0; i < episodes.length; i++){
                    if(titles.length){
                        episodes[i].ep_title = titles[i];
                        if(update.seasonNumber <= 9){
                            episodes[i].ep_number = 'S0' + update.seasonNumber + 'E';
                        }else{
                            episodes[i].ep_number = 'S' + update.seasonNumber + 'E';
                        }
                        if(i < 9){
                            episodes[i].ep_number += '0' + (i + 1);
                        }else{
                            episodes[i].ep_number += i + 1;
                        }
                    }
                    episodes[i].runtime = update.runtime;
                    episodes[i].genre = update.genre;
                    episodes[i].season_year = update.year;
                    episodes[i].season_number = update.seasonNumber;
                }
                console.log(episodes);
            };
            self.approveEpisode = function(episode){
                console.log(episode);
                HoldingBayService.approveEpisode(episode).then(function(data){
                    console.log(data);
                    if(!data.error){
                        toastr.success(data.ep_title + ' Approved!');
                    }else{
                        toastr.error(data.error);
                    }
                });
            };
            self.removeEpisode = function(UID){
                for(shows in self.scanResults){
                    for(seasons in self.scanResults[shows]){
                        for(episodes in self.scanResults[shows][seasons]){
                            if(self.scanResults[shows][seasons][episodes].UID === UID){
                                self.scanResults[shows][seasons].splice(episodes,1);
                            }
                        }
                    }
                }
            }
            self.approveSeason = function(episodes){
                var promises = [];
                for(var i = 0; episodes.length; i++){
                  promises.push(HoldingBayService.approveEpisode(episodes[i]));
                }
                $q.all(promises).then(function(results){
                  console.log(results);
                });
            };
            self.updateShow = function(){};
            self.getShows();
        });
