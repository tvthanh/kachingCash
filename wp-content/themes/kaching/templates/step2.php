<div class="row">
    <div class="col-lg-12">
		<h3>Campaign Media</h3>
    </div>
    <div class="col-md-12 validate2step" data-parsley-validate>
    	<div class="form-group">
            <input id="media_title" type="text" required="" class="form-control" placeholder="Title inside application">
        </div>
    	<div class="form-group">
            <textarea id="media_description" type="text" required="" class="form-control" placeholder="Description inside application"></textarea>
        </div>	  			                           

    </div>
    <!-- <form id="newmedia"> -->
    <div class="col-md-12">
        <h3>Media information</h3>
    </div>

    <div id="addmediacontent" class="form-container">
        <form id="addmediaform" data-parsley-validate>
      <div class="col-md-8">

        <div class="form-group">
              <input id="medianame" required="" type="text" class="form-control media-title" placeholder="Name your media">
          </div>
                         
          <div class="form-group">
            <span class="file-input btn btn-block btn-upload btn-file video-1">

                <span class="resolution"><br>VIDEO 16:9</span> <input data-type="video" accept="video/mp4, video/ogg, video/webm, video/mov" name="video" id="video" required="" type="file" multiple>
            </span>
          </div>
          <div class="form-group upload-holder">
            <span class="file-input btn btn-upload btn-file file-1">
                <span class="resolution"><br>320x300</span> <input data-width="320" accept="image/png, image/jpg, image/jpeg" data-height="300" data-type="image" name="summary_image" required="" id="summary_image" type="file" multiple>
            </span>

            <span class="file-input btn btn-upload btn-file file-2">
                <span class="resolution"><br>260x170</span> <input data-width="260" accept="image/png, image/jpg, image/jpeg" data-height="170" data-type="image" name="landscape" required="" id="landscape" type="file" multiple>
            </span>

            <span class="file-input btn btn-upload btn-file file-3">
                <span class="resolution"><br>100x160</span> <input data-width="100" accept="image/png, image/jpg, image/jpeg" data-height="160" data-type="image" name="portrait" required="" id="portrait" type="file" multiple>
            </span>
          </div>                                          
      </div>
      </form>
      <div class="col-md-4">
        <div class="form-group">
          <button class="btn btn-default btn-form" data-toggle="modal" data-target="#mediaLibraryModal">Add media from library</button>
        </div>       
        <div class="form-group">
          <button id="savemediafromform" class="btn btn-primary btn-form">Upload media</button>
        </div>

        <div class="progress">
          <div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%">
            <span class="sr-only">0% Complete</span>
          </div>
        </div>       

      </div>            

    </div>
    <div id="showmediacontent" class="hidden">
      <div class="col-md-8">    
          <p class="media-title"></p>
          <video class="videoSrc" type="video/mp4" controls>
          </video>

          <div class="images-container">
              <div class="image-container-1"></div>
              <div class="image-container-2"></div>
              <div class="image-container-3"></div>
          </div> 
      </div>
      <div class="col-md-4">
        <div class="form-group">
          <button class="btn btn-primary btn-form" data-toggle="modal" data-target="#mediaLibraryModal">Add media from library</button>
        </div>                      
      </div>        
    </div>



    <!-- </form>     -->
    <!-- <div class="col-md-4"></div> -->
</div>
<div class="row steps-footer">
    <div class="col-md-12">
        <div class="pull-right">
            <a class="btn btn-default" data-step="1">Previous step</a>
            <a id="savestep2" class="btn btn-primary">Next step</a>        
        </div>
    </div>
</div>