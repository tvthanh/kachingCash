(function() {
    'use strict';

    angular.module('panelApp')
        .controller('questionsCtrl', [
            '$scope',
            '$alert',
            '$modal',
            '$http',
            'apiUrl',
            'authToken',
            'errorHandler',
            'productsService',
            'questionsService',
        function(
            $scope,
            $alert,
            $modal,
            $http,
            apiUrl,
            authToken,
            errorHandler,
            productsService,
            questionsService
        ) {

            var itemsPerPage = 12;

            $scope.view = {
                busy: true,
                currentPage: 1,
                media: [],
                maxSize: 10,
                searchPhrase: '',
                searchInput: '',
                orderByOptions: [{
                    'value': 'title',
                    'label': 'Order by title'
                }, {
                    'value': '-date_added',
                    'label': 'Newest first'
                }],
                orderBy: '-date_added',
                itemsPerPage: itemsPerPage,
                selectItem: false
            };

            $scope.data = {
                deletedCount: 0,
                questionsCount: 0,
                questions: []
            };

            var init = function() {
                getQuestions();
            };

            $scope.reloadQuestions = function() {
                $scope.view.currentPage = 1;
                getQuestions();
            };

            $scope.search = function() {
                $scope.view.currentPage = 1;
                $scope.view.searchPhrase = $scope.view.searchInput;
                getQuestions();
            };

            $scope.nextPage = function() {
                if ( $scope.view.busy || $scope.data.questions.length === $scope.data.questionsCount ) {
                    return;
                }
                $scope.view.currentPage++;
                getQuestions();
            };

            function getQuestions (argsObj) {

                var params = {
                    page_size: itemsPerPage,
                    page: $scope.view.currentPage
                    // page: ( itemsPerPage * ($scope.view.currentPage - 1) ) - $scope.data.deletedCount,
                    // ordering: $scope.view.orderBy
                };

                if ($scope.view.searchPhrase.length > 0) {
                    params.content = $scope.view.searchPhrase;
                }

                $scope.view.busy = true;
                questionsService.getQuestions(params).then(
                    function(questions) {
                        $scope.data.questionsCount = questions.count;
                        if ($scope.view.currentPage === 1) {
                            $scope.data.questions = questions.items;
                        } else {
                            $scope.data.questions = $scope.data.questions.concat(questions.items);
                        }
                        $scope.view.busy = false;
                    },
                    function( response ) {
                        $scope.view.busy = false;
                        errorHandler.processApiResponse( response );
                        $scope.$hide();
                    }
                );
            }

            var deleteProduct = function( product, index ) {
                var title = product.title;

                productsService.deleteProduct(product.id).then(
                    function() {
                        $alert({
                            title: 'Product deleted.',
                            content: '"' + title + '" has been deleted.',
                            container: '#alerts-container',
                            placement: 'top',
                            duration: 3,
                            type: 'success',
                            show: true
                        });
                        $scope.data.questions.splice( index, 1 );
                        $scope.data.questionsCount--;
                        $scope.data.deletedCount++;
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            };

            var deleteQuestion = function(question) {
                debugger;
                // var title = product.title;

                questionsService.deleteQuestion(question.id).then(
                    function() {
                        $alert({
                            // title: 'Question deleted.',
                            content: 'Question has been deleted.',
                            container: '#alerts-container',
                            placement: 'top',
                            duration: 3,
                            type: 'success',
                            show: true
                        });
                        $scope.data.questions.splice( question.index, 1 );
                        $scope.data.questionsCount--;
                        $scope.data.deletedCount++;
                        // $scope.reloadQuestions();
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            };

            $scope.showNewQuestionDialog = function() {
                var options = {
                    type: 'new'
                };
                showQuestionDialog(options);
            };

            $scope.showEditQuestionDialog = function(id) {
                var options = {
                    type: 'edit',
                    id: id
                };
                showQuestionDialog(options);
            };

            $scope.showViewQuestionDialog = function(id) {
                var options = {
                    type: 'view',
                    id: id
                };
                showQuestionDialog(options);
            };

            var showQuestionDialog = function(options) {
                var defaultOptions = {
                    submit: function() {
                        $scope.reloadQuestions();
                    }
                };
                angular.extend(defaultOptions, options);
                $modal({
                    templateUrl: templateDirUri + '/assets/kaching/panel-module/components/newQuestionModal/questionModalTmpl.html',
                    controller: 'newQuestionModalCtrl',
                    animation: 'am-fade-and-scale',
                    backdrop: 'static',
                    resolve: {
                        modalOptions: function() {
                            return defaultOptions;
                        }
                    },
                    onHide: getQuestions
                });
            };

            $scope.showDeleteProductDialog = function( product, index ) {
                var options = {
                    delete: function( product, index ) {
                        deleteProduct( product, index );
                    }
                };
                $modal({
                    templateUrl: templateDirUri + '/assets/kaching/panel-module/components/productDeleteModal/modalTmpl.html',
                    // templateUrl: 'panel-module/components/productDeleteModal/modalTmpl.html',
                    controller: 'productDeleteModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    resolve: {
                        modalOptions: function() {
                            return options;
                        },
                        product: function() {
                            return product;
                        },
                        index: function() {
                            return index;
                        }
                    }
                });
            };

            $scope.showDeleteQuestionDialog = function(question, index) {

                var questionData = {
                    id: question.id,
                    index: index
                };

                var options = {
                    okFunction: function() {
                        deleteQuestion(questionData);
                    }
                };
                $modal({
                    templateUrl: templateDirUri + '/assets/kaching/panel-module/components/confirmModal/modalTmpl.html',
                    controller: 'confirmModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    resolve: {
                        modalOptions: function() {
                            return options;
                        },
                        modalTitle: function () {
                            return 'Delete question?';
                        },
                        modalContent: function() {
                            return 'Are you sure you want to delete this question?';
                        },
                        cancelText: function() {
                            return 'Cancel';
                        },
                        okText: function() {
                            return 'Delete';
                        },
                        modalData: function () {
                            return questionData;
                        }
                    }
                });
            };

            init();
        }
    ]);
})();
