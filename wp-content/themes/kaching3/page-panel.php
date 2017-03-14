<?php
/**
 * Template Name: Panel app
 */
?>

<?php get_header(); ?>


<!-- <div ng-include src="'<?php echo home_url(get_template_directory_uri()); ?>/assets/js/panel-module/templates.html'"></div> -->
<div ng-include src="'<?php echo home_url(get_template_directory_uri()); ?>/assets/kaching/panel-module/templates.html'"></div>
<div class="container-fluid main-container">
    <div class="row container-full-page clearfix">
        <div class="col-md-3 col-lg-2 sidebar-area">
            <div id="view-header" ui-view="header"></div>
        </div>
        <div class="col-md-9 col-lg-10 content content-area">
            <div id="view-master" ui-view="main"></div>
        </div>
        <?php get_footer(); ?>
    </div>
</div>
