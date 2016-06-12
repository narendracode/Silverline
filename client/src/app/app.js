angular.module('app', [
    'ngResource'
    ,'ui.router'
    ,'ngStorage'
    ,'auth'
    ,'auth.services'
    ,'ui.bootstrap'
]);

angular.module('app').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/")
    $stateProvider
        .state('index', {
        url: "/",
        templateUrl: "app/index.tpl.html"
        ,controller: 'AppCtrl'
    });
}]);

angular.module('app').controller('HeaderCtrl', ['$scope','$location','AuthService','$rootScope', function($scope,$location,AuthService,$rootScope) {    
    $scope.logout = function(){
        AuthService.logout(function(result){
            $rootScope.currentUser = null;
            $location.path('/login/');
        });
    } 
}]);

angular.module('app').controller('AppCtrl', ['$scope','$location','AuthService','$rootScope','$localStorage','UsersListService','UserService', function($scope,$location,AuthService,$rootScope,$localStorage,UsersListService,UserService) {
    
    $scope.myInit = function(){
        if($localStorage.token){
            AuthService.currentUser(function(result){
                console.log("Current user AppCtrl : "+JSON.stringify(result));
            });
        }
    };

    var accessLevels = {
        'user': ['user'],
        'admin': ['admin','user']
    };

    
    //$scope.users = UsersListService.getUsers();
   
    
    $scope.loadAdminUsers = function(){
        AuthService.getUsers(function(result){
            console.log(" users from admin.."+JSON.stringify(result));
            $scope.users = result.data.users;
        });
    };
    
    $scope.loadAdminUsers();
    
    $scope.deleteUser = function(index,phone){
        UserService.delete({'phone':phone},function(result){
            $scope.users.splice(index, 1);
        }); 
    }
    
    
    $rootScope.hasAccess = function(level){
        if($rootScope.currentUser && accessLevels[$rootScope.currentUser['role']]){
            if(accessLevels[$rootScope.currentUser['role']].indexOf(level) > -1)
                return true;
            else
                return false;
        }else
            return false;
    }

    $scope.logout = function(){
        AuthService.logout(function(result){
            console.log("Response after logout: "+JSON.stringify(result));
            $rootScope.currentUser = null;
            $location.path('/login/');
        });
    } 
}]);

angular.module('app').controller('HeaderCtrl', ['$scope','$location','AuthService','$rootScope', function($scope,$location,AuthService,$rootScope) {    
    $scope.logout = function(){
        AuthService.logout(function(result){
            console.log("Response after logout: "+JSON.stringify(result));
            $rootScope.currentUser = null;
            $location.path('/login/');
        });
    } 
}]);
