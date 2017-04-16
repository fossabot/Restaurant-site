
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
                } else {
                        $('.header').css({position: 'static', top: '0px'});
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