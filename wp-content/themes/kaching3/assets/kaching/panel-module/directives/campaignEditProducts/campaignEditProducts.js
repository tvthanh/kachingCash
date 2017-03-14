(function(){
    'use strict';

    angular.module('panelApp')
        .directive('campaignEditProducts', [
            '$state',
            '$stateParams',
            '$alert',
            '$sce',
            'apiUrl',
            'utils',
            '$modal',
            'errorHandler',
            'productsService',
            'campaignsService',
        function(
            $state,
            $stateParams,
            $alert,
            $sce,
            apiUrl,
            utils,
            $modal,
            errorHandler,
            productsService,
            campaignsService
        ){
            return {
                restrict: 'A',
                scope: {},
                // templateUrl: 'panel-module/directives/campaignEditProducts/campaignEditProductsTmpl.html',
                templateUrl: templateDirUri + '/assets/kaching/panel-module/directives/campaignEditProducts/campaignEditProductsTmpl.html',
                controller: function( $scope ){

                    $scope.fieldHasError = utils.fieldHasError;
                    $scope.videogular = { sources: [] };
                    $scope.videogularApi = null;

                    $scope.view = {
                        loading: false,
                        submitted: false,
                        loadingMedia: false,
                        mediaLoaded: false,
                        playerReady: false,
                        videoSet: false
                    };

                    $scope.data = {
                        campaignId: $stateParams.campaignId,
                        campaign: {},
                        products: []
                    };

                    var init = function() {

                        $scope.view.loading = true;
                        campaignsService.getCampaign( $scope.data.campaignId ).then(function( campaign ){
                            $scope.data.campaign = campaign;
                            if ( campaign.products.length > 0 ) {
                                $scope.data.products = campaign.products;
                            }
                            $scope.view.loading = false;
                        });
                    };

                    $scope.hasProducts = function() {
                        return ! _.isEmpty( $scope.data.products );
                    };

                    $scope.removeProduct = function( index ) {
                        $scope.data.products.splice(index, 1);
                        return;
                    };

                    $scope.showErrors = function() {
                        return $scope.view.submitted;
                    };

                    $scope.showProductsLibrary = function() {
                        var options = {
                            submit: function( selectedProduct ) {
                                $scope.data.products.unshift( selectedProduct );
                            }
                        };
                        $modal({
                            // templateUrl: 'panel-module/components/producstLibraryModal/modalTmpl.html',
                            templateUrl: templateDirUri + '/assets/kaching/panel-module/components/producstLibraryModal/modalTmpl.html',
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
                                console.log('newProduct',newProduct);
                                $scope.data.products.unshift( newProduct );
                            }
                        };
                        $modal({
                            // templateUrl: 'panel-module/components/newProductModal/modalTmpl.html',
                            templateUrl: templateDirUri + '/assets/kaching/panel-module/components/newProductModal/modalTmpl.html',
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

                    $scope.saveForm = function() {

                        $scope.view.submitted = true;

                        if ( $scope.form1.$valid ) {

                            console.log('save : data', $scope.data.campaignId, $scope.data.products);

                            productsService.updateProducts( $scope.data.products ).then(
                                function() {
                                    campaignsService.saveProducts( $scope.data.campaignId, $scope.data.products ).then(
                                        function( response ) {
                                            $alert({
                                                title: 'Campaign details have been saved.',
                                                content: '',
                                                container: '#alerts-container',
                                                placement: 'top',
                                                duration: 3,
                                                type: 'success',
                                                show: true
                                            });

                                            campaignsService.setPrepared( $scope.data.campaignId );
                                        },
                                        function( response ) {
                                            errorHandler.processApiResponse( response );
                                        }
                                    );
                                },
                                function( response ) {
                                    errorHandler.processApiResponse( response );
                                }
                            );

                        }
                    };

                    $scope.cancelEdit = function() {
                        $state.go('campaigns');
                    };

                    init();
                }
            };
        }]);

})();
