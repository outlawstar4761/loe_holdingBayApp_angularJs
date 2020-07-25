var app = angular.module('Comic',['HoldingBayService','toastr'])
        .controller('ComicController',function($q,HoldingBayService,toastr){
            var self = this;
            self.getComics = function(){
                self.loading = true;
                HoldingBayService.getComics().then(function(data){
                    self.loading = false;
                    self.scanResults = data;
                    console.log(self.scanResults);
                });
            };
            self.approveComic = function(comic){
                console.log(comic);
                HoldingBayService.approveComic(comic).then(function(data){
                    console.log(data);
                    if(!data.error){
                        toastr.success(data.issue_title + ' Approved!');
                    }else{
                        toastr.error(data.error);
                    }
                });
            };
        });
