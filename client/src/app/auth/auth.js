angular.module('auth',[
                        'ngResource'
                        ,'ui.router'
                        ,'ui.bootstrap.showErrors'
                        ,'validation.match'
                        ,'auth.services'
                        ,'ngFileUpload'
                      ]
              );

angular.module('auth').config([
                                '$stateProvider'
                                ,'$urlRouterProvider'
                                ,'$httpProvider'
             ,function($stateProvider,$urlRouterProvider,$httpProvider){
             $urlRouterProvider.otherwise("/");
             $httpProvider.interceptors.push('AuthHttpRequestInterceptor');
             $stateProvider.state('login', {
                                                url: "/login/",
                                                templateUrl: 'app/auth/login.tpl.html',
                                                controller: 'AuthController'
                                            }
                            )
                            .state('signup',{
                                                url: "/signup/",
                                                templateUrl : 'app/auth/signup.tpl.html',
                                                controller: 'AuthController'
                                            }
                            );
            }
]);


angular.module('auth').controller('AuthController',  [
                                                    '$scope'
                                                    ,'$resource'
                                                    ,'$state'
                                                    ,'$location'
                                                    ,'AuthService'
                                                    ,'$window'
                                                    ,'$rootScope'
                                                    ,'Upload'
                                            ,
    function($scope,$resource,$state,$location,AuthService,$window,$rootScope,Upload){
                        $scope.errorExists = false;
                        $scope.profilePic = $location.protocol() + "://" + $location.host() + ":" + $location.port()+'/files/profile.png';
                        console.log("profilePic "+$scope.profilePic);
        
                        $scope.signup = function(){
                            $scope.$broadcast('show-errors-check-validity'); 
                            if ($scope.singupForm.$valid){
                                AuthService.signup({
                                                email: $scope.email,
                                                password: $scope.password, 
                                                name: $scope.name
                                                }
                                       ,function(result){
                                             if(!result['type']){
                                                $scope.errorExists = true;
                                                $scope.loginErrorMessage = result['data'];
                                            }else{
                                                  $location.path('/') 
                                            }
                                        }
                                );
                            }   
                       }//signup

                       $scope.login = function(){
                            $scope.$broadcast('show-errors-check-validity'); 
                            if ($scope.loginForm.$valid){                                                           AuthService.login({
                                                'email':$scope.email,
                                                'password':$scope.password
                                              },                                                           function(result){          
                                if(!result['type']){
                                    $scope.errorExists = true;
                                    $scope.loginErrorMessage = result['data'];
                                }else{
                                    console.log(" $$$ response from AuthService.login, info returned : "+JSON.stringify(result));
                                   $location.path("/") 
                                }
                                });
                            }
                           }//login
                       
                       
                       $scope.upload = function (file) {
                           // $scope.progressPercentage = 0.0;
                           Upload.upload({
                               url: 'auth/upload',
                               data: {file: file, 'username': 'hello'}
                           }).then(function (resp) {
                               console.log('Success ' + resp.config.data.file.name + '   uploaded. Response: ' + JSON.stringify(resp.data));
                               console.log($location.protocol() + "://" + $location.host() + ":" + $location.port());
                               $scope.profilePic = $location.protocol() + "://" + $location.host() + ":" + $location.port()+'/files/'+resp.data.file.name;
                               $scope.images.push($location.protocol() + "://" + $location.host() + ":" + $location.port()+'/files/'+resp.data.file.name);
                               //$scope.progressPercentage = 0.0;
                               var img =  "\n \n ![Alt text]("+$location.protocol() + "://" + $location.host() + ":" + $location.port()+'/files/'+resp.data.file.name+">)";


                               $scope.blog.content = $scope.blog.content.concat(img);
                           }, function (resp) {
                               console.log('Error status: ' + resp.status);
                           }, function (evt) {
                               // var psgPercentage = parseInt(100.0 * evt.loaded / evt.total);
                               $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                               console.log('progress: ' + $scope.progressPercentage + '% ' + evt.config.data.file.name);

                               if($scope.progressPercentage === 100.0){
                                   // resetProgressBar();
                                   //  $scope.progressPercentage = 0.0;


                               }

                           });
                       };
                       
                       
                       
            }
]);