<?php get_header(); ?>

<body <?php body_class(); ?> ng-controller="kachingCoreCtrl">

<!--[if lt IE 9]>
<div class="alert alert-warning"><?php _e('You are using an <strong>outdated</strong> browser. Please <a
    href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.', 'sage'); ?>
</div>
<![endif]-->

<?php
//if (is_front_page()) {
//    get_template_part('template-parts/site-header-home');
//} else {
//    get_template_part('template-parts/site-header');
//}
?>

<div ui-view></div>

<?php wp_footer(); ?>

</body>
</html>
