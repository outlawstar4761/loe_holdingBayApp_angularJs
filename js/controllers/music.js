var app = angular.module('Music',['HoldingBayService','toastr'])
        .controller('MusicController',function(HoldingBayService,toastr){
            var self = this;
            self.loading = true;
            self.getArtists = function(){
                console.log('getting results...');
                HoldingBayService.getSongs().then(function(data){
                    self.loading = false;
                    console.log(data);
                    self.scanResults = data;
                });
            };
            self.getCtrlGenre = function(albums){
                var albumKeys = Object.keys(albums);
                console.log(albumKeys);
                if(albums[albumKeys[0]][0].genre === null){
                    return "N/A";
                }
                return albums[albumKeys[0]][0].genre;
            };
            self.updateArtist = function(artist,genre,artistName){
                //alert(artist + "\n" + genre + "\n" + artistName);
                var artistKeys = Object.keys(self.scanResults);
                for(var i = 0; i < artistKeys.length;i++){
                    var albumKeys = Object.keys(self.scanResults[artistKeys[i]]);
                    for(var j = 0; j < albumKeys.length;j++){
//                        console.log(self.scanResults[artistKeys[i]][albumKeys[j]]);
                        for(var k = 0; k < self.scanResults[artistKeys[i]][albumKeys[j]].length;k++){
                            if(self.scanResults[artistKeys[i]][albumKeys[j]][k].artist == artist){
                                self.scanResults[artistKeys[i]][albumKeys[j]][k].genre = genre;
                                self.scanResults[artistKeys[i]][albumKeys[j]][k].band = artist;
                                if(artistName != artist && artistName !== undefined){
                                    self.scanResults[artistKeys[i]][albumKeys[j]][k].artist = artistName;
                                    self.scanResults[artistKeys[i]][albumKeys[j]][k].band = artistName;
                                }
                                //console.log(self.scanResults[artistKeys[i]][albumKeys[j]][k].title + "\n" + self.scanResults[artistKeys[i]][albumKeys[j]][k].artist + "\n" + self.scanResults[artistKeys[i]][albumKeys[j]][k].album + "\n" + self.scanResults[artistKeys[i]][albumKeys[j]][k].genre);
                            }else{
                                continue;
                            }
                        }
                    }
                }
            };
            self.artistSwap = function(artist,artistName){
                //console.log(artist);
                //console.log(artistName);
                if(artistName === undefined){
                    return artist;
                }
                return artistName;
            };
            self.updateAlbum = function(artist,album,artistName,albumName,albumGenre,albumYear){
                var songs = self.scanResults[artist][album];
                for(var i = 0; i < songs.length; i++){
                  if(artistName !== undefined){
                    songs[i].artist = artistName;
                    songs[i].band = artistName;
                  }
                  if(albumName !== undefined){
                    songs[i].album = albumName;
                  }
                  if(albumGenre !== undefined){
                    songs[i].genre = albumGenre;
                  }
                  if(albumYear !== undefined){
                    songs[i].year = albumYear;
                  }
                }
            };
            self.albumSwap = function(album,albumName){
                if(albumName === undefined){
                    return album;
                }
                return albumName;
            };
            self.parseFeat = function(songs){
                var parPattern = /\((.*?)\)/g;
                var bracketPattern = /\[(.*?)\]/g;
                var aposPattern = /'/g;
                //var bracketPattern = "[(.*?)]";
                for(var i = 0; i< songs.length; i++){
                    var matches = songs[i].title.match(bracketPattern);
                    if(matches){
                        songs[i].title = songs[i].title.replace(matches[0],'');
                    }
                    matches = songs[i].title.match(parPattern);
                    if(matches){
                        var feat = matches[0].replace(")","]");
                        feat = feat.replace("(","[");
                        songs[i].title = songs[i].title.replace(matches[0],feat);
                        songs[i].feat = feat;
                    }
                    matches = songs[i].title.match(aposPattern);
                    if(matches){
                        songs[i].title = songs[i].title.replace(matches,'');
                    }
                }
            };
            self.parseTrackNumber = function(songs){
                for(var i = 0; i < songs.length; i++){
                    var results = songs[i].track_number.split('/');
                    if(results){
                        songs[i].track_number = parseInt(results[0]);
                    }else{
                        songs[i].track_number = parseInt(songs[i].track_number);
                    }
                }
            };
            self.approveSong = function(song){
                HoldingBayService.approveSong(song).then(function(data){
                    console.log(data);
                    if(!("error" in data)){
                        toastr.success(data.title + " Approved!");
                    }else{
                        toastr.error(data);
                    }
                    //self.removeSong(song);
                });
            };
            self.removeSong = function(UID){
              for (artists in self.scanResults){
                for(albums in self.scanResults[artists]){
                  for(songs in self.scanResults[artists][albums]){
                    if(self.scanResults[artists][albums][songs].UID === UID){
                      self.scanResults[artists][albums].splice(songs,1);
                    }
                  }
                }
              }
            };
            self.approveAlbum = function(songs){
                for(var i = 0; i < songs.length; i++){
                    self.approveSong(songs[i]);
                }
            };
            self.approveArtist = function(artist){
                HoldingBayService.postNewArtist(artist).then(function(data){
                    console.log(data);
                });
            };
            self.getArtists();
        });
