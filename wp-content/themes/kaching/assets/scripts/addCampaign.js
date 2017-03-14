var newCampaign, startTime, endTime, currentMediaId, currentProductId, levelAvailable;
var currentCampaign = localStorage.getItem("campaign");

(function($) {

    newCampaign = {
        activateLabel: function(event){
            event.preventDefault();
            if(levelAvailable >= $(this).data('step')){
                $('[data-step]').removeClass('active-tab');
                $('[data-step = ' + $(this).data('step') + ']').addClass('active-tab');
                $('.step').removeClass('current-tab');
                $('#step' + $(this).data('step') + '').addClass('current-tab');
                if($(this).data('step') === 4){
                  newCampaign.showSummary();
                }
            } else {
             clients.showinfo('You can\'t go to next step', 'Please save current step');
            }

        },
        gotoStep: function(step){
            $('[data-step]').removeClass('active-tab');
            $('[data-step = ' + step + ']').addClass('active-tab');
            $('.step').removeClass('current-tab');
            $('#step' + step).addClass('current-tab');
        },
        storeCampaignId: function(id){
            localStorage.setItem("campaign", id);
        },
        parseTime: function(value){
            var newDataArray = value.split(" - ");
            startTime = newDataArray[0] + 'T00:00:00.0Z';
            endTime = newDataArray[1] + 'T00:00:00.0Z';
        },
        countDays: function(value){
          var newDate = value.split(" - ");
          var result = $.map( newDate, function( val, i ) {
            return [val.split("-")];
          });
          var a = moment(result[0]);
          var b = moment(result[1]);
          var diffInDays = a.diff(b, 'days');
          return diffInDays;
        },
        substringMatcher: function(strs) {
          return function findMatches(q, cb) {
            var matches, substringRegex;

            // an array that will be populated with substring matches
            matches = [];

            // regex used to determine if a string contains the substring `q`
            substrRegex = new RegExp(q, 'i');

            // iterate through the pool of strings and for any string that
            // contains the substring `q`, add it to the `matches` array
            $.each(strs, function(i, str) {
              if (substrRegex.test(str)) {
                matches.push(str);
              }
            });

            cb(matches);
          };
        },
        saveFirst: function(){
            newCampaign.parseTime($('#datarange').val());
            var formdata = $('#addCampaignStep1').serialize();
            formdata += "&start_date=" + encodeURIComponent(startTime)  + "&end_date=" + encodeURIComponent(endTime) + "&client=" + encodeURIComponent(clients.returnClientId($('#client').val(), clientsList));

          $.ajax({
              headers: {'Authorization': token},
              type: 'POST',
              dataType: 'json',
              data: formdata,
              url:  server + '/campaigns/',
              success: function(response) {
                  newCampaign.storeCampaignId(response.id);
                  console.log(response);
                  newCampaign.savesecond(response.id);
                  newCampaign.savethird(response.id);
                  newCampaign.activatelaststep(response.id);


              },
              complete: function(xhr, textStatus) {
                if(xhr.status === 400){
                  clients.showinfo('You can\'t go to next step', 'Please fill all fields');
                }
              }

          });
        },
        saveFirstStep: function(event){
            event.preventDefault();
            if ( $('#addCampaignStep1').parsley().validate() ) {
              var clientName = $('#client').val();
              if ( clients.search( clientName, clientsList ) !== true ){
                  clients.saveClient( clientName );
              }
              newCampaign.gotoStep(2);
              levelAvailable = 2;
            }
        },
        selectMedia: function(){
            currentMediaId = $(this).data('id');
            $('.medi').removeClass('selectedMedia');
            $(this).addClass('selectedMedia');

            $('#showmediacontent').removeClass('hidden');
            $('#addmediacontent, #medianame').addClass('hidden');
            assets.getAssetDetails();
        },
        selectProduct: function(event){
            event.preventDefault();
            currentProductId = $(this).data('id');
            $('.prod').removeClass('selectedMedia');
            $(this).addClass('selectedMedia');

            $('#withproductlibrary').removeClass('hidden');
            $('#productwithform').addClass('hidden');
            products.getProductDetails();
        },
        savesecond: function(id){
            $.ajax({
                headers: {'Authorization': token},
                type: 'PUT',
                dataType: 'json',
                data: {
                    media: currentMediaId,
                    media_title: $('#media_title').val(),
                    media_description: $('#media_description').val()
                },
                url:  server + '/campaigns/' + id + '/media/',
                success: function(response) {


                },
                complete: function(xhr, textStatus) {
                      if(xhr.status === 400){
                        clients.showinfo('You can\'t go to next step', 'Please add media');
                      }
                }

            });
        },
        saveSecondStep: function(){
          if($('.validate2step').parsley().validate()){
            if(currentMediaId === undefined || currentMediaId === null || currentMediaId === ''){
                levelAvailable = 3;
                newCampaign.gotoStep(3);
            } else{
                levelAvailable = 3;
                newCampaign.gotoStep(3);
                // newCampaign.savesecond();
            }
          }

        },
        savethird: function(id){
            $.ajax({
                headers: {'Authorization': token},
                type: 'PUT',
                dataType: 'json',
                data: {
                    products: currentProductId,

                },
                url:  server + '/campaigns/' + id + '/products/',
                success: function(response) {


                },
                complete: function(xhr, textStatus) {
                      if(xhr.status === 400){
                        clients.showinfo('You can\'t go to next step', 'Please add product');
                      }
                }

            });
        },
        saveThirdStep: function(event){

              if(currentProductId === undefined){
                  newCampaign.addProductFromForm();
                  // setTimeout(newCampaign.savethird, 100);
              } else{
                  levelAvailable = 4;
                  newCampaign.gotoStep(4);
              }
              newCampaign.showSummary();

        },
        showdetails: function(event){
            campaigns.getCampaignRequest().done(function(data){
                $('.name').html(data.client);
                $('.campaign-name').html(data.name);
                $('.date-range').html(assets.dateModifier(data.start_date) + ' - ' + assets.dateModifier(data.end_date));
                $('.title-application').html(data.media[0].media_title);
                $('.description-application').html(data.media[0].media_description);
                $('.videoSrc').attr('src', data.media[0].video);
                $('.budget').html('$' + data.budget);
                $('.daily-budget').html('$' + data.daily_budget);
                $('.chips-view').html(data.chips_per_view);
                $('.cost-per-view').html('$' + data.cost_per_view);
                $('.estimated-total-views').html(data.estimated_total_views);
                $('.estimated-daily-views').html(data.estimated_daily_views);
                $(".videoSrc")[0].load();
                $('.image-container-1').html($('<img class="img1" src="' + data.media[0].summary_image + '" alt="">'));
                $('.image-container-2').html($('<img class="img2" src="' + data.media[0].landscape + '" alt="">'));
                $('.image-container-3').html($('<img class="img3" src="' + data.media[0].portrait + '" alt="">'));
                $('.product-title').html(data.products[0].title);
                $('.img1').html('<img src="' + data.products[0].image + '">');

            });
        },
        showSummary: function(event){
                var days =  -1 * (newCampaign.countDays($('#datarange').val()) - 1);
                var budget = $('#budget1').val();
                var cpm = 0.21;
                $('.name').html($('#client').val());
                $('.campaign-name').html($('.campaign-name').val());
                $('.date-range').html($('#datarange').val());
                $('.title-application').html($('#media_title').val());
                $('.description-application').html($('#media_description').val());
                $('.budget').html('$' + budget);
                $('.daily-budget').html('$' + (budget / days));
                $('.chips-view').html('1');
                $('.cost-per-view').html('$0.21');
                $('.estimated-total-views').html(Math.round(budget / cpm));
                $('.estimated-daily-views').html(Math.round((budget / cpm)/days));

        },
        activatelaststep: function(id){
            $.ajax({
                headers: {'Authorization': token},
                type: 'PUT',
                dataType: 'json',
                data: {
                    status: 1,
                },
                url:  server + '/campaigns/' + id + '/submit/',
                success: function(response) {
                  clients.showinfo('Success!', 'You have successfully added this campaign!<br><br><a class="btn btn-default" href="/campaigns/">Finish</a>');
                  $('#infoModal .btn-primary').hide();
                  $('#savecampaign').hide();
                },
                complete: function(xhr, textStatus) {

                }

            });
        },
        activateCampaign: function(event){
            event.preventDefault();
            newCampaign.saveFirst();

        },
        addMediaFromForm: function(event){
          // event.preventDefault();
          var form = $('form')[0];
          var formData = new FormData(form);

          var data = {
            name: $('#medianame').val(),
            video: $('#video')[0].files[0],
            portrait: $('#portrait')[0].files[0],
            landscape: $('#landscape')[0].files[0],
            summary_image: $('#summary_image')[0].files[0]
          };
            for ( var key in data ) {
                formData.append(key, data[key]);
            }

            if($('#addmediaform').parsley().validate()){

            $.ajax({
              xhr: function () {
                  var xhr = new window.XMLHttpRequest();
                  xhr.upload.addEventListener("progress", function (evt) {
                      if (evt.lengthComputable) {
                          var percentComplete = evt.loaded / evt.total;
                          // console.log(percentComplete);
                          $('.progress-bar').css({
                              width: percentComplete.toFixed(2) * 100 + '%'
                          });
                          if (percentComplete === 1) {
                              $('.progress-bar').addClass('hide');
                          }
                      }
                  }, false);
                  xhr.addEventListener("progress", function (evt) {
                      if (evt.lengthComputable) {
                          var percentComplete = evt.loaded / evt.total;
                          // console.log(percentComplete);
                          $('.progress-bar').css({
                              width: percentComplete.toFixed(2) * 100 + '%'
                          });
                      }
                  }, false);
                  return xhr;
              },
              headers: {'Authorization': token},
              type: 'POST',
              data: formData,

              // async: false,
              // cache: false,
              contentType: false,
              processData: false,

              url: server + '/media/',

               success: function(response) {
                  clients.showinfo('Success', 'Media added successfully');
                  currentMediaId = response.id;
                  $('#showmediacontent').removeClass('hidden');
                  $('#addmediacontent, #medianame').addClass('hidden');
                  assets.getAssetDetails();

               },
                 error: function(xhr, status, error) {
                    // console.log(JSON.parse(xhr.responseText));
                    var foo = JSON.parse(xhr.responseText);
                    var resp = '';
                    for(var i in foo) {
                      resp += '<span>' + i + ':</span><br>' + " <span class='error'>" + foo[i] + "</span><br />";
                    }
                    clients.showinfo('Error', resp);
                 }

            });
          }
        },
        addhttp: function(url) {
           if (!/^(f|ht)tps?:\/\//i.test(url)) {
              url = "http://" + url;
           }
           return url;
        },
        addProductFromForm: function(event){
          // event.preventDefault();
          var form = $('form')[0];
          var formData = new FormData(form);

          var data = {
            title: $('#product-title').val(),
            description: $('#product-description').val(),
            price: $('#product-price').val(),
            url: newCampaign.addhttp($('#product-url').val()),
            image: $('#product-image')[0].files[0]

          };
            for ( var key in data ) {
                formData.append(key, data[key]);
            }
            if($('#productwithform').parsley().validate()){
              $.ajax({
                headers: {'Authorization': token},
                type: 'POST',
                data: formData,
                async: false,
                cache: false,
                contentType: false,
                processData: false,

                url: server + '/products/',
                 success: function(response) {
                    currentProductId = response.id;
                    $('#withproductlibrary').removeClass('hidden');
                    $('#productwithform').addClass('hidden');
                    products.getProductDetails();
                    clients.showinfo('Success', 'Product added successfully');
                 },
                complete: function(xhr, textStatus) {
                    if(xhr.status === 400){

                    }
                }

              });
            }
        }

    };

})(jQuery);