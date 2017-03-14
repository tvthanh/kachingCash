(function(){
    'use strict';

    angular.module('panelApp')
        .factory('countryService', [ '$q', '$http', function( $q, $http ) {
            return {
                getCities: getCities,
                getDistricts: getDistricts
            };
            function getCities (countryCode, city) {
                var url = 'http://api.geonames.org/searchJSON?country=' + countryCode + '&fcode=PPLA&fcode=PPLC&username=ulabvn';

                if (!!city) {
                    url+= '&q=' + city;
                }

                console.log(url);

                return makeRequest( 'GET', url );
            }

            function getDistricts (countryCode, city) {
                var url ='http://api.geonames.org/searchJSON?country=' + countryCode + '&q=' + city +'&fcode=PPLA2&fcode=PPLC&username=ulabvn';
                if (!!city) {
                    url+= '&q=' + city;
                }

                console.log(url);

                return makeRequest( 'GET', url );
            }

            function makeRequest ( method, url ) {

                var deferred = $q.defer();

                var request = {
                    method: method,
                    url: url
                };

                $http( request ).then(
                    function( response ) {
                        deferred.resolve( response.data );
                    },
                    function( response ) {
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            }
        }]);
})();
