var apiKeys;
var key;
(function($) {
	apiKeys = {


    api_keys: server + '/applications/',

    	getApiKeys: function(){
		    var token = 'Token ' + window.localStorage.getItem("conn");
    		var context = this;
	      $.ajax({    
	        headers: {'Authorization': token},
	        type: 'GET',
	        dataType: 'json',
	        
	        url: this.api_keys,

	         success: function(response) {
	          context.generateTable(response.results);
	          // console.log(response.results);
	          $('.loader').hide();
	         },
	        complete: function(xhr, textStatus) {
	            if(xhr.status === 405){
	            // location.href = baseLocation;
	              toastr.error('Your session has expired. Please Sign in.');
	              localStorage.clear();
	            document.cookie = 'username=;expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
	            $('.loader').hide();
	            }
	        }       
	      });   
	    },

		operateFormatter: function (value, row, index) {
			  return [
			'<a href="'+row.url+'" data-toggle="tooltip" data-placement="top" title="Download Key"><i class="icon-download icon table-icon"></i></a>',
			'<span class="remove">',
			  '<a href="#"  data-toggle="tooltip" data-placement="top" title="Delete Key"><i class="icon-delete icon table-icon"></i></a>',
			'</span>'
			  ].join('');
		},
		operateEvents: {

	          'click .like': function (e, value, row, index) {
	              alert('You click like action, row: ' + JSON.stringify(row));
	          },
	          'click .remove': function (e, value, row, index) {
	            key = row.id;
	            $('#confirmModal').modal('show');
	            $('#confirmModal .type').html('API key: ');
	            $('#confirmModal .id').html(row.name);
	            $('#confirmModal .modal-footer .delete-btn').html('<button id="removeKey" type="button" class="btn modal-link btn-primary">Delete</button>');
	            currentrow = $(this).parent('tr');
	            // console.log(currentrow);
	          },
	          'hover .icon':function (e, value, row, index) {
	            $('[data-toggle="tooltip"]').tooltip();         
	          }
	     

	  },
      deleteApiKey: function(event) {
        event.preventDefault();
        /* Act on the event */
    
	      $.ajax({    
	        headers: {'Authorization': token},
	        type: 'DELETE',
	        dataType: 'json',
	        url:  server + '/applications/' + key +'/',

	         success: function(response) {
	          $('#confirmModal').modal('hide');
	                $('#tabletest').bootstrapTable('remove', {
	                    field: 'key',
	                    values: [key]
	                });

	          toastr.success('Successfully removed API Key');

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

      typeFromatter: function (value){
        return value ? 'TESTING' : 'PRODUCTION';
      },
      generateTable: function(res){
	      $('#tabletest').bootstrapTable({
	        classes: 'table-no-bordered',
	        pagination:true,
	        filterControl: true,
	        filterShowClear:true,
	          columns: [{
	              field: 'api_key',
	              title: 'API Key',
	            sortable:true,
	            filterControl: 'input'          
	          },
	          {
	            field: 'name',
	            title: 'Application name',
	            sortable:true,
	            filterControl: 'input'          
	          },  
	          {
	            field: 'monthly_active_users',
	            title: 'Monthly active users',
	            sortable:true,
	            filterControl: 'input'          
	          }, 
	          {
	            field: 'daily_active_users',
	            title: 'Daily active users',
	            sortable:true,
	            filterControl: 'input'          
	          },         
	          {
	            field: 'total_views',
	            title: 'Total views',
	            sortable:true,
	            filterControl: 'input'          
	          },                             
	          // {
	          //     field: 'test',
	          //     title: 'Type',
	          //   sortable:true,
	          //   filterControl: 'input',
	          //   formatter: typeFromatter          
	          // }, {
	          //     field: 'messages',
	          //     title: 'MESSAGES SENT',
	          //   sortable:true,
	          //   filterControl: 'input'          
	          // }
	          {
	              title: 'Actions <i class="icon-search search-icon"></i>',
	              formatter: this.operateFormatter,
	              events: this.operateEvents
	          }
	          ],

	          data: res

	      });


      },
	addNewApiKey: function(e) {
      e.preventDefault();
      var api_keys =  server + '/applications/';
      var token = 'Token ' + window.localStorage.getItem("conn");
      var keyinfo = {
        'name': $('body').find("#keyname").val(),
        'publisher': window.localStorage.getItem("usrid")
        // 'test': $('body').find("#keystatus").val()
      };
      // var jsonkeyinfo = JSON.stringify(keyinfo);
      $.ajax({   
  
        headers: {'Authorization': token},
        type: 'POST',
        dataType: 'json',
        data: keyinfo,
        url: api_keys,
         success: function(response) {
          $('#tabletest').bootstrapTable('insertRow', {
                    index: 0,
                    row: {
                    	api_key: response.api_key,
                        name: response.name,
                        monthly_active_users: response.monthly_active_users,
                        daily_active_users: response.daily_active_users,
                        total_views: response.total_views,                        
                    }
                });
          $('#newkeyModal').modal('hide');          
          toastr.success('Successfully added API Key');

          $('body').find("#keyname").val('');

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

	
};
})(jQuery);
