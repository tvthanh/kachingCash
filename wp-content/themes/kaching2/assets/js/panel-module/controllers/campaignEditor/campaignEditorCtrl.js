(function(){
    "use strict";

    angular.module('panelApp')
        .controller( 'campaignEditorCtrl', [
            '$scope',
            '$state',
            '$stateParams',
            'campaignEditorService',
        function (
            $scope,
            $state,
            $stateParams,
            campaignEditorService
        ) {

            var editor = campaignEditorService;

            $scope.logData = function() {
                editor.logData();
            };

            editor.init( $stateParams.campaignId );
            $scope.currentStep = editor.currentStep;

            $scope.states = {
                step1: 'campaigns.' + editor.mode() + '.step1',
                step2: 'campaigns.' + editor.mode() + '.step2',
                step3: 'campaigns.' + editor.mode() + '.step3',
                step4: 'campaigns.' + editor.mode() + '.step4',
                step5: 'campaigns.' + editor.mode() + '.step5',
                step6: 'campaigns.' + editor.mode() + '.step6'
            };

            $state.go( $scope.states.step1 );
        }]);
})();