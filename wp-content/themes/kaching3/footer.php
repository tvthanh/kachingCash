
<?php if ( !is_front_page() ) { ?>
    <footer class="content-info footer col-md-3 col-lg-2 <?php if ( is_front_page() ) echo 'front-footer'; ?>" role="contentinfo">
        <!-- <div class="container clearfix"> -->
            <?php
            // if (has_nav_menu('footer_navigation')) {
            //     wp_nav_menu(['theme_location' => 'footer_navigation', 'menu_class' => 'nav pull-left']);
            // }
            ?>
            <p>© 2016 KaChing</p>
            <!--
            <ul class="footer-social pull-right">
                <li><a href="" target="_blank" class="icoFacebook" title="Facebook"><i class="icon-ic-facebook"></i></a></li>
                <li><a href="" class="icoTwitter" target="_blank" title="Twitter"><i class="icon-ic-twitter"></i></a></li>
                <li><a href="" target="_blank" class="icoGoogle" title="Google"><i class="icon-ic-google"></i></a></li>
            </ul>
            -->
        <!-- </div> -->
    </footer>
<?php } ?>

    <?php wp_footer(); ?>

    <?php if ( is_front_page() ) { ?>
    <style type="text/css">

      .typed-cursor{
          opacity: 1;
          -webkit-animation: blink 1s infinite;
          -moz-animation: blink 1s infinite;
          animation: blink 1s infinite;
      }
      @keyframes blink{
          0% { opacity:1; }
          50% { opacity:0; }
          100% { opacity:1; }
      }
      @-webkit-keyframes blink{
          0% { opacity:1; }
          50% { opacity:0; }
          100% { opacity:1; }
      }
      @-moz-keyframes blink{
          0% { opacity:1; }
          50% { opacity:0; }
          100% { opacity:1; }
      }
      #typeAnimation span{
        display: none;
      }
      #typeAnimation .block{
        display: inline-block !important;
      }

    </style>
    <?php } ?>

    <script type="text/javascript">

      (function($) {
          var wow = new WOW({
              boxClass: 'wow', // animated element css class (default is wow)
              animateClass: 'animated', // animation css class (default is animated)
              offset: 0, // distance to the element when triggering the animation (default is 0)
              mobile: false, // trigger animations on mobile devices (default is true)
              live: true, // act on asynchronously loaded content (default is true)
              callback: function(box) {
                  // the callback is fired every time an animation is started
                  // the argument that is passed in is the DOM node being animated
              },
              scrollContainer: null // optional scroll container selector, otherwise use window
          });
          wow.init();
      })(jQuery);

      <?php if ( is_front_page() ) { ?>
      (function($){

          $(window).resize(function() {
              resizeRectangle();
          });

          resizeRectangle();

          function resizeRectangle(){
              var width = $('body').innerWidth();
              $('.top-rectangle').css('border-left-width', width);
              $('.bottom-rectangle').css('border-right-width', width);
          }

          var typedHeading = $('#typedHeading');
          var partnerCardAnimate = false;
          var developerCardAnimate = false;

          $('#card-bussiness-partner')
              .mouseenter(function(){

                  var str = 'Business Partner',
                      i = 0,
                      text = '';

                  partnerCardAnimate = true;

                  (function type() {
                      if ( !partnerCardAnimate ) return;
                      text = str.slice(0, ++i);
                      typedHeading.text( text );
                      if ( text === str ) return;
                      setTimeout( type, 80 );
                  })();
              })
              .mouseleave(function(){
                  partnerCardAnimate = false;
                  typedHeading.text( '' );
              });

          $('#card-developer')
              .mouseenter(function(){

                  var str = 'Developer',
                      i = 0,
                      text = '';

                  developerCardAnimate = true;

                  (function type() {
                      if ( !developerCardAnimate ) return;
                      text = str.slice(0, ++i);
                      typedHeading.text( text );
                      if ( text === str ) return;
                      setTimeout( type, 80 );
                  })();
              })
              .mouseleave(function(){
                  developerCardAnimate = false;
                  typedHeading.text( '' );
              });

          $('li.tab-link').click(function(){
              var tab_id = $(this).attr('data-tab');
              $('.tab-link').removeClass('active');
              $('.tab-content').removeClass('current');
              $("#"+tab_id).addClass('current');
              $(this).addClass('active');
          });

          $('.single-item').slick({
              draggable: false,
              arrows: false,
              dots: true
          });

      })(jQuery);
      <?php } ?>

    </script>

</body>
</html>
