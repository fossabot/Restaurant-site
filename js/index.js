$(document).ready(function(){
  // Add smooth scrolling to all links
  $(".navigation").click(function() {
      var hash = this.hash;// Store hash
      $('html, body').animate({
        scrollTop: $(hash).offset().top-$('header').height()
      }, 1000, function(){});
  });

  //map, that sliding from right side
  $('#text-location').click(function() {
    $('#map').animate({marginLeft: '0'},800);
    $('.map-return').animate({marginLeft: '1%'},800);
  });
  //map, that sliding to right side
  $('.map-return').click(function() {
    $('#map').animate({marginLeft: '100%'},800);
    $('.map-return').animate({marginLeft: '101%'},800);
  });
});

var map;
  var restourantPoint={lat:50.745151, lng:25.322764};
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
  };

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
  };  

  menuF.click(function() {
    fadeMenuTypes();
  });
  menuT.click(function() {
    fadeMenuTypes(); 
  });
});

