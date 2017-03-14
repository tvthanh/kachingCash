<?php
/**
 * Plugin Name: KaChing Post Types
 * Description: Registers custom post post types.
 * Version: 1.0
 */

function kaching_post_types() {
	$labels = array(
 		'name' => 'FAQ',
    	'singular_name' => 'FAQ',
    	'add_new' => 'Add New FAQ',
    	'add_new_item' => 'Add New FAQ',
    	'edit_item' => 'Edit FAQ',
    	'new_item' => 'New FAQ',
    	'all_items' => 'All FAQs',
    	'view_item' => 'View FAQ',
    	'search_items' => 'Search FAQs',
    	'not_found' =>  'No FAQ Found',
    	'not_found_in_trash' => 'No FAQ found in Trash',
    	'parent_item_colon' => '',
    	'menu_name' => 'FAQ'
    );
	register_post_type( 'kaching_faq', array(
		'labels' => $labels,
		'has_archive' => true,
 		'public' => true,
        'hierarchical' => false,
		'supports' => array( 'title', 'editor'),
		'taxonomies' => array(),
		'capability_type' => 'post',
		'rewrite' => array( 'slug' => 'faq' )
	));
}
add_action( 'init', 'kaching_post_types' );


function kaching_post_types_flush_rewrite() {
    kaching_post_types();
    flush_rewrite_rules();
}
register_activation_hook( __FILE__, 'kaching_post_types_flush_rewrite' );
