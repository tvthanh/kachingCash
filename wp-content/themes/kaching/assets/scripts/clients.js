var clients;
var autocomplete = [];
var clientsList;
(function($) {

	clients = {
		getClients: function(){
	      var context = this;
	      $.ajax({
	        headers: {'Authorization': token},
	        type: 'GET',
	        dataType: 'json',
	        context: context,
	        url: server + '/clients/',

	         success: function(data) {
				clientsList = data;
				clientsList.each(function(index, el) {
			        autocomplete.push(index.name);
	          });
	          // console.log(autocomplete);
	         },
	        complete: function(xhr, textStatus) {
	            // console.log(xhr.status +' '+ textStatus);

	        }
	      });
		},
		showinfo: function(title, content){
            $('#infoModal').modal('show');
            $('body').find('#infoModal .modal-title').html(title);
            $('body').find('.extra-padd').html(content);
		},
		saveClient: function( clientName ){
			$.ajax({
				headers: {'Authorization': token},
				url: server + '/clients/',
				type: 'POST',
				dataType: 'json',
				data: {
					name: clientName
				},
				success: function(response) {
					clients.getClients();
				},
				complete: function(xhr, textStatus) {}
			});
		},
		search: function (nameKey, myArray){
		    for (var i=0; i < myArray.length; i++) {
		        if (myArray[i].name === nameKey) {
		            return true;
		        }
		    }
		},
		returnClientId: function (nameKey, myArray){
		    for (var i=0; i < myArray.length; i++) {
		        if (myArray[i].name === nameKey) {
		            return myArray[i].id;
		        }
		    }
		}
	};

})(jQuery);