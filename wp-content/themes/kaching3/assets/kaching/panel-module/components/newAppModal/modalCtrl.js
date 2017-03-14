(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'newAppModalCtrl', [
            '$scope',
            'errorHandler',
            'utils',
            'modalOptions',
            'applicationsService',
        function (
            $scope,
            errorHandler,
            utils,
            modalOptions,
            applicationsService
        ) {

            $scope.fieldHasError = utils.fieldHasError;

            $scope.view = {
                loading: true,
                sending: false,
                showErrors: false,
                categoriesError: false
            };

            $scope.data = {
                appName: '',
                categories: [],
                selectedCategories: []
            };

            var init = function() {

                $scope.view.loading = true;

                applicationsService.getCategories().then(
                    function( response ) {
                        $scope.data.categories = response;
                        $scope.setSelectedCategories();
                        $scope.view.loading = false;
                    },
                    function(response ) {
                        errorHandler.processApiResponse( response );
                        $scope.$hide();
                    }
                );
            };

            $scope.setSelectedCategories = function() {

                $scope.data.selectedCategories = [];

                angular.forEach( $scope.data.categories, function( category ){
                    if ( category.selected ) {
                        $scope.data.selectedCategories.push( category.id );
                    }
                });

                $scope.view.categoriesError = ( $scope.data.selectedCategories.length === 0 ) ? true : false;
            };

            $scope.clearCustomErrors = function() {
                $scope.form1.key_name.$setValidity( 'nameUnique', true );
            };

            var hasNameError = function( response ) {
                var error = _.findWhere( response.data.errorDetails.paramsMistake.mistakenParams, {name:'name'} );
                return ( typeof error !== 'undefined' ) ? true : false;
            };

            $scope.formSubmit = function() {

                $scope.view.sending = true;

                if ( $scope.form1.$valid && $scope.view.categoriesError === false ) {

                    applicationsService.addApp( $scope.data.appName, $scope.data.selectedCategories ).then(
                        function( app ){
                            modalOptions.submit( app );
                            $scope.$hide();
                        },
                        function( response ){

                            if ( response.status === 400 && hasNameError( response ) ) {
                                $scope.form1.key_name.$setValidity('nameUnique', false);
                                $scope.view.sending = false;
                                $scope.view.showErrors = true;
                            } else {
                                errorHandler.processApiResponse( response );
                                $scope.$hide();
                            }
                        }
                    );

                } else {
                    $scope.view.sending = false;
                    $scope.view.showErrors = true;
                }
            };

            init();
        }]);
})();
