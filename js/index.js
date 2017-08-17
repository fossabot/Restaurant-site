$(function(){
  function loadGoogleMapAPI(){
    var script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAEgnNcLXu3TxudcgyN9DnQ7uUwWy1hIpI&callback=loadMaps";
    script.type = "text/javascript";
    script.id ="googleMap";
    document.getElementsByTagName("body")[0].append(script);
  }

  window.loadMaps = function (){
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 50.744973, lng: 25.322932},
      zoom: 17
    });

    var marker = new google.maps.Marker({
      position: {lat:50.745151, lng:25.322764},
      map: map,
      title: 'Our Restaurant'
    });
  };
  //map, that sliding from right side
  $('#text-location').click(function() {
    if(document.getElementById('googleMap')===null)
    {
      loadGoogleMapAPI();
    }
    $('#map').animate({marginLeft: '0'},800);
    $('.map-return').animate({marginLeft: '1%'},800);
  });
  //map, that sliding to right side
  $('.map-return').click(function() {
    $('#map').animate({marginLeft: '100%'},800);
    $('.map-return').animate({marginLeft: '101%'},800);
  });
}); 

$(function(){
  // Check the initial posistion of the Sticky Header
  stickyHeaderTop = $('header').offset().top;
  //If page open not top, then header must be top 
  if( $(window).scrollTop() > stickyHeaderTop ) {
    $('header').css({position: 'fixed', top: '0px'});
    $('.header-before-const').addClass('header-const');
  }
  //Sticky Header when scrolling
  $(window).scroll(function(){
    if( $(window).scrollTop() > stickyHeaderTop ) {
      $('header').css({position: 'fixed', top: '0px'});
      $('.header-before-const').addClass('header-const');
    } else {
      $('header').css({position: 'static'});
      $('.header-const').removeClass('header-const');
    }
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
});

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

/*//smooth scrolling by sections
$(function scrollScroll() {
  $.scrollify({
    section : ".big-size",
    easing : "swing",
    scrollSpeed : 1000,
    setHeights : false,
    offset : -$(window).height()*0.1,
    overflowScroll: true,
    updateHash : true,
  });

  scrollScroll();

  //Smooth scrolling to all links
  $(".navigation").click(function() {
    var hash = this.hash;// Store hash
    $('html, body').animate({function(){
      scrollTop: $(hash).offset().top-$('header').height();
      $.scrollify({
        standardScrollElements: "window"
      });}
    }, 1000, function(){});
    scrollScroll();
  });
});*/