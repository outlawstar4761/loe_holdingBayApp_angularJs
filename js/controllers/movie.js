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
                    toastr.success(self.scanResults[index].title + ' Approved!');
                    self.scanResults.splice(index,1);                    
                    console.log(data);
                });
            };
            self.testToast = function(){
                toastr.success('Youve made Toast!');
            };            
            self.getMovies();
        });
