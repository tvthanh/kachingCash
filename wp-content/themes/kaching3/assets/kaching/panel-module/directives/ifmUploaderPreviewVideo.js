(function(){
    'use strict';

    angular.module('panelApp')
        .directive('ifmUploaderPreviewVideo', ['$window', function( $window ) {
            return {
                restrict: 'A',
                link: function( scope, el, attr, ctrl ) {

                    scope.$watch( attr.ifmUploaderPreviewVideo, function( newValue, oldValue ) {
                        console.log('ifmUploaderPreviewVideo - newValue', newValue);
                        if ( typeof newValue === 'object' ) {
                            el.addClass('video-selected');
                        }
                    });

                }
            };
        }]);

})();
