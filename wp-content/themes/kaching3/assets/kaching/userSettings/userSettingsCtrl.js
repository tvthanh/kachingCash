(function(){
    'use strict';

    angular.module('kachingCore')
        .controller( 'userSettingsCtrl', [
            '$scope',
            '$alert',
            '$modal',
            '$q',
            'utils',
            'errorHandler',
            'userService',
        function (
            $scope,
            $alert,
            $modal,
            $q,
            utils,
            errorHandler,
            userService
        ) {

            $scope.fieldHasError = utils.fieldHasError;

            $scope.view = {
                loading: true,
                sending: false,
                submitted: false
            };

            $scope.data = {
                user: {},
                countries: []
            };

            $scope.tab = {
                ACCOUNT_DETAILS: 'accountDetails',
                FUND_DETAILS: 'fundDetails'
            };

            var templateFolder = kachingAppConfig.wpTemplateUri + '/assets/kaching/userSettings/tabs/';

            $scope.userSettingTab = {
                accountDetails : templateFolder + 'accountDetailsTmpl.html',
                fundDetails : templateFolder + 'fundDetailsTmpl.html'
            };

            $scope.updateTab = function(tab) {
                $scope.activedTab = tab;
            };

            // $scope.templateUrl = kachingAppConfig.wpTemplateUri + '/assets/js/kaching-core/directives/userNavBar/userNavBarTmpl.html'
            var init = function() {

                var deferred1 = $q.defer();
                var deferred2 = $q.defer();

                var promisses = [
                    deferred1.promise,
                    deferred2.promise
                ];

                $scope.activedTab = $scope.tab.ACCOUNT_DETAILS;

                userService.getUser().then(
                    function( user ) {
                        $scope.data.user = user;
                        deferred1.resolve( user );
                    },
                    function( response ) {
                        deferred1.reject( response );
                    }
                );

                userService.getCountries().then(
                    function( countries ) {
                        $scope.data.countries = countries;
                        deferred2.resolve( countries );
                    },
                    function( response ) {
                        deferred2.reject( response );
                    }
                );

                $q.all( promisses ).then(
                    function() {
                        $scope.view.loading = false;
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            };

            $scope.showErrors = function() {
                return $scope.view.submitted;
            };

            $scope.showPasswordChangeDialog = function() {
                $modal({
                    // templateUrl: 'panel-module/components/passwordChangeModal/modalTmpl.html',
                    templateUrl: templateDirUri + '/assets/kaching/panel-module/components/passwordChangeModal/modalTmpl.html',
                    controller: 'passwordChangeModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    backdrop: 'static'
                });
            };

            $scope.saveProfile = function() {
                $scope.view.submitted = true;
                if ( $scope.form1.$valid ) {
                    $scope.view.sending = true;
                    userService.updateUser( $scope.data.user ).then(
                        function(){
                            $scope.view.sending = false;
                            $alert({
                                title: 'Account settings saved.',
                                content: '',
                                container: '#alerts-container',
                                placement: 'top',
                                duration: 3,
                                type: 'success',
                                show: true
                            });
                        },
                        function( response ){
                            errorHandler.processApiResponse( response );
                        }
                    );
                }
            };

            init();
        }]);
})();
