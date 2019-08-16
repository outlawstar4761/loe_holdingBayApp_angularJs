var app = angular.module('Movies',['HoldingBayService','toastr'])
        .controller('MovieController',function(HoldingBayService,toastr){
            var self = this;
            self.getMovies = function(){
                self.loading = true;
                HoldingBayService.getMovies().then(function(data){
                    self.loading = false;
                    console.log(data);
                    self.scanResults = data;
                });
            };
            self.approve = function(index){
                var movie = self.scanResults[index];
                HoldingBayService.approveMovie(movie).then(function(data){
                    if(!data.error){
                      toastr.success(self.scanResults[index].title + ' Approved!');
                      self.scanResults.splice(index,1);
                    }else{
                      toastr.error(data.error);
                    }                    
                    console.log(data);
                });
            };
            self.getMovies();
        });
