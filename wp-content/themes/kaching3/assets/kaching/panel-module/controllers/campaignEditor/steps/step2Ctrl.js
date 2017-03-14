(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'campaignEditorStep2Ctrl', [
            '$scope',
            '$state',
            '$sce',
            'utils',
            '$modal',
            'errorHandler',
            'campaignsService',
            'campaignEditorService',
        function (
            $scope,
            $state,
            $sce,
            utils,
            $modal,
            errorHandler,
            campaignsService,
            campaignEditorService
        ) {

            var editor = campaignEditorService;
            $scope.fieldHasError = utils.fieldHasError;

            $scope.view = {
                busy: false,
                showErrors: false,
                errors: {},
                ageRanges: []
            };

            $scope.data = {
                allCategories: true,
                allLocations: true,
                categories: [],
                locations: [],
                gender: {
                    male: true,
                    female: true
                },
                os: {
                    ios: true,
                    android: true
                },
                ageRange: undefined
            };

            var init = function() {

                if ( ! editor.stepGet('step1', 'valid') ) {
                    $state.go( editor.previousState() );
                }

                editor.currentStep('step2');
                editor.previousState( 'campaigns.' + editor.mode() + '.step2' );

                var targetingData = editor.dataGet('targeting');
                if (  ! _.isEmpty( targetingData ) ) {

                    $scope.data = targetingData;

                } else {

                    $scope.view.busy = true;

                    campaignsService.getTargeting().then(
                        function( response ) {
                            $scope.data.allCategories  = response.allCategories;
                            $scope.data.allLocations   = response.allLocations;
                            $scope.data.categories     = response.categories;
                            $scope.data.locations      = response.locations;
                            $scope.data.gender         = response.gender;
                            $scope.data.os             = response.os;
                            $scope.data.ageRange       = response.ageRange;
                            $scope.view.ageRanges      = response.ageRanges;
                            $scope.view.busy = false;
                        },
                        function( response ) {
                            errorHandler.processApiResponse( response );
                        }
                    );
                }

            };

            $scope.nextStep = function() {

                $scope.view.busy = true;
                editor.stepSet('step2', 'submitted', true);

                campaignsService.saveTargeting( editor.dataGet( 'campaignId' ), $scope.data ).then(
                    function( response ) {
                        editor.stepSet('step2', 'valid', true);
                        editor.dataSet('targeting', $scope.data);
                        $state.go( 'campaigns.' + editor.mode() + '.step3' );
                    },
                    function( response ) {
                        $scope.view.busy = false;
                        editor.stepSet('step2', 'valid', false);
                        if ( typeof response === 'object' && ! _.isEmpty( response.validationErrors ) ) {
                            $scope.view.showErrors = true;
                            $scope.view.errors = response.validationErrors;
                        } else {
                            errorHandler.processApiResponse( response );
                        }
                    }
                );
            };

            $scope.previousStep = function() {
                $state.go( 'campaigns.' + editor.mode() + '.step1' );
            };

            $scope.resetError = function( errorName ) {
                if ( typeof $scope.view.errors[errorName] !== 'undefined' ) {
                    delete $scope.view.errors[errorName];
                }
            };

            $scope.updateDataModel = function(e, obj) {
                e.preventDefault();
                obj.selected = !obj.selected;
            };

            init();

        }]);
})();
