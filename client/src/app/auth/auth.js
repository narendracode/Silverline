angular.module('auth',[
                        'ngResource'
                        ,'ui.router'
                        ,'ui.bootstrap.showErrors'
                        ,'validation.match'
                        ,'auth.services'
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
                                                templateUrl: 'app/authorization/login.tpl.html',
                                                controller: 'AuthController'
                                            }
                            )
                            .state('signup',{
                                                url: "/signup/",
                                                templateUrl : 'app/authorization/signup.tpl.html',
                                                controller: 'AuthController'
                                            }
                            )
                            .state('settings',{
                                                url: "/settings/",
                                                templateUrl : 'app/authorization/settings.tpl.html',
                                                controller: 'SettingsController'
                                            }
                            );
            }
]);
/*
angular.module('auth').controller('AuthController',  [
                                                    '$scope'
                                                    ,'$resource'
                                                    ,'$state'
                                                    ,'$location'
                                                    ,'AuthService'
                                                    ,'$window'
                                                    ,'$rootScope'
                                            ,
            function($scope,$resource,$state,$location,AuthService,$window,$rootScope,chatsocket){
                        $scope.errorExists = false;
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
            }
]);
*/