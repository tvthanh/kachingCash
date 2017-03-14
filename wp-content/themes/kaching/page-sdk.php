<?php 
    if($_COOKIE["usertype"] == 2){
?>
	<div class="wrap container" role="document">
  	<div class="row">
		<toastr></toastr>
	</div>  		
  	<div class="content">

		  <?php get_template_part('templates/page', 'header'); ?>
		  <?php get_template_part('templates/content', 'page'); ?>
		<?php 
			if ( have_posts() ) {
			  while ( have_posts() ) {
			    the_post();
			    /* page markup here using the_content() etc */
			  }
			}

			$args = array( 'post_type' => 'wowsdk' );
			$loop = new WP_Query( $args );
			if ( $loop->have_posts() ) {
			  while ( $loop->have_posts() ) {
			    $loop->the_post(); $count++;
			    /* loop markup here using the_content() etc */
			    ?>
				  <div class="sdk-row row">
				  	<div class="col-md-1">
							<!-- <img src="<?php bloginfo('template_url'); ?>/assets/images/ic-sdk.png" alt="SDK icon"> -->
							<?php echo get_the_post_thumbnail( $page->ID, 'thumbnail' ); ?>
				  	</div>
				  	<div class="col-md-7">
				  		<h2><?php the_title() ?> <?php if(get_post_meta($post->ID, "meta-box-checkbox", true)){?> <span class="label label-info">pre-release</span><?php };  ?></h2>
				  		<p><?php the_content() ?></p>
				  	</div>
				  	<div class="col-md-2">

				  		<label>Build</label>
				  		<p class="info"><?php $key="Build"; echo get_post_meta($post->ID, $key, true);  ?></p>
				  		<label>Date</label>
				  		<p class="info"><?php $key="Date"; echo get_post_meta($post->ID, $key, true);  ?></p>
				  	</div>
				  	<div class="col-md-2">
				  		<a href="<?php $key="Download URL"; echo get_post_meta($post->ID, $key, true);  ?>" class="btn <?php if($count === 1){ echo 'btn-primary'; } else {echo 'btn-default';} ?>"><i class="icon icon-download"></i> <br>Download SDK</a>
				  	</div>
				  </div>			    

			    <?php

			  }
			}

			wp_reset_postdata(); // reset to the original page data
		?>

		</div>
	</div>


<?php } else {?>

	<?php include get_template_part('templates/sessionClosed'); ?>

<?php } ?>