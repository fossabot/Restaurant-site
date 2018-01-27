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
var containerMenu = document.getElementById('container-menu');
var smallMenuContainer = document.getElementsByClassName('small-menu-container');
var menuList; 
var containerIndex; 
var menuRequest;
var containerMenu = document.getElementById('container-menu');
var mapWrapper = document.getElementById('map-wrapper');
var footer = document.getElementById('footer');

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
  let parent = el.parentNode;
  while (el.firstChild) parent.insertBefore(el.firstChild, el);
  parent.removeChild(el);
}

function wrapContainers(){
  wrapContainer('container-menu', 'small-menu-container', mediumMenuContainer);
  wrapContainer('container-contact', 'small-contact-container', mediumContactContainer);
}

var wrapContainer = (className, smallContainerName, container) => {
  if (!document.getElementById(className)){
    let el = document.createElement('div');
    el.setAttribute('id', className);

    let elContainer = document.getElementsByClassName(smallContainerName);
    for (let j = 0; j < elContainer.length; ){
      el.appendChild(elContainer[j]);
    }
    container.appendChild(el);
  }
};

function changeMenuMainTitle(targetChildren){
  for (let child of targetChildren) {
    if(child.classList.contains('menu-titles')){
      menuMainTitle.textContent = child.textContent;
    }
  }
}

/*Get index of child element inside node*/
function getElementIndex(node) {
  let index = 0;
  while ( (node = node.previousElementSibling) ){
    index++;
  }
  return index;
}

function showIngedientsPanel(overIndex){
  let ingredients = document.createElement('p');
  ingredients.textContent = menuList.menu[containerIndex][overIndex].ingredients;//get text from JSON

  dishIngredients.innerHTML = '';
  dishIngredients.appendChild(ingredients);
  dishIngredients.style.backgroundColor = 'rgba(182, 182, 182, 0.9)';
}

function changePhoto(overIndex){
  photoContainer.style.backgroundImage = 'url(' + menuList.menu[containerIndex][overIndex].image + ')';
}

/*Creates menu points and append them into list*/
function createMenuPoint(dish){
  let dishEl = document.createElement('li');
  let dishName = document.createElement('p');
  let dishWeight = document.createElement('p');
  let dishPrice = document.createElement('p');

  dishName.textContent = dish.name;
  dishWeight.textContent = dish.calories;
  dishPrice.textContent = dish.price;

  menuDishList.appendChild(dishEl);

  dishEl.appendChild(dishName);
  dishEl.appendChild(dishWeight);
  dishEl.appendChild(dishPrice);

  dishEl.setAttribute('class', 'menu-dish-list-item');
}

function checkAndResizeGrids(){
  if(window.innerWidth < '600'){
    if (document.getElementById('menu-dish-photo-container').style.display == 'flex') {
      changeTemplateColunsAndRows('1fr', '50% 50%');
      dishIngredients.style.height = '30%';
      dishIngredients.fontSize = '5px';
    } else{
      changeTemplateColunsAndRows('repeat(2, 1fr)', 'repeat(3, 1fr)');
      mediumMenuContainer.style.gridAutoRows = 'auto';
    }
  } else if(window.innerWidth >= '600' && window.innerWidth <= '1024'){
    if (document.getElementById('menu-dish-photo-container').style.display == 'flex') {
      changeTemplateColunsAndRows('repeat(2, 1fr)', '100%');
    } else{
      changeTemplateColunsAndRows('20% 60% 20%', '1fr');
    }
  } else {
    if (document.getElementById('menu-dish-photo-container').style.display == 'flex') {
      changeTemplateColunsAndRows('repeat(2, 1fr)', '100%');
    } else{
      changeTemplateColunsAndRows('repeat(3, 1fr)', 'repeat(2, 1fr)');
    }
  }
}

