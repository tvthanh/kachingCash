(function() {
    'use strict';

    angular.module('panelApp')
        .controller('magStep2Ctrl', [
            '$scope',
            '$state',
            'apiUrl',
            'authToken',
            'utils',
            'mediaService',
            'FileUploader',
            'countryService',
            'kachingZonecampaignEditorService',
            'campaignsService',
            '$http',
            '$q',
            'errorHandler',
            'kachingZonesHelpers',
            '$anchorScroll',
            '$location',
            function(
                $scope,
                $state,
                apiUrl,
                authToken,
                utils,
                mediaService,
                FileUploader,
                countryService,
                kachingZonecampaignEditorService,
                campaignsService,
                $http,
                $q,
                errorHandler,
                kachingZonesHelpers,
                $anchorScroll,
                $location
            ) {
                var helper = kachingZonesHelpers;
                var editor = kachingZonecampaignEditorService;
                var uploader = $scope.uploader = new FileUploader({
                    url: apiUrl + '/media/',
                    method: 'PATCH',
                    headers: {
                        'Authorization': 'Token ' + authToken.get()
                    }
                });

                $scope.fieldHasError = utils.fieldHasError;

                $scope.view = {
                    busy: true,
                    uploading: false,
                    submitted: false,
                    mediaCreated: false,

                    videoUploadStarted: false,
                    videoUploadProgress: 0,
                    videoUploadComplete: false,

                    imageUploadStarted: false,
                    imageUploadProgress: 0,
                    imageUploadComplete: false,

                    arImageUploadStarted: false,
                    arImageUploadProgress: 0,
                    arImageUploadComplete: false,

                    brandImageUploadStarted: false,
                    brandImageUploadProgress: 0,
                    brandImageUploadComplete: false
                };

                $scope.data = {
                    arImageFile: '',
                    imageFile: '',
                    mediaName: '',
                    mediaId: '',
                    imageName: '',
                    arImageName: '',
                    description: '',
                    brandImageFile: '',
                    brandDescription: '',
                    animation: ''
                };

                $scope.magezines = ['Tatler','GQ','Time','The Economist','Cosmopolitan','National Geographic','Sports Illustrated','Glamour','Other'];

                // Check other values of selected
                $scope.changeSelect = function() {
                    if ($scope.selectedMagezine.toUpperCase() === 'OTHER') {
                        if (!$scope.magazineOther) {
                            $scope.magazineOther = '';
                        }
                        $scope.isOther = true;
                    } else {
                        $scope.isOther = false;
                    }
                }

                $scope.mediaTypeProp = {
                    'type': 'select',
                    'name': 'media_type',
                    'mediaTypeSelect': 'Upload Media',
                    'values': ['Upload Media', 'External Link']
                };

                $scope.errors = {
                    video: {},
                    image: {},
                    arImage: {}
                };

                var imageStyle = 'background-image: none;border-color: #ccc;';
                $scope.imageList = [imageStyle, imageStyle, imageStyle, imageStyle];
                $scope.imageFileList = [];
                $scope.imageReviewIdx = 0;

                $scope.mediaList = [];

                var checkFormPristine = function() {
                    if (!$scope.form1.$pristine) {
                        return false;
                    } else {
                        // if ($scope.latitude || $scope.longitude) {
                        //     return false;
                        // }
                        for (var property in $scope.data) {
                            if ($scope.data[property]) {
                                return false;
                            }
                        }
                        return true;
                    }
                }

                $scope.nextStep = function() {
                    $scope.form1.$setSubmitted();
                    if (checkFormPristine() && $scope.mediaList.length > 0) {
                        editor.stepSet('step2', 'submitted', true);
                        if ($scope.mediaList.length > 0) {
                            editor.stepSet('step2', 'valid', true);
                            $scope.finish().then(
                                function(){
                                    $scope.goNext();
                                }
                            );
                        } else {
                            editor.stepSet('step2', 'valid', false);
                            setTimeout(function() {
                                $scope.scrollToFirstError();
                            }, 100);
                            helper.alert('danger', 'Please add at least one AR');
                        }
                    } else {
                        $scope.saveMedia().then(
                            function() {
                                editor.stepSet('step2', 'submitted', true);
                                if ($scope.mediaList.length > 0) {
                                    editor.stepSet('step2', 'valid', true);
                                    $scope.finish().then(
                                        function() {
                                            $scope.goNext();
                                        }
                                    );
                                } else {
                                    editor.stepSet('step2', 'valid', false);
                                    setTimeout(function() {
                                        $scope.scrollToFirstError();
                                    }, 100);
                                    helper.alert('danger', 'Please add at least one AR');
                                }
                            },
                            function() {

                            }
                        );
                    }
                };

                $scope.goPrev = function() {
                    $scope.updateStep(1);
                };

                $scope.updateReviewIndex = function(idx) {
                    $scope.imageReviewIdx = idx;
                    $scope.data.imageFile = $scope.imageFileList[$scope.imageReviewIdx];
                    console.log($scope.data.imageFile);
                };

                uploader.onAfterAddingFile = function(newItem) {
                    utils.cleanupUploaderQueue(uploader);
                    if (newItem.alias === 'arDisplay') {
                        $scope.data.arImageFile = newItem._file;
                    }
                    if (newItem.alias === 'brandImage') {
                        $scope.data.brandImageFile = newItem._file;
                    }
                    if (newItem.alias === 'display') {
                        $scope.data.imageFile = newItem._file;
                        setTimeout(function() {
                            var $review = angular.element('.uploader-dropzone.image-selected');
                            var imgStyle = $review.attr('style');
                            $scope.imageList[$scope.imageReviewIdx] = imgStyle;
                            $scope.imageFileList[$scope.imageReviewIdx] = $scope.data.imageFile;
                            $scope.imageReviewIdx++;
                            if ($scope.imageReviewIdx === 4) {
                                $scope.imageReviewIdx = 0;
                            }
                            $scope.$apply();
                        }, 100);
                    }
                };

                uploader.onBeforeUploadItem = function(item) {
                    if (item.alias === 'arDisplay') {
                        $scope.view.arImageUploadStarted = true;
                    }
                    if (item.alias === 'display') {
                        $scope.view.imageUploadStarted = true;
                    }
                    if (item.alias === 'brandImage') {
                        $scope.view.brandImageUploadStarted = true;
                    }
                    item.url = apiUrl + '/media/' + $scope.data.mediaId + '/';
                };

                uploader.onCompleteItem = function(fileItem, response, status, headers) {
                    if (fileItem.alias === 'arDisplay') {
                        $scope.view.arImageUploadComplete = true;
                    }
                    if (fileItem.alias === 'display') {
                        $scope.view.imageUploadComplete = true;
                    }
                    if (fileItem.alias === 'display') {
                        $scope.view.brandImageUploadComplete = true;
                    }
                };

                uploader.onProgressItem = function(fileItem, progress) {
                    if (fileItem.alias === 'arDisplay') {
                        $scope.view.arImageUploadProgress = progress;
                    }
                    if (fileItem.alias === 'display') {
                        $scope.view.imageUploadProgress = progress;
                    }
                    if (fileItem.alias === 'brandImage') {
                        $scope.view.brandImageUploadProgress = progress;
                    }
                };

                uploader.onCompleteAll = function() {
                    $scope.view.mediaCreated = true;
                };

                $scope.showErrors = function() {
                    return $scope.view.submitted;
                };

                $scope.videoHasError = function() {
                    return (typeof $scope.data.videoFile !== 'object');
                };

                $scope.imageHasError = function() {
                    if (typeof $scope.data.imageFile !== 'object') {
                        return true;
                    } else {
                        return false;
                    }
                };

                $scope.viewMedia = function() {
                    $scope.$hide();
                    $state.go('media.view', {
                        mediaId: $scope.data.mediaId
                    });
                };

                $scope.editMedia = function(mediaId) {
                    helper.alert('info', 'You are in edit mode!');
                    $scope.editMode = true;
                    helper.resetAngularFields($scope);
                    $scope.previewMediaId = mediaId.id;
                    mediaService.getMediaItem($scope.previewMediaId).then((response) => {
                        $scope.data.description = response.description;
                        $scope.data.arImageFile     = helper.getMediaPreviewFromUrl(response.ar_resource);
                        $scope.data.arImageName = response.ar_name;
                        $scope.appearance = response.ar_appearance;
                        $scope.imageType = response.ar_resource_type;
                        $scope.data.imageName = response.target_name;
                        $scope.data.url = response.target_url;
                        $scope.data.imageFile = response.target;
                        $scope.data.brandImageFile = response.brand_image;
                        $scope.selectedGender = response.gender;
                        $scope.selectedCategory = response.category;
                        $scope.data.animation = response.animation_type;
                        $scope.selectedMagezine = response.magazine_name;

                        if (_.find($scope.magezines,function(item) {return item == $scope.selectedMagezine})) {
                            $scope.isOther = false;
                        } else {
                            $scope.isOther = true;
                            $scope.magazineOther = $scope.selectedMagezine;
                            $scope.selectedMagezine = 'Other';
                        }

                        $scope.imageList = [];
                        $scope.imageFileList = [];
                        $scope.imageReviewIdx = 0;
                        if ($scope.data.imageFile) {
                            setTimeout(function(){
                                var $review = angular.element('.uploader-dropzone.image-selected');
                                var imgStyle = $review.attr('style');
                                $scope.imageList.push(imgStyle);
                                $scope.imageFileList.push(imgStyle);
                                $scope.imageReviewIdx = 1;
                                var emptyImageStyle = 'background-image: none;border-color: #ccc;';
                                while($scope.imageList.length < 4) {
                                  $scope.imageList.push(emptyImageStyle);
                                }
                                if ($scope.imageList.length > 0) {
                                    $scope.isAddImage = true;
                                }
                            }, 100);
                        } else {
                            var emptyImageStyle = 'background-image: none;border-color: #ccc;';
                            while($scope.imageList.length < 4) {
                              $scope.imageList.push(emptyImageStyle);
                            }
                        }
                    });
                };

                var saveMedia = function() {

                    var deferred = $q.defer();

                    if ($scope.form1.$valid && ($scope.data.arImageFile !== null)) {
                        $scope.validateError = false;
                        $scope.isAddImage = false;

                        var mediaData = {
                            description: $scope.data.description,
                            type: 'magazine',
                            ar_name: $scope.data.arImageName,
                            ar_appearance: $scope.appearance,
                            ar_resource_type: $scope.imageType,
                            target_name: $scope.data.imageName,
                            target_format: 'magazine'
                            // target_url: $scope.data.url,
                        };
                        if ($scope.selectedMagezine) {
                            if ($scope.selectedMagezine.toUpperCase() === 'OTHER') {
                                mediaData.magazine_name = $scope.magazineOther;
                                $scope.magazineOther = '';
                            } else {
                                mediaData.magazine_name = $scope.selectedMagezine;
                            }
                        }

                        if ($scope.data.url) {
                            mediaData.target_url = $scope.data.url;

                            if (mediaData.target_url.indexOf('http://') === -1) {
                                mediaData.target_url = 'http://' + mediaData.target_url;
                            }
                        } else {
                            if (!$scope.data.url) {
                                mediaData.target_url = '';
                            }
                        }

                        if ($scope.editMode) {
                            mediaData.id = $scope.previewMediaId;
                        }

                        if ($scope.data.arImageFile !== null && typeof($scope.data.arImageFile) === 'object') {
                            mediaData.ar_resource = $scope.data.arImageFile;
                        }
                        if ($scope.data.imageFile !== null && typeof($scope.data.imageFile) === 'object') {
                            mediaData.target = $scope.data.imageFile;
                        } else {
                            if (!$scope.data.imageFile) {
                                mediaData.target = '';
                            }
                        }

                        mediaService.saveKachingZoneMedia(mediaData).then(
                            function(data) {
                                deferred.resolve(data);
                            },
                            function(response) {
                                deferred.reject(response);
                            }
                        );
                    } else {
                        $scope.validateError = true;
                        editor.stepSet('step2', 'valid', false);
                        setTimeout(function() {
                            $scope.scrollToFirstError();
                        }, 100);
                        deferred.reject();
                    }
                    return deferred.promise;
                };

                $scope.saveMedia = function() {
                    var deferred = $q.defer();
                    if($scope.form1.$valid) {
                        $scope.view.busy = true;
                        saveMedia().then(
                            function(data) {
                                $scope.form1.$setPristine();
                                if ($scope.editMode) {
                                    $scope.editMode = false;
                                    helper.alert('success', 'Media has been updated.');
                                    $scope.view.busy = false;
                                    $scope.clearForm();
                                    $scope.loadSubmittedMedia();
                                    deferred.resolve();
                                } else {
                                    $scope.mediaList.push(data);
                                    editor.dataSet('mediaList', $scope.mediaList);
                                    $scope.getMedia(data.id).then(
                                        function() {
                                            deferred.resolve();
                                        },
                                        function() {
                                            deferred.reject();
                                        }
                                    );
                                    $scope.clearForm();
                                }
                            },
                            function(response) {
                                $scope.form1.$setPristine();
                                $scope.view.busy = false;
                                deferred.reject();
                            }
                        );
                    } else {
                        $scope.scrollToFirstError();
                        helper.alert('danger', 'Please fill all required fields');
                        deferred.reject();
                    }
                    return deferred.promise;
                };

                $scope.deleteMedia = function(mediaId) {
                    $scope.previewMediaId = mediaId.id;
                    campaignsService.deleteMedia($scope.previewMediaId).then(
                        function(response) {
                            console.log(response);
                            helper.alert('success', 'Media has been deleted');
                            $scope.loadSubmittedMedia();
                        },
                        function(response) {
                            console.log(response);
                            helper.alert('danger', 'Media has not been deleted.');
                        }
                    );
                };

                $scope.removeAddImageForm = function() {
                    $scope.data.description = '';
                    $scope.data.imageName = '';
                    $scope.data.imageFile = '';
                    $scope.data.url = '';
                    $scope.selectedMagezine = $scope.magezines[0];
                    $scope.magazineOther = '';

                    helper.clearFileUploader('#imageFile');
                    helper.clearFileUploader('.image-review-list');
                    $scope.imageList = [];
                    $scope.imageReviewIdx = 0;
                    var imageStyle = 'background-image: none;border-color: #ccc;';
                    $scope.imageList = [imageStyle, imageStyle, imageStyle, imageStyle];

                    var mediaData = {
                        description: '',
                        target: '',
                        target_name: '',
                        target_format: '',
                        target_url: '',
                        magazine_name: ''
                    };

                    $scope.isAddImage = false;
                    $scope.isOther = false;
                    $scope.form1.description.$pristine;
                    $scope.form1.imageName.$pristine;
                    $scope.form1.imageFile.$pristine;
                    $scope.form1.url.$pristine;
                };

                $scope.clearForm = function() {
                    helper.clearForm();

                    $scope.data = {
                        arImageFile: '',
                        imageFile: '',
                        mediaName: '',
                        mediaId: '',
                        imageName: '',
                        arImageName: '',
                        description: '',
                        brandImageFile: '',
                        brandDescription: '',
                        animation: ''
                    };

                    helper.clearFileUploader('#imageFile');
                    helper.clearFileUploader('#arImageFile');
                    helper.clearFileUploader('.image-review-list');

                    $scope.imageList = [];
                    var emptyImageStyle = 'background-image: none;border-color: #ccc;';
                    while($scope.imageList.length < 4) {
                      $scope.imageList.push(emptyImageStyle);
                    }
                    $scope.imageFileList = [];
                    $scope.imageReviewIdx = 0;
                };

                $scope.cancelEdit = function() {
                    $scope.clearForm();
                    $scope.editMode = false;
                    $scope.magazineOther = '';
                    $scope.isAddImage = false;
                };

                $scope.getMedia = function(mediaId) {
                    var deferred = $q.defer();
                    // $scope.view.busyMedia = true;
                    $scope.view.busy = true;
                    mediaService.getMediaItem(mediaId).then(
                        function(mediaItem) {
                            $scope.view.busy = false;
                            $scope.media = mediaItem;
                            editor.dataSet('media', $scope.media);

                            editor.save('step2').then(
                                function() {
                                    $scope.campaignId = editor.dataGet('campaignId');
                                    campaignsService.getCampaign($scope.campaignId);
                                    // show notification
                                    helper.alert('success', 'Media has been created.');
                                    deferred.resolve();
                                },
                                function(response) {
                                    errorHandler.processApiResponse(response);
                                    deferred.reject();
                                }
                            );
                        },
                        function() {
                            // $scope.view.busyMedia = false;
                            $scope.view.busy = false;
                            deferred.reject();
                        }
                    );
                    return deferred.promise;
                };
                $scope.getFormats = function() {
                    $scope.formats = [
                        'Commercial'
                    ];
                };

                $scope.getFormats();

                $scope.loadSubmittedMedia = function() {
                    if (editor.dataGet().campaignId !== undefined) {
                        campaignsService.getCampaign(editor.dataGet().campaignId).then(function(response) {
                            $scope.mediaList = response.media;
                        });
                    }
                };

                $scope.finish = function() {

                    var deferred = $q.defer();

                    var campaignStatus = editor.dataGet('campaignStatus');
                    var campaign = editor.dataGet('campaign');

                    if (campaignStatus === 'start' && !campaign.status || $scope.editId) {
                        // $scope.view.busy = true;
                        // $scope.campaignId = editor.dataGet( 'campaignId' );
                        // campaignsService.setPrepared( $scope.campaignId ).then(
                        //     function( response ) {
                        //         $scope.view.busy = false;
                        //         deferred.resolve(response);
                        //     },
                        //     function( response ) {
                        //         errorHandler.processApiResponse( response );
                        //         $scope.view.busy = false;
                        //         deferred.reject(response);
                        //     }
                        // );
                        $scope.activeCampaign().then(
                            function(){
                                deferred.resolve();
                            },
                            function(){
                                deferred.reject();
                            }
                        );
                    } else {
                        deferred.resolve();
                    }

                    return deferred.promise;
                };

                $scope.scrollToFirstError = function() {
                    var elementName = $scope.form1.$error.required[0].$name;
                    var firstErrorId = document.getElementsByName(elementName)[0].id;
                    $location.hash(firstErrorId);
                    $anchorScroll();
                };

                $scope.needBasicValidateZone = function() {
                    if($scope.data.imageName || $scope.data.imageFile) {
                        return true;
                    } else {
                        return false;
                    }
                };

                $scope.init = function() {
                    // //BEGIN: fake data
                    // $scope.data.imageName       = "image name";
                    // $scope.data.description     = "description";
                    // $scope.data.arImageName     = "ar image name";
                    // $scope.data.url             = "http://abc.com";
                    // $scope.inclusionZone        = 10;
                    // $scope.address              = "14/2 Trường Chinh, Phường 15, Tân Bình, Hồ Chí Minh, Vietnam";
                    // //END: fake data
                    $scope.editMode = false;
                    $scope.isAddImage = false;
                    $scope.loadSubmittedMedia();
                    var targetingData = editor.dataGet('targeting');
                    $scope.view.busy = false;
                };

                function checkMediaValidation() {
                    if($scope.data.arImageName === '') {
                        helper.alert('danger','Please fill all required fields');
                        return false;
                    }
                    return true;
                }
                function checkCampaignValidation() {
                    if($scope.mediaList.length !== 0) {
                        return true;
                    }
                    helper.alert('danger', 'Please, submit at least one media');
                    return false;
                }

                $scope.$on('fund-broadcast', function() {
                    if ($scope.editId) {
                        $scope.nextStep();
                    }
                });

                $scope.init();
            }
        ]);
})();
