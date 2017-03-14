(function(){
    "use strict";

    angular.module('panelApp')
        .controller( 'campaignEditorStep1Ctrl', [
            '$scope',
            '$state',
            '$stateParams',
            'errorHandler',
            'campaignEditorService',
            'utils',
        function (
            $scope,
            $state,
            $stateParams,
            errorHandler,
            campaignEditorService,
            utils
        ) {

            var editor = campaignEditorService;
            $scope.fieldHasError = utils.fieldHasError;

            $scope.view = {
                busy: true
            };

            $scope.campaign = {};

            $scope.daterange = {
                dates: {
                    startDate: null,
                    endDate:   null
                },
                min: moment().format('YYYY-MM-DD'),
                display: 'Select date range'
            };

            var init = function() {

                editor.currentStep('step1');
                editor.previousState( 'campaigns.' + editor.mode() + '.step1' );

                $scope.campaign = editor.dataGet('campaign');

                if ( typeof $scope.campaign.start_date !== 'undefined' && typeof $scope.campaign.end_date !== 'undefined' ) {
                    $scope.daterange.dates.startDate = moment.utc( $scope.campaign.start_date );
                    $scope.daterange.dates.endDate   = moment.utc( $scope.campaign.end_date );
                    $scope.daterange.display = $scope.daterange.dates.startDate.format('YYYY-MM-DD') + ' - ' + $scope.daterange.dates.endDate.format('YYYY-MM-DD');
                }

                $scope.view.busy = false;

            };

            $scope.$watch( function(){ return $scope.daterange.dates; }, function(newValue, oldValue) {
                if ( newValue === undefined || newValue.startDate === null || newValue.endDate === null ) {
                    return;
                }
                $scope.daterange.display = newValue.startDate.format('YYYY-MM-DD') + ' - ' + newValue.endDate.format('YYYY-MM-DD');
            });

            $scope.showErrors = function() {
                return editor.stepGet('step1', 'submitted');
            };

            $scope.nextStep = function() {

                editor.stepSet('step1', 'submitted', true);

                if ( $scope.form1.$valid ) {

                    editor.stepSet('step1', 'valid', true);

                    $scope.campaign.start_date = moment( $scope.daterange.dates.startDate ).format('YYYY-MM-DD') + 'T00:00:00.000Z';
                    $scope.campaign.end_date = moment( $scope.daterange.dates.endDate ).format('YYYY-MM-DD') + 'T23:59:59.999Z';
                    editor.dataSet('campaign', $scope.campaign);

                    editor.save('step1').then(
                        function(){
                            $state.go( 'campaigns.' + editor.mode() + '.step2' );
                        },
                        function( response ){
                            errorHandler.processApiResponse( response );
                        }
                    );

                } else {
                    editor.stepSet('step1', 'valid', false);
                }
            };

            $scope.logControllerData = function() {
                console.log('campaignEditorStep1Ctrl - campaign', angular.copy( $scope.campaign ) );
            };

            init();

        }]);
})();
