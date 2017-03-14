(function() {
    "use strict";

    angular.module('panelApp')
        .controller('productEditCtrl', [
            '$scope',
            '$state',
            '$stateParams',
            '$alert',
            'apiUrl',
            'utils',
            'authToken',
            'errorHandler',
            'FileUploader',
            'productsService',
            function(
                $scope,
                $state,
                $stateParams,
                $alert,
                apiUrl,
                utils,
                authToken,
                errorHandler,
                FileUploader,
                productsService
            ) {

                var uploader = $scope.uploader = new FileUploader({
                    method: 'PATCH',
                    headers: {
                        'Authorization': 'Token ' + authToken.get()
                    }
                });

                $scope.fieldHasError = utils.fieldHasError;
                $scope.urlRegex = utils.urlRegex();

                $scope.view = {
                    busy: false,
                    submitted: false,
                    uploading: false,
                    uploadStarted: false,
                    uploadProgress: 0,
                    uploadComplete: false
                };

                $scope.data = {
                    productId: $stateParams.productId,
                    product: {},
                    imageFile: '',
                    newImageAdded: false
                };

                var init = function() {

                    utils.addUploaderTypeFilter(uploader, 'image', {
                        imageFilter: ['image/png', 'image/jpg', 'image/jpeg']
                    });

                    $scope.view.busy = true;
                    productsService.getProduct($scope.data.productId).then(
                        function(product) {
                            $scope.data.product = product;
                            $scope.data.imageFile = product.image || product.image_url;
                            $scope.view.busy = false;
                        },
                        function( response ) {
                            $scope.view.busy = false;
                            errorHandler.processApiResponse( response );
                            $scope.$hide();
                        }
                    );
                };

                var success = function() {
                    $alert({
                        title: 'Product saved.',
                        content: '',
                        container: '#alerts-container',
                        placement: 'top',
                        duration: 3,
                        type: 'success',
                        show: true
                    });
                    $state.go('products');
                };

                uploader.onAfterAddingFile = function(item) {
                    utils.cleanupUploaderQueue(uploader);
                    $scope.data.imageFile = item._file;
                    $scope.data.newImageAdded = true;
                };

                uploader.onBeforeUploadItem = function(item) {
                    $scope.view.uploading = true;
                    $scope.view.uploadStarted = true;
                    item.url = apiUrl + '/products/' + $scope.data.productId + '/';
                };

                uploader.onProgressItem = function(fileItem, progress) {
                    $scope.view.uploadProgress = progress;
                };

                uploader.onSuccessItem = function(item, response, status, headers) {
                    $scope.view.uploadComplete = true;
                    success();
                };

                $scope.showErrors = function() {
                    return $scope.view.submitted;
                };

                $scope.imageHasError = function() {
                    return ($scope.data.newImageAdded && typeof $scope.data.imageFile !== 'object');
                };

                $scope.saveProduct = function() {
                    $scope.view.submitted = true;
                    if ($scope.form1.$valid) {
                        $scope.view.uploading = true;
                        productsService.updateProduct($scope.data.product).then(
                            function() {
                                if ($scope.data.newImageAdded) {
                                    uploader.uploadAll();
                                } else {
                                    success();
                                }
                            },
                            function() {}
                        );
                    }
                };

                init();
            }
        ]);

})();
