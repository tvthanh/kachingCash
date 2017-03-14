(function() {
    'use strict';

    angular.module('panelApp')
        .filter('coinMappingFilter', ['$window', '$rootScope', function($window, $rootScope) {
            return (items, country) => {
                var dataFilterCountry = country ?
                    items.filter((item) => {
                        return item.country.toLowerCase().indexOf(country.toLowerCase()) > -1 ? true : false;
                    }) :
                    items;

                var filteredData = dataFilterCountry;
                $rootScope.kaching.coinMappingFilteredDataLength = filteredData.length;
                return filteredData;

            };
        }]);

})();
