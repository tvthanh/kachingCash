(function(){
    "use strict";

    angular.module('panelApp')
        .controller( 'campaignEditorStep5Ctrl', [
            '$scope',
            '$state',
            'utils',
            '$modal',
            'errorHandler',
            'campaignsService',
            'campaignEditorService',
            'productsService',
        function (
            $scope,
            $state,
            utils,
            $modal,
            errorHandler,
            campaignsService,
            campaignEditorService,
            productsService
        ) {

            var editor = campaignEditorService;

            $scope.fieldHasError = utils.fieldHasError;
            $scope.urlRegex = utils.urlRegex();

            $scope.products = [];
            $scope.recommendedProducts = [];

            $scope.carouselOptions = {
                nav: true,
                dots: false,
                navText: ['<span class="glyphicon glyphicon-chevron-left"></span>','<span class="glyphicon glyphicon-chevron-right"></span>'],
                navRewind: false,
                loop: false,
                items: 4
            };

            var init = function() {

                if (
                    ! editor.stepGet('step1', 'valid') ||
                    ! editor.stepGet('step2', 'valid') ||
                    ! editor.stepGet('step3', 'valid') ||
                    ! editor.stepGet('step4', 'valid')
                ) {
                    $state.go( editor.previousState() );
                }

                editor.currentStep('step5');
                editor.previousState( 'campaigns.' + editor.mode() + '.step5' );

                $scope.products = editor.dataGet('products');

                productsService.getProducts({ limit: 16, offset: 0, ordering: '-last_used_date' }).then(
                    function( products ) {
                        $scope.recommendedProducts = products.items;
                    }
                );

                $scope.view = {
                    busy: false,
                    submitted: false
                };
            };

            $scope.hasProducts = function() {
                return ! _.isEmpty( $scope.products );
            };

            $scope.showErrors = function() {
                return editor.stepGet('step5', 'submitted');
            };

            $scope.skipStep = function() {
                editor.stepSet('step5', 'submitted', true);
                editor.stepSet('step5', 'valid', true);
                $state.go( 'campaigns.' + editor.mode() + '.step6' );
            };

            $scope.previousStep = function() {
                $state.go( 'campaigns.' + editor.mode() + '.step4' );
            };

            $scope.nextStep = function() {

                editor.stepSet('step5', 'submitted', true);

                if ( $scope.form1.$valid ) {

                    editor.stepSet('step5', 'valid', true);
                    editor.dataSet('products', $scope.products);

                    editor.save('step5').then(
                        function(){
                            $state.go( 'campaigns.' + editor.mode() + '.step6' );
                        },
                        function( response ){
                            errorHandler.processApiResponse( response );
                        }
                    );

                } else {
                    editor.stepSet('step5', 'valid', false);
                }
            };

            $scope.selectRecommendedProduct = function( selectedProduct ) {

                // var index = _.findIndex( $scope.recommendedProducts, function( product ) { return  product.id == selectedProduct.id });
                // console.log('index', index);
                // $scope.recommendedProducts.splice( index, 1 )

                $scope.products.unshift( selectedProduct );
            };

            $scope.showProductsLibrary = function() {
                var options = {
                    submit: function( selectedProduct ) {
                        $scope.products.unshift( selectedProduct );
                    }
                };
                $modal({
                    templateUrl: '/panel-module/components/producstLibraryModal/modalTmpl.html',
                    controller: 'producstLibraryModalCtrl',
                    animation: 'am-fade-and-scale',
                    resolve: {
                        modalOptions: function() {
                            return options;
                        }
                    }
                });
            };

            $scope.showNewProductDialog = function() {
                var options = {
                    mode: 'campaignEditor',
                    submit: function( newProduct ) {
                        console.log("newProduct",newProduct);
                        $scope.products.unshift( newProduct );
                    }
                };
                $modal({
                    templateUrl: '/panel-module/components/newProductModal/modalTmpl.html',
                    controller: 'newProductModalCtrl',
                    animation: 'am-fade-and-scale',
                    backdrop: 'static',
                    resolve: {
                        modalOptions: function() {
                            return options;
                        }
                    }
                });
            };

            $scope.removeProduct = function( index ) {
                $scope.products.splice(index, 1);
                return;
            };

            $scope.logControllerData = function() {
                console.log('campaignEditorStep1Ctrl - products', angular.copy( $scope.products ) );
                return;
            };

            init();
        }]);
})();