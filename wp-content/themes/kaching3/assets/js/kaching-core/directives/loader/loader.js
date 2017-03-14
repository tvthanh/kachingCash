(function(){
    'use strict';

    angular.module('kachingCore')
        .directive('loader', function(){
            return {
                restrict: 'A',
                templateUrl: templateDirUri + '/assets/js/kaching-core/directives/loader/loaderTmpl.html'
                // templateUrl: 'kaching-core/directives/loader/loaderTmpl.html'// from master
            };
        });

})();
