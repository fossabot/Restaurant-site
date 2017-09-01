function loadGoogleMapAPI(){
  var script = document.createElement("script");
  script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAEgnNcLXu3TxudcgyN9DnQ7uUwWy1hIpI&callback=loadMaps";
  script.type = "text/javascript";
  script.id ="googleMap";
  document.getElementsByTagName("body")[0].append(script);
}

window.loadMaps = function (){
  var map = new google.maps.Map(document.getElementById('map_canvas'), {
    center: {lat:50.745151, lng:25.322764},
    zoom: 17,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false
  });

  var marker = new google.maps.Marker({
    position: {lat:50.745151, lng:25.322764},
    map: map,
    title: 'Our Restaurant'
  });

  google.maps.event.addDomListener(map, 'idle', function() {
    google.maps.event.trigger(map, 'resize');
  });
};

function changeZIndex(IndexZ){
  var mapIndex = document.getElementsByClassName('map-wrapper'); 
  if (mapIndex.length > 0) {
    mapIndex[0].style.zIndex = IndexZ;
  }
}

//Highlighting  of active menu item
function highlighting  (){ 
  var scroll_top = $(document).scrollTop();
  $("nav a").each(function(){
    var target = $($(this).attr("href")); 
    if (target.position().top - target.height() <= scroll_top && target.position().top - $('header').height() >= scroll_top) {
      $("nav a.navigation-active").removeClass("navigation-active");
      $(this).addClass("navigation-active");
    } else {
      $(this).removeClass("navigation-active");
    }
  });
}

//map, that sliding from right side
$('#text-location').click(function() {
  changeZIndex(11);
  $('#map_canvas').css({marginLeft:'0', width:'100%'});

  if(document.getElementById('googleMap')===null){
    loadGoogleMapAPI();
  };
  $('.map-button').css({marginLeft: '2.5%'});
});

//map, that sliding to right side
$('.map-return').click(function() {
  $('#map_canvas').css({width: '0', marginLeft: '100%'});
  setTimeout(function(){
    changeZIndex(5);
  },1700);
  $('.fa-chevron-right').css({transform: 'rotate(180deg)'});
  $('.map-button').css({marginLeft: '-10%'});
  setTimeout(function(){
    $('.fa-chevron-right').css({transform: 'rotate(0deg)'});
  },1500);
});

$(function(){
  //Check the initial posistion of the Sticky Header
  var stickyHeaderTop = $('header').offset().top;
  //If page open not top, then header must be top 
  if( $(window).scrollTop() > stickyHeaderTop ) {
    $('header').css({position: 'fixed', top: '0px'});
    $('.header-before-const').addClass('header-const');
  }
  
  highlighting ();

  $(window).scroll(function(){
    //Sticky Header when scrolling
    if( $(window).scrollTop() > stickyHeaderTop ) {
      $('header').css({position: 'fixed', top: '0px'});
      $('.header-before-const').addClass('header-const');
    } else {
      $('header').css({position: 'static'});
      $('.header-const').removeClass('header-const');
    };

    highlighting();
  });
});

var menuF = $('.false-container');
var menuT = $('.small-menu-container > h1');
var menuC = $('.small-menu-container');
var titleM = $('.big-menu-container > h1');

function fadeMenuTypes (){
  $(menuF).fadeToggle(1000, function(){
    //setTimeout(2000,function(){$(this).detach()})
  });
  $(menuT).fadeToggle(1000, function(){
    //setTimeout(2000,function(){$(this).detach()})
  });
  $(menuC).fadeToggle(1000, function(){
    //setTimeout(2000,function(){$(this).detach()})
  });
  $(titleM).fadeToggle(1000, function(){
      
  });
}  

menuF.click(function() {
  fadeMenuTypes(); 
});
menuT.click(function() {
  fadeMenuTypes(); 
});

//Lazy-load of images
;(function() {
  var bLazy = new Blazy({
    breakpoints: [
      {
        width: 1200, 
        src: 'data-src-medium'
      }
    ],
    offset: 1000
  });
})();

//Smooth scrolling by sections
$(function scrollScroll() {
  $.scrollify({
    section : ".big-size",
    easing : "swing",
    scrollSpeed : 1000,
    setHeights : false,
    offset : -$('header').height(),
    overflowScroll: true,
    updateHash : true,
  });
});

//Smooth scrolling to all links
$(".navigation").click(function() {
  var hash = this.hash;// Store hash
  $('html, body').animate({
    scrollTop: $(hash).offset().top-$('header').height()
   }, 'slow', function(){});
});

