<div class="container docs" role="document">
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
			<?php
				$args = array(
					'post_type'=> 'support',
					'p' => '126'
				);
				query_posts( $args );
			?>

			<?php get_template_part('templates/content-single', get_post_type()); ?>
		</div>
	</div>
</div>
