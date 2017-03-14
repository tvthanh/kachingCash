/* ========================================================================
 * DOM-based Routing
 * Based on http://goo.gl/EUTi53 by Paul Irish
 *
 * Only fires on body classes that match. If a body class contains a dash,
 * replace the dash with an underscore when adding it to the object below.
 *
 * .noConflict()
 * The routing is enclosed within an anonymous function so that you can
 * always reference jQuery with $, even when in .noConflict() mode.
 * ======================================================================== */
var server = "http://52.29.146.64/cms-api";
var baseLocation = '';
var mediaArray;
// var tag = document.createElement('script');
// // tag.src = "https://www.youtube.com/player_api";
// var firstScriptTag = document.getElementsByTagName('script')[0];
// firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


(function($) {

  // Use this variable to set up the common and page specific functions. If you
  // rename this variable, you will also need to rename the namespace below.

  var Sage = {
    // All pages
    'common': {
      init: function() {
        // JavaScript to be fired on all pages
        $('input[type="file"]').ezdz({
            reject: function(file, errors) {
              if (errors.mimeType) {
                // alert(file.name + ' must be an image');
                clients.showinfo('You can\'t go to next step', file.name + ' must be an ' + $(this).data('type'));
              }
              if (errors.maxWidth) {
                clients.showinfo('You can\'t go to next step', file.name + ' must be width:' + $(this).data('width') + 'px max');
              }
              if (errors.maxHeight) {
                clients.showinfo(file.name + ' must be height:' + $(this).data('height') + 'px max');
              }

            },
            validators: {
              maxWidth: $(this).data('width'),
              maxHeight: $(this).data('height')
            },
        });
      },
      finalize: function() {
        // JavaScript to be fired on all pages, after page specific JS is fired
      }
    },
    // Home page
    'home': {
      init: function() {
        // JavaScript to be fired on the home page
        // $('#menu-nav-menu').find('#menu-item-71').removeClass('current_page_parent');

        // Developer section
        var developer = {
          init: function(){
            $('#developer').on('click', '#registerlink', this.register);
            $('#developer').on('click', '#getapilink', this.showApi);
          },
          register: function(){
            if(localStorage.getItem("user") !== null){
              $('#infoModal').modal('show');
              $('#infoModal').find('h4').text('You already registered');
              $('#infoModal').find('#infotext').text('If you would like create another account, please sign out.');
            } else {
              $('#myModal2').modal('show');
            }
          },
          showApi:function(){
            if(localStorage.getItem("user") !== null){
              location.href = baseLocation + '/api-keys/';
            } else {
              $('#myModal').modal('show');
            }
          }

        };
        developer.init();

      },
      finalize: function() {

        // Home page scroll to section
        $(function() {
          $('a[href*=#]:not([href=#])').click(function() {
            if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') && location.hostname === this.hostname) {
              var target = $(this.hash);
              target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
              if (target.length) {
                $('html,body').animate({
                  scrollTop: target.offset().top
                }, 1000);
                return false;
              }
            }
          });
        });
      }
    },
    // About us page, note the change from about-us to about_us.
    'about_us': {
      init: function() {
        // JavaScript to be fired on the about us page
      }
    },
    'activate': {
      init: function() {
          var uid = assets.getParameterByName('uid');
          var authtoken = assets.getParameterByName('token');
        $.ajax({
          // headers: {'Authorization': token},
          type: 'POST',
          dataType: 'json',
          data: {
            uid: uid,
            token: authtoken
          },

          url: server + '/auth/activate/',
           success: function(response) {
              clients.showinfo('Success', 'Your account has been activated. Please sign in.');

           },
           error: function(xhr, status, error) {
              // console.log(JSON.parse(xhr.responseText));
              var foo = JSON.parse(xhr.responseText);
              clients.showinfo('Error', foo.detail);
              setTimeout(function(){
                location.href = '/';
              }, 4500);

           }

        });
        $('body').delegate('#infoModal .btn-primary').on('click', function(event) {
          event.preventDefault();
          /* Act on the event */
          $('#infoModal').modal('hide');
          $('#myModal').modal('show');
        });
      }
    },
    'products': {

      // SCRIPT LOCATION
      // assets/scripts/assets.js

      init: function() {
        // JavaScript to be fired on the products page
        products.getProducts();
        $(document).on('change', '.btn-file :file', products.readURL);
        $("form#uploadproduct").on('submit', products.addProducts);
        $('#searchform').on('keyup', products.filterResults);
        $(document).on('click', '.btn-del', products.showDeleteModal);
        $(document).on('click', '.delete-btn', products.deleteProducts);

        // $(document).on('click', '.edit-products', products.editAssets);
        $('#newProducts').on('click', function(){
          $('#newProductsModal').modal('show');
        });

      }
    },
    'product_detail': {

      // SCRIPT LOCATION
      // assets/scripts/assets.js

      init: function() {
        // JavaScript to be fired on the assets page
        products.getProductDetails();
        $(document).on('click', '.btn-del', assets.showDeleteModal);
        $('body').delegate('i.back').on( 'click', '.back', function(){
          parent.history.back();
          return false;
        });
        $(document).on('change', '.btn-file :file', assets.readURL);
        $('.edit').on('click', products.allowEdition);
        $(document).on('click', '.save', products.saveEditedProducts);
        $('#changeProductImage').on('change', function() {
          console.log('test');
          $('#changeProductImage').attr('name', 'image');
        });        
      }
    },
    // 'product_edit': {

    //   // SCRIPT LOCATION
    //   // assets/scripts/assets.js

    //   init: function() {
    //     // JavaScript to be fired on the assets page
    //     products.getProductToEdit();
    //     function MarkAsChanged(){
    //       $(this).addClass("changed");
    //     }
    //     $(":input").blur(MarkAsChanged).change(MarkAsChanged);


    //     $('body').delegate('i.back').on( 'click', '.back', function(){
    //       parent.history.back();
    //       return false;
    //     });
    //   }
    // },
    'media': {

      // SCRIPT LOCATION
      // assets/scripts/assets.js

      init: function() {
        // JavaScript to be fired on the assets page
        assets.getAssets();
        $(document).on('change', '.btn-file :file', assets.readURL);
        $("form#uploadmedia").on('submit', assets.addAssets);
        $('#searchform').on('keyup', assets.filterResults);
        $(document).on('click', '.btn-del', assets.showDeleteModal);
        $(document).on('click', '.delete-btn', assets.deleteAssets);
        $(document).on('click', '.edit-assets', assets.editAssets);
        $('#newAssets').on('click', function(){
          $('#newAssetsModal').modal('show');
        });
      }
    },

    'media_detail': {

      // SCRIPT LOCATION
      // assets/scripts/assets.js

      init: function() {
        // JavaScript to be fired on the assets page
        assets.getAssetDetails();
        $(document).on('click', '.btn-del', assets.showDeleteModal);
        $(document).on('click', '.delete-btn', assets.deleteAssets);
        $('body').delegate('i.back').on( 'click', '.back', function(){
          parent.history.back();
          return false;
        });
      }
    },
    'media_edit': {

      // SCRIPT LOCATION
      // assets/scripts/assets.js

      init: function() {
        // JavaScript to be fired on the assets page
        assets.getAssetToEdit();
        function MarkAsChanged(){
          $(this).addClass("changed");
        }
        $(":input").blur(MarkAsChanged).change(MarkAsChanged);
        $(document).on('change', '.btn-file :file', assets.readURL);
        $(document).on('submit', '#editMedia', assets.saveEditedAssets);
        $('body').delegate('i.back').on( 'click', '.back', function(){
          parent.history.back();
          return false;
        });
      }
    },
    'password': {
      init: function() {

      var api_getreset =  server + '/auth/password/reset/confirm/';
      var token;
      var uid;
    $('body').delegate('#savesettings', 'submit', function(event){
      event.preventDefault();
      $.ajax({
        type: 'POST',
        dataType: 'json',
        data:{
          uid:  assets.getParameterByName('uid'),
          token:  assets.getParameterByName('token'),
          new_password: $('#settingpass').val(),
        },
        url: api_getreset,

         success: function(response) {
            toastr.success('Password has been changed');
            $('#myModal').modal('show');
         },
        complete: function(xhr, textStatus) {
            // console.log(xhr.status +' '+ textStatus);
            // if(xhr.status === 400){
            // toastr.error('Given token was already used');

            // localStorage.clear();
            // document.cookie = 'username=;expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
            //   setTimeout(function(){
            //       location.href = baseLocation;
            //   }, 1500);
            // }
            // if(xhr.status === 405){
            // location.href = baseLocation;
            // }
        }
      });
    });
    // $('body').delegate('#savesettings', 'submit', function(event){
    //   event.preventDefault();
    //   var api_pass =  server + '/admin_panel/user/';
    //   var token = 'Token ' + window.localStorage.getItem("conn");
    //   var settingpass = $('body').find('#settingpass').val();
    //   var pass = {
    //     "password": settingpass
    //   };
    //   pass = JSON.stringify(pass);
    //   $.ajax({
    //     headers: {'Authentication': token},
    //     type: 'PUT',
    //     dataType: 'json',
    //     data: pass,
    //     url: api_pass,

    //      success: function(response) {
    //       // console.log(response);
    //       toastr.success('Successfully reset password');
    //       setTimeout(function(){
    //         // location.href = baseLocation + 'api-keys/';
    //       }, 500);

    //      },
    //     complete: function(xhr, textStatus) {
    //         // console.log(xhr.status +' '+ textStatus);
    //         if(xhr.status === 405){
    //           document.cookie = 'username=;expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
    //           localStorage.clear();
    //         // location.href = baseLocation;
    //         }
    //     }
    //   });
    // });
      }
    },
    'campaigns': {

      // SCRIPT LOCATION
      // assets/scripts/campaigns.js

      init: function() {
        campaigns.getCampaigns();
        $('body').delegate('#removeMessage').on('click', '#removeMessage', campaigns.deleteCampaign);
        // $('#newCampaign').on('click', campaigns.showCreateModal);
        // $('body').delegate('#addnewcampaign').on('submit', campaigns.createCampaign);
        $('body').delegate('#detaildelete', 'click', function(event) {
              $('#detailsModal').modal('hide');
              $('#confirmModal').modal('show');
            $('#confirmModal .modal-footer .delete-btn').html('<button id="removeMessage" type="button" class="btn modal-link btn-primary">Delete</button>');
        });
        // $('#datetimepicker1').datetimepicker({
        //         format: 'DD.MM.YYYY',
        //         disabledHours: [true]
        //     });
        // $('#datetimepicker2').datetimepicker({
        //         format: 'DD.MM.YYYY',
        //         disabledHours: [true]
        //     });
      }
    },
    'new_campaign': {

      // SCRIPT LOCATION
      // assets/scripts/campaigns.js

      init: function() {
        clients.getClients();
        assets.getAssets();
        products.getProducts();

        $('[data-step]').on('click', newCampaign.activateLabel);
        $('body').on('click', '#submit-first', newCampaign.saveFirstStep);
        $('body').on('click', '#savestep2', newCampaign.saveSecondStep);
        $('body').on('click', '#savestep3', newCampaign.saveThirdStep);
        $('body').on('click', '.medi', newCampaign.selectMedia);
        $('body').on('click', '.prod', newCampaign.selectProduct);
        $('body').on('click', '#savemediafromform', newCampaign.addMediaFromForm);
        $('body').on('click', '#saveproductfromform', newCampaign.addProductFromForm);
        $(document).on('change', '.btn-file :file', assets.readURL);
        $('body').on('click', '#savecampaign', newCampaign.activateCampaign);
        $('body').on('progress', function(event) {
          event.preventDefault();
          /* Act on the event */
          console.log('dziala');
        });

        $('#datarange').daterangepicker({
          autoApply: true,
          "opens": "center",
          "minDate": moment().format('YYYY-MM-DD'),
          locale: {
            format: 'YYYY-MM-DD'
          }
        });


        $('.typeahead').typeahead({
          //hint: true,
          highlight: true,
          minLength: 0
        },{
          name: 'clients',
          limit: 1000,
          source: newCampaign.substringMatcher(autocomplete)
        });
      }
    },

    'report':{
      init: function(){
        var ctx = document.getElementById("myChart").getContext("2d");
        /*** Gradient ***/
        var gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, 'rgba(229,189,49,1)');
            gradient.addColorStop(1, 'rgba(229,189,49,0.1)');
        /***************/
        var data = {
            labels: ["07.01.2015", "08.01.2015", "09.01.2015", "10.01.2015", "11.01.2015", "12.01.2015", "13.01.2015"],
            datasets: [
                {
                    label: "",
                    fillColor: gradient,
                    strokeColor: "rgba(220,220,220,0)",
                    pointColor: "rgba(229,189,49,0)",
                    pointStrokeColor: "rgba(229,189,49,0)",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: [3000, 1000, 2000, 1300, 4000, 700, 2000]
                }
            ]
        };
        var options = {

          ///Boolean - Whether grid lines are shown across the chart
          scaleShowGridLines : false,
          scaleFontColor: "#f9cd3f",

          //String - Colour of the grid lines
          scaleGridLineColor : "rgba(0,0,0,.05)",

          //Number - Width of the grid lines
          scaleGridLineWidth : 1,

          //Boolean - Whether to show horizontal lines (except X axis)
          scaleShowHorizontalLines: true,

          //Boolean - Whether to show vertical lines (except Y axis)
          scaleShowVerticalLines: true,

          //Boolean - Whether the line is curved between points
          bezierCurve : true,

          //Number - Tension of the bezier curve between points
          bezierCurveTension : 0.4,

          //Boolean - Whether to show a dot for each point
          pointDot : true,

          //Number - Radius of each point dot in pixels
          pointDotRadius : 4,

          //Number - Pixel width of point dot stroke
          pointDotStrokeWidth : 1,

          //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
          pointHitDetectionRadius : 20,

          //Boolean - Whether to show a stroke for datasets
          datasetStroke : true,

          //Number - Pixel width of dataset stroke
          datasetStrokeWidth : 2,

          //Boolean - Whether to fill the dataset with a colour
          datasetFill : true,

          //String - A legend template
          legendTemplate : "<ul style=\"display:none\" class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

      };
        var myLineChart = new Chart(ctx).Line(data, options);
      }
    },
    'api_keys': {

      // SCRIPT LOCATION
      // assets/scripts/getapikeys.js

      init: function() {
        // JavaScript to be fired on the about us page
          apiKeys.getApiKeys();
          $('body').delegate('#removeKey', 'click', apiKeys.deleteApiKey);
          $('body').delegate("#addnewkey", "submit", apiKeys.addNewApiKey);
          $('body').delegate( "#generateKey", "click", function() {
            $('#newkeyModal').modal('show');
          });


          $('body').delegate( "#hidegen", "click", function() {
            $('.newrow').hide();
          });

      }
    },
    'settings': {
      init: function() {
        toastr.options = {
          'target': 'toastr',
          "closeButton": true,
          "positionClass": "toast-top-full-width",
        };
        settings.getSettings();
      }
    },
    'support': {
      init: function(){
        console.log('test');
        $('a').on('click', 'a', function(event) {
          event.preventDefault();
          /* Act on the event */
          console.log('siema');
          $('.children').toggleClass('children_active');
        });
      }
    }
  };

  // The routing fires all common scripts, followed by the page specific scripts.
  // Add additional events for more control over timing e.g. a finalize event
  var UTIL = {
    fire: function(func, funcname, args) {
      var fire;
      var namespace = Sage;
      funcname = (funcname === undefined) ? 'init' : funcname;
      fire = func !== '';
      fire = fire && namespace[func];
      fire = fire && typeof namespace[func][funcname] === 'function';

      if (fire) {
        namespace[func][funcname](args);
      }
    },
    loadEvents: function() {
      // Fire common init JS
      UTIL.fire('common');

      // Fire page-specific init JS, and then finalize JS
      $.each(document.body.className.replace(/-/g, '_').split(/\s+/), function(i, classnm) {
        UTIL.fire(classnm);
        UTIL.fire(classnm, 'finalize');
      });

      // Fire common finalize JS
      UTIL.fire('common', 'finalize');

      var jorneySwiper = new Swiper('.tech-journey-slider', {
          spaceBetween: 30,
          effect: 'fade',
          pagination: '.journey-pagination',
          paginationClickable: true,
          paginationBulletRender: function (index, className) {
            return '<span class="' + className + '">' + ' Step' + (index + 1) + '</span>';
          }
      });

      var jorneySwiper2 = new Swiper('.tech-social-slider', {
        spaceBetween: 30,
        effect: 'fade',
        onSlideChangeEnd : function(swiperHere) {
            // console.log(swiperHere.activeIndex);
            switch(swiperHere.activeIndex) {
              case 0:
                $('#social-pagination-1').addClass('active');
                $('#social-pagination-2').removeClass('active');
                $('#social-pagination-3').removeClass('active');
                break;
              case 1:
                $('#social-pagination-2').addClass('active');
                $('#social-pagination-1').removeClass('active');
                $('#social-pagination-3').removeClass('active');
                break;
              case 2:
                $('#social-pagination-3').addClass('active');
                $('#social-pagination-1').removeClass('active');
                $('#social-pagination-2').removeClass('active');
            }
        }
      });

      $('#social-pagination-1').click(function() {
        jorneySwiper2.slideTo(0);
        $(this).parents('ul').find('a').removeClass('active');
        $(this).addClass('active');
      });

      $('#social-pagination-2').click(function() {
        jorneySwiper2.slideTo(1);
        $(this).parents('ul').find('a').removeClass('active');
        $(this).addClass('active');
      });

      $('#social-pagination-3').click(function() {
        jorneySwiper2.slideTo(2);
        $(this).parents('ul').find('a').removeClass('active');
        $(this).addClass('active');
      });



      // toogle search

      $('body').delegate('.search-icon', 'click', function(event) {
        $(this).toggleClass('search-active-icon');
        $('.fht-cell').toggleClass('search-active');
      });

    }
  };
    toastr.options = {
      'target': 'toastr',
      "closeButton": true,
      "positionClass": "toast-top-full-width",
      // "showDuration": "0",
      // "hideDuration": "0",
      // "timeOut": "0",
      // "extendedTimeOut": "0",
    };
  // Load Events
  $(document).ready(UTIL.loadEvents);

// ANIMATIONS - LANDING PAGE

  var wow = new WOW(
  {
    boxClass:     'wow',      // animated element css class (default is wow)
    animateClass: 'animated', // animation css class (default is animated)
    offset:       0,          // distance to the element when triggering the animation (default is 0)
    mobile:       false,       // trigger animations on mobile devices (default is true)
    live:         true,       // act on asynchronously loaded content (default is true)
    callback:     function(box) {
      // the callback is fired every time an animation is started
      // the argument that is passed in is the DOM node being animated
    },
    scrollContainer: null // optional scroll container selector, otherwise use window
  }
);
wow.init();

})(jQuery); // Fully reference jQuery after this point.
