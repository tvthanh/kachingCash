(function() {
    'use strict';

    angular.module('panelApp')
        .filter('fundManagementFilter', ['$window', '$rootScope', function($window, $rootScope) {
            return (items, name) => {

                var dataFilterName = name ?
                    items.filter((item) => {
                        return item.name.toLowerCase().indexOf(name.toLowerCase()) > -1 ? true : false;
                    }) :
                    items;
                // $rootScope.kaching.fundManagementFilteredDataLength = dataFilterName.length;

                return dataFilterName;
            };
        }]);

})();
