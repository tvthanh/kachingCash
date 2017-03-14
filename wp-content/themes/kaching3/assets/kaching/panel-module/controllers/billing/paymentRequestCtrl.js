(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'paymentRequestCtrl', [
            '$scope',
            'errorHandler',
            'billingService',
            'userService',
            '$filter',
            '$modal',
        function (
            $scope,
            errorHandler,
            billingService,
            userService,
            $filter,
            $modal
        ) {
            var itemsPerPage = 10;

            $scope.view = {
                initialLoadComplete: false,
                itemsPerPage: itemsPerPage,
                currentPage: 1,
                maxSize: 10
            };

            $scope.data = {
                paymentCount: 0,
                payments: []
            };

            $scope.filters = {};

            $scope.daterange = {
                dates: {
                    startDate: null,
                    endDate:   null
                },
                datepickerLabel: 'Select date range'
            };

            var init = function() {

                getPaymentRequest();
            };

            function getPaymentRequest () {
                var params = {
                    limit: itemsPerPage,
                    offset: itemsPerPage * ($scope.view.currentPage - 1)
                };

                if ( $scope.filters.start_date ) {
                    params.start_date = $scope.filters.start_date;
                }
                if ( $scope.filters.end_date ) {
                    params.end_date = $scope.filters.end_date;
                }

                billingService.getPaymentRequest( params ).then(
                    function( response ) {
                        console.log('payments: ', response);
                        $scope.data.paymentCount = response.count;
                        $scope.data.payments = response.results;
                        $scope.view.initialLoadComplete = true;
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            }

            $scope.updateFilters = function() {
                $scope.reloadPayments();
            };

            $scope.reloadPayments = function() {
                $scope.view.currentPage = 1;
                getPaymentRequest();
            };

            $scope.$watch('daterange.dates.startDate', function(newValue, oldValue) {
                if ( newValue === null ) {
                    return;
                }
                $scope.filters.start_date = moment.utc( $scope.daterange.dates.startDate ).hour(0).minute(0).second(0).format('YYYY-MM-DD');
                $scope.filters.end_date = moment.utc( $scope.daterange.dates.endDate ).hour(23).minute(59).second(59).format('YYYY-MM-DD');
                $scope.daterange.datepickerLabel =  $filter('date')( $scope.filters.start_date, 'yyyy-MM-dd' ) + ' - ' + $filter('date')( $scope.filters.end_date, 'yyyy-MM-dd' );
                $scope.updateFilters();
            });

            $scope.showEditPaymentPopup = function( paymentId ) {
                $modal({
                    // templateUrl: 'panel-module/components/campaignDetailsModal/modalTmpl.html',
                    templateUrl: templateDirUri + '/assets/kaching/panel-module/controllers/billing/editPaymentRequestTmpl.html',
                    controller: 'editPaymentRequestCtrl',
                    animation: 'am-fade-and-scale',
                    resolve: {
                        paymentId: function () {
                            return paymentId;
                        }
                    }
                });
            };

            init();
        }]);
})();
