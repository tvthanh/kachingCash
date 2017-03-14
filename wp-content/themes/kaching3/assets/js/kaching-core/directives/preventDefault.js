(function(){
    'use strict';

    angular.module('kachingCore')
        .directive('preventDefault', function() {
            return {
                restrict: 'A',
                link: function( scope, element, attrs ) {
                    if( attrs.ngClick || attrs.href === '' || attrs.href === '#' ){
                        element.on('click', function(e){
                            e.preventDefault();
                        });
                    }
                }
            };
        });

})();