function changeTemplateColunsAndRows(column, row){
  mediumMenuContainer.style.gridTemplateColumns = column;
  mediumMenuContainer.style.gridTemplateRows = row;
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

function connectJSON(){
  menuRequest = new XMLHttpRequest();
  menuRequest.open('GET', 'menu.json');
  menuRequest.responseType = 'text';
  menuRequest.send();
  menuRequest.addEventListener('load', function(e){
    menuList = JSON.parse(menuRequest.response); // convert it to an object
    for (let dish of menuList.menu[containerIndex]){
      createMenuPoint(dish);
    }
  });
}

//Lazy-load of images
function lazyLoad(){
  ;(function() {
    var bLazy = new Blazy({
      offset: 600
    });
  })();
}

function changeDisplay(display, ...elements){
  for (let el of elements) {
    el.style.display = display;
  }
}

/**
 * Event Listeners
*/

window.loadMaps = () => {
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
  for (let chevron of chevronRight) {
    chevron.style.transform = 'rotate(180deg)';
  }
  mapReturnButton.style.marginLeft = '-20%';
  setTimeout(function(){
    for (let chevron of chevronRight) {
      chevron.style.transform = 'rotate(0deg)';
    }
  },1500);
});

window.addEventListener('DOMContentLoaded', function(){
  fixHeader();//If page open not top, then header must be top 
  lazyLoad();//Lazy load of images
});

//Sticky Header when scrolling
window.onscroll = function(){
  fixHeader();
};

//Smooth scrolling to links from header
header.onclick = function(e){
  smoothScroll(e);
};

//Smooth scrolling to links from footer
footer.onclick = e => {
  smoothScroll(e);
};

window.onload = function(){
  checkAndResizeGrids();

  var menuContainer = document.getElementById('container-menu');
  var contactContainer = document.getElementById('container-contact');

  if(window.innerWidth >= '1024' || window.innerWidth < '600'){
    unwrapContainer(menuContainer);
    unwrapContainer(contactContainer);
  }
};

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

      /*Connect JSON if unconnected and create dish list*/
      if (!menuList) {
        connectJSON();
      } else {
        menuDishList.innerHTML = '';//clear list
        for (let dish of menuList.menu[containerIndex]){
          createMenuPoint(dish);
        }
      }

      containerMenu.style.display = 'none';
      backMenuButton.style.display = 'inline-block';
      changeDisplay('flex', menuPhotoContainer, menuListContainer);
      /*Hide menu main parts*/
      for (let container of smallMenuContainer) {
        container.style.display = 'none';
      }

      changeMenuMainTitle(target.children);
      photoContainer.style.backgroundImage = window.getComputedStyle(target).getPropertyValue('background-image');

      /*For narrow ones screens*/
      if (window.innerWidth < '600') {
        changeTemplateColunsAndRows('1fr', '50% 50%');
        dishIngredients.style.height = '30%';
        dishIngredients.fontSize = '5px';
      } else {
        changeTemplateColunsAndRows('repeat(2, 1fr)', '100%');
      }

      return;
    } 
    target = target.parentNode;
  }
};

backMenuButton.addEventListener('click', function(){
  containerMenu.style.display = 'grid';
  for (let container of smallMenuContainer) {
    container.style.display = 'block';
  }
  changeDisplay('none', this, menuPhotoContainer, menuListContainer);

  menuMainTitle.textContent = 'Menu';

  checkAndResizeGrids();

  //hide and clear ingredients panel
  dishIngredients.innerHTML = '';
  dishIngredients.style.backgroundColor = 'rgba(182, 182, 182, 0)';
});

window.addEventListener('resize', function(){
  console.log(window.innerWidth);
  if(screen.orientation.angle == '0'){
    menuContainer = document.getElementById('container-menu');
    contactContainer = document.getElementById('container-contact');
    unwrapContainer(menuContainer);
    unwrapContainer(contactContainer);
  } else{
    wrapContainers();
  }
  checkAndResizeGrids();
});
