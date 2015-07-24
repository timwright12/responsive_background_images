/*

  Responsive Background Image(s)
  version 0.1.0
  By Scott O'Hara & Sarah Canieso
  Copyright (c) 2015 Fresh Tilled Soil http://freshtilledsoil.com

  MIT License, http://www.opensource.org/licenses/mit-license.php


  Handy plug-in to load the appropriate background image for an element
  based on the screen size of the browser window on page load.


  Notes:

  Three main break points:
  small screen:    480px
  medium screen:   768px
  large screen:   1024px

  If a screen size starts off large and is then scaled down,
  we want to make sure not to download new assets, as there is no
  negative effect of scaling down a larger than needed image, if
  that image has already loaded.

  If a screen size starts off at medium, and then scales up,
  we will download the larger background image, as we don't
  want to scale up smaller images, as they will begin to degrade
  in quality.


  Expected Mark-up:

  <element class="responsive-bgi"
           data-img-small="url(...)"
           data-img-medium="url(...)"
           data-img-large="url(...)">

  Be sure to include a fall back in case of no JS
  <noscript>
      <div class="rbgi-fallback" style="background-image: url(..)"></div>
  </noscript>

*/

;(function ($) {

  'use strict';

  $.fn.responsiveBackgroundImage = function (options) {
    var settings = $.extend({
      breakSm: 480,
      breakMed: 768,
      breakLg: 1024
    }, options),

    win = $(window),
    currentImage = 'none',

    breakSm = settings.breakSm,
    breakMed = settings.breakMed,
    breakLg = settings.breakLg,

    checkImage = function () {

      var rbgis = {
            // grab the urls from the data attributes
            small: $(this).data('img-small'),
            medium: $(this).data('img-medium'),
            large: $(this).data('img-large')
          },

          currentWidth = win.width(),

          // placeholders for condition vars
          isGreaterThanMed,
          isLessThanMed,
          isGreaterThanSm,
          isLessThanSm;

        // function sourceTest() {
        //   if (!rbgis.small) {
        //     console.log('missing small image');
        //   }
        //   if (!rbgis.medium) {
        //     console.log('missing medium image');
        //   }
        //   if (!rbgis.large) {
        //     console.log('missing large image');
        //   }
        // }

        // only run if data attributes are set
        if (rbgis.small && rbgis.medium && rbgis.large) {

          if (currentImage === 'large') {
            win.off('resize.responsiveBackgroundImage');
          }

          // set our sizing conditions
          isGreaterThanMed = currentWidth >= breakMed;
          isLessThanMed = currentWidth <= breakMed;

          isGreaterThanSm = currentWidth >= breakSm;
          isLessThanSm = currentWidth <= breakSm;


          // check our conditions
          // if greater than the max medium breakpoint, load the largest image
          if (isGreaterThanMed) {
            currentImage = 'large';
            // console.log(currentImage);
          }

          // load/check medium
          else if (currentImage !== 'large' && isGreaterThanSm && isLessThanMed) {
            currentImage = 'medium';
            // console.log(currentImage);
          }

          // load/check small
          else if (currentImage === 'none' &&  isLessThanSm) {
            currentImage = 'small';
            // console.log(currentImage);
          }

          // set the appropriate background image
          // based on the currentImage value
          $(this).css('background-image', rbgis[currentImage]);
        }
        else {
          // sourceTest();
        }
    };




    return this.each(function() {
      // initial page load will place the appropriate image
      var $this = $(this),
          t,
          TIME_TO_APPLY = 300,


      resetTimer = function () {
        // console.log('reset');
        clearTimeout(t);
        t = setTimeout( applyTimer, TIME_TO_APPLY );
      },

      applyTimer = function () {
        // console.log('checking image');
        $this.each( checkImage );
      };

      // for each instance of .responsive-bgi, run the function
      $this.each( checkImage );

      win.on( 'resize.responsiveBackgroundImage', resetTimer.bind( this ) );
      applyTimer();

    });

  };

})( jQuery );


$(function() {
  $('.responsive-bgi').responsiveBackgroundImage();
});
