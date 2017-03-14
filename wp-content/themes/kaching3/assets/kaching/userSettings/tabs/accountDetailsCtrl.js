(function(){
    'use strict';

    angular.module('kachingCore')
        .controller( 'accountDetailsCtrl', [
            '$scope',
            '$rootScope',
            'errorHandler',
            '$modal',
            'utils',
            'userService',
            'FileUploader',
        function (
            $scope,
            $rootScope,
            errorHandler,
            $modal,
            utils,
            userService,
            FileUploader
        ) {

            // Show / hide edit card form
            $scope.toggleCardForm = function() {
                $scope.isVisibleCardForm = !$scope.isVisibleCardForm;
            };

            $scope.profileImageUploader = new FileUploader();

            $scope.previewImage = function(event) {
                var imageFile = event.target.files[0];
                var reader = new FileReader();
                reader.readAsDataURL(imageFile);
                reader.addEventListener('load', function() {
                    angular.element('#profileImage').css('background-image', 'url(' + reader.result + ')');
                });
            };

            var init = function() {
                $scope.isVisibleCardForm = true;
                $scope.notification = {
                    emailSetting: true,
                    fundSetting: true,
                    maintanenceSetting: false
                };
            };

            init();

        }]);
})();
