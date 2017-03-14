(function(){
    "use strict";

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

            $scope.logoSrc = kachingAppConfig.wpTemplateUri + '/assets/images/ic_kaching.png';

            $scope.logoClick = function() {
                if ( authService.isAdvertiser() ) {
                    $state.go('campaigns');
                } else if ( authService.isDeveloper() ) {
                    $state.go('apikeys');
                } else {
                    $window.location.href = kachingAppConfig.homeUrl;
                }
            };

        }]);

})();
