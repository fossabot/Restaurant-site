/**
 * Site for non-existen restaurant
 *
 * @Author Oleh Yaroshchuk 
 */

/**
 * Global variables
*/
var textLocation = document.getElementById('text-location');
var mapContainer = document.getElementById('map-container');
var mapReturnButton = document.getElementById('map-return-button');
var chevronRight = document.getElementsByClassName('fa-chevron-right');
var headerBeforeConst = document.getElementById('header-before-const');
var header = document.getElementById('header');  

var stickyHeaderTop = headerBeforeConst.offsetTop; //Check the initial posistion of the Sticky Header

var navigation = document.getElementsByClassName('navigation');
var cloneMenuContainer; 
var cloneContactContainer;
var mediumMenuContainer = document.getElementById('medium-menu-container');
var mediumContactContainer = document.getElementById('medium-contact-container');
var menuContainer = document.getElementById('container-menu');
var contactContainer = document.getElementById('container-contact');
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
var menuRequest;
var containerMenu = document.getElementById('container-menu');
var smallEmptyMenuContainer = document.getElementsByClassName('empty-small-menu-container');
var mapWrapper = document.getElementById('map-wrapper');
var footer = document.getElementById('footer');

menuRequest = new XMLHttpRequest();
menuRequest.open('GET', 'menu.json');
menuRequest.responseType = 'text';
menuRequest.send();
saveNodes();
/**
 * Functions
*/

function loadGoogleMap(){
  var script = document.createElement("script");
  script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAEgnNcLXu3TxudcgyN9DnQ7uUwWy1hIpI&callback=loadMaps";
  script.type = "text/javascript";
  script.id ="googleMap";
  document.getElementsByTagName("body")[0].append(script);
}

function fixHeader(){
  var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : document.body.scrollTop;

  if( scrollTop > stickyHeaderTop ) {
    header.style.position = 'fixed';
    header.style.top = '0px';
  } else{
    header.style.position = 'absolute';
    header.style.top = '90%';
  }
}

function scrollTo(element) {
  var scrollPos = element.offsetTop - header.clientHeight;
  window.scroll({
    behavior: 'smooth',
    left: 0,
    top: scrollPos
  });
}

/*remove Container if screen orientation in landscape mode*/
function unwrapContainer(el){
  var parent = el.parentNode;
  while (el.firstChild) parent.insertBefore(el.firstChild, el);
  parent.removeChild(el);
}

/*Return Container*/
function  replaceToPrevious(oldNode, newNode){
  oldNode = newNode;//replace old node by new
}

function wrapContainers(){
  console.log('wrap');
  replaceToPrevious(mediumMenuContainer, cloneMenuContainer);
  replaceToPrevious(mediumContactContainer, cloneContactContainer);
}

function saveNodes(){
  console.log('saved');
  cloneMenuContainer = mediumMenuContainer.cloneNode(true);
  cloneContactContainer = mediumContactContainer.cloneNode(true);
}

function saveNodeAndUnwrapContainers (){
  saveNodes();

  unwrapContainer(menuContainer);
  unwrapContainer(contactContainer);
}

function changeMenuMainTitle(targetChildren){
  for (i = 0; i < targetChildren.length; i++) {
    if(targetChildren[i].classList.contains('menu-titles')){
      menuMainTitle.textContent = targetChildren[i].textContent;
    }
  }
}

