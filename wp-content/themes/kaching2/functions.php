<?php

function kaching_theme_setup() {

    add_theme_support( 'menus' );

    register_nav_menu( 'footer_navigation', 'Footer navigation' );
    register_nav_menu( 'main_navigation', 'Main navigation' );
}
add_action( 'after_setup_theme', 'kaching_theme_setup' );

function kaching_enqueue_scripts() {

    wp_enqueue_style('main-css', get_template_directory_uri() . '/dist/css/main.css', false, null);
    wp_enqueue_style('libs-css', get_template_directory_uri() . '/dist/css/libs.css', false, null);

    if (is_single() && comments_open() && get_option('thread_comments')) {
        wp_enqueue_script('comment-reply');
    }

    // wp_enqueue_script ( $handle, $src, $deps, $ver, $in_footer );
    // wp_enqueue_script('modernizr', get_template_directory_uri() . '/dist/scripts/modernizr.js', [], null, false);
    wp_enqueue_script('braintreeJs', 'https://js.braintreegateway.com/js/braintree-2.24.1.min.js', null, null, true);
    wp_enqueue_script('libsCoreJs', get_template_directory_uri() . '/dist/js/libsCore.js', ['jquery'], null, true);
    wp_enqueue_script('libsPanelJs', get_template_directory_uri() . '/dist/js/libsPanel.js',   ['libsCoreJs'], null, true);
    wp_enqueue_script('kachingTmpl', get_template_directory_uri() . '/dist/js/kachingTmpl.js',   ['libsCoreJs'], null, true);
    wp_enqueue_script('kachingCoreJs', get_template_directory_uri() . '/dist/js/kachingCore.min.js', ['kachingTmpl', 'libsCoreJs', 'libsPanelJs', 'braintreeJs'], null, true);
    //wp_enqueue_script('panelAppJs', get_template_directory_uri() . '/dist/js/panelApp.js', ['libsPanelJs'], null, true); // lazy loaded later on
}
add_action('wp_enqueue_scripts', 'kaching_enqueue_scripts', 100);


add_action( 'wp_ajax_kaching_main_menu', 'ajax_main_menu' );
add_action( 'wp_ajax_nopriv_kaching_main_menu', 'ajax_main_menu' );

function ajax_main_menu () {

    if (has_nav_menu('main_navigation')) {
        wp_nav_menu([
            'theme_location' => 'main_navigation',
            'menu_class' => 'site-nav',
            'container' => false
        ]);
    }

    wp_die();
}

