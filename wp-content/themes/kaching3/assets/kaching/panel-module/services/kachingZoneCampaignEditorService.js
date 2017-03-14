(function() {
    'use strict';

    angular.module('panelApp')
        .factory('kachingZonecampaignEditorService', [
            '$q',
            'campaignsService',
            'clientsService',
            'productsService',
            function(
                $q,
                campaignsService,
                clientsService,
                productsService
            ) {

                var view = {};
                var data = {};
                var flags = {};

                return {
                    init: init,
                    flag: flag,
                    mode: mode,
                    save: save,
                    currentStep: currentStep,
                    previousState: previousState,
                    stepGet: stepGet,
                    stepSet: stepSet,
                    dataGet: dataGet,
                    dataSet: dataSet,
                    logData: logData
                };

                // Public function

                function init (campaignId) {

                    view = {
                        currentStep: 1,
                        previousState: 1,
                        'step1': {
                            valid: false,
                            submitted: false
                        },
                        'step2': {
                            valid: false,
                            submitted: false
                        },
                        'step3': {
                            valid: false,
                            submitted: false
                        },
                        'step4': {
                            valid: false,
                            submitted: false
                        }
                    };

                    data = {
                        campaignId: undefined,
                        campaign: {
                            type: undefined,
                            name: undefined,
                            client: '',
                            start_date: undefined,
                            end_date: undefined,
                            // budget: undefined,
                            logo_image: undefined,
                            header_image: undefined,
                            description: '',
                            logo_description: '',
                            header_description: ''
                        },
                        targeting: {
                            // os: undefined,
                            // gender: undefined,
                            // ageRange: undefined,
                            // locations: undefined,
                            // categories: undefined
                        },
                        // media: {},
                        media: [],
                        products: []
                    };

                    flags = {
                        mode: 'new'
                    };

                    if (typeof campaignId !== 'undefined') {
                        flag('mode', 'edit');
                        dataSet('campaignId', campaignId);
                    }
                }

                function flag(name, val) {
                    if (typeof val !== 'undefined') {
                        flags[name] = val;
                    } else {
                        if (typeof flags[name] !== 'undefined') {
                            return flags[name];
                        } else {
                            return false;
                        }
                    }
                }

                function mode () {
                    return flags.mode;
                }

                function save (step) {
                    if (step === 'step1') {
                        return saveStep1();
                    } else if (step === 'step2') {
                        return saveStep2();
                    } else if (step === 'step3') {
                        return saveStep3();
                    } else if (step === 'step4') {
                        return saveStep4();
                    }
                }

                function currentStep ( step ) {
                    if ( typeof step === 'string' ) {
                        view.currentStep = step;
                    } else {
                        return view.currentStep;
                    }
                }

                function previousState (state) {
                    if (typeof state === 'string') {
                        view.previousState = state;
                    } else {
                        return view.previousState;
                    }
                }

                function stepGet (step, prop) {
                    if (typeof step !== 'string') {
                        return false;
                    }
                    if (typeof prop === 'string') {
                        return angular.copy(view[step][prop]);
                    }
                    return angular.copy(view[step]);
                }

                function stepSet (step, prop, val) {
                    if (typeof step !== 'string' || typeof prop !== 'string' || typeof val === 'undefined') {
                        return false;
                    }
                    view[step][prop] = val;
                    return stepGet(step);
                }

                function dataGet (prop) {
                    if (typeof prop !== 'undefined') {
                        if (typeof data[prop] !== 'undefined') {
                            // return angular.copy(data[prop]);
                            return _.clone(data[prop]);
                        } else {
                            return false;
                        }
                    }
                    // return angular.copy(data);
                    return _.clone(data);
                }

                function dataSet(prop, val) {
                    if (typeof prop !== 'string' || typeof val === 'undefined') {
                        return false;
                    }
                    data[prop] = val;
                    return dataGet();
                }

                function logData () {
                    console.log('campaignEditorService - data', angular.copy(data));
                }

                // Private function

                function b64toBlob(b64Data, contentType, sliceSize) {
                  b64Data = b64Data.substring(22);
                  contentType = contentType || '';
                  sliceSize = sliceSize || 512;

                  var byteCharacters = atob(b64Data);
                  var byteArrays = [];

                  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                    var slice = byteCharacters.slice(offset, offset + sliceSize);

                    var byteNumbers = new Array(slice.length);
                    for (var i = 0; i < slice.length; i++) {
                      byteNumbers[i] = slice.charCodeAt(i);
                    }

                    var byteArray = new Uint8Array(byteNumbers);

                    byteArrays.push(byteArray);
                  }

                  var blob = new Blob(byteArrays, {type: contentType});
                  return blob;
                }

                function saveCampagin() {

                    var deferred = $q.defer();
                    var campaign = dataGet('campaign');
                    var campaignData = {
                        id: dataGet('campaignId') || campaign.id,
                        type: campaign.type,
                        name: campaign.name,
                        // client: campaign.customerName,
                        start_date: campaign.start_date,
                        end_date: campaign.end_date,
                        fund: campaign.fund,
                        // description: campaign.description,
                        register: campaign.register || 0,
                        newFund: campaign.newFund
                    };

                    campaignData.client = campaign.client || '';
                    campaignData.description = campaign.description || '';
                    campaignData.logo_description = campaign.logo_description || '';
                    campaignData.header_description = campaign.header_description || '';

                    if (campaign.logo_image !== null && typeof(campaign.logo_image) === 'object') {
                        campaignData.logo_image = campaign.logo_image;
                    } else {
                        if (typeof(campaign.logo_image) === 'string' && campaign.logo_image.indexOf('base64') > -1) {
                            var blob = b64toBlob(campaign.logo_image, 'image/jpeg');
                            var file = new File([blob], 'logo_image.jpeg');
                            campaignData.logo_image = file;
                        }
                    }

                    if (campaign.header_image !== null && typeof(campaign.header_image) === 'object') {
                        campaignData.header_image = campaign.header_image;
                    } else {
                        if (typeof(campaign.header_image) === 'string' && campaign.header_image.indexOf('base64') > -1) {
                            var headerBlob = b64toBlob(campaign.header_image, 'image/jpeg');
                            var headerFile = new File([headerBlob], 'header_image.jpeg');
                            campaignData.header_image = headerFile;
                        }
                    }

                    campaignsService.saveKachingZoneCampagin(campaignData).then(
                        function(campaign) {
                            dataSet('campaignId', campaign.id);
                            dataSet('campaign', campaign);
                            deferred.resolve(dataGet('campaign'));
                        },
                        function(response) {
                            deferred.reject(response);
                        }
                    );

                    return deferred.promise;
                }

                function saveTargeting() {

                    var deferred = $q.defer();
                    var targetingData = dataGet('targeting');
                    var selectedCountry = dataGet('selectedCountry');

                    campaignsService.saveTargeting(dataGet('campaignId'), targetingData).then(
                        function(targeting) {
                            // dataSet('targeting', targeting);
                            deferred.resolve(dataGet('targeting'));
                        },
                        function(response) {
                            deferred.reject(response);
                        }
                    );

                    return deferred.promise;
                }

                function saveCampaignBudget() {

                    var deferred = $q.defer();

                    var budgeting = dataGet('budgeting');

                    campaignsService.saveCampaignBudget(dataGet('campaignId'), budgeting, budgeting.hasBudget, budgeting.id).then(
                        function(budgeting) {
                            dataSet('budgeting', budgeting);
                            deferred.resolve(dataGet('budgeting'));
                        },
                        function(response) {
                            deferred.reject(response);
                        }
                    );

                    return deferred.promise;
                }

                // function updateFund(id) {
                //
                //     var deferred = $q.defer();
                //
                //     // campaignsService.saveTargeting(dataGet('campaignId'), targetingData).then(
                //     //     function(targeting) {
                //     //         // dataSet('targeting', targeting);
                //     //         deferred.resolve(dataGet('targeting'));
                //     //     },
                //     //     function(response) {
                //     //         deferred.reject(response);
                //     //     }
                //     // );
                //
                //     return deferred.promise;
                // }

                function saveStep1() {

                    var deferred = $q.defer();
                    var deferred1 = $q.defer();
                    var deferred2 = $q.defer();
                    var deferred3 = $q.defer();

                    var promisses = [
                        deferred1.promise,
                        deferred2.promise,
                        deferred3.promise
                    ];

                    var campaign = dataGet('campaign');
                    var data = {};

                    saveCampagin().then(
                        function(campaign){
                            data.campaign = campaign;
                            deferred1.resolve();
                            saveTargeting().then(
                                function(targeting){
                                    data.targeting = targeting;
                                    deferred2.resolve();
                                },
                                function( response ) { deferred2.reject( response ); }
                            );
                            saveCampaignBudget().then(
                                function(budgeting){
                                    data.budgeting = budgeting;
                                    deferred3.resolve();
                                },
                                function( response ) { deferred3.reject( response ); }
                            );
                        },
                        function( response ) { deferred1.reject( response ); }
                    );

                    $q.all( promisses ).then(
                        function() {
                            deferred.resolve(data);
                        },
                        function( response ) { deferred.reject( response ); }
                    );

                    return deferred.promise;
                }

                function saveStep2() {

                    var deferred = $q.defer();

                    var media = dataGet('media');

                    var mediaData = {
                        campaignId: dataGet('campaignId'),
                        media: media.id,
                        // media_title:  media.media_title,
                        // media_description:  media.media_description
                        media_title: 'empty',
                        media_description: 'empty'
                    };

                    campaignsService.saveMedia(mediaData).then(
                        function() {
                            //dataSet('campaignId', campaign.id );
                            deferred.resolve();
                        },
                        function(response) {
                            deferred.reject(response);
                        }
                    );

                    return deferred.promise;
                }

                function saveStep3() {

                    var deferred = $q.defer();

                    saveCampagin(deferred);

                    return deferred.promise;
                }

                function saveStep4() {

                }
            }
        ]);
})();
