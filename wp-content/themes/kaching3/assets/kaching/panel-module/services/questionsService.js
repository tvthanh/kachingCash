(function() {
    'use strict';

    angular.module('panelApp')
        .factory('questionsService', ['$http', '$q', 'apiService', function($http, $q, apiService) {
            return {
                createQuestion: createQuestion,
                createAnswer: createAnswer,
                getQuestions: getQuestions,
                getQuestionDetail: getQuestionDetail,
                createAnswers: createAnswers,
                deleteQuestion: deleteQuestion
            };

            function createQuestion(question) {

                var deferred = $q.defer();

                if (typeof question.id === 'undefined') {
                    apiService.post('/questions/', question, true).then(
                        function(response) {
                            deferred.resolve(response);
                        },
                        function(response) {
                            deferred.reject(response);
                        }
                    );
                } else {
                    apiService.patch('/questions/' + question.id + '/', question, true).then(
                        function(response) {
                            deferred.resolve(response);
                        },
                        function(response) {
                            deferred.reject(response);
                        }
                    );
                }

                return deferred.promise;
            }

            function createAnswer(data) {

                var deferred = $q.defer();

                var url = '/questions/' + data.questionID + '/createAnswer/';
                var answer = {
                    content: data.content
                };

                apiService.post(url, answer, true).then(
                    function(response) {
                        deferred.resolve(response);
                    },
                    function(response) {
                        deferred.reject(response);
                    }
                );

                return deferred.promise;
            }

            function getQuestions(params) {

                var deferred = $q.defer();

                var requestParams = {
                    page_size: 6,
                    page: 1,
                    // ordering: 'title'
                };

                if (typeof params === 'object') {
                    if ('page_size' in params) {
                        requestParams.page_size = params.page_size;
                    }
                    if ('page' in params) {
                        requestParams.page = params.page;
                    }
                    // if ('ordering' in params) {
                    //     requestParams.ordering = params.ordering;
                    // }
                    if ('content' in params) {
                        requestParams.content = params.content;
                    }
                }

                apiService.get('/questions/', requestParams, true).then(
                    function(response) {
                        deferred.resolve({
                            count: response.count,
                            items: response.results
                        });
                    },
                    function(response) {
                        deferred.reject(response);
                    }
                );

                return deferred.promise;
            }

            function getQuestionDetail(id) {
                var deferred = $q.defer();

                apiService.get('/questions/' + id + '/', null, true).then(
                    function(response) {
                        deferred.resolve(response);
                    },
                    function(response) {
                        deferred.reject(response);
                    }
                );

                return deferred.promise;
            }

            function createAnswers(data) {

                var deferred = $q.defer();

                var url = '/questions/' + data.questionID + '/answer/';
                // var answer = {
                //     content: data.content
                // };

                apiService.patch(url, data.contents, true).then(
                    function(response) {
                        deferred.resolve(response);
                    },
                    function(response) {
                        deferred.reject(response);
                    }
                );

                return deferred.promise;
            }

            function deleteQuestion(id) {

                var deferred = $q.defer();

                apiService.delete('/questions/' + id + '/', null, true).then(
                    function(response) {
                        deferred.resolve(response);
                    },
                    function(response) {
                        deferred.reject(response);
                    }
                );

                return deferred.promise;
            }
        }]);
})();
