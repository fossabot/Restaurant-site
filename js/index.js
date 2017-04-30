
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
          center: {lat: 50.744973, lng: 25.322932},
          zoom: 17
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
    if (this.hash !== "") {
      var hash = this.hash;// Store hash
      $('html, body').animate({
        scrollTop: $(hash).offset().top-$('.header').height()
      }, 1000, function(){});
    };
  });
  $('#text-location').click(function() {
    $('#map').animate({marginLeft: '0'},800,function(){});
  });
});
