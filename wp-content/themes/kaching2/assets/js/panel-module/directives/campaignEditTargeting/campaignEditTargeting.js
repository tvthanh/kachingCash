(function(){
    "use strict";

    angular.module('panelApp')
        .directive("campaignEditTargeting", [
            '$q',
            '$alert',
            '$state',
            '$stateParams',
            'campaignsService',
            'errorHandler',
            'utils',
        function(
            $q,
            $alert,
            $state,
            $stateParams,
            campaignsService,
            errorHandler,
            utils
        ){
            return {
                restrict: 'A',
                scope: {},
                templateUrl: 'panel-module/directives/campaignEditTargeting/campaignEditTargetingTmpl.html',
                controller: function( $scope ){

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

                    $scope.campaignId = $stateParams.campaignId;

                    var init = function() {

                        $scope.view.busy = true;

                        campaignsService.getTargeting( $scope.campaignId ).then(
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

                    };

                    $scope.saveForm = function() {

                        $scope.view.busy = true;

                        campaignsService.saveTargeting( $scope.campaignId, $scope.data ).then(
                            function( response ) {
                                $scope.view.showErrors = false;
                                $scope.view.busy = false;
                                $alert({
                                    title: 'Campaign details have been saved.',
                                    content: '',
                                    container: '#alerts-container',
                                    placement: 'top',
                                    duration: 3,
                                    type: 'success',
                                    show: true
                                });
                            },
                            function( response ) {
                                $scope.view.busy = false;
                                if ( typeof response === 'object' && ! _.isEmpty( response.validationErrors ) ) {
                                    $scope.view.showErrors = true;
                                    $scope.view.errors = response.validationErrors;
                                } else {
                                    errorHandler.processApiResponse( response );
                                }
                            }
                        );
                    };

                    $scope.resetError = function( errorName ) {
                        if ( typeof $scope.view.errors[errorName] !== 'undefined' ) {
                            delete $scope.view.errors[errorName];
                        }
                    };

                    $scope.cancelEdit = function() {
                        $state.go('campaigns');
                    };

                    init();
                }
            };
        }]);

})();