/*Get index of child element inside node*/
function getElementIndex(node) {
  var index = 0;
  while (node = node.previousElementSibling){
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

function checkAndResizeGrids(){
  if(window.innerWidth < '600'){
    mediumMenuContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
    mediumMenuContainer.style.gridTemplateRows = 'repeat(3, 1fr)';
    mediumMenuContainer.style.gridAutoRows = 'auto';
    smallEmptyMenuContainer[0].style.display = 'none';
  } else if(window.innerWidth >= '600' && window.innerWidth <= '1024'){
    mediumMenuContainer.style.gridTemplateColumns = '20% 60% 20%';
    smallEmptyMenuContainer[0].style.display = 'block';
    wrapContainers();
  } else {
    mediumMenuContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
    mediumMenuContainer.style.gridAutoRows = '50%';
  }
}

function smoothScroll(e){
  var target = e.target;
  while (target != this) {
    if (target.classList.contains('navigation')) {
      scrollTo(document.querySelector(target.getAttribute('scrollTo')));
      return;
    } else target = target.parentNode;
  }
}

/**
 * Event Listeners
*/

window.loadMaps = function (){
  var map = new google.maps.Map(document.getElementById('map-container'), {
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

//map, that sliding from right side
textLocation.addEventListener('click', function(){
  mapWrapper.style.zIndex = 11;
  mapContainer.style.marginLeft = 0;
  mapContainer.style.width = '100%';

  if(document.getElementById('googleMap') === null){
    loadGoogleMap();
  }
  mapReturnButton.style.marginLeft = '2.5%';
});

/*map, that sliding to right side*/
mapReturnButton.addEventListener('click', function() {
  mapContainer.style.width = '0';
  mapContainer.style.marginLeft = '100%';
  setTimeout(function(){
    mapWrapper.style.zIndex = 5;
  },1700);
  for (var i = 0; i < chevronRight.length; i++) {
    chevronRight[i].style.transform = 'rotate(180deg)';
  }
  mapReturnButton.style.marginLeft = '-20%';
  setTimeout(function(){
    for (var i = 0; i < chevronRight.length; i++) {
      chevronRight[i].style.transform = 'rotate(0deg)';
    }
  },1500);
});

//If page open not top, then header must be top 
window.onload = function(){
  fixHeader();
};

//Sticky Header when scrolling
window.onscroll = function(){
  fixHeader();
};

//Smooth scrolling to links from header
header.onclick = function(e){
  smoothScroll(e);
};

//Smooth scrolling to links from footer
footer.onclick = function(e){
  smoothScroll(e);
};

document.addEventListener('DOMContentLoaded', function(){
  console.log(window.screen.orientation.type);
  console.log(window.innerWidth);
  saveNodes();

  if(window.screen.orientation.type == 'portrait-primary' || window.innerWidth >= '1024' || window.innerWidth < '600'){
    saveNodeAndUnwrapContainers();
  }

  checkAndResizeGrids();
});

window.addEventListener('orientationchange', function(){
  console.log(window.screen.orientation.type);
  if(window.screen.orientation.type == 'portrait-primary'){
    saveNodeAndUnwrapContainers();
  } else {
    wrapContainers();
  }

  checkAndResizeGrids();
  lazyLoad();
}, false);

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

      if(window.innerWidth < '600' || window.innerWidth > '1024'){
        containerIndex -= 2;
      }

      containerMenu.style.display = 'none';

      /*Hide menu parts of choosing*/
      for (var i = 0; i < smallMenuContainer.length; i++) {
        smallMenuContainer[i].style.display = 'none';
      }
      smallEmptyMenuContainer[0].style.display = 'none';

      backMenuButton.style.display = 'inline-block';
      menuPhotoContainer.style.display = 'flex';
      menuListContainer.style.display = 'flex';

      changeMenuMainTitle(target.children);

      mediumMenuContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
      mediumMenuContainer.style.gridAutoRows = '100%';

      menuDishList.innerHTML = '';//clear list
      for (i = 0; i < menuList.menu[containerIndex].length; i++){
        createMenuPoint(i);
      }

      photoContainer.style.backgroundImage = window.getComputedStyle(target).getPropertyValue('background-image');

      /*For narrow ones screens*/
      if (window.innerWidth < '600') {
        mediumMenuContainer.style.gridTemplateColumns = '1fr';
        mediumMenuContainer.style.gridTemplateRows = '50% 50%'
        dishIngredients.style.height = '30%';
        dishIngredients.fontSize = '5px';
      }

      return;
    } 
    target = target.parentNode;
  }
};

backMenuButton.addEventListener('click', function(){
  containerMenu.style.display = 'grid';

  for (var i = 0; i < smallMenuContainer.length; i++) {
    smallMenuContainer[i].style.display = 'block';
  }
  smallEmptyMenuContainer[0].style.display = 'block';

  this.style.display = 'none';
  menuPhotoContainer.style.display = 'none';
  menuListContainer.style.display = 'none';

  menuMainTitle.textContent = 'Menu';

  checkAndResizeGrids();

  //hide and clear ingredients panel
  dishIngredients.innerHTML = '';
  dishIngredients.style.backgroundColor = 'rgba(182, 182, 182, 0)';
});

window.addEventListener('resize', function(){
  console.log(window.innerWidth);
  checkAndResizeGrids();
});

/**
 * Another
*/

//Lazy-load of images
function lazyLoad(){
  ;(function() {
    var bLazy = new Blazy({
      /*success: function(){
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
      ],*/
      offset: 100
    });
  })();
}

lazyLoad();

