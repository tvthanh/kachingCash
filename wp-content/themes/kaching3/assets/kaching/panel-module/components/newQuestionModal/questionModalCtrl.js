(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'newQuestionModalCtrl', [
            '$scope',
            '$state',
            'errorHandler',
            'apiUrl',
            'authToken',
            'utils',
            'productsService',
            'FileUploader',
            'modalOptions',
            'questionsService',
            '$q',
        function (
            $scope,
            $state,
            errorHandler,
            apiUrl,
            authToken,
            utils,
            productsService,
            FileUploader,
            modalOptions,
            questionsService,
            $q
        ) {

            var answerId = 0;

            $scope.fieldHasError = utils.fieldHasError;
            $scope.view = {
                submitted: false
            };

            var init = function() {
                $scope.answerList = [];
                $scope.dialogTitle = 'New question';
                $scope.viewMode = false;
                if (modalOptions.type !== 'new') {
                    $scope.editId = modalOptions.id;
                    $scope.getQuestion(modalOptions.id);

                    if (modalOptions.type === 'edit') {
                        $scope.dialogTitle = 'Edit question';
                    } else {
                        $scope.dialogTitle = 'View question';
                        $scope.viewMode = true;
                    }
                }
            };

            $scope.getQuestion = function(id) {
                questionsService.getQuestionDetail(id).then(
                    (data) => {
                        $scope.question = data.content;
                        $scope.answerList = data.answers;
                        $scope.answerType = data.type;
                    },
                    (error) => {
                    }
                )
            }

            $scope.showErrors = function() {
                return $scope.view.submitted;
            };

            $scope.showNoAnswerError = function() {
                if (parseInt($scope.answerType) === 2) {
                    return false;
                } else {
                    return $scope.answerList.length < 2;
                }
            }

            $scope.createQuestion = function() {
                $scope.view.submitted = true;
                if ( $scope.form1.$valid  && !$scope.showNoAnswerError()) {
                    var data = {content: $scope.question, type: $scope.answerType};
                    if ($scope.editId) {
                        data.id = $scope.editId;
                    }
                    questionsService.createQuestion(data).then(
                        (data)=>{
                            $scope.createdQuestion = data;
                            $scope.createAnswers();
                            $scope.closeModal();
                        },
                        ()=>{
                        }
                    );
                }
            };

            $scope.createAnswers = function() {
                if (!$scope.createdQuestion) return;
                var deferred = $q.defer();

                var data = {
                    questionID: $scope.createdQuestion.id,
                    contents: []
                };

                if ($scope.answerType != 2) {
                    angular.forEach($scope.answerList, (answer) => {
                        data.contents.push({content: answer.content});
                    });
                }

                questionsService.createAnswers(data).then(
                    (data)=>{
                        deferred.response(data);
                    },
                    (error)=>{
                        deferred.reject(error);
                    }
                );

                return deferred.promise;
            };

            $scope.closeModal = function() {
                modalOptions.submit();
                $scope.$hide();
            };

            $scope.addAnswer = function() {
                $scope.answerList.push({id: 'new' + answerId, content: $scope.answerItem});
                answerId++;
                $scope.answerItem = '';
            };

            $scope.removeQuestion = function(id) {
                $scope.answerList = _.without($scope.answerList, _.findWhere($scope.answerList, {id: id}))
            };

            $scope.answerType = 0;

            // $scope.$watch('answerType', function(newVal, oldVal) {
            //     if (newVal) {
            //     }
            // });

            // SINGLE_CHOICE = 0
            // MULTIPLE_CHOICE = 1
            // OTHER_CHOICE = 2
            // COMBINE_CHOICE = 3

            init();
        }]);
})();
