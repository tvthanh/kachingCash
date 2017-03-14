var settings;
(function($) {

    var api_settings =  server + '/users/profile/';
    var token = 'Token ' + window.localStorage.getItem("conn");
    // GET parameters from URL

    var activateToken = assets.getParameterByName('activate_user_token');

    settings = {
      getSettings: function(){
        $.ajax({    
          headers: {'Authorization': token},
          type: 'GET',
          dataType: 'json',
          
          url: api_settings,

           success: function(response) {
            // console.log(rgetSettingsesponse);
            $('#firstName').val(response.first_name);
            $('#lastName').val(response.last_name);
            $('#settingsemail').val(response.email);
            $('#settingcompany').val(response.company);
            // $('#bank_country').val(response.country);
            // $('#bank_account_owner_name').val(response.bank_account_owner_name);
            // $('#bank_name').val(response.bank_name);
            // $('#bank_account_number').val(response.bank_account_number);            
            console.log(response);
           },
          complete: function(xhr, textStatus) {
              // console.log(xhr.status +' '+ textStatus);
              $('#settingpass').attr('disabled', true);
              if(xhr.status === 405){
              // location.href = baseLocation;
                toastr.error('Your session has expired. Please Sign in.');
                localStorage.clear();
              document.cookie = 'username=;expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';          
              }
          }       
        });      
      },
      editSettings: function(event) {
      event.preventDefault();
      $('#settingpass').attr('disabled', false);
      var firstName = $('body').find('#firstName').prop('value'),
        lastName = $('body').find('#lastName').val(),
        settingpass = $('body').find('#settingpass').val(),
        settingcompany = $('body').find('#settingcompany').val(),
        settingsemail = $('body').find('#settingsemail').val(),
        bank_country = $('body').find('#bank_country').val(),
        bank_account_owner_name = $('body').find('#bank_account_owner_name').val(),
        bank_name = $('body').find('#bank_name').val(),
        bank_account_number = $('body').find('#bank_account_number').val(),   
        userdata = {
          "first_name": firstName,
          "last_name": lastName,
          // "password": settingpass,
          "company": settingcompany,
          "email": settingsemail,
          // "bank_country": bank_country,
          // "bank_account_owner_name": bank_account_owner_name,
          // "bank_name": bank_name,
          // "bank_account_number":bank_account_number


        };
        // userData = JSON.stringify(userdata);    
      // console.log(userData);

      $.ajax({    
        headers: {'Authentication': token},
        type: 'PUT',
        dataType: 'json',
        data: userdata,   
        url: api_messages,

         success: function(response) {
          // console.log(response);
          toastr.success('Successfully changed data');
          var now = new Date();
          var time = now.getTime();
          time += 3600 * 2000;
          $('#name').html(settingcompany + '<span class="icon-down"></span>');
          now.setTime(time);
          document.cookie = 
          'username=' + settingcompany + 
          '; expires=' + now.toUTCString() + 
          '; path=/';
          $('#settingpass').attr('disabled', true);
         },
        complete: function(xhr, textStatus) {
            // console.log(xhr.status +' '+ textStatus);
            if(xhr.status === 405){
              
              localStorage.clear();           
            // location.href = baseLocation;
            document.cookie = 'username=;expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';            
            }
        }       
      }); 
    }
    };
    if(activateToken !== ''){
      $.ajax({    
        type: 'POST',
        dataType: 'json',
        
        url: api_messages + 'activate/' +  activateToken + '/',

         success: function(response) {
          var conn = response.token;
          var user = response.user_company;
          localStorage.setItem("conn", conn);
          localStorage.setItem("user", user);
          var now = new Date();
          var time = now.getTime();
          time += 3600 * 2000;
          now.setTime(time);
          document.cookie = 
          'username=' + user + 
          '; expires=' + now.toUTCString() + 
          '; path=/';               
            toastr.success('Your account has been activated');
            setTimeout(function(){
              location.href = baseLocation + '/settings/';
            }, 500);
         },
        complete: function(xhr, textStatus) {
            // console.log(xhr.status +' '+ textStatus);
            if(xhr.status === 400){
            toastr.error('Given token was already used');
            // location.href = baseLocation;          
            }               
            if(xhr.status === 405){
            // location.href = baseLocation;
            }
        }       
      });     
    } else {
    // GET SETTINGS
      $('#settingpass').attr('disabled', false);

    }
    // PUT SETTINGS

    // $('body').delegate( "#settingsForm", "submit", );

// CHANGE PASSWORD

    $('body').delegate('#changepass', 'submit', function(event){
      event.preventDefault();
      $('#settingpass').attr('disabled', false);
      var api_resetPass =  server + '/admin_panel/user/password/';
      var settingpass = $('body').find('#newPass').val();
      var passField = $('body').find("#oldPass").parsley();
      var oldPass = $('body').find('#oldPass').val();      
      var pass = {
        "old_password": oldPass,
        "new_password": settingpass
      };
      pass = JSON.stringify(pass);
      $.ajax({    
        headers: {'Authentication': token},
        type: 'PUT',
        dataType: 'json',
        data: pass,   
        url: api_resetPass,

         success: function(response) {
          // console.log(response);
          toastr.success('Successfully changed data');
          $('#passwordModal').modal('hide');
          $('#settingpass').val($('#newPass').val());
          $('#settingpass').attr('disabled', true);     

         },
        complete: function(xhr, textStatus) {
            if(xhr.status === 400){
               // toastr.error('Invalid email or password.'); 
              window.ParsleyUI.addError(passField, "passwordError", xhr.responseText);
            }           
            // console.log(xhr.status +' '+ textStatus);
            if(xhr.status === 405){
            // location.href = baseLocation;

            localStorage.clear();             
            document.cookie = 'username=;expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';            
            }
        }       
      });     
    });

    
})(jQuery); // Fully reference jQuery after this point.    