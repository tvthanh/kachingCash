var products;
(function($) {
  var productId;
  products = {     
    getProducts: function(){

// GET ASSETS FROM API


      var context = this;
      $.ajax({    
        headers: {'Authorization': token},
        type: 'GET',
        dataType: 'json',
        context: context,
        url: server + '/products/',

         success: function(data) {
          
          productArray = data;
          this.showAssets(productArray);            
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
    addProducts: function(event){
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

          url: server + '/products/',
           success: function(response) {
              console.log(response);
              location.href = '/products/';
             $('#newProductsModal').modal('hide');
           },
          complete: function(xhr, textStatus) {
              if(xhr.status === 400){
                 // toastr.error(JSON.parse(xhr.responseText).name[0].message);
                 toastr.error(xhr.responseText);


              }
          }   
            
        });      
    },
    getParameterByName: function(name) {

// GET PARAMS FROM URL

      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
          results = regex.exec(location.search);
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },   
    getProductRequest: function(){

// GET MEDIA DETAIL BY ID

      var token = 'Token ' + window.localStorage.getItem("conn");
      var context = this;
      var paramId = this.getParameterByName('id') || currentProductId;
      var promise = $.Deferred();
      $.ajax({    
        headers: {'Authorization': token},
        type: 'GET',
        dataType: 'json',
        context: context,
        url: server + '/products/' + paramId + '/',

         success: function(data) {
          promise.resolve(data);
         },
        error: function(){
          var error = 'Cannot fetch product';
          promise.reject(error);
        }      
      });
      return promise;
    },        
    getProductDetails: function(){

// GET MEDIA DETAIL BY ID

      var token = 'Token ' + window.localStorage.getItem("conn");
      var context = this;
      var paramId = this.getParameterByName('id');
      var editable = assets.getParameterByName('edit');
      console.log('test');
      
      this.getProductRequest()
        .done(function(data){

          $('h1').html('<i class="icon-ic-back back"></i>' + '  ' + data.title);          
          $('#media-title').val(data.title);
          $('.img').html($('<br><img src="' + data.image + '" alt="">'));
          $('#product-url').val(data.url);
          $('#product-price').val(data.price);
          $('#product-description').val(data.description);
          $('.edit').attr('href', '/product-edit/?id=' + data.id);
          $('#status').val(assets.activeModifier(data.is_active));
          $('#media-added').val(assets.dateModifier(data.date_added));
          $('#media-used').val(assets.dateModifier(data.last_used_date)); 
          $('.ezdz-dropzone').css({'background-image': 'url(' + data.image + ')'});
          // $.each(data.history, function(index, el) {
          //   $('.media-history').append('<p>' + el.campaign_name + '</p><span>' + assets.dateModifier(el.date) + '</span>');                   
          // });                 
          if(editable == 1){
            products.allowEdition();
          }
        });
    },
    getProductToEdit: function(){

// GET Product TO EDITION BY ID

      var token = 'Token ' + window.localStorage.getItem("conn");
      var context = this;

      console.log('test');
      this.getProductRequest()
        .done(function(data){
          $('h1').html('<i class="icon-ic-back back"></i>' + '  ' + data.title);          
          $('.product-title').val(data.title);
          $('.product-url').val(data.url);
          $('.product-description').val(data.description);
          $('.product-price').val(data.price);          
          $('.file-edit').css({'background-image': 'url(' + data.image + ')'});
          $('.media-added').html(assets.dateModifier(data.date));
          // $('.media-used').html(assets.dateModifier(data.date));          
          $('.status').html(assets.activeModifier(data.is_active));
          $.each(data.history, function(index, el) {
            $('.media-history').append('<p>' + el.campaign_name + '</p><span>' + assets.dateModifier(el.date) + '</span>');
          });
        });

    },    
    readURL: function(){
        var context = $(this);
        if (this.files[0]) {
            var reader = new FileReader();
            
            reader.onload = function (e) {
                context.closest('.btn-file').css({'background-image': 'url(' + e.target.result + ')'});
                console.log(context);
            };
            
            reader.readAsDataURL(this.files[0]);
        }
    },
    showDeleteModal: function(event){
      event.preventDefault();
      productId = $(this).closest('.asset').data('id');


      $('#confirmModal').modal('show');
      $('#confirmModal').find('.modal-footer .form-container .btn-primary').detach();
      $('#confirmModal').find('h4').html('Remove Product');
      $('#confirmModal').find('p').html('Are you sure do you want remove this product?');
      $('#confirmModal').find('.modal-footer .form-container').append($('<button type="button" class="btn modal-link btn-cancel btn-primary delete-btn" data-dismiss="modal">Remove</button><span class="delete-btn"></span>'));
    },
    deleteProducts: function(){
      console.log('test');
        $.ajax({    
          headers: {'Authorization': token},
          type: 'DELETE',
          dataType: 'json',
          url:  server + '/products/' + productId +'/',

           success: function(response) {


            // toastr.success('Successfully removed Product');
            location.href = '/products/';
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
    saveEditedProducts: function(event){
      event.preventDefault();
      var formData = new FormData($('#editProduct')[0]);
      var paramId = assets.getParameterByName('id');
      if ( $('#editProduct').parsley().validate() ) {
        function saveAsset(){
            $.ajax({
              headers: {'Authorization': token},
              type: 'PATCH',
              data: formData,
              async: false,
              cache: false,
              contentType: false,
              processData: false,

              url: server + '/products/' + paramId + '/',
               success: function(response) {
                  console.log(response);
                  products.disableEdition();
                  products.getProductDetails();
                  clients.showinfo('Success', 'Product has been saved');
               },
              complete: function(xhr, textStatus) {
                  if(xhr.status === 400){
                     // toastr.error(JSON.parse(xhr.responseText).name[0].message);
                     toastr.error(xhr.responseText);

                  }
              }

            });
        }
      }
      setTimeout(saveAsset, 100);
    },
    allowEdition: function(){
      $('.editable').prop('disabled', false);
      $('.edit').hide();
      $('.btn-del').hide();
      $('.img').hide();
      $('.img-edit').show();
      $('.page-header').append($('<button type="button" class="btn btn-primary btn-tab-action save">Save</button>'));
    },
    disableEdition: function(){
      $('.editable').prop('disabled', true);
      $('.edit').show();
      $('.btn-del').show();
      $('.img').show();
      $('.img-edit').hide();
      $('.save').remove();
    },    
    showAssets: function(array){

// CREATING ASSETS VIEW
      if(array.length > 0){
        $.each(array, function(index, key) {
            /// do stuff

          $('#products-list').append($(
            '<div class="product prod col-xs-12 col-sm-6 col-md-3" data-id=\"' + key.id + '\">' +
              '<div class="crop">' +
                '<img src=\"' + key.image + '\">' +
                
              '</div>' +
              '<div class="info">' +
                '<div class="col-md-7 no-padding">' +                    
                  '<p class="name ellipsis">' + key.title +'</p>' +
                  '<p class="date">Added:' + assets.dateModifier(key.date_added) + '</p>' +
                '</div>' +
                '<div class="col-md-5 no-padding">' +                  
                  '<div class="action-buttons">' +
                    '<div class="action-buttons-holder">' +
                      '<a href="/product-detail/?id=' + key.id + '"><i class="icon-ic-eye"></i></a>' +
                      '<a href="/product-detail/?id=' + key.id + '&edit=1"><i class="icon-ic-pen"></i></a>' +
                      '<a href="#" class="btn-del"><i class="icon-ic-remove"></i></a>' +       
                    '</div>' +             
                  '</div>' +                        
                '</div>' +         
              '</div>' +
            '</div>')
          );
        });
      } else {
        $('#products-list').append('<h2>You have no products</h2>');
      }
    },
    filterResults: function(){

// FILTER ASSETS BY NAME

      var filterInput = $('#search').val();
      var filteredAssets = $.grep(productArray, function(v) {
          return v.title.toLowerCase().indexOf(filterInput) > -1;
      });
      var filteredMedia;
      if(filteredAssets.length > 0){
        filteredMedia = $.map(filteredAssets, function(key, index) {
            /// do stuff
          
          return $('<div class="asset prod" data-id=\"' + key.id + '\">' +
              '<div class="crop">' +
                '<img src=\"' + key.image + '\">' +
                '<div class="action-buttons">' +
                  '<div class="action-buttons-holder">' +
                    '<a href="/product-detail/?id=' + key.id + '"><i class="icon-ic-eye"></i></a>' +
                    '<a href="/product-edit/?id=' + key.id + '"><i class="icon-ic-pen"></i></a>' +
                    '<a href="#" class="btn-del"><i class="icon-ic-remove"></i></a>' +       
                  '</div>' +             
                '</div>' +
                '<span class="status ' + (key.is_active ? "active-status" : "") + '">' + assets.activeModifier(key.is_active) + '</status>' +                
              '</div>' +
              '<div class="info">' +
                '<p class="ellipsis"><i class="icon-ic-title"></i>' + key.title +'</p>' +
                '<p><i class="icon-ic-added-date"></i>' + '2016/03/17' + '</p>' +
                '<p><i class="icon-ic-date"></i>'+assets.dateModifier(key.last_used_date)+'</p>' +
              '</div>' +
            '</div>');
        }); 
      } else {
        filteredMedia = '<h2 class="text-center">No results</h2>';
      }

      $('#products-list').html(filteredMedia);
    }
  };
})(jQuery);