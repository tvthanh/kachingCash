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

	  <button type="button" class="btn btn-primary btn-tab-action pull-100-left edit">Edit</button>	
	  <button type="button" class="btn btn-danger btn-tab-action btn-del">Remove</button>	    
<form id="editProduct" data-parsley-validate>
	<div class="row product-edition">

		<div class="col-md-4">
			<div class="img"></div>
			<div class="img-edit">
	            <span class="file-input btn btn-upload btn-file file-edit">
	                <input id="changeProductImage" type="file" multiple>         
	            </span>
	        </div>
		</div>
		<div class="col-md-8">
			<div class="panel panel-default">
				<div class="panel-heading">Product details</div>
				<div class="panel-body">
					<div class="form-group">
						<label for="media-title">Name:</label>
						<input name="title" id="media-title" type="text" class="form-control editable" disabled required="">
					</div>
					<div class="form-group">
						<label for="product-url">URL:</label>
					    <div class="input-group">
					      <input name="url" type="text" id="product-url" class="form-control editable" placeholder="Search" disabled required="">
					      <div class="input-group-btn">
					        <button class="btn btn-default" type="button">Copy</button>
					      </div>
					    </div>							

					</div>
					<div class="form-group">
						<label for="product-price">Price in USD:</label>
				
						<input name="price" id="product-price" type="text" class="form-control editable" disabled required="">
					</div>
					<div class="form-group">
						<label for="product-description">Description:</label>
						<textarea name="description" rows="6" id="product-description" class="form-control editable" disabled required=""></textarea>
					</div>
					<div class="row">
						<div class="col-xs-12 col-md-6">
							<div class="form-group">
								<label for="media-added">Added date:</label>
								<input id="media-added" type="text" class="form-control" disabled>
							</div>							
						</div>
						<div class="col-xs-12 col-md-6">
							<div class="form-group">
								<label for="media-used">Last used date:</label>
								<input id="media-used" type="text" class="form-control" disabled>
							</div>							
						</div>
					</div>


					<div class="form-group">
						<label for="status">Status</label>
						<input id="status" type="text" class="form-control" disabled>
					</div>
			  </div>
			</div>		
		</div>

	</div>
</form>
	<?php include get_template_part('templates/confirmation-modal'); ?>
	<?php include get_template_part('templates/infoModal'); ?>

  </div><!-- /.content -->
</div><!-- /.wrap -->
<?php } else {?>

	<?php include get_template_part('templates/sessionClosed'); ?>

<?php } ?>