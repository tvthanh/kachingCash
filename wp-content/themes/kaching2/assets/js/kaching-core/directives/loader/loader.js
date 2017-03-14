(function(){
    "use strict";

    angular.module('kachingCore')
        .directive("loader", function(){
            return {
                restrict: 'A',
                templateUrl: 'kaching-core/directives/loader/loaderTmpl.html'
            };
        });

})();