(function() {
    'use strict';

    angular.module('panelApp')
        .controller('radioStep2Ctrl', [
            '$scope',
            '$state',
            'apiUrl',
            'authToken',
            'utils',
            'mediaService',
            'FileUploader',
            'countryService',
            'campaignEditorService',
            'campaignsService',
            '$http',
            '$q',
            'errorHandler',
            '$anchorScroll',
            '$location',
            'kachingZonesHelpers',
            'kachingZonecampaignEditorService',
            function(
                $scope,
                $state,
                apiUrl,
                authToken,
                utils,
                mediaService,
                FileUploader,
                countryService,
                campaignEditorService,
                campaignsService,
                $http,
                $q,
                errorHandler,
                $anchorScroll,
                $location,
                kachingZonesHelpers,
                kachingZonecampaignEditorService
            ) {
                var helper = kachingZonesHelpers;
                var editor = kachingZonecampaignEditorService;

                $scope.formSummited = false;

                var uploader = $scope.uploader = new FileUploader({
                    url: apiUrl + '/media/',
                    method: 'PATCH',
                    headers: {
                        'Authorization': 'Token ' + authToken.get()
                    }
                });

                $scope.view = {
                    busy: true
                };

                $scope.data = {
                    arImageFile: '',
                    imageFile: '',
                    mediaName: '',
                    mediaId: '',
                    imageName: '',
                    arImageName: '',
                    description: ''
                };

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
                $scope.fieldHasError = utils.fieldHasError;

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

                $scope.showErrors = function() {
                    return ($scope.mediaList.length === 0 && editor.stepGet('step2', 'submitted')) || $scope.validateError;
                };

                $scope.videoHasError = function() {
                    return (typeof $scope.data.videoFile !== 'object');
                };

                $scope.viewMedia = function() {
                    $scope.$hide();
                    $state.go('media.view', {
                        mediaId: $scope.data.mediaId
                    });
                };

                var saveMedia = function() {

                    var deferred = $q.defer();

                    if ($scope.form1.$valid && $scope.data.imageFile !== null) {
                        var mediaData = {
                            description: $scope.data.description,
                            type: 'radio',
                            target_name: $scope.data.imageName,
                            target_format: 'radio'
                                // radio_station: $scope.selectedStation.name
                        };

                        if ($scope.selectedStation) {
                            if ($scope.selectedStation.name.toUpperCase() === 'OTHER') {
                                mediaData.radio_station = $scope.stationOther;
                                $scope.stationOther = '';
                            } else {
                                mediaData.radio_station = $scope.selectedStation.name;
                            }
                        }

                        if ($scope.data.radioUrl) {
                            mediaData.target_url = $scope.data.radioUrl;

                            if (mediaData.target_url.indexOf('http://') === -1) {
                                mediaData.target_url = 'http://' + mediaData.target_url;
                            }
                        }

                        if ($scope.editMode) {
                            mediaData.id = $scope.previewMediaId;
                        }
                        if ($scope.data.imageFile !== null && typeof($scope.data.imageFile) === 'object') {
                            mediaData.radio = $scope.data.imageFile;
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
                            helper.scrollToFirstError($scope);
                        }, 100);
                        deferred.reject();
                    }
                    return deferred.promise;
                };

                $scope.saveMedia = function() {
                    var deferred = $q.defer();
                    if ($scope.form1.$valid) {
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
                                    data.target = kachingAppConfig.wpTemplateUri + '/assets/images/audio_icon.jpg';
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
                        helper.scrollToFirstError($scope);
                        helper.alert('danger', 'Please fill all required fields.');
                        deferred.reject();
                    }
                    return deferred.promise;
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
                    helper.clearFileUploader('.image-review-list');

                    $scope.imageList = [];
                    var emptyImageStyle = 'background-image: none;border-color: #ccc;';
                    while ($scope.imageList.length < 4) {
                        $scope.imageList.push(emptyImageStyle);
                    }
                    $scope.imageFileList = [];
                    $scope.imageReviewIdx = 0;
                };

                $scope.cancelEdit = function() {
                    $scope.clearForm();
                    $scope.editMode = false;
                    $scope.stationOther = '';
                };

                $scope.getMedia = function(mediaId) {
                    var deferred = $q.defer();
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

                $scope.editMedia = function(mediaId) {
                    helper.alert('info', 'You are in edit mode!');
                    $scope.editMode = true;
                    helper.resetAngularFields($scope);
                    $scope.previewMediaId = mediaId.id;
                    mediaService.getMediaItem($scope.previewMediaId).then(function(response) {
                        $scope.data.description = response.description;
                        $scope.data.imageName = response.target_name;
                        $scope.data.imageFile = kachingAppConfig.wpTemplateUri + '/assets/images/audio_icon.jpg';
                        $scope.data.radioUrl = response.target_url;

                        var currentStation = _.find($scope.stations, {
                            name: response.radio_station
                        });

                        if (currentStation) {
                            $scope.isOther = false;
                            $scope.selectedStation = currentStation;
                        } else {
                            $scope.isOther = true;
                            $scope.stationOther = response.radio_station;
                            $scope.selectedStation = _.find($scope.stations, {
                                name: 'Other'
                            });
                        }

                        $scope.imageList = [];
                        $scope.imageFileList = [];
                        $scope.imageReviewIdx = 0;
                        if ($scope.data.imageFile) {
                            setTimeout(function() {
                                var $review = angular.element('.uploader-dropzone.image-selected');
                                var imgStyle = $review.attr('style');
                                $scope.imageList.push(imgStyle);
                                $scope.imageFileList.push(imgStyle);
                                $scope.imageReviewIdx = 1;
                                var emptyImageStyle = 'background-image: none;border-color: #ccc;';
                                while ($scope.imageList.length < 4) {
                                    $scope.imageList.push(emptyImageStyle);
                                }
                            }, 100);
                        } else {
                            var emptyImageStyle = 'background-image: none;border-color: #ccc;';
                            while ($scope.imageList.length < 4) {
                                $scope.imageList.push(emptyImageStyle);
                            }
                        }
                    });
                    $scope.editMediaMode = true;
                };

                $scope.deleteMedia = function(media) {
                    $scope.previewMediaId = media.id;
                    campaignsService.deleteMedia($scope.previewMediaId).then(
                        function(response) {
                            console.log(response);
                            helper.alert('success', 'Media has been deleted.');
                            $scope.loadSubmittedMedia();
                        },
                        function(response) {
                            console.log(response);
                            helper.alert('danger', 'Media has not been deleted.');
                        }
                    );
                };

                $scope.loadSubmittedMedia = function() {
                    if (editor.dataGet().campaignId !== undefined) {
                        campaignsService.getCampaign(editor.dataGet().campaignId).then(function(response) {
                            var mediaTemplate = [];
                            angular.forEach(response.media, function(item, id) {
                                if (!item.target) {
                                    item.target = kachingAppConfig.wpTemplateUri + '/assets/images/audio_icon.jpg';
                                    mediaTemplate.push(item);
                                }
                            });
                            $scope.mediaList = mediaTemplate;
                        });
                    }
                };

                $scope.getFormats = function() {
                    $scope.formats = [
                        'Commercial'
                    ];
                };
                $scope.getFormats();

                $scope.stations = [{
                    id: 'Z100_FM',
                    name: 'FZ 100'
                }, {
                    id: 'Z200_AM',
                    name: 'FZ_200'
                }, {
                    id: 'Jazz_FM',
                    name: 'Jazz FM'
                }, {
                    id: '101.9_FM',
                    name: '101.9 FM'
                }, {
                    id: 'KISS_FM',
                    name: 'KISS FM'
                }, {
                    id: '95_FM',
                    name: '95 FM'
                }, {
                    id: 'other',
                    name: 'Other'
                }];
                $scope.selectedStation = $scope.stations[0];

                // Check other values of selected
                $scope.changeSelect = function() {
                    if ($scope.selectedStation.name.toUpperCase() === 'OTHER') {
                        if (!$scope.stationOther) {
                            $scope.stationOther = '';
                        }
                        $scope.isOther = true;
                    } else {
                        $scope.isOther = false;
                    }
                }

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
                            function() {
                                deferred.resolve();
                            },
                            function() {
                                deferred.reject();
                            }
                        );
                    } else {
                        deferred.resolve();
                    }

                    return deferred.promise;
                };

                $scope.init = function() {

                    $scope.validateError = false;
                    $scope.loadSubmittedMedia();

                    if (!$scope.editId) {
                        if (!editor.stepGet('step1', 'valid')) {
                            $scope.updateStep(editor.currentStep());
                        }
                    }

                    editor.currentStep(2);
                    editor.previousState(2);

                    $scope.mediaList = [];

                    if ($scope.editId) {
                        $scope.initEditMode($scope.editId);
                    } else {
                        var mediaListData = editor.dataGet('mediaList');
                        if (!_.isEmpty(mediaListData)) {
                            $scope.mediaList = mediaListData;
                        }
                    }

                    $scope.view.busy = false;
                    $scope.editMediaMode = false;
                    $scope.editMode = false;
                };

                $scope.initEditMode = function() {
                    // $scope.view.busy = true;
                    campaignsService.getCampaign($scope.editId).then(
                        function(data) {
                            // $scope.campaign
                            $scope.validateError = false;
                            $scope.mediaList = data.media;
                            angular.forEach($scope.mediaList, function(value, key) {
                                if (value.target === null) {
                                    value.target = kachingAppConfig.wpTemplateUri + '/assets/images/audio_icon.jpg';
                                }
                            });
                        },
                        function() {}
                    );
                };

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
                                function() {
                                    $scope.goNext();
                                }
                            );
                        } else {
                            editor.stepSet('step2', 'valid', false);
                            setTimeout(function() {
                                helper.scrollToFirstError($scope);
                            }, 100);
                            helper.alert('danger', 'Please add at least one Audio');
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
                                        helper.scrollToFirstError($scope);
                                    }, 100);
                                    helper.alert('danger', 'Please add at least one Audio');
                                }
                            },
                            function() {

                            }
                        )
                    }
                };

                $scope.goPrev = function() {
                    $scope.updateStep(1);
                };

                $scope.needBasicValidateZone = function() {
                    if ($scope.data.imageFile || $scope.data.imageName || $scope.data.url || $scope.data.description) {
                        return true;
                    } else {
                        return false;
                    }
                };

                $scope.$on('fund-broadcast', function() {
                    if ($scope.editId) {
                        $scope.nextStep();
                    }
                });

                $scope.init();
            }
        ]);
})();
