(function(){
    "use strict";

    angular.module('panelApp')
        .controller( 'campaignEditorStep3Ctrl', [
            '$scope',
            '$state',
            'utils',
            'errorHandler',
            'campaignsService',
            'campaignEditorService',
            '$timeout',
        function (
            $scope,
            $state,
            utils,
            errorHandler,
            campaignsService,
            campaignEditorService,
            $timeout
        ) {

            var editor = campaignEditorService;
            $scope.fieldHasError = utils.fieldHasError;

            $scope.hasBudget = false;

            $scope.view = {
                busy: false,
                showCharts: false
            };

            $scope.data = {
                budgetType: 'ongoing',
                bidAmount: undefined,
                budgetAmount: undefined
            };

            $scope.estViews = {
                daily: { percentage: 0, min: 0, max: 0 },
                total: { percentage: 0, min: 0, max: 0 }
            };

            $scope.estDailyViewsChart = {
                data: [ $scope.estViews.daily.percentage, 100 - $scope.estViews.daily.percentage ],
                labels: ['', ''],
                colours: [ '#f9cd3f', '#dae2e5' ],
                options: {
                    animationEasing: 'easeOutQuart',
                    showTooltips: false,
                    segmentShowStroke: false,
                    percentageInnerCutout: 85
                }
            };

            $scope.estTotalViewsChart = {
                data: [ $scope.estViews.total.percentage, 100 - $scope.estViews.total.percentage ],
                labels: ['', ''],
                colours: [ '#343b45', '#dae2e5' ],
                options: {
                    animationEasing: 'easeOutQuart',
                    showTooltips: false,
                    segmentShowStroke: false,
                    percentageInnerCutout: 85
                }
            };

            var mapBudgetType = function( type ) {
                var types = [ 'ongoing', 'fixed', 'daily' ];
                if ( typeof type === 'number' ) {
                    return types[ type - 1 ];
                } else if ( typeof type === 'string' ) {
                    type = types.indexOf( type );
                    return type + 1;
                }
            };

            var init = function() {

                if (
                    ! editor.stepGet('step1', 'valid') ||
                    ! editor.stepGet('step2', 'valid')
                ) {
                    $state.go( editor.previousState() );
                }

                editor.currentStep('step3');
                editor.previousState( 'campaigns.' + editor.mode() + '.step3' );

                var budgetingData = editor.dataGet('budgeting');

                if (  ! _.isEmpty( budgetingData ) ) {

                    $scope.data = budgetingData;
                    $scope.hasBudget = true;

                    $timeout(function(){
                        updateEstimatedViews();
                    }, 300 );

                } else {

                    $timeout(function(){
                        updateEstimatedViews();
                    }, 300 );
                }
            };

            $scope.changedBid = function() {
                updateEstimatedViews();
            };

            var updateEstimatedViews = function() {
                if ( typeof $scope.data.bidAmount === 'undefined' ) {
                    $scope.estViews = {
                        daily: { percentage: 0, min: 0, max: 0 },
                        total: { percentage: 0, min: 0, max: 0 }
                    };
                    updateCharts();
                    $scope.view.showCharts = true;
                } else {
                    campaignsService.getEstimatedViews( editor.dataGet('campaignId'), $scope.data.bidAmount ).then(
                        function( response ) {
                            $scope.estViews = response;
                            updateCharts();
                            $scope.view.showCharts = true;
                        },
                        function( response ) {
                            errorHandler.processApiResponse( response );
                        }
                    );
                }
            };

            var updateCharts = function() {
                $scope.estDailyViewsChart.data = [ $scope.estViews.daily.percentage, 100 - $scope.estViews.daily.percentage ];
                $scope.estTotalViewsChart.data = [ $scope.estViews.total.percentage, 100 - $scope.estViews.total.percentage ];
            };

            $scope.showErrors = function() {
                return editor.stepGet('step3', 'submitted');
            };

            $scope.previousStep = function() {
                $state.go( 'campaigns.' + editor.mode() + '.step2' );
            };

            $scope.nextStep = function() {

                editor.stepSet('step3', 'submitted', true);

                if ( $scope.form1.$valid ) {

                    $scope.view.busy = true;

                    var data = {
                        cost_per_view: $scope.data.bidAmount,
                        amount: $scope.data.budgetAmount,
                        type: mapBudgetType( $scope.data.budgetType )
                    };

                    if ( $scope.data.budgetType === 'ongoing' ) {
                        data.amount = 0;
                    }

                    campaignsService.saveCampaignBudget( editor.dataGet( 'campaignId' ), data, $scope.hasBudget ).then(
                        function( response ) {
                            editor.stepSet('step3', 'valid', true);
                            editor.dataSet('budgeting', $scope.data);
                            $state.go( 'campaigns.' + editor.mode() + '.step4' );
                        },
                        function( response ) {
                            errorHandler.processApiResponse( response );
                        }
                    );
                }
            };

            init();

        }]);
})();
