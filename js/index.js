
/*$(window).scroll(function () {
    if( $(window).scrollTop() > $('.header').offset().top && !($('.header').hasClass('headerFixedTop'))){
    $('.header').addClass('headerFixedTop');
    } else if ($(window).scrollTop() == 0){
    $('.header').removeClass('headerFixedTop');
    }
});*/

$(function(){
        // Check the initial Poistion of the Sticky Header
        var stickyHeaderTop = $('.header').offset().top;
 
        $(window).scroll(function(){
                if( $(window).scrollTop() > stickyHeaderTop ) {
                        $('.header').css({position: 'fixed', top: '0px'});
                        $('.header-before-const').addClass('header-const');
                } else {
                        $('.header').css({position: 'static', top: '0px'});
                        $('.header-const').removeClass('header-const');
                }
        });
  });

var map;
var restourantPoint={lat:50.745151, lng:25.322764}
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 50.7472, lng: 25.3254},
          zoom: 15
        });

        var marker = new google.maps.Marker({
   			position: restourantPoint,
    		map: map,
    		title: 'Our Restaurant'
 		});
      }

$(document).ready(function(){
  // Add smooth scrolling to all links
  $("a").on('click', function(event) {

    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 1000, function(){
   
        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    } // End if
  });
});