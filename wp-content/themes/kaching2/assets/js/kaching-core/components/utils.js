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
