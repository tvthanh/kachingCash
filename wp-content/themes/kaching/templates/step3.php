<!-- <div class="row">
    <div class="col-lg-12">
		<h3>Recomended Products</h3>
    </div>
</div>
<div class="row">
	<div class="col-md-2 product-image">
		
	</div>
</div> -->
    <div class="row">
	<div class="col-md-12">
		<h3>Product information</h3>
	</div>
    </div>
    <div id="productwithform" data-parsley-validate>
    <div class="row">
        <div class="col-md-8">
        	<div class="form-group">
                <input id="product-title" type="text" required="" class="form-control product-title" placeholder="Name of product">
            </div>
        </div>
        <div class="col-md-4">
        	<div class="form-group">
        		<button class="btn btn-default btn-form"  data-toggle="modal" data-target="#productLibraryModal">Add product from library</button>
        	</div>	                    	
        </div>
    </div>
    <div class="row">        
        <div class="col-md-8">
        	<div class="form-group">
                <input id="product-url" data-parsley-type="url" parsley-type="urlstrict" type="text" required="" class="form-control product-url" placeholder="Product URL">
            </div>
        </div>
        <div class="col-md-4">
        	<div class="form-group">
        		<input id="product-price" data-parsley-type="number" type="text" required="" class="form-control product-price" placeholder="Product price" >
        	</div>	                    	
        </div>		                	
    </div>        
        <div class="row">
          <div class="col-md-2">
            <span class="file-input btn btn-upload btn-file btn-block product-image-upload file-edit">
                <span class="resolution">100x160</span> <input id="product-image" required="" name="image" type="file" multiple>
            </span>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <textarea id="product-description" required="" name="description" type="text" class="form-control product-description" placeholder="Description" required="" data-parsley-maxlength="32" data-parsley-required-message="Required."></textarea>
            </div>
          </div>
            <div class="col-md-4">
                <div class="form-group">
                    <button class="btn btn-primary btn-form"  data-toggle="modal" id="saveproductfromform">Save product</button>
                </div>                          
            </div>             
        </div>
    </div>
    <div id="withproductlibrary" class="hidden">
    <div class="row">
        <div class="col-md-8">    
            <span>Name:</span>
            <p class="media-title"></p>
        </div>
        <div class="col-md-4">
            <div class="form-group">
                <button class="btn btn-primary btn-form"  data-toggle="modal" data-target="#productLibraryModal">Add product from library</button>
            </div>                          
        </div>
    </div>
    <div class="row">
        <div class="col-md-8">                
            <span>URL:</span>
            <p class="product-url"></p>
        </div>
        <div class="col-md-4">
            <span>Price:</span>
            <p class="product-price"></p>
        </div>       
    </div>

        <div class="row row-min">
          <div class="col-md-2 min-padding">        
            <span class="img1">Photo of product:</span>              
          </div>
          <div class="col-md-10 min-padding">
            <span>Description:</span>
            <p class="product-description"></p>   
          </div>
       
        </div>
    </div>

<div class="row steps-footer">
    <div class="col-md-12">
        <div class="pull-right">
            <a class="btn btn-default" data-step="2">Previous step</a>
            <a id="savestep3" class="btn btn-primary">Next step</a>        
        </div>
    </div>
</div>