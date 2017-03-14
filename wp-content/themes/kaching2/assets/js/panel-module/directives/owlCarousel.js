(function(){
    "use strict";

    angular.module('panelApp')
        .directive("owlCarousel", function() {
            return {
                restrict: 'EA',
                transclude: false,
                link: function( scope, element, attrs ) {

                    scope.initCarousel = function() {

                        var defaultOptions = {};
                        var customOptions = scope.$eval($(element).attr('data-options'));

                        for (var key in customOptions) {
                            defaultOptions[key] = customOptions[key];
                        }

                        $(element).owlCarousel(defaultOptions);
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