var app = angular.module('Music',['HoldingBayService','toastr'])
        .controller('MusicController',function(HoldingBayService,toastr){
            var self = this;
            self.fsPattern = /\/LOE\//;
            self.domainPattern = /https:\/\/loe.outlawdesigns.io\//;
            self.domain = 'https://loe.outlawdesigns.io/';
            self.fsReplacement = '/LOE/';
            self.selectedCover = null;
            self.loading = true;
            self.scanResults = {};
            self.possibleCovers = [];
            self.getArtists = function(){
                console.log('getting results...');
                HoldingBayService.getSongs().then(function(data){
                    //console.log(data);
                    self.loading = false;
                    self.possibleCovers = self.parseCovers(data.images);
                    console.log(self.possibleCovers);
                    delete data.images;
                    self.scanResults = data;
                });
            };
            self.artistSwap = function(artist,artistName){
                Object.defineProperty(self.scanResults,artistName,Object.getOwnPropertyDescriptor(self.scanResults,artist));
                delete self.scanResults[artist];
            };
            self.albumSwap = function(artist,album,albumName){
                Object.defineProperty(self.scanResults[artist],albumName,Object.getOwnPropertyDescriptor(self.scanResults[artist],album));
                delete self.scanResults[artist][album];
            };
            self.getCtrlGenre = function(albums){
                var albumKeys = Object.keys(albums);
                console.log(albumKeys);
                if(albums[albumKeys[0]][0].genre === null){
                    return "N/A";
                }
                return albums[albumKeys[0]][0].genre;
            };
            self.updateArtist = function(artist,genre,artistName,artistCountry,artistCity,artistState){
              var albums = self.scanResults[artist];
              var keys = Object.keys(albums);
              keys.forEach((k)=>{
                songs = self.scanResults[artist][k];
                for(var i = 0; i < songs.length; i++){
                  self.scanResults[artist][k][i].genre = (genre !== undefined) ? genre:self.scanResults[artist][k][i].genre;
                  self.scanResults[artist][k][i].artist_country = (artistCountry !== undefined) ? artistCountry:self.scanResults[artist][k][i].artist_country;
                  self.scanResults[artist][k][i].artist_city = (artistCity !== undefined) ? artistCity:self.scanResults[artist][k][i].artist_city;
                  self.scanResults[artist][k][i].artist_state = (artistState !== undefined) ? artistState:self.scanResults[artist][k][i].artist_state;
                  if(artistName !== undefined){
                    self.scanResults[artist][k][i].artist = artistName;
                    self.scanResults[artist][k][i].band = artistName;
                  }
                }
              });
              if(artistName !== undefined){
                self.artistSwap(artist,artistName);
              }
            };
            self.updateAlbum = function(artist,album,artistName,albumName,albumGenre,albumYear,publisher){
                var renameAlbum = (albumName !== undefined) ? true:false;
                var renameArtist = (artistName !== undefined) ? true:false;
                var songs = self.scanResults[artist][album];
                for(var i = 0; i < songs.length; i++){
                  if(renameArtist){
                    songs[i].artist = artistName;
                    songs[i].band = artistName;
                  }
                  if(renameAlbum){
                    songs[i].album = albumName;
                  }
                  if(albumGenre !== undefined){
                    songs[i].genre = albumGenre;
                  }
                  if(albumYear !== undefined){
                    songs[i].year = albumYear;
                  }
                  if(publisher !== undefined){
                    songs[i].publisher = publisher;
                  }
                }
                if(renameArtist){
                  self.artistSwap(artist,artistName);
                }
                if(renameAlbum && renameArtist){
                  self.albumSwap(artistName,album,albumName);
                }else if(renameAlbum){
                  self.albumSwap(artist,album,albumName);
                }
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
            self.approveSongPromise = function(song){
              return new Promise((resolve,reject)=>{
                HoldingBayService.approveSong(song).then((data)=>{
                  if(!("error" in data)){
                    toastr.success(data.title + " Approved!");
                    resolve(song.UID);
                  }else{
                    toastr.error(data);
                    reject(data);
                  }
                });
              });
            };
            self.parseCovers = function(imageArray){
              for(var i = 0; i < imageArray.length; i++){
                imageArray[i] = imageArray[i].replace(self.fsPattern,self.domain);
              }
              return imageArray;
            };
            self.setCover = function(songs){
              for(var i = 0; i < songs.length; i++){
                songs[i].cover_path = self.selectedCover.replace(self.domainPattern,self.fsReplacement);
              }
              console.log(self.scanResults);
            };
            self.spliceCover = function(cover_path){
              let targetValue = cover_path.replace(self.fsPattern,self.domain);
              let targetIndex = self.possibleCovers.indexOf(targetValue);
              if(targetIndex !== -1){
                self.possibleCovers.splice(targetIndex,1);
              }
            }
            self.removeSong = function(UID){
              for (artists in self.scanResults){
                for(albums in self.scanResults[artists]){
                  for(songs in self.scanResults[artists][albums]){
                    if(self.scanResults[artists][albums][songs].UID === UID){
                      self.scanResults[artists][albums].splice(songs,1);
                      self.spliceCover(self.scanResults[artists][albums][songs].cover_path);
                    }
                  }
                }
              }
            };
            self.approveAlbum = function(songs){
                let confirmation = confirm("Are you sure you want to approve these" + songs.length + " songs?");
                if(!confirmation){
                  return;
                }
                var promises = [];
                songs.forEach((s)=>{
                  promises.push(self.approveSongPromise(s));
                });
                Promise.allSettled(promises).then((data)=>{
                  data.forEach((d)=>{
                    console.log(d);
                    if(d.status == "fulfilled"){
                      self.removeSong(d.value);
                    }
                  })
                });
            };
            self.approveArtist = function(albums){
              //We can't have the confirmation on both methods if they're going to call eachother...
              //I think this should prompt for each album, which is a little better than having no confirmation at all.
              /*let confirmation = confirm("Are you sure you want to approve these" + albums.length + " albums?");
              if(!confirmation){
                return;
              }*/
              for(albumKey in albums){
                self.approveAlbum(albums[albumKey]);
              }
            };
            self.getArtists();
        });
