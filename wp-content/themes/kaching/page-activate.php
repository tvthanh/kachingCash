<?php while (have_posts()) : the_post(); ?>
	<div class="wrap container" role="document">
		
		<?php include get_template_part('templates/infoModal'); ?>
	</div>
<?php endwhile; ?>	
