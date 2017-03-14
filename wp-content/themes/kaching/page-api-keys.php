<?php 
    if($_COOKIE["usertype"] == 2){
?> 
<?php while (have_posts()) : the_post(); ?>
  <div class="wrap container" role="document">
  	<div class="row">
		<toastr></toastr>
	</div>  
  	<div class="content row">

  		<?php get_template_part('templates/page', 'header'); ?>

  		<?php get_template_part('templates/content', 'page'); ?>

		  <button id="generateKey" type="button" class="btn btn-primary btn-tab-action">Generate new key</button>

			<div class="table-responsive">
			<table id="tabletest" class="table table-hover" ></table>

			</div>
			<?php include get_template_part('templates/details-modal'); ?>			
			<?php include get_template_part('templates/confirmation-modal'); ?>
			<?php include get_template_part('templates/newkeymodal'); ?>			

              <div class="loader">
                <svg class="circular" viewBox="25 25 50 50">
                  <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>
                </svg>
                <p class="text-center">Loading...</p>
              </div>


	  </div><!-- /.content -->

	</div><!-- /.wrap -->

<?php endwhile; ?>
<?php } else {?>

	<?php include get_template_part('templates/sessionClosed'); ?>

<?php } ?>
