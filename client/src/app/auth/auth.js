angular.module('auth',[
                        'ngResource'
                        ,'ui.router'
                        ,'ui.bootstrap.showErrors'
                        ,'validation.match'
                        ,'auth.services'
                        ,'ngFileUpload'
                        ,'ui.bootstrap'
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
                            )
                            .state('view',{
                                                url: "/view/:phone",
                                                templateUrl : 'app/auth/user.view.tpl.html',
                 controller: 'UserEditController'
                                            }
                            )
                            .state('edit',{
                                                url: "/edit/:phone",
                                                templateUrl : 'app/auth/user.edit.tpl.html',
                                                controller: 'UserEditController'
                                            }
                            );
            }
]);




angular.module('auth').controller('UserEditController',[
    '$scope'
    ,'$resource'
    ,'$state'
    ,'$location'
    ,'UserService'
    ,'$window'
    ,'$rootScope'
    ,'Upload'
    ,'UsersListService'
    ,'$stateParams'
    ,
    function($scope,$resource,$state,$location,UserService,$window,$rootScope,Upload,UsersListService,$stateParams){
        var userService = new UserService();

        console.log(".. id: "+$stateParams.phone);
        userService.$get({phone:$stateParams.phone},function(result){
            $scope.user = result.data.user;
        });

    $scope.updateUser = function(){
        userService.name = $scope.user.info.name;
        userService.email = $scope.user.info.email;
        userService.$update({phone:$stateParams.phone},function(result){
                    if(result)
                        $location.path("/");
                });
    }

}]);



angular.module('auth').controller('AuthController',  [
                                                    '$scope'
                                                    ,'$resource'
                                                    ,'$state'
                                                    ,'$location'
                                                    ,'AuthService'
                                                    ,'$window'
                                                    ,'$rootScope'
                                                    ,'Upload'
                                                    ,'UsersListService'
    ,
    function($scope,$resource,$state,$location,AuthService,$window,$rootScope,Upload,UsersListService){
                        $scope.errorExists = false;
                        $scope.profilePic = $location.protocol() + "://" + $location.host() + ":" + $location.port()+'/files/profile.png';
                        console.log("profilePic "+$scope.profilePic);
        
                        $scope.signup = function(){
                            $scope.$broadcast('show-errors-check-validity'); 
                            if ($scope.singupForm.$valid){
                                AuthService.signup({
                                                name: $scope.name,
                                                phone: $scope.phone,
                                                email: $scope.email,
                                                profilePic: $scope.profilePic,
                                                dob:$scope.dob,
                                                address:$scope.address,
                                                password: $scope.password, 
                                                }
                                       ,function(result){
                                             if(!result['type']){
                                                $scope.errorExists = true;
                                                $scope.loginErrorMessage = result['err'];
                                            }else{
                                                  $location.path('/') 
                                            }
                                        }
                                );
                            }   
                       }//signup

                       $scope.login = function(){
                            $scope.$broadcast('show-errors-check-validity'); 
                            if ($scope.loginForm.$valid){  
                                AuthService.login({
                                                'phone':$scope.phone,
                                                'password':$scope.password
                                              }
                                ,function(result){          
                                    if(!result['type']){
                                        $scope.errorExists = true;
                                        $scope.loginErrorMessage = result['err'];
                                    }else{
                                        //console.log(" $$$ response from AuthService.login, info returned : "+JSON.stringify(result));
                                        console.log(" users : "+JSON.stringify(result.data.users));
                                        UsersListService.setUsers(result.data.users);
                                        $location.path("/"); 
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
                                //$scope.progressPercentage = 0.0;
                               var img =  "\n \n ![Alt text]("+$location.protocol() + "://" + $location.host() + ":" + $location.port()+'/files/'+resp.data.file.name+">)";
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
                       
        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function() {
            $scope.dt = null;
        };

        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date(),
            showWeeks: true
        };

        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1
        };

        // Disable weekend selection
        function disabled(data) {
            var date = data.date,
                mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        }

        $scope.toggleMin = function() {
            $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
            $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
        };

        $scope.toggleMin();

        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };

        $scope.open2 = function() {
            $scope.popup2.opened = true;
        };

        $scope.setDate = function(year, month, day) {
            $scope.dt = new Date(year, month, day);
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popup1 = {
            opened: false
        };

        $scope.popup2 = {
            opened: false
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 1);
        $scope.events = [
            {
                date: tomorrow,
                status: 'full'
            },
            {
                date: afterTomorrow,
                status: 'partially'
            }
        ];

        function getDayClass(data) {
            var date = data.date,
                mode = data.mode;
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0,0,0,0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        }          
    }
]);