(function(){
    "use strict";

    angular.module('panelApp')
        .controller( 'creditCardsCtrl', [
            '$scope',
            '$alert',
            '$modal',
            'errorHandler',
            'billingService',
        function (
            $scope,
            $alert,
            $modal,
            errorHandler,
            billingService
        ) {

            var itemsPerPage = 10;

            $scope.view = {
                busy: true
            };

            $scope.data = {
                cards: []
            };

            var init = function() {
                $scope.view.busy = true;
                getCards();
            };

            var getCards = function() {
                billingService.getCards().then(
                    function( cards ) {
                        $scope.data.cards = cards;
                        $scope.view.busy = false;
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            };

            var deleteCard = function( card ) {
                billingService.deleteCard( card.payment_method_id ).then(
                    function() {
                        $alert({
                            title: 'Your credit card has been deleted.',
                            content: '',
                            container: '#alerts-container',
                            placement: 'top',
                            duration: 3,
                            type: 'success',
                            show: true
                        });
                        getCards();
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            };

            $scope.setMainCard = function( card ) {
                billingService.setMainCard( card.payment_method_id ).then(
                    function( cards ) {
                        getCards();
                    },
                    function( response ) {
                        errorHandler.processApiResponse( response );
                    }
                );
            };

            $scope.showDeleteCardDialog = function( card ) {
                var callbacks = {
                    delete: function( card ) {
                        console.log('delete card', card);
                        deleteCard( card );
                    }
                };
                $modal({
                    templateUrl: 'panel-module/components/cardDeleteModal/modalTmpl.html',
                    controller: 'cardDeleteModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    resolve: {
                        callbacks: function() {
                            return callbacks;
                        },
                        card: function () {
                            return card;
                        }
                    }
                });
            };

            $scope.showNewCardDialog = function() {
                var callbacks = {
                    cardAdded: function( card ) {
                        console.log("new card",card);
                        getCards();
                    }
                };
                $modal({
                    templateUrl: 'panel-module/components/newCardModal/modalTmpl.html',
                    controller: 'newCardModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center',
                    resolve: {
                        callbacks: function() {
                            return callbacks;
                        }
                    }
                });
            };

            init();
        }]);
})();
