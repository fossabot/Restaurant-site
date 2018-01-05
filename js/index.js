function loadGoogleMapAPI(){
  var script = document.createElement("script");
  script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAEgnNcLXu3TxudcgyN9DnQ7uUwWy1hIpI&callback=loadMaps";
  script.type = "text/javascript";
  script.id ="googleMap";
  document.getElementsByTagName("body")[0].append(script);
}

window.loadMaps = function (){
  var map = new google.maps.Map(document.getElementById('map-canvas'), {
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
  $('#map-canvas').css({marginLeft:'0', width:'100%'});

  if(document.getElementById('googleMap')===null){
    loadGoogleMapAPI();
  };
  $('.map-button').css({marginLeft: '2.5%'});
});

/*map, that sliding to right side*/
$('.map-return').click(function() {
  $('#map-canvas').css({width: '0', marginLeft: '100%'});
  setTimeout(function(){
    changeZIndex(5);
  },1700);
  $('.fa-chevron-right').css({transform: 'rotate(180deg)'});
  $('.map-button').css({marginLeft: '-20%'});
  setTimeout(function(){
    $('.fa-chevron-right').css({transform: 'rotate(0deg)'});
  },1500);
});

//Check the initial posistion of the Sticky Header
var stickyHeaderTop = $('.header-before-const').offset().top;
  
//If page open not top, then header must be top 
$(function(){
  if( $(window).scrollTop() > stickyHeaderTop ) {
    $('#header').css({position: 'fixed', top: '0px'});
  } else{
    $('#header').css({position: 'absolute', top: '90%'});
  }

  highlighting();
});

$(window).scroll(function(){
  //Sticky Header when scrolling
  if( $(window).scrollTop() > stickyHeaderTop ) {
    $('#header').css({position:'fixed',top: '0px'});
  } else {
    $('#header').css({position:'absolute',top: '90%'});
  };

  highlighting();
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
function lazyLoad(){
  ;(function() {
    var bLazy = new Blazy({
      success: function(){
            $('.salads').css({backgroundPosition : '0 79.646429%'});
            $('.soups').css({backgroundPosition : '0 99.744127%'});
            $('.main-dishes').css({backgroundPosition : '0 59.792388%'});
            $('.appetizer').css({backgroundPosition : '0 0%'});
            $('.desserts').css({backgroundPosition : '0 40.195394%'});
            $('.beverages').css({backgroundPosition : '0 20.097697%'});
            $('.small-menu-container').css({backgroundSize: '110%'});
          },
      breakpoints: [
        {
          width: 1200, 
          src: 'data-src-medium',
          success: function(){
            $('.salads').css({backgroundPosition : '0 79.436828%'});
            $('.soups').css({backgroundPosition : '0 99.592442%'});
            $('.main-dishes').css({backgroundPosition : '0 59.977949%'});
            $('.appetizer').css({backgroundPosition : '0 0%'});
            $('.desserts').css({backgroundPosition : '0 40.311226%'});
            $('.beverages').css({backgroundPosition : '0 20.155613%'});
            $('.small-menu-container').css({backgroundSize: '100%'});
          }
        }
      ],
      offset: 1000
    });
  })();
}

lazyLoad();

/*//Smooth scrolling by sections
$(function scrollScroll() {
  $.scrollify({
    section : ".big-size",
    easing : "swing",
    scrollSpeed : 1000,
    setHeights : false,
    offset : -$('#header').height(),
    overflowScroll: true,
    updateHash : true,
  });
});*/

//Smooth scrolling to all links
$(".navigation").click(function() {
  var hash = this.hash;// Store hash
  $('html, body').animate({
    scrollTop: $(hash).offset().top-$('#header').height()
   }, 'slow', function(){});
});




var cloneMenuContainer, cloneContactContainer;

var mediumMenuContainer = document.getElementById('medium-menu-container');
var mediumContactContainer = document.getElementById('medium-contact-container');

var menuContainer = document.getElementById('container-menu');
var contactContainer = document.getElementById('container-contact');

$(function(){
  cloneMenuContainer = menuContainer.cloneNode(true);
  cloneContactContainer = contactContainer.cloneNode(true);
  if(window.screen.orientation.type == 'portrait-primary'){
    var elMenu = document.getElementById('container-menu');
    var elContact = document.getElementById('container-contact');

    cloneMenu = elMenu.cloneNode();
    cloneContact = elContact.cloneNode();

    unwrapContainer(elMenu);
    unwrapContainer(elContact);
  }
});

window.addEventListener('orientationchange', function(){
  console.log(window.screen.orientation.type);
  if(window.screen.orientation.type == 'portrait-primary'){
    var menuContainer = document.getElementById('container-menu');
    var contactContainer = document.getElementById('container-contact');
    
    cloneMenuContainer = menuContainer.cloneNode(true);
    cloneContactContainer = contactContainer.cloneNode(true);

    var elMenu = document.getElementById('container-menu');
    var elContact = document.getElementById('container-contact');

    unwrapContainer(elMenu);
    unwrapContainer(elContact);
  } else {
    replaceToPrevious(mediumMenuContainer, cloneMenuContainer);
    replaceToPrevious(mediumContactContainer, cloneContactContainer);
  }
  lazyLoad();
}, false);

/*remove Container if screen orientation in landscape mode*/
function unwrapContainer(el){
  var parent = el.parentNode;
  while (el.firstChild) parent.insertBefore(el.firstChild, el);
  parent.removeChild(el);
}

/*Return Container for portrait mode*/
function  replaceToPrevious(parent, newNode){
  parent.innerHTML = '';//clear parent inner node
  parent.appendChild(newNode);//append old node instead empty place
}
