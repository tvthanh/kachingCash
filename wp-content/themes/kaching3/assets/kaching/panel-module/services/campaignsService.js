(function(){
    'use strict';

    angular.module('panelApp')
        .factory('campaignsService', [ '$q', 'apiService', function( $q, apiService ) {

            return {
                getCampaigns: getCampaigns,
                getCampaign: getCampaign,
                saveCampagin: saveCampagin,
                deleteCampaign: deleteCampaign,
                saveProducts: saveProducts,
                saveMedia: saveMedia,
                stopCampaign: stopCampaign,
                startCampaign: startCampaign,
                setPrepared: setPrepared,
                saveTargeting: saveTargeting,
                getTargeting: getTargeting,
                getEstimatedViews: getEstimatedViews,
                getCampaignBudget: getCampaignBudget,
                saveCampaignBudget: saveCampaignBudget,
                updateMedia: updateMedia,
                deleteMedia: deleteMedia,
                saveKachingZoneCampagin: saveKachingZoneCampagin,
                updateMediaProduct: updateMediaProduct,
                updateMediaQuestion: updateMediaQuestion,
                updateMediaInstoreRewards: updateMediaInstoreRewards,
                generateInStoreReward: generateInStoreReward
            };

            function getCampaigns ( params ) {

                var deferred = $q.defer();

                var requestParams = {
                    limit: 10,
                    offset: 0,
                    ordering: '-id',
                    // type: 'billboard' // for now: only get billboard
                };

                if ( typeof params === 'object' ) {
                    if ( 'limit' in params ) {
                        requestParams.limit = params.limit;
                    }
                    if ( 'offset' in params ) {
                        requestParams.offset = params.offset;
                    }
                    if ( 'ordering' in params ) {
                        requestParams.ordering = params.ordering;
                    }
                    if ( 'name' in params ) {
                        requestParams.name = params.name;
                    }
                    if ( 'client' in params ) {
                        requestParams.client = params.client;
                    }
                    if ( 'media_title' in params ) {
                        requestParams.media_title = params.media_title;
                    }
                    if ( 'start_date' in params ) {
                        requestParams.start_date = params.start_date;
                    }
                    if ( 'end_date' in params ) {
                        requestParams.end_date = params.end_date;
                    }
                    if ( 'status' in params ) {
                        requestParams.status = params.status;
                    }
                }

                apiService.get( '/campaigns/', requestParams, true ).then(
                    function( response ) {
                        deferred.resolve({
                            count: response.count,
                            items: response.results
                        });
                    },
                    function( response ) {
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            }

            function getCampaign ( campaignId ) {

                var deferred = $q.defer();

                apiService.get( '/campaigns/' + campaignId + '/', false, true ).then(
                    function( response ) {
                        deferred.resolve( response );
                    },
                    function( response ) {
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            }

            function deleteCampaign ( campaignId ) {

                var deferred = $q.defer();

                apiService.delete( '/campaigns/' + campaignId + '/', false, true ).then(
                    function( response ) {
                        console.log('deleteCampaign() success', response);
                        deferred.resolve( response );
                    },
                    function( response ) {
                        console.log('deleteCampaign() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            }

            function stopCampaign ( campaignId ) {
                return changeCampaignStatus( campaignId, 5 );
            }

            function startCampaign ( campaignId ) {
                return changeCampaignStatus( campaignId, 3 );
            }

            function setPrepared ( campaignId ) {
                return changeCampaignStatus( campaignId, 2 );
            }

            function changeCampaignStatus ( campaignId, status ) {

                var deferred = $q.defer();

                var data = { status: status };

                apiService.put( '/campaigns/' + campaignId + '/status/', data, true ).then(
                    function( response ) {
                        deferred.resolve( response );
                    },
                    function( response ) {
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            }

            function saveCampagin ( campaign ) {

                var deferred = $q.defer();

                if ( typeof campaign.id === 'undefined' ) {
                    apiService.post( '/campaigns/', campaign, true ).then(
                        function( response ) {
                            console.log('saveCampaign() success', response);
                            deferred.resolve( response );
                        },
                        function( response ) {
                            console.log('saveCampaign() failure', response);
                            deferred.reject( response );
                        }
                    );
                } else {
                    apiService.patch( '/campaigns/' + campaign.id + '/', campaign, true ).then(
                        function( response ) {
                            console.log('saveCampaign() success', response);
                            deferred.resolve( response );
                        },
                        function( response ) {
                            console.log('saveCampaign() failure', response);
                            deferred.reject( response );
                        }
                    );
                }
                return deferred.promise;
            }

            function saveKachingZoneCampagin ( campaign ) {

                var deferred = $q.defer();

                if ( typeof campaign.id === 'undefined' ) {
                    apiService.postMultiPart( '/campaigns/', campaign, true ).then(
                        function( response ) {
                            deferred.resolve( response );
                        },
                        function( response ) {
                            deferred.reject( response );
                        }
                    );
                } else {
                    var campaignData = undefined;

                    apiService.patchMultiPart( '/campaigns/' + campaign.id + '/', campaign, true ).then(
                        function( response ) {
                            campaignData = response;
                            var fundData = {
                                fund: campaign.newFund || 0
                            };
                            apiService.post( '/campaigns/' + campaign.id + '/addFund/', fundData, true ).then(
                                function( response ) {
                                    deferred.resolve( campaignData );
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
                }
                return deferred.promise;
            }

            function saveMedia ( data ) {

                var deferred = $q.defer();

                var campaignId = data.campaignId;
                delete data.campaignId;

                apiService.patch( '/campaigns/' + campaignId + '/media/', data, true ).then(
                    function( response ) {
                        console.log('saveMedia() success', response);
                        deferred.resolve( response );
                    },
                    function( response ) {
                        console.log('saveMedia() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            }

            function saveProducts ( campaignId, products ) {

                var deferred = $q.defer();

                var productsData = {
                    products: []
                };

                angular.forEach( products, function( product ){
                    productsData.products.push( product.id );
                });

                apiService.patch( '/campaigns/' + campaignId + '/products/', productsData, true ).then(
                    function( response ) {
                        console.log('saveProducts() success', response);
                        deferred.resolve( response );
                    },
                    function( response ) {
                        console.log('saveProducts() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            }

            function getTargetingLocations ( selectedLocations ) {

                var deferred = $q.defer();

                apiService.get( '/countries/', null, true ).then(
                    function( response ) {

                        // var allLocations = true;
                        // var locations = [];
                        //
                        // angular.forEach( response, function( name, id ){
                        //
                        //     // id = parseInt( id );
                        //     id = parseInt(name.id);
                        //     var item = { id: id, name: name, selected: true };
                        //
                        //     if ( typeof selectedLocations !== 'undefined'  && selectedLocations.indexOf( id ) === -1 ) {
                        //         item.selected = false;
                        //         allLocations = false;
                        //     }
                        //
                        //     locations.push( item );
                        // });
                        //
                        // deferred.resolve({
                        //     allLocations: allLocations,
                        //     locations: locations
                        // });
                        deferred.resolve(response);
                    },
                    function( response ) { deferred.reject( response ); }
                );

                return deferred.promise;
            }

            function getTargetingCategories ( selectedCategories ) {

                var deferred = $q.defer();

                apiService.get( '/campaigns/categories/', null, true ).then(
                    function( response ) {

                        var allCategories = true;
                        var categories = [];

                        angular.forEach( response, function( name, id ){

                            id = parseInt( id );
                            var item = { id: id, name: name, selected: true };

                            if ( typeof selectedCategories !== 'undefined' && selectedCategories.indexOf( id ) === -1 ) {
                                item.selected = false;
                                allCategories = false;
                            }

                            categories.push( item );
                        });

                        deferred.resolve({
                            allCategories: allCategories,
                            categories: categories
                        });
                    },
                    function( response ) { deferred.reject( response ); }
                );

                return deferred.promise;
            }

            function getAgeRanges () {
                return [
                    { value: 0, label: 'Any' },
                    { value: 2130, label: '21 - 30' },
                    { value: 3145, label: '31 - 45' },
                    { value: 4660, label: '46 - 60' },
                    { value: 6180, label: '61 - 80' }
                ];
            }

            function getTargeting ( campaignId ) {

                var deferred  = $q.defer();
                var deferred1 = $q.defer();
                var deferred2 = $q.defer();

                var promisses = [
                    deferred1.promise,
                    deferred2.promise
                ];

                var data = {
                    gender: {},
                    os: {}
                };

                if ( typeof campaignId === 'undefined' ) {

                    getTargetingCategories().then(
                        function( response ) {
                            data.allCategories = response.allCategories;
                            data.categories    = response.categories;
                            deferred1.resolve();
                        },
                        function( response ) { deferred1.reject( response ); }
                    );

                    getTargetingLocations().then(
                        function( response ) {
                            data.allLocations = response.allLocations;
                            data.locations    = response;
                            data.selectedCountry = response.selectedCountry
                                                    || _.findWhere(response, {alpha2_code: (kachingAppConfig.localeData ? kachingAppConfig.localeData.country : 'SG')})
                                                    || _.findWhere(response, {alpha2_code: 'SG'});
                            deferred2.resolve();
                        },
                        function( response ) { deferred2.reject( response ); }
                    );

                    $q.all( promisses ).then(
                        function() {
                            data.gender = { male: true, female: true };
                            data.os = { android: true, ios: true };
                            data.ageRanges = getAgeRanges();
                            data.ageRange = data.ageRanges[0];
                            deferred.resolve( data );
                        },
                        function( response ) { deferred.reject( response ); }
                    );

                } else {

                    apiService.get( '/campaigns/' + campaignId + '/targeting_options/', false, true ).then(
                        function( targetingData ) {
                            data.selectedCountry = targetingData.location[0] || undefined;

                            getTargetingCategories( targetingData.app_categories ).then(
                                function( response ) {
                                    data.allCategories = response.allCategories;
                                    data.categories    = response.categories;
                                    deferred1.resolve();
                                },
                                function( response ) { deferred1.reject( response ); }
                            );

                            getTargetingLocations().then(
                                function( response ) {
                                    // data.allLocations = response.allLocations;
                                    // data.locations    = response.locations;
                                    data.locations = response;

                                    if (!data.selectedCountry) {
                                        data.selectedCountry =  _.findWhere(response, {alpha2_code:kachingAppConfig.localeData.country})
                                                                ||  _.findWhere(response, {alpha2_code:'SG'});
                                    } else {
                                         data.selectedCountry =  _.findWhere(response, {id:data.selectedCountry});
                                    }
                                    deferred2.resolve();
                                },
                                function( response ) { deferred2.reject( response ); }
                            );

                            $q.all( promisses ).then(
                                function() {

                                    // gender: 'F', 'M', 'A' (M+F)
                                    data.gender.male   = ( targetingData.gender === 'M' || targetingData.gender === 'A' ) ? true : false;
                                    data.gender.female = ( targetingData.gender === 'F' || targetingData.gender === 'A' ) ? true : false;

                                    // os: 0 - any, 1 - android, 2 - ios
                                    data.os.android = ( targetingData.os === 1 || targetingData.os === 0 ) ? true : false;
                                    data.os.ios     = ( targetingData.os === 2 || targetingData.os === 0 ) ? true : false;

                                    // Age ranges
                                    data.ageRanges = getAgeRanges();

                                    if ( targetingData.age_range.length > 1 ) {
                                        data.ageRange = data.ageRanges[0];
                                    } else {
                                        var selectedAgeRange = targetingData.age_range[0];
                                        data.ageRange = _.findWhere( data.ageRanges, { value: selectedAgeRange } );
                                    }

                                    deferred.resolve( data );
                                },
                                function( response ) { deferred.reject( response ); }
                            );
                        },
                        function( response ) { deferred.reject( response ); }
                    );
                }


                return deferred.promise;
            }

            function saveTargeting ( campaignId, settings ) {

                var deferred = $q.defer();
                var data = {};
                var error = {
                    validationErrors: {}
                };

                // Operating system
                if ( settings.os.android === true && settings.os.ios === true ) {
                    data.os = 0;
                } else if ( settings.os.android === true ) {
                    data.os = 1;
                } else if ( settings.os.ios === true ) {
                    data.os = 2;
                } else {
                    error.validationErrors.os = true;
                }

                // Gender
                if ( settings.gender.male === true && settings.gender.female === true ) {
                    data.gender = 'A';
                } else if ( settings.gender.male === true ) {
                    data.gender = 'M';
                } else if ( settings.gender.female === true ) {
                    data.gender = 'F';
                } else {
                    error.validationErrors.gender = true;
                }

                // Age range
                if ( settings.ageRange.value === 0 ) {
                    data.age_range = [];
                    angular.forEach( getAgeRanges(), function( range ){
                        if ( range.value !== 0 ) {
                            data.age_range.push( range.value );
                        }
                    });
                } else {
                    data.age_range = [ settings.ageRange.value ];
                }

                // Locations
                // data.location = [];
                // angular.forEach( settings.locations, function( location ){
                //     if ( settings.allLocations === true || location.selected === true ) {
                //         data.location.push( location.id );
                //     }
                // });
                data.location = [];
                data.location.push(settings.locations.id);
                if ( data.location.length === 0 ) {
                    error.validationErrors.locations = true;
                }

                // Categories
                data.app_categories = [];
                angular.forEach( settings.categories, function( category ){
                    if ( settings.allCategories === true || category.selected === true ) {
                        data.app_categories.push( category.id );
                    }
                });
                if ( data.app_categories.length === 0 ) {
                    error.validationErrors.categories = true;
                }

                if ( _.isEmpty( error.validationErrors ) ) {
                    // Save data in the backend
                    apiService.put( '/campaigns/' + campaignId + '/targeting_options/', data, true ).then(
                        function( response ) { deferred.resolve( response ); },
                        function( response ) { deferred.reject( response ); }
                    );
                } else {
                    deferred.reject( error );
                }

                return deferred.promise;
            }

            function getEstimatedViews ( campaignId, cpv ) {

                var deferred = $q.defer();
                var requestParams = {};

                if ( typeof cpv !== 'undefined' ) {
                    requestParams.cpv = cpv;
                }

                apiService.get( '/campaigns/' + campaignId + '/estimated_views/', requestParams, true ).then(
                    function( response ) {
                        console.log('getEstimatedViews() success', response);
                        deferred.resolve( response );
                    },
                    function( response ) {
                        console.log('getEstimatedViews() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            }

            function getCampaignBudget ( campaignId ) {

                var deferred = $q.defer();

                apiService.get( '/campaigns/' + campaignId + '/budget/', null, true ).then(
                    function( response ) {
                        deferred.resolve( response );
                    },
                    function( response ) {
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            }

            function saveCampaignBudget ( campaignId, data, hasBudget, budgetId ) {

                var deferred = $q.defer();

                if ( hasBudget ) {
                    apiService.put( '/campaigns/' + campaignId + '/budget/' + budgetId + '/', data, true ).then(
                        function( response ) {
                            console.log('saveCampaignBudget() success', response);
                            deferred.resolve( response );
                        },
                        function( response ) {
                            console.log('saveCampaignBudget() failure', response);
                            deferred.reject( response );
                        }
                    );
                } else {
                    apiService.post( '/campaigns/' + campaignId + '/budget/', data, true ).then(
                        function( response ) {
                            console.log('saveCampaignBudget() success', response);
                            deferred.resolve( response );
                        },
                        function( response ) {
                            console.log('saveCampaignBudget() failure', response);
                            deferred.reject( response );
                        }
                    );
                }

                return deferred.promise;
            }

            function campaignHasBudget ( campaignId ) {

                var deferred = $q.defer();

                apiService.get( '/campaigns/' + campaignId + '/budget/', null, true ).then(
                    function( response ) {
                        deferred.resolve( response );
                    },
                    function( response ) {
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            }

            function updateMedia ( media ) {

                var deferred = $q.defer();

                apiService.patch( '/media/' + media.id + '/', media, true ).then(
                    function( response ) {
                        deferred.resolve( response );
                    },
                    function( response ) {
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            }

            function deleteMedia ( campaignId ) {

                var deferred = $q.defer();

                apiService.delete( '/media/' + campaignId + '/', false, true).then(
                    function( response ) {
                        deferred.resolve( response );
                    },
                    function( response ) {
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            }

            function updateMediaProduct ( media ) {

                var deferred = $q.defer();

                apiService.patch( '/media/' + media.id + '/products/', media, true ).then(
                    function( response ) {
                        deferred.resolve( response );
                    },
                    function( response ) {
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            }

            function updateMediaQuestion ( media ) {

                var deferred = $q.defer();

                apiService.patch( '/media/' + media.id + '/questions/', media, true ).then(
                    function( response ) {
                        deferred.resolve( response );
                    },
                    function( response ) {
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            }

            function updateMediaInstoreRewards(media) {
                var deferred = $q.defer();
                apiService.post('/media/' + media.id + '/instoreRewards/', media.instore_rewards, true).then(
                    function(response) {
                        deferred.resolve(response);
                    },
                    function(response) {
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }

            function generateInStoreReward(media, reward) {
                var deferred = $q.defer();
                apiService.post('/media/' + media.id + '/instoreReward/', reward, true).then(
                    function(response) {
                        deferred.resolve(response);
                    },
                    function(response) {
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }
        }]);
})();
