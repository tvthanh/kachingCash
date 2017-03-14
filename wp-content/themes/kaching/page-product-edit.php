<?php 
    if($_COOKIE["usertype"] == 1){
?> 
<div class="wrap container" role="document">
	<div class="row">
	<toastr></toastr>
</div>  	
	<div class="content">

	  <?php get_template_part('templates/page', 'header'); ?>
	  <?php get_template_part('templates/content', 'page'); ?>


	  <button type="button" class="btn btn-primary btn-tab-action btn-del">Accept</button>	    
	<div class="row">
		<div class="col-md-4">
			<h3>Product details</h3>



			<span>Added date:</span>
			<p class="media-added">10/02/2016</p>			

			<span>Last used date:</span>
			<p class="media-used">10/02/2016</p>		

			<span>Status:</span>
			<p class="status">Active</p>

			<h3>History</h3>		
			<div class="media-history">
				
			</div>		
		</div>
		<div class="col-md-8">
			<h3>Product information</h3>
			<span>Name:</span>
			<div class="form-group">
				<input name="title" type="text" class="form-control product-title">
			</div>
			<span>URL:</span>

			<div class="form-group">
				<input name="url" type="text" class="form-control product-url">
			</div>			
			<span>Price:</span>
			<p class="product-price"></p>		
			<span class="img1">Photo of product:</span>	<br>				
            <span class="file-input btn btn-upload btn-file file-edit">
                <input name="summary_image" type="file" multiple>
                
            </span><br>
			<span>Description:</span>
			<div class="form-group">
				<textarea name="url" type="text" class="form-control product-url"></textarea>
			</div>					

		</div>
	</div>
	<?php include get_template_part('templates/infoModal'); ?>
	<?php include get_template_part('templates/confirmation-modal'); ?>

  </div><!-- /.content -->
</div><!-- /.wrap -->

<?php } else {?>

	<?php include get_template_part('templates/sessionClosed'); ?>

<?php } ?>