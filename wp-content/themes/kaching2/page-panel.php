<?php
/**
 * Template Name: Panel app
 */
?>

<?php get_header(); ?>


<div ng-include src="'<?php echo home_url(get_template_directory_uri()); ?>/assets/js/panel-module/templates.html'"></div>
<div id="view-header" ui-view="header"></div>
<div id="view-master" ui-view="main"></div>

<?php get_footer(); ?>