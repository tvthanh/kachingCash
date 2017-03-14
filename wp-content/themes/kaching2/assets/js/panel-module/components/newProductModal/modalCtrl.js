(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'newProductModalCtrl', [
            '$scope',
            '$state',
            'errorHandler',
            'apiUrl',
            'authToken',
            'utils',
            'productsService',
            'FileUploader',
            'modalOptions',
        function (
            $scope,
            $state,
            errorHandler,
            apiUrl,
            authToken,
            utils,
            productsService,
            FileUploader,
            modalOptions
        ) {

            var uploader = $scope.uploader = new FileUploader({
                url: apiUrl + '/products/',
                method: 'POST',
                headers: {
                    'Authorization': 'Token ' + authToken.get()
                }
            });

            $scope.fieldHasError = utils.fieldHasError;
            $scope.urlRegex = utils.urlRegex();

            $scope.view = {
                uploading: false,
                submitted: false,
                uploadStarted: false,
                uploadProgress: 0,
                uploadComplete: false,
                productCreated: false,
                externalProducts: []
            };

            $scope.data = {
                productId: undefined,
                title: '',
                url: '',
                price: '',
                description: '',
                image: '',
                imageFile: '',
                external: false
            };

            var init = function() {
                utils.addUploaderTypeFilter( uploader, 'image', {
                    imageFilter: ['image/png', 'image/jpg', 'image/jpeg']
                });
            };

            uploader.onAfterAddingFile = function( item ) {
                utils.cleanupUploaderQueue( uploader );
                $scope.data.imageFile = item._file;
            };

            uploader.onBeforeUploadItem = function( item ) {

                var formData = {
                    title: $scope.data.title,
                    url: $scope.data.url,
                    price: $scope.data.price,
                    description: $scope.data.description
                };

                if ( formData.url.match(/^http[s]?:\/\//i) === null ) {
                    formData.url = 'http://' + formData.url;
                }

                if ( $scope.data.image_url ) {
                    formData.image_url = $scope.data.image_url;
                }
                if ( $scope.data.external_id ) {
                    formData.external_id = $scope.data.external_id;
                }

                item.formData.push( formData );
                $scope.view.uploading = true;
                $scope.view.uploadStarted = true;
            };

            uploader.onProgressItem = function(fileItem, progress) {
                $scope.view.uploadProgress = progress;
            };

            uploader.onSuccessItem = function( item, response, status, headers ) {
                console.log("onSuccessItem", item, response, status, headers);

                $scope.data.productId = response.id;
                $scope.data.image = response.image;
                $scope.data.date_added = response.date_added;
                $scope.data.is_active = response.is_active;

                $scope.view.productCreated = true;

                if ( modalOptions.mode === 'campaignEditor' ) {
                    $scope.closeModal();
                }
            };

            uploader.onCompleteAll = function() {
                $scope.view.uploadComplete = true;
            };

            $scope.showErrors = function() {
                return $scope.view.submitted;
            };
            $scope.imageHasError = function() {
                return ( !$scope.data.imageFile );
            };

            $scope.viewProduct = function() {
                $scope.$hide();
                $state.go( 'products.view', { productId: $scope.data.productId } );
            };

            $scope.saveProduct = function() {
                $scope.view.submitted = true;
                if ( $scope.form1.$valid ) {
                    if ( $scope.data.external === true ) {
                        $scope.createProductFromExternal();
                    } else {
                        uploader.uploadAll();
                    }
                }
            };

            $scope.closeModal = function() {
                if ( $scope.view.productCreated  && _.isFunction( modalOptions.submit ) ) {
                    modalOptions.submit({
                        id: $scope.data.productId,
                        title: $scope.data.title,
                        url: $scope.data.url,
                        price: $scope.data.price,
                        description: $scope.data.description,
                        image: $scope.data.image,
                        date_added: $scope.data.date_added,
                        is_active: $scope.data.is_active
                    });
                }
                $scope.$hide();
            };

            $scope.searchExternalProducts = function() {
                $scope.view.busy = true;
                productsService.searchExternalProducts({ search: $scope.view.externalProductsSearchInput }).then(
                    function( products ) {
                        $scope.view.externalProducts = products;
                        $scope.view.busy = false;
                    },
                    function( response ) {
                        $scope.view.busy = false;
                        errorHandler.processApiResponse( response );
                        $scope.$hide();
                    }
                );
            };

            $scope.resetExternalProducts = function() {
                $scope.view.externalProducts = [];
            };

            $scope.addExternalProduct = function(product) {

                $scope.data.external = true;
                $scope.data.title = product.name;
                $scope.data.url = product.medium_image;
                $scope.data.price = product.price_min;
                $scope.data.description = product.description ? product.description : product.name;
                $scope.data.image_url =  product.medium_image;
                $scope.data.external_id =  product.asin;
                $scope.data.imageFile = product.medium_image;
                $scope.data.image = product.medium_image;

                $scope.resetExternalProducts();
            };

            $scope.createProductFromExternal = function() {

                productsService.createProductFromExternal( $scope.data ).then(
                    function( response ) {

                        $scope.data.productId = response.id;
                        $scope.view.productCreated = true;

                        if ( modalOptions.mode === 'campaignEditor' ) {
                            $scope.closeModal();
                        }
                    },
                    function( response ) {
                        $scope.view.busy = false;
                        errorHandler.processApiResponse( response );
                        $scope.$hide();
                    }
                );
            };

            init();
        }]);
})();
