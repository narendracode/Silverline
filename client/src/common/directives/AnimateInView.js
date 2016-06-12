var module = angular.module('animate.directives', []);

module.directive('animateInView', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (element[0].y < $window.innerHeight) {
                angular.element(element).addClass(attr.animateInView);
            }
            angular.element($window).on('scroll', function () {
                if (element[0].getBoundingClientRect().top < $window.innerHeight) {
                    return angular.element(element).addClass(attr.animateInView);
                }
            });
        }
    };
});


module.directive('datepicker', function() {
    return {
        restrict: 'A',
        require : 'ngModel',
        link : function (scope, element, attrs, ngModelCtrl) {
            $(function(){
                element.datepicker({
                    dateFormat:'dd/mm/yy',
                    onSelect:function (date) {
                        scope.$apply(function () {
                            ngModelCtrl.$setViewValue(date);
                        });
                    }
                });
            });
        }
    }
});