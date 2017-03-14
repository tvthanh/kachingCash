(function(){
    'use strict';

    angular.module('panelApp')
        .directive('owlCarousel', function() {
            return {
                restrict: 'EA',
                transclude: false,
                link: function( scope, element, attrs ) {
                    scope.initCarousel = function() {

                        var defaultOptions = {};
                        var customOptions = scope.$eval(angular.element(element).attr('data-options'));

                        for (var key in customOptions) {
                            if(customOptions.hasOwnProperty(key)) {
                                defaultOptions[key] = customOptions[key];
                            }
                        }

                        var $owl = angular.element(element);
                        $owl.trigger('destroy.owl.carousel');
                        $owl.owlCarousel(defaultOptions);
                        $owl.on('changed.owl.carousel', function(event) {
                            var owlStageOuter = event.currentTarget.children[0];
                            var owlStage = owlStageOuter.children[0];
                            if(event.item.index != null){
                                if(owlStage.children === undefined) {return;}
                                var owlItem = owlStage.children[event.item.index + 1];
                                if( owlItem !== undefined && owlItem.children.length === 0){
                                    $owl.trigger('prev.owl.carousel');
                                }
                            }
                        });
                    };

                    scope.destroyCarousel = function() {
                        angular.element(element).owlCarousel('destroy');
                    };
                }
            };
        });

    angular.module('panelApp')
        .directive('owlCarouselItem', [function() {
            return {
                restrict: 'A',
                transclude: false,
                link: function(scope, element) {
                    // wait for the last item in the ng-repeat then call init
                    if (scope.$last) {
                        scope.initCarousel();
                    }
                }
            };
        }]);

})();
