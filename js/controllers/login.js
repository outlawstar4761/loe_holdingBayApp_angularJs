var app = angular.module('Login',['HoldingBayService','ngCookies'])
        .controller('LoginController',function($location,$cookies,HoldingBayService){
          var self = this;
          self.errorMsg = '';
          self.username = '';
          self.password = '';
          self.checkToken = function(){
            var token = $cookies.get('auth_token');
            if(token !== undefined){
              HoldingBayService.token = token;
              self.verifyToken();
            }
          };
          self.verifyToken = function(){
            HoldingBayService.verifyToken().then(function(data){
              if(!data.error){
                $location.path('/home');
              }
            });
          };
          self.login = function(){
            HoldingBayService.authenticate(self.username,self.password).then(function(data){
              if(!data.error){
                HoldingBayService.token = data.token;
                $cookies.put('auth_token',HoldingBayService.token);
                $location.path('/home');
              }else{
                self.errorMsg = data.error;
              }
            });
          };
          self.checkToken();
        });
