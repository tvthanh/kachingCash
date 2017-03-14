(function(){
    'use strict';

    angular.module('panelApp')
        .directive('ifmClipboard', [ '$tooltip', function( $tooltip ) {
            return {
                restrict: 'A',
                scope: {
                    clipboardSuccess: '&',
                    clipboardError: '&',
                    tooltipTitle: '@',
                    tooltipPlacement: '@',
                    tooltipAnimation: '@'
                },
                link: function( scope, el ) {

                    var tooltipTitle   = ( typeof scope.tooltipTitle === 'undefined') ? 'Copied' : scope.tooltipTitle;
                    var tooltipPlacement = ( typeof scope.tooltipPlacement === 'undefined') ? 'top' : scope.tooltipPlacement;
                    var tooltipAnimation = ( typeof scope.tooltipAnimation === 'undefined') ? 'am-fade-and-scale' : scope.tooltipAnimation;

                    var myTooltip = $tooltip( el, { title: tooltipTitle, placement: tooltipPlacement, animation: tooltipAnimation, trigger: 'manual' } );

                    el.on('mouseout',function(){
                        myTooltip.hide();
                    });

                    var clipboard = new Clipboard(el[0]);

                    clipboard.on('success', function(e) {
                        myTooltip.show();
                        scope.$apply(function () {
                            scope.clipboardSuccess({
                                e: e
                            });
                        });
                    });

                    clipboard.on('error', function(e) {
                        scope.$apply(function () {
                            scope.clipboardError({
                                e: e
                            });
                        });
                    });

                }
            };
        }]);
})();
