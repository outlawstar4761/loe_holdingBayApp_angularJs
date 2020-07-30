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
            self.parseIssueNumber = function(number){
              var numZeros = 3 - number.toString().length;
              var numZeros = 3 - number.length;
              var str = '';
              for(var i = 0; i < numZeros; i++){
                  str += '0';
              }
              console.log(str);
              return str;

            };
            self.approve = function(index){
                var comic = self.scanResults[index];
                HoldingBayService.approveComic(comic).then(function(data){
                    console.log(data);
                    if(!data.error){
                        toastr.success(data.issue_title + ' Approved!');
                        self.scanResults.splice(index,1);
                    }else{
                        toastr.error(data.error);
                    }
                });
            };
            self.getComics();
        });
