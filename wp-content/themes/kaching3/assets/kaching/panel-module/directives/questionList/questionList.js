(function() {
    'use strict';
    angular.module('panelApp')
        .directive('questionList', [
            'errorHandler',
            'questionsService',
            function(
                errorHandler,
                questionsService
            ) {
                return {
                    restrict: 'E',
                    scope: {
                        selectedMedia: '='
                    },
                    templateUrl: templateDirUri + '/assets/kaching/panel-module/directives/questionList/questionListTmpl.html',
                    controller: function($scope, errorHandler) {
                        var itemsPerPage = 8;

                        $scope.view = {
                            busyQuestion: true,
                            currentPage: 1,
                            questionsCount: 0,
                            questions: [],
                            maxSize: 10,
                            searchPhrase: '',
                            searchInput: '',
                            orderByOptions: [
                                {
                                    'value': 'name',
                                    'label': 'Order by title'
                                },
                                {
                                    'value': '-date_added',
                                    'label': 'Newest first'
                                }
                            ],
                            orderBy: '-date_added',
                            itemsPerPage: itemsPerPage,
                            selectItem: false
                        };

                        $scope.search = function() {
                            $scope.view.currentPage = 1;
                            $scope.view.searchPhrase = $scope.view.searchInput;
                            getQuestions();
                        };

                        $scope.changePage = function() {
                            getQuestions();
                        };

                        $scope.toggleItem = function( item ) {
                            if (!$scope.selectedMedia.questions) {
                                $scope.selectedMedia.questions = [];
                            }
                            if ( item.selected ) {
                                item.selected = false;
                                $scope.selectedMedia.questions = _.without($scope.selectedMedia.questions, _.findWhere($scope.selectedMedia.questions, {id:item.id}));
                            } else {
                                item.selected = true;
                                $scope.selectedMedia.questions.push(item);
                            }
                        };

                        var init = function() {
                            getQuestions();
                        };

                        var mapSelectedQuestion = function() {
                            if ($scope.view.questions && $scope.view.questions.length > 0) {
                                $scope.view.questions.forEach(function(item){
                                    item.selected = false;
                                });

                                if ($scope.selectedMedia && $scope.selectedMedia.questions && $scope.selectedMedia.questions.length > 0) {
                                    $scope.selectedMedia.questions.forEach(function(item) {
                                        var matchedItem = _.findWhere($scope.view.questions, {id:item.id});
                                        if (matchedItem) {
                                            matchedItem.selected = true;
                                        }
                                    });
                                }
                            }
                        };

                        function getQuestions () {

                            var params = {
                                page_size: itemsPerPage,
                                page: $scope.view.currentPage,
                                // ordering: $scope.view.orderBy
                            };

                            if ( $scope.view.searchPhrase.length > 0 ) {
                                params.content = $scope.view.searchPhrase;
                            }

                            $scope.view.busyQuestion = true;
                            questionsService.getQuestions(params).then(
                                function( questions ) {
                                    $scope.view.questionsCount = questions.count;
                                    $scope.view.questions = questions.items;
                                    $scope.view.busyQuestion = false;
                                    mapSelectedQuestion();
                                },
                                function( response ) {
                                    $scope.view.busyQuestion = false;
                                    errorHandler.processApiResponse( response );
                                    // $scope.$hide();
                                }
                            );
                        }

                        init();

                        $scope.$watch('selectedMedia', function (newVal, oldVal) {
                            if (newVal) {
                                mapSelectedQuestion();
                            }
                        });
                    }
                };
            }
        ]);
})();
