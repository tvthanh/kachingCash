var assets;
var token = 'Token ' + window.localStorage.getItem("conn");
(function($) {
  var mediaId;

  assets = {
    getAssets: function(){

// GET ASSETS FROM API


      var context = this;
      $.ajax({
        headers: {'Authorization': token},
        type: 'GET',
        dataType: 'json',
        context: context,
        url: server + '/media/',

         success: function(data) {

          mediaArray = data;
          this.showAssets(mediaArray);
          $('.loader').hide();
         },
        complete: function(xhr, textStatus) {
            // console.log(xhr.status +' '+ textStatus);
            if(xhr.status === 405){
            // location.href = baseLocation;
            $('.loader').hide();
              toastr.error('Your session has expired. Please Sign in.');
              localStorage.clear();
              document.cookie = 'username=;expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
            }
        }
      });
    },
    addAssets: function(event){
      event.preventDefault();
      var formData = new FormData($(this)[0]);

        $.ajax({
          headers: {'Authorization': token},
          type: 'POST',
          data: formData,
          async: false,
          cache: false,
          contentType: false,
          processData: false,

          url: server + '/media/',
           success: function(response) {
              console.log(response);
              location.href = '/media/';
             $('#newAssetsModal').modal('hide');
           },
          complete: function(xhr, textStatus) {
              if(xhr.status === 400){
                 // toastr.error(JSON.parse(xhr.responseText).name[0].message);
                 toastr.error(xhr.responseText);
              $('#newkeyModal').modal('hide');
              }
          }

        });
    },
    addAssetsToMedia: function(event){

      event.preventDefault();
      var formData = new FormData($('#newmedia')[0]);
      if(currentMediaId === null){
        $.ajax({
          headers: {'Authorization': token},
          type: 'POST',
          data: formData,
          async: false,
          cache: false,
          contentType: false,
          processData: false,

          url: server + '/media/',
           success: function(response) {
              console.log(response);

           },
          complete: function(xhr, textStatus) {
              if(xhr.status === 400){
                 // toastr.error(JSON.parse(xhr.responseText).name[0].message);
                 toastr.error(xhr.responseText);
              $('#newkeyModal').modal('hide');
              }
          }

        });
      }  else {
        clients.showinfo('You already added media',"You already added media");
      }
    },
    getParameterByName: function(name) {

// GET PARAMS FROM URL

      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
          results = regex.exec(location.search);
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },
    getAssetRequest: function(){

// GET MEDIA DETAIL BY ID

      var token = 'Token ' + window.localStorage.getItem("conn");
      var context = this;
      var paramId = this.getParameterByName('id') || currentMediaId;
      var promise = $.Deferred();
      $.ajax({
        headers: {'Authorization': token},
        type: 'GET',
        dataType: 'json',
        context: context,
        url: server + '/media/' + paramId + '/',

         success: function(data) {
          promise.resolve(data);
         },
        error: function(){
          var error = 'Cannot fetch media';
          promise.reject(error);
        }
      });
      return promise;
    },
    getAssetDetails: function(){

// GET MEDIA DETAIL BY ID

      var token = 'Token ' + window.localStorage.getItem("conn");
      var context = this;
      var paramId = this.getParameterByName('id');
      this.getAssetRequest()
        .done(function(data){
          $('h1').html('<i class="icon-ic-back back"></i>' + '  ' + data.name);
          $('.media-title').html(data.name);
          $('.videoSrc').attr('src', data.video);
          $(".videoSrc")[0].load();
          $('.image-container-1').html($('<img class="img1" src="' + data.summary_image + '" alt=""><span>320x300</span>'));
          $('.image-container-2').html($('<img class="img2" src="' + data.landscape + '" alt=""><span>260x170</span>'));
          $('.image-container-3').html($('<img class="img3" src="' + data.portrait + '" alt=""><span>100x160</span>'));
          $('.edit').attr('href', '/media-edit/?id=' + data.id);
          $('.media-added').html(assets.dateModifier(data.date));
          // $('.media-used').html(assets.dateModifier(data.date));
          $('.status').html(assets.activeModifier(data.is_active));
          $.each(data.history, function(index, el) {
            $('.media-history').append('<p>' + el.campaign_name + '</p><span>' + assets.dateModifier(el.date) + '</span>');
          });

        });

    },
    getAssetToEdit: function(){

// GET MEDIA TO EDITION BY ID

      var token = 'Token ' + window.localStorage.getItem("conn");
      var context = this;

      console.log('test');
      this.getAssetRequest()
        .done(function(data){
          $('h1').html('<i class="icon-ic-back back"></i>' + '  ' + data.name);
          $('.media-title').val(data.name);
          // $('.videoSrc').attr('src', data.video);
          // $(".videoSrc")[0].load();
          $('.file-1').css({'background-image': 'url(' + data.summary_image + ')'});
          $('.file-2').css({'background-image': 'url(' + data.landscape + ')'});
          $('.file-3').css({'background-image': 'url(' + data.portrait + ')'});
          $('.media-added').html(assets.dateModifier(data.date));
          $('.status').html(assets.activeModifier(data.is_active));
          $('.media-added').html(assets.dateModifier(data.date));
          // $('.media-used').html(assets.dateModifier(data.date));
          $('.status').html(assets.activeModifier(data.is_active));
          $.each(data.history, function(index, el) {
            $('.media-history').append('<p>' + el.campaign_name + '</p><span>' + assets.dateModifier(el.date) + '</span>');
          });
      });
    },
    disableInputs: function(event){
        event.preventDefault();
        $(":input:not(.changed)").attr("disabled", "disabled");
        assets.saveEditedAssets();

    },
    saveEditedAssets: function(event){
      event.preventDefault();
      $(":input:not(.changed)").attr("disabled", "disabled");
      var formData = new FormData($(this)[0]);
      var paramId = assets.getParameterByName('id');
      function saveAsset(){
          $.ajax({
            headers: {'Authorization': token},
            type: 'PATCH',
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            processData: false,

            url: server + '/media/' + paramId + '/',
             success: function(response) {
                console.log(response);
                $(":input").removeAttr('disabled');
             },
            complete: function(xhr, textStatus) {
                if(xhr.status === 400){
                   // toastr.error(JSON.parse(xhr.responseText).name[0].message);
                   toastr.error(xhr.responseText);
                $('#newkeyModal').modal('hide');
                }
            }

          });
      }
      setTimeout(saveAsset, 100);
    },
    readURL: function(){
        var context = $(this);
        var filename = this.files[0].name;
        if (this.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                // context.closest('.btn-file').not('.video-1').css({'background-image': 'url(' + e.target.result + ')'});
                // console.log(e.target);
                context.closest('.btn-file').addClass('uploaded');
                if(context.closest('.btn-file').hasClass('video-1')){
                  context.closest('.btn-file').append($('<span>' + filename + '</span>'));
                }
            };

            reader.readAsDataURL(this.files[0]);
        }
    },
    showDeleteModal: function(event){
      event.preventDefault();
      mediaId = $(this).closest('.asset').data('id');


      $('#confirmModal').modal('show');
      $('#confirmModal').find('.modal-footer .form-container .btn-primary').detach();
      $('#confirmModal').find('h4').html('Remove Media Collection');
      $('#confirmModal').find('p').html('Are you sure do you want remove this media collection?');
      $('#confirmModal').find('.modal-footer .form-container').append($('<button type="button" class="btn modal-link btn-cancel btn-primary delete-btn" data-dismiss="modal">Remove</button><span class="delete-btn"></span>'));
    },
    deleteAssets: function(){
      var media = mediaId || assets.getParameterByName('id');
      console.log('test');
        $.ajax({
          headers: {'Authorization': token},
          type: 'DELETE',
          dataType: 'json',
          url:  server + '/media/' + media +'/',

           success: function(response) {


            toastr.success('Successfully removed Media');
            location.href = '/media/';
           },
          complete: function(xhr, textStatus) {

              if(xhr.status === 405){
              document.cookie = 'username=;expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';

              localStorage.clear();
              location.href = baseLocation;
              }
          }
      });


    },
    dateModifier: function(val){
      if(val !== null && undefined != val){
        return val.slice(0, 10).replace(/-/g, '/');
      } else {
        return '-';
      }
    },
    activeModifier: function(val){
      return val ? 'Active' : 'Inactive';
    },
    editAssets: function(){

// SHOW MODALS AND CHANGED CLASSES

      console.log($(this).closest('.asset'));
      $(this).closest('.asset').find('.crop, .embed-responsive').addClass('editable');
      $(this).addClass('btn-save');
      $(this).html('Accept');
    },
    showAssets: function(array){

// CREATING ASSETS VIEW
      if(array.length > 0){
        $.each(array, function(index, key) {
              /// do stuff

            $('#assets-list').append($(
              '<div class="asset medi" data-id=\"' + key.id + '\">' +
                '<div class="crop">' +
                  '<img src=\"' + key.summary_image + '\">' +
                  '<div class="action-buttons">' +
                    '<div class="action-buttons-holder">' +
                      '<a href="/media-detail/?id=' + key.id + '"><i class="icon-ic-eye"></i></a>' +
                      '<a href="/media-edit/?id=' + key.id + '"><i class="icon-ic-pen"></i></a>' +
                      '<a href="#" class="btn-del"><i class="icon-ic-remove"></i></a>' +
                    '</div>' +
                  '</div>' +
                  '<span class="status ' + (key.is_active ? "active-status" : "") + '">' + assets.activeModifier(key.is_active) + '</status>' +
                '</div>' +
                '<div class="info">' +
                  '<p class="ellipsis"><i class="icon-ic-title"></i>' + key.name +'</p>' +
                  '<p><i class="icon-ic-added-date"></i>' + assets.dateModifier(key.date) + '</p>' +
                  '<p><i class="icon-ic-date"></i>'+ assets.dateModifier(key.last_used_date) +'</p>' +
                '</div>' +
              '</div>')
            );
          });
        } else {
          $('#assets-list').append('<h2>You have no media</h2>');
        }
    },
    filterResults: function(){

// FILTER ASSETS BY NAME

      var filterInput = $('#search').val();
      var filteredAssets = $.grep(mediaArray, function(v) {
          return v.name.toLowerCase().indexOf(filterInput) > -1;
      });
      var filteredMedia;
      if(filteredAssets.length > 0){
        filteredMedia = $.map(filteredAssets, function(key, index) {
            /// do stuff

          return $('<div class="asset medi" data-id=\"' + key.id + '\">' +
              '<div class="crop">' +
                '<img src=\"' + key.summary_image + '\">' +
                '<div class="action-buttons">' +
                  '<div class="action-buttons-holder">' +
                    '<a href="/media-detail/?id=' + key.id + '"><i class="icon-ic-eye"></i></a>' +
                    '<a href="/media-edit/?id=' + key.id + '"><i class="icon-ic-pen"></i></a>' +
                    '<a href="#" class="btn-del"><i class="icon-ic-remove"></i></a>' +
                  '</div>' +
                '</div>' +
                '<span class="status ' + (key.is_active ? "active-status" : "") + '">' + assets.activeModifier(key.is_active) + '</status>' +
              '</div>' +
              '<div class="info">' +
                '<p class="ellipsis"><i class="icon-ic-title"></i>' + key.name +'</p>' +
                '<p><i class="icon-ic-added-date"></i>' + assets.dateModifier(key.date) + '</p>' +
                '<p><i class="icon-ic-date"></i>'+ assets.dateModifier(key.last_used_date) +'</p>' +
              '</div>' +
            '</div>');
        });
      } else {
        filteredMedia = '<h2 class="text-center">No results</h2>';
      }

      $('#assets-list').html(filteredMedia);
    }
  };
})(jQuery);