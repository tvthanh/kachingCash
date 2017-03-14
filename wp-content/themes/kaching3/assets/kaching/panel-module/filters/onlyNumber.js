(function(){
    'use strict';

    angular.module('panelApp')
        .filter('onlyNumberFilter', function () {
            return function (number) {
                if (!number) return number;
                var val = '' + number;
                return val.replace(/\+|\-/g,'');
            };
        });
})();
