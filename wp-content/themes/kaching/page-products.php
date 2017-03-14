<?php 
    if($_COOKIE["usertype"] == 1){
?> 
<?php while (have_posts()) : the_post(); ?>
	<div class="wrap container" role="document">
  	<div class="row">
		<toastr></toastr>
	</div>  	
  	<div class="content">

<!-- 		  <?php get_template_part('templates/page', 'header'); ?> -->
		  <?php get_template_part('templates/content', 'page'); ?>
			 <button id="newProducts" type="button" class="btn btn-primary btn-tab-action">New Product</button>		  
		<div class="search row">   
			
				<form id="searchform">
					<div class="form-group col-md-3">

						<div class="input-bg">	
						    <div class="input-group">
						      <input type="text" class="form-control" placeholder="Search">
						      <span class="input-group-btn">
						        <button class="btn btn-primary" type="button"><i class="
glyphicon glyphicon-search"></i></button>
						      </span>
						    </div><!-- /input-group -->
						</div>
					</div>						
					<div class="form-group col-md-3">

						<div class="input-bg">	
						  <select class="form-control" id="sel1">
						    <option>Sort by name</option>
						    <option>Sort by added date</option>
						    <option>Sort by last used date</option>
						  </select>
						</div>
					</div>		
				</form>
		</div>
<!-- Assets list -->
		<div id="products-list" class="products row">
			
		</div>
<!-- End -->
	</div>
			<?php include get_template_part('templates/infoModal'); ?>
			<?php include get_template_part('templates/newProductModal'); ?>			
			<?php include get_template_part('templates/confirmation-modal'); ?>
			<!-- Loader -->

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