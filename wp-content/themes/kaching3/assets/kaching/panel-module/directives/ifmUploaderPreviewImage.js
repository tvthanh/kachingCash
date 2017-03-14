(function(){
    'use strict';

    angular.module('panelApp')
        .directive('ifmUploaderPreviewImage', ['$window', '$parse', function( $window, $parse ) {
            var helper = {
                support: !!$window.FileReader,
                isFile: function(item) {
                    return angular.isObject(item) && item instanceof $window.File;
                },
                isImage: function(file) {
                    var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                    return '|jpg|png|jpeg|'.indexOf(type) !== -1;
                },
                isAudio: function(file) {
                    var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                    return '|mp3|'.indexOf(type) !== -1;
                },
                isVideo: function(file) {
                    var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                    return '|mkv|flv|vob|ogv|ogg|avi|wmv|mpg|m4v|mp4|mov|'.indexOf(type) !== -1;
                }
            };
            return {
                restrict: 'A',
                link: function( scope, el, attr, ctrl ) {

                    var reader;

                    if (!helper.support) {return;}

                    scope.$watch( attr.ifmUploaderPreviewImage, function( newValue, oldValue ) {
                        if (!newValue) return;
                        if ( typeof newValue === 'string' && newValue.length > 0 ) {
                            var url = $parse(attr.ifmUploaderPreviewImage)(scope);
                            el.css('background-image', 'url(' + url + ')').addClass('image-selected');
                        } else {
                            // check wikitude file -- .wt3
                            if(newValue === undefined || newValue === null || newValue === '') {
                                return;
                            }
                            else if (newValue.type === '' && newValue.name.indexOf('.wt3') > -1) {
                                var newUrl = kachingAppConfig.wpTemplateUri + '/assets/images/wikitude_logo.jpg';
                                el.css('background-image', 'url(' + newUrl + ')').addClass('image-selected');
                            } else if( helper.isAudio( newValue ) ) {
                                var audioUrl = kachingAppConfig.wpTemplateUri + '/assets/images/audio_icon.jpg';
                                el.css('background-image', 'url(' + audioUrl + ')').addClass('image-selected');
                            } else if( helper.isVideo( newValue ) ) {
                                var videoUrl = kachingAppConfig.wpTemplateUri + '/assets/images/video-play.png';
                                el.css('background-image', 'url(' + videoUrl + ')').addClass('image-selected');
                            } else {
                                if ( !helper.isFile( newValue ) ) {return;}
                                if ( !helper.isImage( newValue ) ) {return;}
                                reader = new FileReader();
                                reader.onload = function (e) {
                                    el.css('background-image', 'url(' + e.target.result + ')').addClass('image-selected');
                                };
                                reader.readAsDataURL( newValue );
                            }
                        }
                    });

                }
            };
        }]);

})();
