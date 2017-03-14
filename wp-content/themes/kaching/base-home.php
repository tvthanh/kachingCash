<?php

use Roots\Sage\Config;
use Roots\Sage\Wrapper;

?>

<!doctype html>
<html class="no-js" <?php language_attributes(); ?>>
  <?php get_template_part('templates/head'); ?>
  <body <?php body_class(); ?>>
    <!--[if lt IE 9]>
      <div class="alert alert-warning">
        <?php _e('You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.', 'sage'); ?>
      </div>
    <![endif]-->
  <header class="home-banner" role="banner">
    <?php 
        if(isset($_COOKIE["username"])){
    ?>    
    <?php
      do_action('get_header');
      get_template_part('templates/header');
    ?>
    <?php
    } else {
    ?>    
    <nav class="navbar navbar-home">
      <div class="container">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
          <!-- <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button> -->
          <a class="navbar-brand btn-move" href="<?= esc_url(home_url('/')); ?>">
            <img id="logo" src="<?php bloginfo('template_url'); ?>/assets/images/logo.png" alt=""> 
          </a>
        </div>
        
        <!-- <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul class="nav navbar-nav navbar-right">
            <li class="dropdown dropdown-inverse">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Username <span class="caret"></span></a>
              <ul class="dropdown-menu">
                <li><a href="#">Settings</a></li>
                <li><a href="#">Sign out</a></li>
              </ul>
            </li>
          </ul>
        </div> -->

        <div>
          <ul class="nav navbar-nav navbar-right">
            <!-- <li class="hidden-xs"><label>Developers section</label></li> -->
            <?php 
              if(!isset($_COOKIE["username"])){
          ?>
          <li>
            <a href="#" class="signinbtn" role="button" type="button" data-toggle="modal" data-target="#myModal">Sign In</a>
          </li>
          <li>
            <a href="#" class="signupbtn" role="button" type="button" data-toggle="modal" data-target="#myModal2">Sign Up</a>
          </li>
          <?php
          } else {
          ?>
            <li>
              <a href="#" id="signout" role="button" type="button">Sign Out</a>
            </li>
          <?php
          }
        ?>
          </ul>
        </div>
      </div>
    </nav>  
      <?php
      }
    ?>      
    <?php include Wrapper\template_path(); ?>
    
    <?php
      do_action('get_footer');
      get_template_part('templates/footer');
      wp_footer();
    ?>

    <?php include get_template_part('templates/sign-in-modal'); ?>
    <?php include get_template_part('templates/sign-up-modal'); ?>
    <?php include get_template_part('templates/register-success-modal'); ?>
    <?php include get_template_part('templates/reset-pass-modal'); ?>   
    <?php include get_template_part('templates/pass-success-modal'); ?>    
  </body>
</html>
