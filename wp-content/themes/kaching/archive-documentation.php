<?php /* Template Name: Documentation type */ ?>
<div class="container docs" role="document">
  	<div class="row">
		<toastr></toastr>
	</div>  	
	<div class="content row">
		<div class="col-md-4 docs-nav">

			<ul class="docs-sidebar-nav docs-sidebar-nav-intro">
<!-- 				 <div class="btn-group">   

				    <form role="search" action="<?php echo site_url('/'); ?>" method="get" id="searchform">
				    <div class="input-group">
					    <input class="form-control" type="text" name="s" placeholder="Search"/>
					    <input type="hidden" name="post_type" value="support" />
					    <span class="input-group-btn">
						    <button class="btn btn-primary" type="submit" alt="Search" value="Search" /><i class="glyphicon glyphicon-search"></i></button>
						</span>
				    </div>
				  </form>
				 </div>	 -->			
				<div class="form-group selectwrap"><select id="filterDocs" class="form-control"></select></div>
				<?php 
					$args = array(
					  'post_type'=>'documentation',
					  'title_li'=> '<label>' . __('Menu') . '</label>'
					);
					wp_list_pages( $args );
				?>
			</ul>
			<ul class="docs-sidebar-nav-mobile">
				<select class="form-control" name="" id="selectMobileCategory">
					<option value="android">Android Documentation</option>
					<option value="ios">iOS Documentation</option>
				</select>
			</ul>
			<ul id="android-docs" class="docs-sidebar-nav-mobile">
				<?php 
					$args = array(
					  'post_type'=>'support',
					  'show_option_none'=>'Choose...',
					  'sort_column'=>'menu_order',
					  'title_li'=> '<label>' . __('Menu') . '</label>',
					  'child_of'=>90,
					  'class'=>'form-control',
					  'name'=>'android_id'
					);
					wp_dropdown_pages( $args );
				?>
			</ul>
			<ul id="ios-docs" class="docs-sidebar-nav-mobile">
				<?php 
					$args = array(
					  'post_type'=>'support',
					  'show_option_none'=>'Choose...',
					  'sort_column'=>'menu_order',
					  'title_li'=> '<label>' . __('Menu') . '</label>',
					  'child_of'=>111,
					  'class'=>'form-control',
					  'name'=>'ios_id'
					);
					wp_dropdown_pages( $args );
				?>
			</ul>			
		</div>
		<div class="col-md-8 wrap">
			<?php get_template_part('templates/content-single', get_post_type()); ?>	
		</div>
	</div>
</div>

<!-- Mobile change page on select -->
<script type="text/javascript">
	var selectmenu = document.getElementById("android_id");
	var selectmenu2 = document.getElementById("ios_id");
	function onPageChange() {
	    if ( selectmenu.options[selectmenu.selectedIndex].value > 0 ) {
	        location.href = "<?php echo get_option('home'); ?>/?page_id="+selectmenu.options[selectmenu.selectedIndex].value;
	    }
	}
	function onPageChange2() {
	    if ( selectmenu2.options[selectmenu2.selectedIndex].value > 0 ) {
	        location.href = "<?php echo get_option('home'); ?>/?page_id="+selectmenu2.options[selectmenu2.selectedIndex].value;
	    }
	}	
	selectmenu.onchange = onPageChange;
	selectmenu2.onchange = onPageChange2;


</script>
