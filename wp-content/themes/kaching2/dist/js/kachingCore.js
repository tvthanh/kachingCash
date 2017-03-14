(function($){
(function(){
    "use strict";

    console.log('kachingCore loaded');

    angular.module('kachingCore', [
        'underscore',
        'ngSanitize',
        'ngAnimate',
        'ngCookies',
        'ui.router',
        'mgcrea.ngStrap',
        'oc.lazyLoad',
        'kachingTmpl'
    ]);

    angular.module('kachingCore')

        .constant( 'apiUrl', kachingAppConfig.apiUrl )
        .constant( 'sessionDays', 30 )

        .controller('kachingCoreCtrl', [
            '$scope',
            '$rootScope',
            '$ocLazyLoad',
            '$urlRouter',
            '$modal',
            '$window',
            'authService',
        function(
            $scope,
            $rootScope,
            $ocLazyLoad,
            $urlRouter,
            $modal,
            $window,
            authService
        ) {

            if ( kachingAppConfig.isHomePage === true && authService.isLoggedIn() ) {
                $window.location.href = kachingAppConfig.panelUrl;
            } else if ( kachingAppConfig.isPanelPage === true ) {
                $scope.isPanelPage = true;
                $ocLazyLoad.load( kachingAppConfig.wpTemplateUri + '/dist/js/panelApp.min.js').then(
                    function( panelApp ) {
                        $urlRouter.sync();
                    }
                );
            }

            $scope.showSignupDialog = function() {
                $modal({
                    templateUrl: 'kaching-core/components/signupModal/modalTmpl.html',
                    controller: 'signupModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center'
                });
            };

        }]);
})();

(function(){
    "use strict";

    angular.module('kachingCore')
        .factory('utils', [ function() {

            var fieldHasError = function( elScope, formName, fieldName, error ) {

                var field;

                if ( elScope.hasOwnProperty(formName) && typeof elScope[formName] === 'object' ) {
                    field = elScope[formName][fieldName];
                } else if ( elScope.$parent.hasOwnProperty(formName) && typeof elScope.$parent[formName] === 'object' ) {
                    field = elScope.$parent[formName][fieldName];
                }

                if ( typeof field === 'undefined' ) {
                    return false;
                }

                if ( typeof error !== 'undefined' ) {
                    return field.$error[error] ? true : false;
                } else {
                    return field.$invalid ? true : false;
                }
            };

            // Allow only 1 image and 1 video in the upload queue
            var cleanupUploaderQueue = function( uploader ) {
                var videoItems = [], imageItems = [];
                angular.forEach( uploader.getNotUploadedItems(), function( item, index ) {
                    if ( item.alias === 'video' ) {
                        videoItems.push({ queueIndex: index });
                    } else {
                        imageItems.push({ queueIndex: index });
                    }
                });
                if ( videoItems.length > 1) {
                    uploader.removeFromQueue( videoItems[0].queueIndex );
                }
                if ( imageItems.length > 1) {
                    uploader.removeFromQueue( imageItems[0].queueIndex );
                }
            };

            var addUploaderTypeFilter = function( uploader, alias, filter ) {
                var name = Object.keys(filter)[0];
                var acceptedTypes = filter[name];
                uploader.filters.push({
                    name: name,
                    fn: function(file, uploaderItem) {
                        if ( uploaderItem.alias !== alias ) {
                            return true;
                        }
                        if ( acceptedTypes.indexOf( file.type ) === -1 ) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                });
            };

            // URL validation regex based on the Django URL validator used in the backend
            //   Differences:
            //     - scheme has been made optional
            //     - there is no check for the dashes at the end of domain name and tld (due to lack of support for lookbehind in JS)
            var urlRegex = function(){

                var ul = '\\u00a1-\\uffff';  // unicode letters range (must be a unicode string, not a raw string)

                // IP patterns
                var ipv4_re = '(?:25[0-5]|2[0-4]\\d|[0-1]?\\d?\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|[0-1]?\\d?\\d)){3}';
                var ipv6_re = '([0-9a-f:\\.]+)';  // (simple regex, validated later)

                // Host patterns
                var hostname_re = '[a-z' + ul + '0-9](?:[a-z' + ul + '0-9-]{0,61}[a-z' + ul + '0-9])?';

                // Max length for domain name labels is 63 characters per RFC 1034 sec. 3.1
                var domain_re = '(?:\\.(?!-)[a-z' + ul + '0-9-]{1,63})*';

                // Original was (with lookbehind):
                // domain_re = r'(?:\.(?!-)[a-z' + ul + r'0-9-]{1,63}(?<!-))*'

                var tld_re = '';
                tld_re += '\\.';                               // dot
                tld_re += '(?!-)';                             // can't start with a dash
                tld_re += '(?:[a-z' + ul + '-]{2,63}';         // domain label
                tld_re += '|xn--[a-z0-9]{1,59})';              // or punycode label
                // tld_re += '(?<!-)';                            // can't end with a dash (lookbehind...)
                tld_re += '\\.?';                              // may have a trailing dot

                var host_re = '(' + hostname_re + domain_re + tld_re + '|localhost)';


                var regex = '';
                regex += '^(?:(?:[a-z0-9\\.\\-\\+]*):\\/\\/)?';                      // scheme. This is one big diffrence from the backend validation - scheme is optional
                regex += '(?:\\S+(?::\\S*)?@)?';                                     // user:pass authentication
                regex += '(?:' + ipv4_re + '|' + ipv6_re + '|' + host_re + ')';
                regex += '(?::\\d{2,5})?';                                           // port
                regex += '(?:[/?#][^\\s]*)?';                                        // resource path
                regex += '$';

                return RegExp( regex, 'i' );
            };

            return {
                fieldHasError: fieldHasError,
                cleanupUploaderQueue: cleanupUploaderQueue,
                addUploaderTypeFilter: addUploaderTypeFilter,
                urlRegex: urlRegex
            };
        }]);

})();

(function(){
    'use strict';

    angular.module('kachingCore')
        .controller( 'loginModalCtrl', [
            '$scope',
            '$alert',
            '$modal',
            '$state',
            '$window',
            'authService',
            'utils',
        function (
            $scope,
            $alert,
            $modal,
            $state,
            $window,
            authService,
            utils
        ) {

            $scope.view = {
                busy: false,
                formError: false
            };

            $scope.loginFormData = {
                email: '',
                password: ''
            };

            $scope.showSignupDialog = function() {
                $scope.$hide();
                $modal({
                    templateUrl: 'kaching-core/components/signupModal/modalTmpl.html',
                    controller: 'signupModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center'
                });
            };

            $scope.showForgotPasswordDialog = function() {
                $scope.$hide();
                $modal({
                    templateUrl: 'kaching-core/components/forgotPasswordModal/modalTmpl.html',
                    controller: 'forgotPasswordModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center'
                });
            };

            $scope.signinFormSubmit = function() {

                console.log('in signinFormSubmit()', $scope.loginFormData.email, $scope.loginFormData.password);

                $scope.view.busy = true;
                $scope.view.formError = false;

                authService.login( $scope.loginFormData.email, $scope.loginFormData.password ).then(
                    function( user ){
                        $scope.view.busy = false;
                        $window.location.href = kachingAppConfig.panelUrl;
                    },
                    function(){
                        $scope.view.busy = false;
                        $scope.view.formError = true;
                    }
                );

            };

        }]);
})();
(function(){
    'use strict';

    angular.module('kachingCore')
        .controller( 'signupModalCtrl', [
            '$scope',
            'errorHandler',
            '$modal',
            'utils',
            'userService',
        function (
            $scope,
            errorHandler,
            $modal,
            utils,
            userService
        ) {

            $scope.fieldHasError = utils.fieldHasError;

            $scope.view = {
                sending: false,
                submitted: false,
                success: false
            };

            $scope.data = {
                firstName: '',
                lastName: '',
                email: '',
                company: '',
                password: ''
            };

            $scope.showErrors = function() {
                return $scope.view.submitted;
            };

            $scope.clearCustomErrors = function() {
                $scope.form1.email.$setValidity( 'emailRegistered', true );
                $scope.form1.email.$setValidity( 'emailInvalid', true );
            };

            $scope.usertypeImgSrc = function( type ) {
                var image = '';
                if ( type === 'advertiser' ) {
                    image = ( $scope.data.usertype === 1 ) ? 'ic_advertiser_fill.svg' : 'ic_advertiser.svg';
                }
                if ( type === 'publisher' ) {
                    image = ( $scope.data.usertype === 2 ) ? 'ic_publisher_fill.svg' : 'ic_publisher.svg';
                }
                return kachingAppConfig.wpTemplateUri + '/assets/images/' + image;
            };

            var hasEmailError = function( response ) {
                var error = _.findWhere( response.data.errorDetails.paramsMistake.mistakenParams, {name:'email'} );
                if ( typeof error !== 'undefined' ) {
                    return true;
                } else {
                    return false;
                }
            };

            $scope.signupFormSubmit = function() {
                $scope.view.submitted = true;
                if ( $scope.form1.$valid ) {
                    $scope.view.sending = true;
                    userService.registerUser( $scope.data ).then(
                        function( repsonse ){
                            $scope.view.success = true;
                        },
                        function( response ){

                            $scope.view.sending = false;

                            if ( response.status === 400 && hasEmailError( response ) ) {
                                $scope.form1.email.$setValidity('emailRegistered', false);
                                // if ( response.data.email[0] === 'CMSUser with this email already exists.' ) {
                                //     $scope.form1.email.$setValidity('emailRegistered', false);
                                // } else {
                                //     $scope.form1.email.$setValidity('emailInvalid', false);
                                // }
                                $scope.view.sending = false;
                            } else {
                                errorHandler.processApiResponse( response );
                                $scope.$hide();
                            }
                        }
                    );
                }
            };

            $scope.showLoginDialog = function() {
                $scope.$hide();
                $modal({
                    templateUrl: 'kaching-core/components/loginModal/modalTmpl.html',
                    controller: 'loginModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center'
                });
            };

        }]);
})();
(function(){
    'use strict';

    angular.module('kachingCore')
        .controller( 'forgotPasswordModalCtrl', [
            '$scope',
            'errorHandler',
            '$modal',
            'utils',
            'userService',
        function (
            $scope,
            errorHandler,
            $modal,
            utils,
            userService
        ) {

            $scope.fieldHasError = utils.fieldHasError;

            $scope.view = {
                sending: false,
                submitted: false,
                success: false
            };

            $scope.data = {
                email: ''
            };

            $scope.showErrors = function() {
                return $scope.view.submitted;
            };

            $scope.formSubmit = function() {
                $scope.view.submitted = true;
                if ( $scope.form1.$valid ) {

                    $scope.view.sending = true;

                    userService.passwordResetRequest( $scope.data.email ).then(
                        function( user ){
                            $scope.view.sending = false;
                            $scope.view.success = true;
                        },
                        function( response ){
                            errorHandler.processApiResponse( response );
                            $scope.$hide();
                        }
                    );
                }
            };

            $scope.showLoginDialog = function() {
                $scope.$hide();
                $modal({
                    templateUrl: 'kaching-core/components/loginModal/modalTmpl.html',
                    controller: 'loginModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center'
                });
            };

        }]);
})();
(function(){
    'use strict';

    angular.module('kachingCore')
        .controller( 'resetPasswordModalCtrl', [
            '$scope',
            'errorHandler',
            '$modal',
            'utils',
            'userService',
        function (
            $scope,
            errorHandler,
            $modal,
            utils,
            userService
        ) {

            $scope.fieldHasError = utils.fieldHasError;

            $scope.view = {
                sending: false,
                submitted: false,
                success: false
            };

            $scope.data = {
                newPassword: '',
                newPasswordRepeat: '',
                token: kachingAppConfig.resetPassword.token,
                uid: kachingAppConfig.resetPassword.uid
            };

            $scope.showErrors = function() {
                return $scope.view.submitted;
            };

            $scope.formSubmit = function() {
                $scope.view.submitted = true;
                if ( $scope.form1.$valid ) {

                    $scope.view.sending = true;

                    userService.passwordReset( $scope.data.newPassword, $scope.data.uid, $scope.data.token ).then(
                        function(){
                            $scope.view.sending = false;
                            $scope.view.success = true;
                        },
                        function( response ){
                            errorHandler.processApiResponse( response );
                            $scope.$hide();
                        }
                    );
                }
            };

            $scope.showLoginDialog = function() {
                $scope.$hide();
                $modal({
                    templateUrl: 'kaching-core/components/loginModal/modalTmpl.html',
                    controller: 'loginModalCtrl',
                    animation: 'am-fade-and-scale',
                    placement: 'center'
                });
            };

        }]);
})();
(function(){
    "use strict";

    console.log('apiService loaded');

    angular.module('kachingCore')
        .factory('apiService', [
            '$http',
            '$cookies',
            '$q',
            '$window',
            'apiUrl',
            'authToken',
        function(
            $http,
            $cookies,
            $q,
            $window,
            apiUrl,
            authToken
        ) {

            console.log('in apiService');

            var makeRequest = function( method, path, data, authRequired ) {

                console.log('in makeRequest()', method, path, data, authRequired);

                var deferred = $q.defer();

                var request = {
                    method: method,
                    url: apiUrl + path
                };

                if ( data ) {
                    if ( method === 'GET' ) {
                        request.params = data;
                    } else {
                        request.data = data;
                    }
                }

                if ( authRequired ) {
                    request.headers = {
                        'Authorization': 'Token ' + authToken.get( true )
                    };
                }

                $http( request ).then(
                    function( response ) {
                        console.log('makeRequest() success - response, status', response);
                        deferred.resolve( response.data );
                    },
                    function( response ) {
                        console.log('makeRequest() failure - response, status', response);
                        if ( response.status === 403 && request.url.match(/\/auth\/logout\/$/) === null ) {
                            destroyCookies();
                            $window.location.href = kachingAppConfig.panelUrl + '#expired';
                        }
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var destroyCookies = function() {
                $cookies.remove( 'usertype', { path: '/' } );
                authToken.delete();
            };

            var getRequest = function( path, data, authRequired ) {
                console.log('in get()');
                data = ( typeof data !== 'object' ) ? false : data;
                authRequired = ( authRequired === true ) ? true : false;
                return makeRequest( 'GET', path, data, authRequired );
            };

            var putRequest = function( path, data, authRequired ) {
                console.log('in put()');
                data = ( typeof data !== 'object' ) ? false : data;
                authRequired = ( authRequired === true ) ? true : false;
                return makeRequest( 'PUT', path, data, authRequired );
            };

            var postRequest = function( path, data, authRequired ) {
                console.log('in post()');
                data = ( typeof data !== 'object' ) ? false : data;
                authRequired = ( authRequired === true ) ? true : false;
                return makeRequest( 'POST', path, data, authRequired );
            };

            var patchRequest = function( path, data, authRequired ) {
                console.log('in patch()');
                data = ( typeof data !== 'object' ) ? false : data;
                authRequired = ( authRequired === true ) ? true : false;
                return makeRequest( 'PATCH', path, data, authRequired );
            };

            var deleteRequest = function( path, data, authRequired ) {
                console.log('in delete()');
                data = ( typeof data !== 'object' ) ? false : data;
                authRequired = ( authRequired === true ) ? true : false;
                return makeRequest( 'DELETE', path, data, authRequired );
            };

            return {
                get: getRequest,
                put: putRequest,
                post: postRequest,
                patch: patchRequest,
                delete: deleteRequest
            };
        }]);
})();
(function(){
    'use strict';

    angular.module('kachingCore')
        .factory('authService', [
            '$q',
            '$cookies',
            'utils',
            'apiService',
            'authToken',
            'userService',
            'sessionDays',
        function(
            $q,
            $cookies,
            utils,
            apiService,
            authToken,
            userService,
            sessionDays
        ) {

            var switchUserType = function( type ) {

                var expires = new Date();
                expires.setDate( expires.getDate() + sessionDays );

                if ( type === 'advertiser' ) {
                    if ( isAdvertiser() ) {
                        return false;
                    }
                    $cookies.put( 'usertype', 'advertiser', { path: '/', expires: expires } );
                    return true;
                } else if ( type === 'developer' ) {
                    if ( isDeveloper() ) {
                        return false;
                    }
                    $cookies.put( 'usertype', 'developer', { path: '/', expires: expires } );
                    return true;
                }
            };

            var parseUsertype = function( usertype ) {
                usertype = parseInt( usertype );
                if ( usertype === 1 ) {
                    return 'advertiser';
                } else if ( usertype === 2 ) {
                    return 'developer';
                } else {
                    return false;
                }
            };

            var isLoggedIn = function() {
                return ( authToken.get( true ) !== false && typeof getUsertype() !== 'undefined' ) ? true : false;
            };

            var getUsertype = function() {
                return $cookies.get('usertype');
            };

            var isAdvertiser = function() {
                return getUsertype() === 'advertiser';
            };

            var isDeveloper = function() {
                return getUsertype() === 'developer';
            };

            var requestAuthToken = function( email, password ) {

                var deferred = $q.defer();

                apiService.post( '/api-token-auth/', { email: email, password: password } ).then(
                    function( response ) {
                        deferred.resolve( response.token );
                    },
                    function( response ) {
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var login = function( email, password ) {

                var deferred = $q.defer();

                $cookies.remove( 'usertype', { path: '/' } );
                authToken.delete();

                requestAuthToken( email, password ).then(
                    function( token ){

                        var expires = new Date();
                        expires.setDate( expires.getDate() + sessionDays );

                        authToken.save( token, expires );

                        userService.getUser().then(
                            function( user ) {
                                $cookies.put( 'usertype', 'advertiser', { path: '/', expires: expires } );
                                deferred.resolve( user );
                            },
                            function() {
                                deferred.reject();
                            }
                        );
                    },
                    function(){
                        deferred.reject();
                    }
                );

                return deferred.promise;
            };

            var logout = function() {

                var deferred = $q.defer();

                apiService.post( '/auth/logout/', false, true ).finally(function() {
                    $cookies.remove( 'usertype', { path: '/' } );
                    authToken.delete();
                    deferred.resolve();
                });

                return deferred.promise;
            };

            return {
                switchUserType: switchUserType,
                isLoggedIn: isLoggedIn,
                getUsertype: getUsertype,
                isAdvertiser: isAdvertiser,
                isDeveloper: isDeveloper,
                login: login,
                logout: logout
            };
        }]);
})();
(function(){
    'use strict';

    console.log('authToken loaded');

    angular.module('kachingCore')
        .factory('authToken', [ '$cookies', function( $cookies ) {

            var authToken;

            var saveToken = function( token, expires ) {
                $cookies.put( 'token', token, { path: '/', expires: expires } );
            };

            var deleteToken = function() {
                $cookies.remove( 'token', { path: '/' } );
            };

            var getToken = function( forceCookieCheck ) {

                if ( authToken && !forceCookieCheck ) {
                    return authToken;
                }

                var token = $cookies.get( 'token' );
                if ( token ) {
                    authToken = token;
                    return authToken;
                }

                return false;
            };

            return {
                save: saveToken,
                delete: deleteToken,
                get: getToken
            };
        }]);
})();
(function(){
    'use strict';

    angular.module('kachingCore')
        .factory('userService', [ '$q', 'apiService', function( $q, apiService ) {

            var user;

            var getUser = function() {

                var deferred = $q.defer();

                apiService.get( '/auth/me/', false, true ).then(
                    function( response ) {

                        console.log('getUser() success', response);

                        user = {
                            id:         response.id,
                            email:      response.email,
                            firstName:  response.first_name ? response.first_name : '',
                            lastName:   response.last_name ? response.last_name : '',
                            company:    response.company ? response.company : '',
                            country:    response.country ? response.country.toString() : undefined,
                            city:       response.city ? response.city : '',
                            address:    response.address ? response.address : '',
                            postalCode: response.postal_code ? response.postal_code : ''
                        };

                        deferred.resolve( user );
                    },
                    function( response ) {
                        console.log('getUser() failure', response );
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var getBalance = function() {

                var deferred = $q.defer();

                apiService.get( '/auth/me/balance/', false, true ).then(
                    function( response ) {
                        console.log('getBalance() success', response);
                        deferred.resolve( response );
                    },
                    function( response ) {
                        console.log('getBalance() failure', response );
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var updateUser = function( user ) {

                var deferred = $q.defer();

                var data = {
                    first_name:  user.firstName,
                    last_name:   user.lastName,
                    email:       user.email,
                    company:     user.company,
                    country:     user.country,
                    city:        user.city,
                    address:     user.address,
                    postal_code: user.postalCode
                };

                apiService.patch( '/auth/me/', data, true ).then(
                    function( data ) {
                        console.log('updateUser() success', data);
                        deferred.resolve( data );
                    },
                    function( response ) {
                        console.log('updateUser() failure', response );
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var changePassword = function( currentPassword, newPassword ) {

                var deferred = $q.defer();

                var data = {
                    new_password: newPassword,
                    current_password:  currentPassword
                };

                apiService.post( '/auth/password/', data, true ).then(
                    function( data ) {
                        console.log('changePassword() success', data);
                        deferred.resolve( data );
                    },
                    function( response ) {
                        console.log('changePassword() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var passwordResetRequest = function( email ) {

                var deferred = $q.defer();

                var data = { email: email };

                apiService.post( '/auth/password/reset/', data, false ).then(
                    function( data ) {
                        console.log('passwordResetRequest() success', data);
                        deferred.resolve( data );
                    },
                    function( response ) {
                        console.log('passwordResetRequest() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var passwordReset = function( password, uid, token ) {

                var deferred = $q.defer();

                var data = {
                    uid: uid,
                    token: token,
                    new_password: password
                };

                apiService.post( '/auth/password/reset/confirm/', data, false ).then(
                    function( data ) {
                        console.log('passwordReset() success', data);
                        deferred.resolve( data );
                    },
                    function( response ) {
                        console.log('passwordReset() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var registerUser = function( user ) {

                var deferred = $q.defer();

                var data = {
                    first_name: user.firstName,
                    last_name:  user.lastName,
                    email:      user.email,
                    company:    user.company,
                    password:   user.password,
                    groups:     [1,2]
                };

                apiService.post( '/auth/register/', data, false ).then(
                    function( data ) {
                        console.log('registerUser() success', data);
                        deferred.resolve( data );
                    },
                    function( response ) {
                        console.log('registerUser() failure', response );
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var activateAccount = function( uid, token ) {

                var deferred = $q.defer();

                var data = {
                    uid: uid,
                    token: token
                };

                apiService.post( '/auth/activate/', data, false ).then(
                    function( response ) {
                        console.log('activateAccount() success', response);
                        deferred.resolve( response );
                    },
                    function( response ) {
                        console.log('activateAccount() failure', response);
                        deferred.reject( response );
                    }
                );

                return deferred.promise;
            };

            var getCountries = function() {

                var deferred = $q.defer();

                apiService.get( '/countries/', null, true ).then(
                    function( response ) {
                        var countries = [];
                        angular.forEach( response, function( name, id ){
                            countries.push( { id: id, name: name } );
                        });
                        deferred.resolve( countries );
                    },
                    function( response ) { deferred.reject( response ); }
                );

                return deferred.promise;
            };

            return {
                getUser: getUser,
                getBalance: getBalance,
                updateUser: updateUser,
                changePassword: changePassword,
                passwordResetRequest: passwordResetRequest,
                passwordReset: passwordReset,
                registerUser: registerUser,
                activateAccount: activateAccount,
                getCountries: getCountries
            };
        }]);
})();
(function(){
    'use strict';

    angular.module('kachingCore')
        .factory('errorHandler', [ '$alert', function( $alert ) {

            var processApiResponse = function( response ) {

                if ( response.status !== 403 ) {

                    $alert({
                        title: 'ERROR!',
                        content: 'An error has occured. Please try again later.',
                        container: '#alerts-container',
                        placement: 'top',
                        duration: 3,
                        type: 'danger',
                        show: true
                    });
                }
            };

            return {
                processApiResponse: processApiResponse
            };
        }]);
})();
(function(){
    "use strict";

    angular.module('kachingCore')
        .directive("loader", function(){
            return {
                restrict: 'A',
                templateUrl: 'kaching-core/directives/loader/loaderTmpl.html'
            };
        });

})();
(function(){
    'use strict';

    angular.module('kachingCore')
        .directive('preventDefault', function() {
            return {
                restrict: 'A',
                link: function( scope, element, attrs ) {
                    if( attrs.ngClick || attrs.href === '' || attrs.href === '#' ){
                        element.on('click', function(e){
                            e.preventDefault();
                        });
                    }
                }
            };
        });

})();
(function(){
    'use strict';

    angular.module('kachingCore')
        .directive('passwordMatch', [function() {
            return {
                require: 'ngModel',
                link: function(scope, elem, attrs, ctrl) {
                    var firstPassword = '#' + attrs.passwordMatch;
                    elem.add( firstPassword ).on( 'keyup', function() {
                        scope.$apply( function() {
                            var v = elem.val() === $(firstPassword).val();
                            ctrl.$setValidity('pwmatch', v);
                        });
                    });
                }
            };
        }]);
})();
(function(){
    'use strict';

    angular.module('kachingCore')
        .directive('panelTitle', [ "$rootScope", "$timeout", "$state", function( $rootScope, $timeout, $state ) {
            return {
                link: function( scope, el, attrs, ctrl ) {

                    var originalTitle = el.text();

                    $rootScope.$on("$stateChangeSuccess", function() {
                        var stateTitle = '';
                        if ( typeof $state.$current.data === 'object' && typeof $state.$current.data.title !== 'undefined' ) {
                            stateTitle = $state.$current.data.title + ' – ';
                        }
                        $timeout(function() {
                            el.text( stateTitle + originalTitle );
                        });
                    });
                }
            };
        }]);

})();
(function(){
    'use strict';

    angular.module('kachingCore')
        .directive('kachingHeader', [ '$window', 'authService', function( $window, authService ) {
            return {
                restrict: 'A',
                controller: ["$scope", function( $scope ){

                    $scope.loggedIn = authService.isLoggedIn();

                    $scope.logoClick = function() {
                        if ( authService.isLoggedIn() ) {
                            $window.location.href = kachingAppConfig.homeUrl + 'panel/';
                        } else {
                            $window.location.href = kachingAppConfig.homeUrl;
                        }
                    };

                }]
            };
        }]);
})();

(function(){
    "use strict";

    angular.module('kachingCore')
        .directive("panelNav", [ 'utils', 'authService', function( utils, authService ){
            return {
                restrict: 'A',
                scope: {
                    'loggedIn' : '='
                },
                templateUrl: 'kaching-core/directives/panelNav/panelNavTmpl.html',
                controller: ["$scope", function( $scope ) {

                    $scope.isPanel = kachingAppConfig.isPanelPage;

                    $scope.urls = {
                        campaigns: kachingAppConfig.panelUrl + '#/campaigns',
                        media:     kachingAppConfig.panelUrl + '#/media',
                        products:  kachingAppConfig.panelUrl + '#/products',
                        billing:   kachingAppConfig.panelUrl + '#/billing',
                        apikeys:   kachingAppConfig.panelUrl + '#/api-keys'
                    };

                    $scope.isAdvertiser = function() {
                        return authService.isAdvertiser();
                    };

                    $scope.isDeveloper = function() {
                        return authService.isDeveloper();
                    };
                }]
            };
        }]);

})();
(function(){
    'use strict';

    angular.module('kachingCore')
        .directive('userNavBar', [
            '$rootScope',
            'userService',
            'authService',
            '$modal',
            '$window',
            '$state',
        function(
            $rootScope,
            userService,
            authService,
            $modal,
            $window,
            $state
        ) {
            return {
                restrict: 'A',
                scope: {
                    'loggedIn' : '=',
                    'isHomepage' : '='
                },
                templateUrl: 'kaching-core/directives/userNavBar/userNavBarTmpl.html',
                controller: ["$scope", function( $scope ) {

                    $scope.user = {};
                    $scope.username = '';
                    $scope.balance = null;

                    $scope.isPanel = kachingAppConfig.isPanelPage;

                    $scope.urls = {
                        account: kachingAppConfig.panelUrl + '#/account',
                        funds:   kachingAppConfig.panelUrl + '#/add-funds',
                        cards:   kachingAppConfig.panelUrl + '#/credit-cards'
                    };

                    if ( $scope.loggedIn ) {
                        userService.getUser().then(
                            function( user ){
                                $scope.user = user;
                                $scope.username = user.email;
                            },
                            function(){}
                        );
                        userService.getBalance().then(function( response ){
                            $scope.balance = response.credits_balance;
                        });
                    }

                    $rootScope.$on('accountBalanceChanged', function(){
                        userService.getBalance().then(function( response ){
                            $scope.balance = response.credits_balance;
                        });
                    });

                    $scope.logout = function() {
                        authService.logout().then(function() {
                            $window.location.href = kachingAppConfig.homeUrl;
                        });
                    };

                    $scope.isAdvertiser = function() {
                        return authService.isAdvertiser();
                    };

                    $scope.isDeveloper = function() {
                        return authService.isDeveloper();
                    };

                    $scope.switchUserType = function( type ) {

                        if ( authService.switchUserType( type ) ) {
                            if ( ! $scope.isPanel ) {
                                $window.location.href = kachingAppConfig.panelUrl;
                            } else {
                                if ( type === 'advertiser' ) {
                                    $state.transitionTo('campaigns');
                                } else if ( type === 'developer' ) {
                                    $state.transitionTo('apikeys');
                                }
                            }
                        }
                    };

                    $scope.showLoginDialog = function() {
                        $modal({
                            templateUrl: 'kaching-core/components/loginModal/modalTmpl.html',
                            controller: 'loginModalCtrl',
                            animation: 'am-fade-and-scale',
                            placement: 'center'
                        });
                    };

                    $scope.showSignupDialog = function() {
                        $modal({
                            templateUrl: 'kaching-core/components/signupModal/modalTmpl.html',
                            controller: 'signupModalCtrl',
                            animation: 'am-fade-and-scale',
                            placement: 'center'
                        });
                    };
                }]
            };
        }]);
})();

(function(){
    'use strict';

    angular.module('kachingCore')
        .directive('resetPassword', [
            '$alert',
            '$modal',
            'utils',
            'userService',
        function (
            $alert,
            $modal,
            utils,
            userService
        ) {
            return {
                restrict: 'A',
                templateUrl: 'kaching-core/directives/resetPassword/resetPasswordTmpl.html',
                controller: ["$scope", function( $scope ){

                    $scope.fieldHasError = utils.fieldHasError;

                    $scope.view = {
                        urlError: false,
                        sending: false,
                        submitted: false,
                        success: false
                    };

                    $scope.data = {
                        newPassword: '',
                        newPasswordRepeat: '',
                        token: kachingQueryParams.token,
                        uid: kachingQueryParams.uid
                    };

                    if ( typeof kachingQueryParams.uid === 'undefined' || typeof kachingQueryParams.token === 'undefined' ) {
                        $scope.view.urlError = true;
                    }

                    $scope.showErrors = function() {
                        return $scope.view.submitted;
                    };

                    $scope.formSubmit = function() {
                        $scope.view.submitted = true;
                        if ( $scope.form1.$valid ) {

                            $scope.view.sending = true;

                            userService.passwordReset( $scope.data.newPassword, $scope.data.uid, $scope.data.token ).then(
                                function(){
                                    $scope.view.sending = false;
                                    $scope.view.success = true;
                                },
                                function( response ){
                                    console.log('passwordReset response', response);
                                    $scope.view.urlError = true;
                                }
                            );
                        }
                    };

                    $scope.showLoginDialog = function() {
                        $modal({
                            templateUrl: 'kaching-core/components/loginModal/modalTmpl.html',
                            controller: 'loginModalCtrl',
                            animation: 'am-fade-and-scale',
                            placement: 'center'
                        });
                    };

                    $scope.showForgotPasswordDialog = function() {
                        $modal({
                            templateUrl: 'kaching-core/components/forgotPasswordModal/modalTmpl.html',
                            controller: 'forgotPasswordModalCtrl',
                            animation: 'am-fade-and-scale',
                            placement: 'center'
                        });
                    };

                }]
            };
        }]);

})();

(function(){
    'use strict';

    angular.module('kachingCore')
        .directive('activateAccount', [
            '$alert',
            '$modal',
            '$window',
            'authService',
            'userService',
            'utils',
        function (
            $alert,
            $modal,
            $window,
            authService,
            userService,
            utils
        ) {
            return {
                restrict: 'A',
                templateUrl: 'kaching-core/directives/activateAccount/activateAccountTmpl.html',
                controller: ["$scope", function( $scope ){

                    $scope.view = {
                        verificationError: false,
                        verificationSuccess: false,
                        verificationProcessing: false,
                        logginProcessing: false,
                        formError: false
                    };

                    $scope.loginFormData = {
                        email: '',
                        password: ''
                    };

                    $scope.view.verificationProcessing = true;

                    authService.logout().then(function() {

                        if ( typeof kachingQueryParams.uid !== 'string' || typeof kachingQueryParams.token !== 'string' ) {

                            $scope.view.verificationProcessing = false;
                            $scope.view.verificationError = true;

                        } else {

                            userService.activateAccount( kachingQueryParams.uid, kachingQueryParams.token ).then(
                                function() {
                                    $scope.view.verificationProcessing = false;
                                    $scope.view.verificationSuccess = true;
                                },
                                function() {
                                    $scope.view.verificationProcessing = false;
                                    $scope.view.verificationError = true;
                                }
                            );
                        }

                    });

                    $scope.signinFormSubmit = function() {

                        $scope.view.logginProcessing = true;
                        $scope.view.formError = false;

                        authService.login( $scope.loginFormData.email, $scope.loginFormData.password ).then(
                            function( user ){
                                $scope.view.logginProcessing = false;
                                $window.location.href = kachingAppConfig.panelUrl;
                            },
                            function(){
                                $scope.view.logginProcessing = false;
                                $scope.view.formError = true;
                            }
                        );
                    };
                }]
            };
        }]);
})();

})(jQuery);
//# sourceMappingURL=kachingCore.js.map
