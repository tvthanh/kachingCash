(function(){
    'use strict';

    angular.module('kachingCore')
        .directive('kachingHeader', [ '$window', 'authService', function( $window, authService ) {
            return {
                restrict: 'A',
                controller: function( $scope ){

                    $scope.loggedIn = authService.isLoggedIn();

                    $scope.logoClick = function() {
                        if ( authService.isLoggedIn() ) {
                            $window.location.href = kachingAppConfig.homeUrl + 'panel/';
                        } else {
                            $window.location.href = kachingAppConfig.homeUrl;
                        }
                    };

                }
            };
        }]);
})();
