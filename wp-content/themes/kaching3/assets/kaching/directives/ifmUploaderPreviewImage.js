(function(){
    "use strict";

    angular.module('panelApp')
        .directive("ifmUploaderPreviewImage", ['$window', '$parse', function( $window, $parse ) {
            var helper = {
                support: !!$window.FileReader,
                isFile: function(item) {
                    return angular.isObject(item) && item instanceof $window.File;
                },
                isImage: function(file) {
                    var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                    return '|jpg|png|jpeg|'.indexOf(type) !== -1;
                }
            };
            return {
                restrict: 'A',
                link: function( scope, el, attr, ctrl ) {

                    var reader;

                    if (!helper.support) return;

                    scope.$watch( attr.ifmUploaderPreviewImage, function( newValue, oldValue ) {
                        if ( typeof newValue === 'string' && newValue.length > 0 ) {
                            var url = $parse(attr.ifmUploaderPreviewImage)(scope);
                            el.css('background-image', 'url(' + url + ')').addClass('image-selected');
                        } else {

                            if ( !helper.isFile( newValue ) ) return;
                            if ( !helper.isImage( newValue ) ) return;
                            reader = new FileReader();
                            reader.onload = function (e) {
                                el.css('background-image', 'url(' + e.target.result + ')').addClass('image-selected');
                            };
                            reader.readAsDataURL( newValue );
                        }
                    });

                }
            };
        }]);

})();
