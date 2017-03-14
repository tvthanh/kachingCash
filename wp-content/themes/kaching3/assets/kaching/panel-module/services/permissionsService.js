(function() {
    'use strict';

    angular.module('panelApp')
        .factory('permissionsService', [
            'statePermissions',
            'authService',
            function(
                statePermissions,
                authService
            ) {
                return {
                    userHasAccess: userHasAccess
                };
                function userHasAccess (stateName) {
                    var usertype = authService.getUsertype();
                    return _.contains(statePermissions[usertype], stateName);
                }
            }
        ]);
})();
