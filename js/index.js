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
  }
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
  }

  highlighting();
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
  console.log(window.screen.orientation.type);
  cloneMenuContainer = menuContainer.cloneNode(true);
  cloneContactContainer = contactContainer.cloneNode(true);
  console.log(window.innerWidth);
  if(window.screen.orientation.type == 'portrait-primary' || window.innerWidth >= 1024){
    saveNodeAndUnwrapContainers();
  }
});

window.addEventListener('orientationchange', function(){
  console.log(window.screen.orientation.type);
  if(window.screen.orientation.type == 'portrait-primary'){
    saveNodeAndUnwrapContainers();
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

function saveNodeAndUnwrapContainers (){
  var menuContainer = document.getElementById('container-menu');
  var contactContainer = document.getElementById('container-contact');
    
  cloneMenuContainer = menuContainer.cloneNode(true);
  cloneContactContainer = contactContainer.cloneNode(true);

  unwrapContainer(menuContainer);
  unwrapContainer(contactContainer);
}


var backMenuButton = document.getElementById('menu-back-button');
var menuPhotoContainer = document.getElementById('menu-dish-photo-container');
var menuListContainer = document.getElementById('menu-dish-list-container');
var menuMainTitle = document.getElementById('menu-main-title');
var photoContainer = document.getElementById('menu-dish-photo');
var dishIngredients = document.getElementById('menu-dish-ingredients');
var menuDishList = document.getElementById('menu-dish-list');
var menuListItem = document.getElementsByClassName('menu-dish-list-item');
var containerMenu = document.getElementById('container-menu');
var smallMenuContainer = document.getElementsByClassName('small-menu-container');
var menuList; 
var containerIndex; 
var containerMenu = document.getElementById('container-menu');
var smallEmptyMenuContainer = document.getElementsByClassName('empty-small-menu-container');

var menuRequest = new XMLHttpRequest();
menuRequest.open('GET', 'menu.json');
menuRequest.responseType = 'text';
menuRequest.send();

menuRequest.addEventListener('load', function(e){
  menuList = JSON.parse(menuRequest.response); // convert it to an object
});

menuDishList.onmouseover = function(e){
  var target = e.target;
  while (target != this) {
    if (target.tagName == 'LI') {
      var overIndex = getElementIndex(target);//index of mouseover li element
      if (overIndex != -1) { 
        if (menuMainTitle.textContent != 'Beverages') {
          showIngedientsPanel(overIndex);
        }
        changePhoto(overIndex);
      }
      return;
    } else target = target.parentNode;
  }
};

mediumMenuContainer.onclick = function(e){
  var target = e.target;
  while (target != this) {
    if (target.classList.contains('small-menu-container')) {
      containerIndex = getElementIndex(target);//get index of clicked element

      containerMenu.style.display = 'none';
      for (var i = 0; i < smallMenuContainer.length; i++) {
        smallMenuContainer[i].style.display = 'none';
      }

      smallEmptyMenuContainer[0].style.display = 'none';

      backMenuButton.style.display = 'inline-block';
      menuPhotoContainer.style.display = 'flex';
      menuListContainer.style.display = 'flex';
      mediumMenuContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
      mediumMenuContainer.style.gridAutoRows = '100%';



      var targetChildren = target.children;
      changeMenuMainTitle(targetChildren);

      menuDishList.innerHTML = '';//clear list

      for (i = 0; i < menuList.menu[containerIndex].length; i++){
        createMenuPoint(i);
      }

      photoContainer.style.backgroundImage = target.style.backgroundImage;
      photoContainer.style.backgroundPosition = target.style.backgroundPosition;

      return;
    } 
    target = target.parentNode;
    console.log(target);
  }
};

backMenuButton.addEventListener('click', function(){
  this.style.display = 'none';
  menuMainTitle.textContent = 'Menu';
  containerMenu.style.display = 'grid';
  menuPhotoContainer.style.display = 'none';
  menuListContainer.style.display = 'none';
  console.log(window.innerWidth);
  
  for (var i = 0; i < smallMenuContainer.length; i++) {
    smallMenuContainer[i].style.display = 'block';
  }

  dishIngredients.innerHTML = '';
  dishIngredients.style.backgroundColor = 'rgba(182, 182, 182, 0)';

  if(window.innerWidth <= '840'){
    mediumMenuContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
  } else if(window.innerWidth <= '1024' && window.innerWidth >= '600'){
    mediumMenuContainer.style.gridTemplateColumns = '20% 60% 20%';
    smallEmptyMenuContainer[0].style.display = 'block';
  } else {
    mediumMenuContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
  }

  mediumMenuContainer.style.gridAutoRows = 'auto';
});

function changeMenuMainTitle(targetChildren){
  for (i = 0; i < targetChildren.length; i++) {
    if(targetChildren[i].classList.contains('menu-titles')){
      menuMainTitle.textContent = targetChildren[i].textContent;
    }
  }
}

function getElementIndex(node) {
  var index = 0;
  while ( (node = node.previousElementSibling) ) {
    index++;
  }
  return index;
}

function showIngedientsPanel(overIndex){
  var ingredients = document.createElement('p');
  ingredients.textContent = menuList.menu[containerIndex][overIndex].ingredients;//get text from JSON

  dishIngredients.innerHTML = '';
  dishIngredients.appendChild(ingredients);
  dishIngredients.style.backgroundColor = 'rgba(182, 182, 182, 0.9)';
}

function changePhoto(overIndex){
  photoContainer.style.backgroundImage = 'url(' + menuList.menu[containerIndex][overIndex].image + ')';
}

/*Creates menu points and append them into list*/
function createMenuPoint(i){
  var dish = document.createElement('li');
  var dishName = document.createElement('p');
  var dishWeight = document.createElement('p');
  var dishPrice = document.createElement('p');

  dishName.textContent = menuList.menu[containerIndex][i].name;
  dishWeight.textContent = menuList.menu[containerIndex][i].calories;
  dishPrice.textContent = menuList.menu[containerIndex][i].price;

  menuDishList.appendChild(dish);

  dish.appendChild(dishName);
  dish.appendChild(dishWeight);
  dish.appendChild(dishPrice);

  dish.setAttribute('class', 'menu-dish-list-item');
}