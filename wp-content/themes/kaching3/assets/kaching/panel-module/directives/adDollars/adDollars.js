(function() {
    'use strict';
    angular.module('panelApp')
        .directive('adDollars', [
            '$modal',
            '$q',
            'campaignsService',
            function(
                $modal,
                $q,
                campaignsService
            ) {
                return {
                    restrict: 'E',
                    scope: {
                        medias: '=',
                        campaign: '=',
                        selectedMedia: '=',
                        availableCoin: '=',
                        grandTotal: '=',
                        onSignup: '='
                    },
                    templateUrl: templateDirUri + '/assets/kaching/panel-module/directives/adDollars/adDollarsTmpl.html',
                    link: function(scope, ele, attrs) {
                        ele.on('click','.media-preview-collapsed',function() {
                            if (scope.onSignup) {
                                return;
                            }
                            var $storeArea = angular.element(this).closest('.store-header-area');
                            var $expandItem = $storeArea.find('.media-preview-expanded');

                            $storeArea.find('.glyphicon').toggleClass('glyphicon-menu-down').toggleClass('glyphicon-menu-right');
                            $storeArea.toggleClass('has-darkgray');
                            $expandItem.slideToggle();

                            var $others = angular.element('.store-header-area').not($storeArea);
                            $others.find('.glyphicon').removeClass('glyphicon-menu-down').addClass('glyphicon-menu-right');
                            $others.find('.media-preview-expanded').slideUp();
                            $others.removeClass('has-darkgray');
                        });
                    },
                    controller: function($scope) {
                        $scope.grandTotal = 0;
                        $scope.selectedMediaContentTab = 1;

                        $scope.increaseRewardSetting = function($event, media, setting, value) {
                            $event.stopPropagation();
                            $event.preventDefault();
                            media.reward[setting] = 1*value + 1;
                            $scope.updateAmount();
                            $scope.updateMediaItem(media);
                        };
                        $scope.decreaseRewardSetting = function($event, media, setting, value) {
                            $event.stopPropagation();
                            $event.preventDefault();
                            if (media.reward[setting] > 0) {
                                media.reward[setting] = 1*value - 1;
                                $scope.updateAmount();
                                $scope.updateMediaItem(media);
                            }
                        };

                        $scope.increaseSetting = function($event, campaign, setting, value) {
                            $event.stopPropagation();
                            campaign[setting] = 1*value + 1;
                            $scope.updateAmount();
                            $scope.updateMediaItem(campaign);
                        };
                        $scope.decreaseSetting = function($event, campaign, setting, value) {
                            $event.stopPropagation();
                            if (campaign[setting] > 0) {
                                campaign[setting] = 1*value - 1;
                                $scope.updateAmount();
                                $scope.updateMediaItem(campaign);
                            }
                        };
                        $scope.updateAmount = function(media) {
                            $scope.grandTotal = 0;

                            angular.forEach($scope.medias, function(value, key) {
                                $scope.grandTotal += 1 * value.bets_per_view;

                                var totalSetting = 0;

                                // totalSetting = totalSetting + 1*value.reward.send_information;
                                totalSetting = totalSetting + 1*value.reward.share;
                                totalSetting = totalSetting + 1*value.reward.product;
                                totalSetting = totalSetting + 1*value.reward.survey;

                                $scope.grandTotal += totalSetting;
                            });

                            if ($scope.campaign) {
                                $scope.grandTotal += 1*$scope.campaign.register;
                            }

                            if (media) {
                                $scope.updateMediaItem(media);
                            }
                        };
                        $scope.updateMediaItem = function(media) {
                            media.subTotal = 1*media.bets_per_view;
                            media.subTotal += (1*media.reward.share);
                            media.subTotal += (1*media.reward.product);
                            media.subTotal += (1*media.reward.survey);
                        };
                        $scope.toggleSelectedMedia = function(media) {
                            if ($scope.onSignup) {
                                return;
                            }
                            if (!$scope.selectedMedia) {
                                $scope.selectedMedia = media;
                            } else {
                                if ($scope.selectedMedia.id !== media.id) {
                                    $scope.selectedMedia = media;
                                } else {
                                    $scope.selectedMedia = null;
                                }
                            }
                            $scope.selectedMediaContentTab = 1;
                        };
                        $scope.removeProduct = function(media, product) {
                            product.selected = false;
                            media.products = _.without(media.products, _.findWhere(media.products, {id:product.id}));
                        };
                        $scope.removeQuestion = function(media, question) {
                            question.selected = false;
                            media.questions = _.without(media.questions, _.findWhere(media.questions, {id:question.id}));
                        };
                        $scope.stopEvent = function(e) {
                            e.stopPropagation();
                            e.preventDefault();
                            return false;
                        };
                        $scope.selectMediaContentTab = function(selectedContentTab) {
                            $scope.selectedMediaContentTab = selectedContentTab;
                        };
                        $scope.addInstoreReward = function(media) {
                            media.instore_rewards = media.instore_rewards || [];
                            var currentId = media.instore_rewards.length;
                            media.instore_rewards.push({id: currentId, coins: 1, action_note: '$1'});
                        };
                        $scope.removeReward = function(media, instoreReward) {
                            var indexOfReward = media.instore_rewards.indexOf(instoreReward);
                            if (indexOfReward > -1) {
                                media.instore_rewards.splice(indexOfReward, 1);
                            }
                        };

                        function showQrCode(actionImage, actionText) {
                            $modal({
                                templateUrl: templateDirUri + '/assets/kaching/panel-module/components/imagePreviewModal/imagePreviewModalTmpl.html',
                                controller: 'imagePreviewModalCtrl',
                                animation: 'am-fade-and-scale',
                                backdrop: 'static',
                                resolve: {
                                    imageUrl: function() {
                                        return actionImage;
                                    },
                                    actionText: function() {
                                        return actionText;
                                    }
                                }
                            });
                        }

                        $scope.generateQRCode = function(media, reward) {
                            if (reward.disableGenerate) {
                                return;
                            }

                            reward.disableGenerate = true;
                            if (reward.action_image) {
                                showQrCode(reward.action_image, 'Download QR Code');
                                reward.disableGenerate = false;
                            } else {
                                // Create reward and get qr code image url
                                var generateRewardDeferred = $q.defer();
                                campaignsService.generateInStoreReward(media, reward).then(
                                    function(response) {
                                        if (!response.action_image) {
                                            showQrCode('', 'Cannot generate QR code, please check input and try again.');
                                            return;
                                        }

                                        reward.action_image = response.action_image;
                                        reward.action_type = response.action_type;
                                        showQrCode(response.action_image, 'Download QR Code');
                                        reward.disableGenerate = false;
                                    },
                                    function() {
                                        showQrCode('', 'Cannot generate QR code, please check input and try again.');
                                        reward.disableGenerate = false;
                                    }
                                );
                            }
                        }
                    }
                };
            }
        ]);
})();
