(function($) {

	// $navContainer = $('.docs-sidebar-nav');
	// $mobileNav = $('.docs-sidebar-nav-mobile');

	// var navDoc = {

	// 	// 'createSelect': function(){
	// 	// 	$navContainer.prepend($('<div class="form-group selectwrap"><select id="filterDocs" class="form-control"></select></div>'));
	// 	// 	// $mobileNav.prepend($('<div class="form-group selectwrap"><select id="mobilefilterDocs" class="form-control"></select></div>'));
	// 	// },
	// 	'getMain': function(){
	// 		// this.createSelect();
	// 		$navContainer.find('> li > ul > li > a').map(function(){
	// 			var categoryName = $.trim($(this).text());
 //               $navContainer.find('select').append($('<option>' + categoryName + '</option>'));
 //               // $mobileNav.find('#mobilefilterDocs').append($('<option>' + categoryName + '</option>'));
 //               // $mobileNav.append($('<div  class="form-group selectwrap secondSelect"><select id="' + categoryName.replace(/ /g,"_") + '" class="form-control"></select></div>'));
 //            }).get();
	// 	},

	// 	'hideOnLoad':function(){

	// 		var filterCat = (localStorage.getItem("category") === null) ? ($(this).val()) : localStorage.getItem("category");
	// 		// console.log(filterCat);
	// 		$navContainer.find('> li > ul > li > a').map(function(){
	// 			var categoryName = $.trim($(this).text());
 //               	if(categoryName !== filterCat){
 //               		$(this).parent().hide();
 //               	} else{
 //               		$(this).parent().find('> a').hide();           		
 //               		$(this).parent().show();
 //               		$navContainer.find('#filterDocs').val(filterCat);
 //               	}
 //            }).get();
	// 	},
	// 	'filter': function(){
	// 		var filterCat = $(this).val();
	// 		$navContainer.find('> li > ul > li > a').map(function(){
	// 			var categoryName = $.trim($(this).text());
 //               	if(categoryName !== filterCat){
 //               		$(this).parent().hide();
 //               	} else{
 //               		$(this).parent().show();
 //               		$(this).parent().find('> a').hide();
 //               		localStorage.setItem("category", categoryName);
 //               		if(filterCat === 'Android documentation'){
 //               			location.href = baseLocation + '/documentation/android-overview/wow-sdk-usage-guide/';
 //               		}
 //               		else if(filterCat === 'iOS Documentation'){
 //               			location.href = baseLocation + '/documentation/ios-documentation/wow-sdk-usage-guide/';
 //               		}
 //               	}
 //            }).get();
	// 	},
	// 	'mobilefilter': function(){
	// 		// var filterCat = $(this).val().replace(/ /g,"_");

	// 		// $navContainer.find('> li > ul > li > a').map(function(){
	// 		// 	var categoryName = $.trim($(this).text()).replace(/ /g,"_");

 //   //             	if(categoryName !== filterCat){
 //   //             		$mobileNav.find('#' + categoryName).hide();
 //   //             	} else{
 //   //             		$mobileNav.find('#' + categoryName).show();          		
               		
 //   //             	} 
 //   //          }).get();
	// 		if($(this).val() === 'android'){
	// 			$('#android-docs').show();
	// 			$('#ios-docs').hide();
	// 		}	else {
	// 			$('#android-docs').hide();
	// 			$('#ios-docs').show();				
	// 		}
	// 	},		
	// 	'showMobile': function(){
	// 		$mobileNav.prepend(($navContainer).find('li'));
	// 	}
	// };
	
	// $(document).ready(function() {
	// 	$navContainer.on('change', '#filterDocs', navDoc.filter);
	// 	$mobileNav.on('change', '#selectMobileCategory', navDoc.mobilefilter);		
	// 	$.when($navContainer.find('#filterDocs')).done(navDoc.hideOnLoad);
	// 	// navDoc.createMobile();
	// });
	// navDoc.getMain();
	
})(jQuery);
