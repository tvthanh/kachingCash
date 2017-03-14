(function(){
    'use strict';

    angular.module('panelApp')
        .directive('campaignEditDetails', [
            '$alert',
            '$state',
            '$stateParams',
            '$filter',
            'utils',
            'errorHandler',
            'campaignsService',
        function(
            $alert,
            $state,
            $stateParams,
            $filter,
            utils,
            errorHandler,
            campaignsService
        ){
            return {
                restrict: 'A',
                scope: {},
                // templateUrl: 'panel-module/directives/campaignEditDetails/campaignEditDetailsTmpl.html',
                templateUrl: templateDirUri + '/assets/kaching/panel-module/directives/campaignEditDetails/campaignEditDetailsTmpl.html',
                controller: function( $scope ){

                    $scope.fieldHasError = utils.fieldHasError;

                    $scope.view = {
                        busy: false,
                        submitted: false
                    };

                    $scope.data = {
                        campaignId: $stateParams.campaignId,
                        campaign: {}
                    };

                    $scope.daterange = {
                        dates: {
                            startDate: null,
                            endDate:   null
                        },
                        min: moment().format('YYYY-MM-DD'),
                        display: 'Select date range'
                    };

                    var init = function() {

                        $scope.view.busy = true;

                        campaignsService.getCampaign( $scope.data.campaignId ).then(
                            function( campaign ){
                                $scope.data.campaign = campaign;

                                if ( typeof campaign.start_date !== 'undefined' && typeof campaign.end_date !== 'undefined' ) {
                                    $scope.daterange.dates.startDate = moment.utc( campaign.start_date );
                                    $scope.daterange.dates.endDate = moment.utc( campaign.end_date );
                                    $scope.daterange.display = $scope.daterange.dates.startDate.format('YYYY-MM-DD') + ' - ' + $scope.daterange.dates.endDate.format('YYYY-MM-DD');
                                }

                                $scope.view.busy = false;
                            },
                            function( response ) {
                                errorHandler.processApiResponse( response );
                            }
                        );

                    };

                    $scope.$watch( function(){ return $scope.daterange.dates; }, function(newValue, oldValue) {
                        if ( newValue === undefined || newValue.startDate === null || newValue.endDate === null ) {
                            return;
                        }
                        $scope.daterange.display = newValue.startDate.format('YYYY-MM-DD') + ' - ' + newValue.endDate.format('YYYY-MM-DD');
                    });

                    $scope.showErrors = function() {
                        return $scope.view.submitted;
                    };

                    $scope.saveForm = function() {

                        $scope.view.submitted = true;

                        if ( $scope.form1.$valid ) {

                            var data = {
                                id: $scope.data.campaignId,
                                name: $scope.data.campaign.name,
                                start_date: moment( $scope.daterange.dates.startDate ).format('YYYY-MM-DD') + 'T00:00:00.000Z',
                                end_date: moment( $scope.daterange.dates.endDate ).format('YYYY-MM-DD') + 'T23:59:59.999Z'
                            };

                            console.log('save',data);

                            campaignsService.saveCampagin( data ).then(
                                function(){
                                    $alert({
                                        title: 'Campaign details have been saved.',
                                        content: '',
                                        container: '#alerts-container',
                                        placement: 'top',
                                        duration: 3,
                                        type: 'success',
                                        show: true
                                    });
                                    campaignsService.setPrepared( $scope.data.campaignId );
                                },
                                function( response ){
                                    errorHandler.processApiResponse( response );
                                }
                            );
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
