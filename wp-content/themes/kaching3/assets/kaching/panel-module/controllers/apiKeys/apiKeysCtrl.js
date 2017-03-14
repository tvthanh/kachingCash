(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'apiKeysCtrl', [
            '$scope',
            '$alert',
            '$modal',
            'errorHandler',
            'applicationsService',
        function (
            $scope,
            $alert,
            $modal,
            errorHandler,
            applicationsService
        ) {

            var itemsPerPage = 10;

            $scope.view = {
                busy: true,
                currentPage: 1,
                maxSize: 10,
                itemsPerPage: itemsPerPage,
                filtersActive: false,
                initialLoadComplete: false
            };

            $scope.data = {
                appsCount: 0,
                apps: []
            };

            $scope.filters = {};

            var init = function() {
                initFilters();
                getApps();
            };

            function initFilters () {
                $scope.filters = {
                    name: '',
                    api_key: ''
                };
            }

            $scope.changePage = function() {
                getApps();
            };

            $scope.reloadApps = function() {
                $scope.view.currentPage = 1;
                getApps();
            };

            function getApps ( argsObj ) {

                var params = {
                    limit: itemsPerPage,
                    offset: itemsPerPage * ($scope.view.currentPage - 1)
                };

                if ( $scope.filters.name.length > 0 ) {
                    params.name = $scope.filters.name;
                }
                if ( $scope.filters.api_key.length > 0 ) {
                    params.api_key = $scope.filters.api_key;
                }

                $scope.view.busy = true;
                applicationsService.getApps( params ).then(
                    function( apps ) {
                        $scope.data.appsCount = apps.count;
                        $scope.data.apps = apps.items;
                        $scope.view.busy = false;
                        $scope.view.initialLoadComplete = true;
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            }

            var deleteApp = function( app ) {
                var name = app.name;
                applicationsService.deleteApp( app.id ).then(
                    function() {
                        $alert({
                            title: 'Application deleted.',
                            content: 'Application "' + name + '" has been deleted.',
                            container: '#alerts-container',
                            placement: 'top',
                            duration: 3,
                            type: 'success',
                            show: true
                        });
                        getApps();
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            };

            $scope.showDeleteAppDialog = function( app ) {
                var options = {
                    delete: function( app ) {
                        console.log('delete app', app);
                        deleteApp( app );
                    }
                };
                $modal({
                    templateUrl: 'panel-module/components/appDeleteModal/modalTmpl.html',
                    controller: 'appDeleteModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    resolve: {
                        modalOptions: function() {
                            return options;
                        },
                        app: function () {
                            return app;
                        }
                    }
                });
            };

            $scope.showNewAppDialog = function() {
                var options = {
                    submit: function( app ) {
                        $alert({
                            title: 'Application added.',
                            content: 'Application "' + app.name + '" has been added.',
                            container: '#alerts-container',
                            placement: 'top',
                            duration: 3,
                            type: 'success',
                            show: true
                        });
                        $scope.reloadApps();
                    }
                };
                $modal({
                    templateUrl: 'panel-module/components/newAppModal/modalTmpl.html',
                    controller: 'newAppModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    resolve: {
                        modalOptions: function() {
                            return options;
                        }
                    }
                });
            };

            $scope.showAppEditDialog = function( app ) {
                var options = {
                    submit: function( app ) {
                        $alert({
                            title: 'Application updated.',
                            content: '',
                            container: '#alerts-container',
                            placement: 'top',
                            duration: 3,
                            type: 'success',
                            show: true
                        });
                        $scope.reloadApps();
                    }
                };
                $modal({
                    templateUrl: 'panel-module/components/appEditModal/modalTmpl.html',
                    controller: 'appEditModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    resolve: {
                        modalOptions: function() {
                            return options;
                        },
                        app: function () {
                            return app;
                        }
                    }
                });
            };

            $scope.showAppKeyDialog = function( app ) {
                $modal({
                    templateUrl: 'panel-module/components/appKeyModal/modalTmpl.html',
                    controller: 'appKeyModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    resolve: {
                        app: function () {
                            return app;
                        }
                    }
                });
            };

            $scope.updateFilters = function() {
                $scope.reloadApps();
            };

            $scope.toggleFilters = function() {
                if ( $scope.view.filtersActive ) {
                    $scope.clearFilters();
                } else {
                    $scope.view.filtersActive = true;
                }
            };

            $scope.clearFilters = function() {
                $scope.view.filtersActive = false;
                initFilters();
                $scope.reloadApps();
            };

            init();
        }]);
})();
