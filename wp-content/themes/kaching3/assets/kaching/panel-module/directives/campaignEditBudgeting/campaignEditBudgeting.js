(function(){
    'use strict';

    angular.module('panelApp')
        .directive('campaignEditBudgeting', [
            '$alert',
            '$state',
            '$stateParams',
            '$timeout',
            'campaignsService',
            'errorHandler',
            'utils',
        function(
            $alert,
            $state,
            $stateParams,
            $timeout,
            campaignsService,
            errorHandler,
            utils
        ){
            return {
                restrict: 'A',
                scope: {},
                // templateUrl: 'panel-module/directives/campaignEditBudgeting/campaignEditBudgetingTmpl.html',
                templateUrl: templateDirUri + '/assets/kaching/panel-module/directives/campaignEditBudgeting/campaignEditBudgetingTmpl.html',
                controller: function( $scope ){

                    $scope.fieldHasError = utils.fieldHasError;

                    $scope.hasBudget = true;

                    $scope.view = {
                        busy: false,
                        showCharts: false,
                        submitted: false
                    };

                    $scope.data = {
                        campaignId: $stateParams.campaignId,
                        budgetId: undefined,
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

                        $scope.view.busy = true;

                        campaignsService.getCampaignBudget( $scope.data.campaignId ).then(
                            function( response ) {
                                if ( typeof response === 'undefined' ) {
                                    $scope.hasBudget = false;
                                } else {
                                    // $scope.data.budgetId = response.id;
                                    // $scope.data.bidAmount = response.cost_per_view;
                                    // $scope.data.budgetAmount = response.amount;
                                    // $scope.data.budgetType = mapBudgetType( response.type );
                                    if (response.results && response.results[0]) {
                                        var data = response.results[0];
                                        $scope.data.budgetId = data.id;
                                        $scope.data.bidAmount = data.cost_per_view;
                                        $scope.data.budgetAmount = data.amount;
                                        $scope.data.budgetType = mapBudgetType( data.type );
                                    }
                                }
                                $scope.view.busy = false;
                                updateEstimatedViews();
                            },
                            function( response ) {
                                errorHandler.processApiResponse( response );
                            }
                        );
                    };

                    $scope.changedBid = function() {
                        updateEstimatedViews();
                    };

                    function updateEstimatedViews () {
                        if ( typeof $scope.data.bidAmount === 'undefined' ) {
                            $scope.estViews = {
                                daily: { percentage: 0, min: 0, max: 0 },
                                total: { percentage: 0, min: 0, max: 0 }
                            };
                            updateCharts();
                            $scope.view.showCharts = true;
                        } else {
                            campaignsService.getEstimatedViews( $scope.data.campaignId, $scope.data.bidAmount ).then(
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
                    }

                    function updateCharts () {
                        $scope.estDailyViewsChart.data = [ $scope.estViews.daily.percentage, 100 - $scope.estViews.daily.percentage ];
                        $scope.estTotalViewsChart.data = [ $scope.estViews.total.percentage, 100 - $scope.estViews.total.percentage ];
                    }

                    $scope.showErrors = function() {
                        return $scope.view.submitted;
                    };

                    $scope.saveForm = function() {

                        $scope.view.submitted = true;

                        if ( $scope.form1.$valid ) {

                            var data = {
                                cost_per_view: $scope.data.bidAmount,
                                amount: $scope.data.budgetAmount,
                                type: mapBudgetType( $scope.data.budgetType )
                            };

                            if ( $scope.data.budgetType === 'ongoing' ) {
                                data.amount = 0;
                            }

                            campaignsService.saveCampaignBudget( $scope.data.campaignId, data, $scope.hasBudget, $scope.data.budgetId ).then(
                                function( response ) {
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
                                function( response ) {
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
