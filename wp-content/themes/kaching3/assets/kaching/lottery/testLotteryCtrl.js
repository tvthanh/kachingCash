(function(){
    'use strict';
    angular.module('panelApp')
        .controller( 'testLotteryCtrl', [
            '$scope',
        function (
            $scope
        ) {
            var $lotterEl = angular.element('#lottery-control');
            window.lottery = undefined;
            function initLotteryControl() {
                if (!KachingLottery) {
                    return;
                } else {
                    lottery = new KachingLottery($lotterEl);
                }
            }
            var init = function() {
                initLotteryControl();
            };
            init();
        }]);
})();
