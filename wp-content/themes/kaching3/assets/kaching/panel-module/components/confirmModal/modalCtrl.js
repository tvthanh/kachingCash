(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'confirmModalCtrl', [
            '$scope',
            '$alert',
            'mediaService',
            'modalOptions',
            'modalData',
            'modalTitle',
            'modalContent',
            'cancelText',
            'okText',
        function (
            $scope,
            $alert,
            mediaService,
            modalOptions,
            modalData,
            modalTitle,
            modalContent,
            cancelText,
            okText
        ) {
            $scope.title = modalTitle;
            $scope.content = modalContent;
            $scope.cancelText = cancelText;
            $scope.okText = okText;

            $scope.modalData = modalData;

            $scope.okFunction = function() {
                modalOptions.okFunction(modalData);
                $scope.$hide();
            };
        }]);
})();
