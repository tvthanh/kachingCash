(function(){
    'use strict';

    angular.module('panelApp')
        .filter('mediaType', function () {

            var isAudio = function(fileType) {
                var type =  '|' + fileType + '|';
                return '|mp3|'.indexOf(type) !== -1;
            };

            var isVideo = function(fileType) {
                var type =  '|' + fileType + '|';
                return '|mkv|flv|vob|ogv|ogg|avi|wmv|mpg|m4v|mp4|mov|'.indexOf(type) !== -1;
            };

            var isWikiTude = function(fileType) {
                var type =  '|' + fileType + '|';
                return '|wt3|'.indexOf(type) !== -1;
            };

            var audioUrl = kachingAppConfig.wpTemplateUri + '/assets/images/audio_icon.jpg';
            var videoUrl = kachingAppConfig.wpTemplateUri + '/assets/images/video-play.png';
            var wikiTudeUrl = kachingAppConfig.wpTemplateUri + '/assets/images/wikitude_logo.jpg';

            return function (media) {

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
            };
        });
})();
