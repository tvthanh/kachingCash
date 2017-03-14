<?php

$query_params_js = array();
foreach ( $_GET as $key => $val ) {
    $key = esc_js($key);
    $val = esc_js($val);
    array_push( $query_params_js, "$key: '$val'" );
}
$query_params_js = implode( ', ', $query_params_js );

?>

<!doctype html>
<html class="no-js" <?php language_attributes(); ?> ng-app="kachingCore">

<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="shortcut icon" type="image/x-icon"
          href="<?php echo home_url(get_template_directory_uri()); ?>/favicon.ico"/>

    <title panel-title><?php wp_title('&ndash;', true, 'right'); ?><?php bloginfo('name'); ?></title>
    <!-- <script type="text/javascript" src="https://maps.google.com/maps/api/js?libraries=places"></script> -->
    <script type="text/javascript" src="https://maps.google.com/maps/api/js?sensor=true&libraries=places&key=AIzaSyBZkLVUDzFY3sBNZEhC0AqfnmW2q_Fxfxc&language=en"></script>
    <!-- <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAYogQ-EUw8rpRqTj6LzcCTHnpHoJGBqGc&libraries=places&callback=initMap"></script> -->
    <script type="text/javascript">
        var ajaxurl = "<?php echo home_url(admin_url('admin-ajax.php')); ?>";
        var templateDirUri = '<?php echo home_url(get_template_directory_uri()); ?>';
        var kachingAppConfig = {
            isPanelPage: <?php echo is_page_template('page-panel.php') ? "true" : "false" ?>,
            isHomePage: <?php echo is_front_page() ? "true" : "false" ?>,
            wpTemplateUri: '<?php echo home_url(get_template_directory_uri()); ?>',
            homeUrl: '<?php echo trailingslashit(home_url()); ?>',
            panelUrl: '<?php echo trailingslashit(home_url('panel')); ?>',
            // apiUrl: '<?php echo 'http://api-staging.kachingcash.com/cms-api'; ?>',
            apiUrl: '<?php echo KACHING_CMS_API_URL; ?>',
            ulabApiUrl: '<?php echo 'http://search.ulab.com'; ?>',
            mainMenuTmpl: ajaxurl + '?action=kaching_main_menu'
        };
        var kachingQueryParams = { <?php echo $query_params_js; ?> };

        function jsonpCallback(data) {
            kachingAppConfig.localeData = data;
        };

    </script>

    <script src="http://ipinfo.io?callback=jsonpCallback"
        type="text/javascript">
    </script>

    <?php wp_head(); ?>

    <!-- <base href="/"> -->
</head>

<body <?php body_class(); ?> ng-controller="kachingCoreCtrl">
    <div id="alerts-container"></div>

    <!--[if lt IE 9]>
        <div class="alert alert-warning"><?php _e('You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.', 'sage'); ?></div>
    <![endif]-->

    <?php
    // if ( is_front_page() ) {
    //     get_template_part('template-parts/site-header-home');
    // } else {
    //     get_template_part('template-parts/site-header');
    // }
    ?>
