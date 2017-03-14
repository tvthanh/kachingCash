(function(){
    'use strict';

    angular.module('kachingCore')
        .directive('userNavBar', [
            '$rootScope',
            'userService',
            'authService',
            '$modal',
            '$window',
            '$state',
        function(
            $rootScope,
            userService,
            authService,
            $modal,
            $window,
            $state
        ) {
            return {
                restrict: 'A',
                scope: {
                    'loggedIn' : '=',
                    'isHomepage' : '='
                },
                templateUrl: 'kaching-core/directives/userNavBar/userNavBarTmpl.html',
                controller: function( $scope ) {

                    $scope.user = {};
                    $scope.username = '';
                    $scope.balance = null;

                    $scope.isPanel = kachingAppConfig.isPanelPage;

                    $scope.urls = {
                        account: kachingAppConfig.panelUrl + '#/account',
                        funds:   kachingAppConfig.panelUrl + '#/add-funds',
                        cards:   kachingAppConfig.panelUrl + '#/credit-cards'
                    };

                    if ( $scope.loggedIn ) {
                        userService.getUser().then(
                            function( user ){
                                $scope.user = user;
                                $scope.username = user.email;
                            },
                            function(){}
                        );
                        userService.getBalance().then(function( response ){
                            $scope.balance = response.credits_balance;
                        });
                    }

                    $rootScope.$on('accountBalanceChanged', function(){
                        userService.getBalance().then(function( response ){
                            $scope.balance = response.credits_balance;
                        });
                    });

                    $scope.logout = function() {
                        authService.logout().then(function() {
                            $window.location.href = kachingAppConfig.homeUrl;
                        });
                    };

                    $scope.isAdvertiser = function() {
                        return authService.isAdvertiser();
                    };

                    $scope.isDeveloper = function() {
                        return authService.isDeveloper();
                    };

                    $scope.switchUserType = function( type ) {

                        if ( authService.switchUserType( type ) ) {
                            if ( ! $scope.isPanel ) {
                                $window.location.href = kachingAppConfig.panelUrl;
                            } else {
                                if ( type === 'advertiser' ) {
                                    $state.transitionTo('campaigns');
                                } else if ( type === 'developer' ) {
                                    $state.transitionTo('apikeys');
                                }
                            }
                        }
                    };

                    $scope.showLoginDialog = function() {
                        $modal({
                            templateUrl: 'kaching-core/components/loginModal/modalTmpl.html',
                            controller: 'loginModalCtrl',
                            animation: 'am-fade-and-scale',
                            placement: 'center'
                        });
                    };

                    $scope.showSignupDialog = function() {
                        $modal({
                            templateUrl: 'kaching-core/components/signupModal/modalTmpl.html',
                            controller: 'signupModalCtrl',
                            animation: 'am-fade-and-scale',
                            placement: 'center'
                        });
                    };
                }
            };
        }]);
})();
