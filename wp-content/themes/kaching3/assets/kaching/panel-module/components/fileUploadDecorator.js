//
// A patch for the ngFileUpload module.
// It's a replacement for the nvFileOver directive, which has multiple bugs.
// Usage - simply add the 'ifm-over-class' attribute to the nv-file-drop element:
// <div nv-file-drop uploader="uploader" ifm-over-class="fileover"></div>
//

(function () {
    'use strict';
    angular.module('panelApp')
        .config(function ($provide) {
            $provide.decorator('nvFileDropDirective', function ($delegate) {
                var directive = $delegate[0],
                    link = directive.link;

                directive.compile = function () {
                    return function (scope, element, attrs) {
                        var overClass = attrs.ifmOverClass || 'fileover';
                        link.apply(this, arguments);
                        element.on('dragover', function () {
                            element.addClass(overClass);
                        });
                        element.on('dragleave', function () {
                            element.removeClass(overClass);
                        });
                        element.on('drop', function () {
                            element.removeClass(overClass);
                        });
                    };
                };

                return $delegate;
            });
        });
})();