<footer class="content-info footer <?php if(is_front_page()){ echo "front-footer";} ?>" role="contentinfo">
  <div class="container clearfix">
    <?php dynamic_sidebar('sidebar-footer'); ?>

    <?php
    if (has_nav_menu('footer_navigation')) :
      wp_nav_menu(['theme_location' => 'footer_navigation', 'menu_class' => 'nav pull-left']);
    endif;
    ?>

    
    <p class="pull-right">© KaChing</p>
    <ul class="footer-social pull-right">
      <li><a href="" target="_blank" class="icoFacebook" title="Facebook"><i class="icon-ic-facebook"></i></a></li>
      <li><a href="" class="icoTwitter" target="_blank" title="Twitter"><i class="icon-ic-twitter"></i></a></li>
      <li><a href="" target="_blank" class="icoGoogle" title="Google"><i class="icon-ic-google"></i></a></li>
    </ul> 
    
  	

    
  </div>
</footer>
