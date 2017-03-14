(function() {
    'use strict';
    angular.module('panelApp')
        .directive('cropperImage', ['$uibModal', '$window',
            function($uibModal, $window) {
                var cropperModal;

                return {
                    restrict: 'E',
                    scope: {
                        imageNeedCrop: '=',
                        canvasName: '='
                    },
                    templateUrl: kachingAppConfig.wpTemplateUri + '/assets/kaching/panel-module/directives/cropper-image/cropper-image.html',
                    link: (scope, element, attr) => {
                        scope.canvas = document.getElementsByTagName('CANVAS')[0];
                        var targetBrowser = detectBrowser();
                        if (targetBrowser !== 'safari') {
                            scope.$watch('imageNeedCrop', (newValue, preValue) => {
                                // scope.hasImage = scope.imageNeedCrop ? true : false;
                                if (!scope.imageNeedCrop) {
                                    scope.hasImage = false;
                                } else {
                                    if (typeof(scope.imageNeedCrop) === 'object') {
                                        if (scope.imageNeedCrop.type.indexOf('image') > -1) {
                                            scope.hasImage = true;
                                        } else {
                                            scope.hasImage = false;
                                        }
                                    } else {
                                        if (typeof(scope.imageNeedCrop) === 'string' && scope.imageNeedCrop.indexOf('data:image') >-1) {
                                            scope.hasImage = true;
                                        } else {
                                            var type =  '|' + scope.imageNeedCrop.slice(scope.imageNeedCrop.lastIndexOf('.') + 1) + '|';
                                            scope.hasImage = '|jpg|png|jpeg|'.indexOf(type) !== -1;
                                        }
                                    }
                                }
                            });
                        } else {
                            scope.hasImage = false;
                        }
                        scope.openCropper = () => {
                            let imageNeedCrop = scope.imageNeedCrop;
                            openModal(imageNeedCrop, scope);
                        };
                        scope.closeModal = closeModal;
                    }
                };

                function openModal(imageNeedCrop, scope) {
                    cropperModal = $uibModal.open({
                        animation: true,
                        size: 'lg',
                        templateUrl: kachingAppConfig.wpTemplateUri + '/assets/kaching/panel-module/directives/cropper-image/image-cropper-modal/image-cropper-modal.html',
                        controller: 'cropperImageController',
                        scope: scope
                    });
                    cropperModal.rendered.then(() => {

                        function getRectangleCanvas(sourceCanvas) {
                            var canvas = document.createElement('canvas');
                            var context = canvas.getContext('2d');
                            var width = sourceCanvas.width;
                            var height = sourceCanvas.height;
                            context.imageSmoothingEnabled = true;

                            canvas.width = width;
                            canvas.height = height;

                            context.drawImage(sourceCanvas, 0, 0, width, height);
                            context.globalCompositeOperation = 'destination-in';
                            context.beginPath();
                            context.rect(0, 0, width, height);
                            context.fill();

                            return canvas;
                        }

                        var image = document.getElementById('image');

                        if (typeof(imageNeedCrop) === 'string') {
                            if(image.src.indexOf('base64') === -1) {
                                image.src += '?cache=false';
                            }
                            init();
                        } else {
                            if (typeof(imageNeedCrop) === 'object') {
                                var reader = new FileReader();
                                reader.onload = function (e) {
                                    image.src = e.target.result;
                                    init();
                                };
                                reader.readAsDataURL( imageNeedCrop );
                            }
                        }

                         function init () {
                            var cropButton = document.getElementById('crop-button');
                            var saveButton = document.getElementById('save-button');
                            var cancelButton = document.getElementById('cancel-button');

                            var result = document.getElementById('result');
                            var minAspectRatio = 0.5;
                            var maxAspectRatio = 1.5;

                            var cropper = new window.Cropper(image, {
                              ready: function () {
                                var cropper = this.cropper;
                                var containerData = cropper.getContainerData();
                                var cropBoxData = cropper.getCropBoxData();
                                var aspectRatio = cropBoxData.width / cropBoxData.height;
                                var newCropBoxWidth;

                                // if (aspectRatio < minAspectRatio || aspectRatio > maxAspectRatio) {
                                //   newCropBoxWidth = cropBoxData.height * ((minAspectRatio + maxAspectRatio) / 2);
                                //
                                //   cropper.setCropBoxData({
                                //     left: (containerData.width - newCropBoxWidth) / 2,
                                //     width: newCropBoxWidth
                                //   });
                                // }

                                cropper.setCropBoxData({
                                  left: (containerData.width - cropBoxData.width) / 2,
                                  width: cropBoxData.width
                                });
                              },
                              cropmove: function () {
                                var cropper = this.cropper;
                                var cropBoxData = cropper.getCropBoxData();
                                var aspectRatio = cropBoxData.width / cropBoxData.height;

                                // if (aspectRatio < minAspectRatio) {
                                //   cropper.setCropBoxData({
                                //     width: cropBoxData.height * minAspectRatio
                                //   });
                                // } else if (aspectRatio > maxAspectRatio) {
                                //   cropper.setCropBoxData({
                                //     width: cropBoxData.height * maxAspectRatio
                                //   });
                                // }

                                cropper.setCropBoxData({
                                  width: cropBoxData.width
                                });
                              }
                            });

                            cropButton.onclick = function() {
                                var croppedCanvas;
                                var rectangleCanvas;
                                var rectangleImage;
                                // Crop
                                croppedCanvas = cropper.getCroppedCanvas();

                                // Rectangle
                                rectangleCanvas = getRectangleCanvas(croppedCanvas);

                                // Show
                                rectangleImage = document.createElement('img');
                                rectangleImage.src = rectangleCanvas.toDataURL();
                                result.innerHTML = '';
                                result.appendChild(rectangleImage);
                            };

                            cancelButton.onclick = function() {
                                closeModal();
                            };

                            saveButton.onclick = function() {
                                scope.imageNeedCrop = result.childNodes[0].src;
                                closeModal();
                            };
                        };
                    });
                }

                function closeModal() {
                    cropperModal.close();
                }

                function detectBrowser() {
                    var userAgent = $window.navigator.userAgent;

                    var browsers = {chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i};

                    for(var key in browsers) {
                        if (browsers[key].test(userAgent)) {
                            return key;
                        }
                    };

                   return 'safari';
                }
            }
        ]);
})();
