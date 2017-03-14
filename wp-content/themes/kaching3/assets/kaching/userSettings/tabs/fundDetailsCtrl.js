(function() {
    'use strict';

    angular.module('kachingCore')
        .controller('fundDetailsCtrl', [
            '$scope',
            function($scope) {

                var dataFundDetails = [
                    {
                        title: 'Coca Cola',
                        view: '354',
                        conversion: '10.5',
                        numPayout: '25,000',
                        totalFund: '1,000,000'
                    },
                    {
                        title: 'Nike',
                        view: '296',
                        conversion: '25',
                        numPayout: '100,000',
                        totalFund: '550,000'
                    },
                    {
                        title: 'Starbucks',
                        view: '64',
                        conversion: '45',
                        numPayout: '80,000',
                        totalFund: '230,000'
                    },
                    {
                        title: 'Apple',
                        view: '784',
                        conversion: '87',
                        numPayout: '1,350,000',
                        totalFund: '2,300,000'
                    },
                    {
                        title: 'Vans',
                        view: '59',
                        conversion: '12',
                        numPayout: '8,000',
                        totalFund: '150,000'
                    },
                    {
                        title: 'Samsung',
                        view: '873',
                        conversion: '77',
                        numPayout: '900,000',
                        totalFund: '2,300,000'
                    },
                    {
                        title: 'Camper',
                        view: '109',
                        conversion: '43',
                        numPayout: '81,000',
                        totalFund: '350,000'
                    },
                    {
                        title: 'Sony',
                        view: '45',
                        conversion: '52',
                        numPayout: '700,000',
                        totalFund: '1,500,000'
                    }
                ];

                $scope.dataFundDetails = dataFundDetails;

            }
        ]);
})();
