(function(){
    'use strict';

    angular.module('panelApp')
        .factory('campaignEditorService', [
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


            function init ( campaignId ) {

                view = {
                    currentStep: 'step1',
                    previousState: 'campaigns.new.step1',
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
                    },
                    'step5': {
                        valid: false,
                        submitted: false
                    },
                    'step6': {
                        valid: false,
                        submitted: false
                    }
                };

                data = {
                    campaignId: undefined,
                    campaign: {
                        name: undefined,
                        start_date: undefined,
                        end_date: undefined,
                        budget: undefined
                    },
                    targeting: {},
                    media: [],
                    products: []
                };

                flags = {
                    mode: 'new',
                    campaignLoaded: false
                };

                if ( typeof campaignId !== 'undefined' ) {
                    flag( 'mode', 'edit' );
                    dataSet( 'campaignId', campaignId );
                }
            }

            function mode () {
                return flags.mode;
            }

            function flag ( name, val ) {
                if ( typeof val !== 'undefined' ) {
                    flags[name] = val;
                } else {
                    if ( typeof flags[name] !== 'undefined' ) {
                        return flags[name];
                    } else {
                        return false;
                    }
                }
            }

            function currentStep ( step ) {
                if ( typeof step === 'string' ) {
                    view.currentStep = step;
                } else {
                    return view.currentStep;
                }
            }

            function previousState ( state ) {
                if ( typeof state === 'string' ) {
                    view.previousState = state;
                } else {
                    return view.previousState;
                }
            }

            function stepGet ( step, prop ) {
                if ( typeof step !== 'string' ) {
                    return false;
                }
                if ( typeof prop === 'string' ) {
                    return angular.copy( view[step][prop] );
                }
                return angular.copy( view[step] );
            }

            function stepSet ( step, prop, val ) {
                if ( typeof step !== 'string' || typeof prop !== 'string' || typeof val === 'undefined' ) {
                    return false;
                }
                view[step][prop] = val;
                return stepGet( step );
            }

            function dataGet ( prop ) {
                if ( typeof prop !== 'undefined' ) {
                    if ( typeof data[prop] !== 'undefined' ) {
                        return angular.copy( data[prop] );
                    } else {
                        return false;
                    }
                }
                return angular.copy( data );
            }

            function dataSet ( prop, val ) {
                if ( typeof prop !== 'string' || typeof val === 'undefined' ) {
                    return false;
                }
                data[prop] = val;
                return dataGet();
            }

            function save ( step ) {
                if ( step === 'step1' ) {
                    return saveStep1();
                } else if ( step === 'step2' ) {
                    return saveStep2();
                } else if ( step === 'step3' ) {
                    return saveStep3();
                } else if ( step === 'step4' ) {
                    return saveStep4();
                } else if ( step === 'step5' ) {
                    return saveStep5();
                }
            }

            function saveStep1 () {

                var deferred = $q.defer();

                var campaign = dataGet( 'campaign' );

                saveCampagin( deferred );

                return deferred.promise;
            }

            function saveCampagin ( deferred ) {

                var campaign = dataGet( 'campaign' );

                var campaignData = {
                    name: campaign.name,
                    start_date: campaign.start_date,
                    end_date: campaign.end_date,
                    budget: campaign.budget
                };

                if ( dataGet( 'campaignId' ) ) {
                    campaignData.id = dataGet( 'campaignId' );
                }

                campaignsService.saveCampagin( campaignData ).then(
                    function( campaign ) {
                        dataSet( 'campaignId', campaign.id );
                        deferred.resolve( dataGet('campaign') );
                    },
                    function( response ) {
                        deferred.reject( response );
                    }
                );
            }

            function saveStep2 () {

                var deferred = $q.defer();

                saveCampagin( deferred );

                return deferred.promise;
            }

            function saveStep3 () {

                var deferred = $q.defer();

                saveCampagin( deferred );

                return deferred.promise;
            }

            function saveStep4 () {

                var deferred = $q.defer();

                var media = dataGet( 'media' );

                var mediaData = {
                    campaignId: dataGet( 'campaignId' ),
                    media: media.id,
                    media_title:  'empty',
                    media_description:  'empty'
                };

                campaignsService.saveMedia( mediaData ).then(
                    function() {
                        deferred.resolve();
                    },
                    function( response ) {
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            }

            function saveStep5() {

                var deferred = $q.defer();

                var campaignId = dataGet( 'campaignId' );
                var products = dataGet( 'products' );

                productsService.updateProducts( products ).then(
                    function() {
                        campaignsService.saveProducts( campaignId, products ).then(
                            function( campaign ) {
                                deferred.resolve( campaign );
                            },
                            function( response ) {
                                deferred.reject( response );
                            }
                        );
                    },
                    function( response ) {
                        deferred.reject( response );
                    }
                );


                return deferred.promise;
            }

            function logData (){
                console.log('campaignEditorService - data', angular.copy( data ) );
            }
        }]);
})();
