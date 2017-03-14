(function(){
    'use strict';

    angular.module('kachingCore')
        .directive('panelTitle', [ '$rootScope', '$timeout', '$state', function( $rootScope, $timeout, $state ) {
            return {
                link: function( scope, el, attrs, ctrl ) {

                    var originalTitle = el.text();

                    $rootScope.$on('$stateChangeSuccess', function() {
                        var stateTitle = '';
                        if ( typeof $state.$current.data === 'object' && typeof $state.$current.data.title !== 'undefined' ) {
                            stateTitle = $state.$current.data.title + ' – ';
                        }
                        $timeout(function() {
                            el.text( stateTitle + originalTitle );
                        });
                    });
                }
            };
        }]);

})();
