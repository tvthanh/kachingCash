(function() {
    'use strict';

    angular.module('panelApp')
        .factory('kachingZonesHelpers', [
            '$q',
            'apiService',
            '$alert',
            '$anchorScroll',
            '$location',
            function(
                $q,
                apiService,
                $alert,
                $anchorScroll,
                $location
            ) {
                return {
                    clearForm: clearForm,
                    alert: alert,
                    resetAngularFields: resetAngularFields,
                    clearFileUploader: clearFileUploader,
                    getMediaPreviewFromUrl: getMediaPreviewFromUrl,
                    scrollToFirstError: scrollToFirstError,
                    preventDefaultByPressingEnter: preventDefaultByPressingEnter
                };

                function clearForm() {
                    angular.element('input[type="text"], textarea').val(null);
                    var imageElements = angular.element('.image-selected');
                    angular.forEach(imageElements, (imageElement) => {
                        if (imageElement.style.backgroundImage) {
                            imageElement.style.backgroundImage = null;
                        }
                    });
                    imageElements.removeClass('image-selected');
                }

                function alert(type, title, duration) {
                    $alert({
                        title: title,
                        content: '',
                        container: '#alerts-container',
                        placement: 'top-right',
                        duration: duration || 3,
                        type: type,
                        show: true
                    });
                }

                function resetAngularFields(scope) {
                    return true;
                    for (var key in scope) {
                        if (scope.hasOwnProperty(key)) {
                            if (typeof scope[key] === 'string') {
                                scope[key] = '';
                            }
                            if (key === 'data') {
                                for (var item in scope[key]) {
                                    if (scope[key].hasOwnProperty(item)) {
                                        scope[key][item] = null;
                                    }
                                }
                            }
                        }
                    }
                }

                function clearFileUploader(selector) {
                    angular.element(selector).removeClass('image-selected');
                    angular.element(selector).removeAttr( 'style' );
                }

                function isAudio(fileType) {
                    var type =  '|' + fileType + '|';
                    return '|mp3|'.indexOf(type) !== -1;
                }

                function isVideo(fileType) {
                    var type =  '|' + fileType + '|';
                    return '|mkv|flv|vob|ogv|ogg|avi|wmv|mpg|m4v|mp4|mov|'.indexOf(type) !== -1;
                }

                function isWikiTude(fileType) {
                    var type =  '|' + fileType + '|';
                    return '|wt3|'.indexOf(type) !== -1;
                }

                function getMediaPreviewFromUrl(media) {
                    var audioUrl = kachingAppConfig.wpTemplateUri + '/assets/images/audio_icon.jpg';
                    var videoUrl = kachingAppConfig.wpTemplateUri + '/assets/images/video-play.png';
                    var wikiTudeUrl = kachingAppConfig.wpTemplateUri + '/assets/images/wikitude_logo.jpg';

                    if (!media) {
                        return;
                    }

                    var mediaType = media.substr(media.lastIndexOf('.') + 1);

                    if (isVideo(mediaType)) {
                        return videoUrl;
                    }

                    if (isAudio(mediaType)) {
                        return audioUrl;
                    }

                    if (isWikiTude(mediaType)) {
                        return wikiTudeUrl;
                    }

                    return media;
                }

                function scrollToFirstError(scope) {
                    if (scope.form1.$error.required && scope.form1.$error.required[0]) {
                        var elementName = scope.form1.$error.required[0].$name;
                        var firstErrorId = document.getElementsByName(elementName)[0].id;
                        $location.hash(firstErrorId);
                        $anchorScroll();
                    }
                }

                function preventDefaultByPressingEnter() {
                    document.getElementById('form1').onkeypress = function(e) {
                      var key = e.charCode || e.keyCode || 0;
                      if (key === 13) {
                        e.preventDefault();
                      }
                  };
                }

            }
        ]);
})();
