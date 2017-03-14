var campaigns;
var currentMessage;
(function($) {
	campaigns = {
        // var api_messages =  server + '/campaigns/';
        // var token = 'Token ' + window.localStorage.getItem("conn");
	  api_messages: server + '/campaigns/',
        operateEvents: {

// EVENTS IN BOOTSTRAP TABLE

            'click .details': function (e, value, row, index) {
              currentCampaign = row.id;            
              $('#campaignDetailModal').modal('show');
              newCampaign.showdetails();

       	 },
            'click .remove': function (e, value, row, index) {
              currentMessage = row.id;
              // console.log(currentMessage);
              $('#confirmModal').modal('show');
              $('#confirmModal .type').html('Campaign: ');
              $('#confirmModal .id').html(row.id);
              $('#confirmModal .modal-footer .delete-btn').html('<button id="removeMessage" type="button" class="btn modal-link btn-primary">Delete</button>');
            },
            'hover .icon':function (e, value, row, index) {
              $('[data-toggle="tooltip"]').tooltip();         
            }
       
        },


        moneyFormatter: function(value){

// ADDING $ BEFORE VALUE          
        	return '$' + value;
        },
        statusFromatter: function (value){


          return value ? '<span class="td-reported">Reported</span>' : 'Sent';
        },

           

      dateFormatter: function(value){
        // function pad(s) { return (s < 10) ? '0' + s : s; }
        // var d = new Date(value*1000);
        // return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('.');
        if(value !== null){
          return value.substring(0,10);
        }
      },
      getCampaignRequest: function(){

  // GET MEDIA DETAIL BY ID

        var token = 'Token ' + window.localStorage.getItem("conn");
        var context = this;
        var paramId = assets.getParameterByName('id') || currentCampaign;
        var promise = $.Deferred();
        $.ajax({    
          headers: {'Authorization': token},
          type: 'GET',
          dataType: 'json',
          context: context,
          url: server + '/campaigns/' + paramId + '/',

           success: function(data) {
            promise.resolve(data);
           },
          error: function(){
            var error = 'Cannot fetch campaign';
            promise.reject(error);
          }      
        });
        return promise;
      },          
      operateFormatter: function(value, row, index) {

// ADDED ICONS TO TABLE
 
          return [
        '<span class="details">',
          '<a href="#" data-toggle="tooltip" data-placement="top" title="Campaign details"><i class="icon-more icon table-icon"></i></a>',
        '</span>',
        // '<span class="report">',
        //   '<a href="/report"  data-toggle="tooltip" data-placement="top" title="Campaign Report"><i class="icon-ic-stats icon table-icon"></i></a>',
        // '</span>',        
        '<span class="remove">',
          '<a href="#"  data-toggle="tooltip" data-placement="top" title="Delete Campaign"><i class="icon-delete icon table-icon"></i></a>',
        '</span>'
       
          ].join('');
      },        
      generateTable: function(res){

// GENERATING TABLES

        $('#tablemessages').bootstrapTable({
          classes: 'table-no-bordered',
          pagination:true,
          filterControl: true,
          filterShowClear:true,       
            columns: [

          {
            field: 'name',
                title: 'Campaign name',
              sortable:true,
              filterControl: 'input'
            },
          {
            field: 'client',
                title: 'Customer',
              sortable:true,
              filterControl: 'input'
            },  
          {
            field: 'start_date',
            formatter: this.dateFormatter,
                title: 'Start Date',
              sortable:true,
              filterControl: 'input'
            },                              
          {
                field: 'end_date',
                formatter: this.dateFormatter,
                title: 'End date',
              sortable:true,
              filterControl: 'input'
            },  
          // {
          //       field: 'views_total',
          //       title: 'Content views',
          //     sortable:true,
          //     filterControl: 'input'
          //   }, 
          {
                field: 'budget',
                title: 'Left Budget',
                formatter: this.moneyFormatter,
              sortable:true,
              filterControl: 'input'
            },           
             {
                title: 'Actions <i class="icon-search search-icon"></i>',
                formatter: this.operateFormatter,
                events: this.operateEvents
            }],

            data: res

        });
      },       
      getCampaigns: function(){

// GET CAMPAIGNS DATA FROM SERVER

        var token = 'Token ' + window.localStorage.getItem("conn");
        var context = this;
        $.ajax({    
          headers: {'Authorization': token},
          type: 'GET',
          dataType: 'json',
          context: context,
          url: this.api_messages,

           success: function(response) {
            // console.log(response);
            context.generateTable(response);
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
      deleteCampaign: function(event){

// DELETE CAMPAIGN FROM SERVER

        event.preventDefault();
          /* Act on the event */
        $.ajax({    
          headers: {'Authorization': token},
          type: 'DELETE',
          dataType: 'json',
          url:  server + '/campaigns/' + currentMessage +'/',

           success: function(response) {
            // console.log(response);
            $('#confirmModal').modal('hide');
                  $('#tablemessages').bootstrapTable('remove', {
                      field: 'id',
                      values: [currentMessage]
                  });           
            toastr.success('Successfully removed Campaign');
           },
          complete: function(xhr, textStatus) {
              // console.log(xhr.status +' '+ textStatus);
              if(xhr.status === 405){
                toastr.error('Your session has expired. Please log-in.');
              // location.href = baseLocation;
                  localStorage.clear();
              document.cookie = 'username=;expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
              }
          }       
        });        
      },
      showCreateModal: function(){
        $('#newCampaignModal').modal('show');
      },
      createCampaign: function(event){

// CREATE NEW CAMPAIGN

        event.preventDefault();
        event.stopImmediatePropagation();
        // console.log($(this).serialize());
        var context = this;
        var dataCampaign = {
          title: $(this).find('#title').val(),
          // start_date: $(this).find('#start').val(),
          // end_date: $(this).find('#end').val(),
          views_total: $(this).find('#views').val(),
          budget: $(this).find('#budget').val()
        };
        // console.log(dataCampaign);
        $.ajax({    
          // headers: {'Authentication': token},
          type: 'POST',
          dataType: 'json',

          data: dataCampaign,
          url: server + '/campaigns/',
           success: function(response) {
            // $('#tabletest').bootstrapTable('insertRow', {
            //       index: 0,
            //       row: {
            //           name: response.name,
            //           // test: response.key.test,
            //           messages: response.key.messages
            //       }
            //   });
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