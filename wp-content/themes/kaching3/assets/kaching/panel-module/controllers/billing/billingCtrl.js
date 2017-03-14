(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'billingCtrl', [
            '$scope',
            '$modal',
            '$filter',
            'errorHandler',
            'billingService',
            'userService',
        function (
            $scope,
            $modal,
            $filter,
            errorHandler,
            billingService,
            userService
        ) {

            var itemsPerPage = 10;

            $scope.view = {
                initialLoadComplete: false,
                itemsPerPage: itemsPerPage,
                currentPage: 1,
                maxSize: 10
            };

            $scope.data = {
                transactionsCount: 0,
                transactions: [],
                user: {
                    hasBillingDetails: false
                }
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

                userService.getUser().then(
                    function( user ) {

                        $scope.data.user.firstName  = user.firstName;
                        $scope.data.user.lastName   = user.lastName;
                        $scope.data.user.company    = user.company;
                        $scope.data.user.country    = user.country;
                        $scope.data.user.city       = user.city;
                        $scope.data.user.address    = user.address;
                        $scope.data.user.postalCode = user.postalCode;
                        $scope.data.user.hasBillingDetails = userHasBillingDetails();

                        getTransactions();
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            };

            function userHasBillingDetails () {
                if ( $scope.data.user.firstName === '' ) { return false; }
                if ( $scope.data.user.lastName === '' ) { return false; }
                if ( $scope.data.user.company === '' ) { return false; }
                if ( $scope.data.user.country === undefined ) { return false; }
                if ( $scope.data.user.city === '' ) { return false; }
                if ( $scope.data.user.address === '' ) { return false; }
                if ( $scope.data.user.postalCode === '' ) { return false; }
                return true;
            }

            $scope.changePage = function() {
                getTransactions();
            };

            $scope.reloadTransactions = function() {
                $scope.view.currentPage = 1;
                getTransactions();
            };

            function getTransactions () {

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

                billingService.getTransactions( params ).then(
                    function( transactions ) {
                        $scope.data.transactionsCount = transactions.count;
                        $scope.data.transactions = transactions.results;
                        $scope.view.initialLoadComplete = true;
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            }

            $scope.updateFilters = function() {
                $scope.reloadTransactions();
            };

            $scope.getInvoicePdf = function( transactionId ) {

                var modal = $modal({
                    templateUrl: '/panel-module/components/invoiceDownloadModal/modalTmpl.html',
                    animation: 'am-fade-and-scale',
                    placement: 'center'
                });

                billingService.getInvoicePdf( transactionId ).then(
                    function( response ){
                        modal.$promise.then(modal.hide);
                    },
                    function( response ){
                        errorHandler.processApiResponse( response );
                        modal.$promise.then(modal.hide);
                    }
                );
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

            init();
        }]);
})();
