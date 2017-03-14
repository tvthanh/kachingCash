(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'headerCtrl', [
            '$scope',
            '$state',
            'authService',
            '$window',
        function (
            $scope,
            $state,
            authService,
            $window
        ) {
            $scope.loggedIn = authService.isLoggedIn();

            $scope.logoSrc = kachingAppConfig.wpTemplateUri + '/assets/images/logo.png';

            $scope.logoClick = function() {
                if ( authService.isAdvertiser() ) {
                    $state.go('kaching.campaigns');
                } else if ( authService.isDeveloper() ) {
                    $state.go('apikeys');
                } else {
                    $window.location.href = kachingAppConfig.homeUrl;
                }
            };

        }]);

})();
