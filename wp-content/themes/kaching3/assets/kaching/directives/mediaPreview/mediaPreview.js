(function() {
    'use strict';
    angular.module('panelApp')
        .directive('mediaPreview', ['$modal', function($modal) {
            return {
                restrict: 'E',
                scope: {
                    mediaList: '=mediaList',
                    itemEdit: '&',
                    itemDelete: '&',
                    showEdit: '=showEdit',
                    showDelete: '=showDelete',
                    viewMedia: '=viewMedia',
                    review: '=',
                    viewTab: '=',
                    selectedMedia: '=',
                    hasAr: '=',
                    connector: '='
                },
                templateUrl: kachingAppConfig.wpTemplateUri + '/assets/kaching/directives/mediaPreview/media-preview.tmpl.html',
                link: function(scope, ele, attrs) {
                    ele.on('click','.glyphicon',function(event){
                        var $mediaItem = angular.element(this).closest('li.media-preview');
                        var $expandedItem = $mediaItem.find('.media-preview-expanded');

                        $mediaItem.toggleClass('actived');
                        $mediaItem.find('.glyphicon').toggleClass('glyphicon-menu-down').toggleClass('glyphicon-menu-right');
                        $expandedItem.slideToggle();

                        var $others = angular.element('li.media-preview').not($mediaItem);
                        $others.find('.glyphicon').removeClass('glyphicon-menu-down').addClass('glyphicon-menu-right');
                        $others.find('.media-preview-expanded').slideUp();
                        $others.removeClass('actived');
                    });
                    scope.filter = function(item) {
                        var type = 'all';
                        if(scope.tab === 'video') {
                            type = 'video';
                        } else if (scope.tab === 'image') {
                            type = 'image';
                        } else {
                            return true;
                        }
                        return item.ar_resource_type === type ? true : false;
                    };
                    if (scope.connector) {
                        scope.connector.resetSelectedMedia = function() {
                            scope.editingMediaId = undefined;
                        };
                    }
                },
                controller: function($scope) {
                    $scope.previewMedia = function(event, media) {
                        media.selected = false;
                        if (event.target.tagName === 'SPAN') {
                            return false;
                        }
                        if (!$scope.selectedMedia) {
                            $scope.selectedMedia = media;
                            media.selected = true;
                        } else {
                            if ($scope.selectedMedia.id !== media.id) {
                                if ($scope.selectedMedia.id) {
                                    $scope.selectedMedia.selected = false;
                                }
                                $scope.selectedMedia = media;
                                media.selected = true;
                            } else {
                                media.selected = false;
                                $scope.selectedMedia = null;
                            }
                        }
                    };

                    $scope.showDeleteMediaDialog = function( media ) {
                        var options = {
                            delete: function( media ) {
                                $scope.itemDelete( {media:media} );
                            }
                        };
                        $modal({
                            templateUrl: templateDirUri + '/assets/kaching/panel-module/components/mediaDeleteModal/modalTmpl.html',
                            controller: 'mediaDeleteModalCtrl',
                            animation: 'am-fade-and-scale',
                            placement: 'center',
                            resolve: {
                                modalOptions: function() {
                                    return options;
                                },
                                media: function () {
                                    return media;
                                }
                            }
                        });
                    };
                    $scope.edit = function(mediaId) {
                        $scope.itemEdit({mediaId: mediaId});
                        $scope.editingMediaId = mediaId.id;
                    };
                }
            };
        }]);

})();
