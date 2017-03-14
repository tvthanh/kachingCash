<div class="container docs" role="document">
  	<div class="row">
		<toastr></toastr>
	</div>  	
	<div class="content row">
		<div class="col-md-4 docs-nav">

			<ul class="docs-sidebar-nav docs-sidebar-nav-intro">		
				<!-- <div class="form-group selectwrap"><select id="filterDocs" class="form-control"></select></div> -->
				<?php 
					$args = array(
					  'post_type'=>'support',
					  'title_li'=> '<label>' . __('Menu') . '</label>'
					);
					wp_list_pages( $args );
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

	(function($) {
        $('.page_item_has_children > a').removeAttr('href');
		$('.page_item_has_children').on('click', 'a', function(event) {
			// event.preventDefault();
			$(this).parent('.page_item_has_children').toggleClass('open');
			$(this).parent('.page_item_has_children').find('.children').toggleClass('children_active');
		
		});
    })(jQuery);



</script>
