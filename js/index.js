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
var overIndex;
var mediumMenuContainer = document.getElementById('medium-menu-container');
var mediumContactContainer = document.getElementById('medium-contact-container');
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
var mapWrapper = document.getElementById('map-wrapper');
var footer = document.getElementById('footer');

/**
 * Functions
*/

function loadGoogleMap(){
  let script = document.createElement('script');
  script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAEgnNcLXu3TxudcgyN9DnQ7uUwWy1hIpI&callback=loadMaps';
  script.type = 'text/javascript';
  script.id ='googleMap';
  document.getElementsByTagName('body')[0].append(script);
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
  let addToCartWrapper = document.createElement('p');
  let addToCart = document.createElement('i');

  dishName.textContent = dish.name;
  dishWeight.textContent = dish.calories;
  dishPrice.textContent = dish.price;
  addToCart.setAttribute('class', 'fas fa-cart-plus');
  addToCartWrapper.appendChild(addToCart);
  addToCartWrapper.setAttribute('class', 'cart-plus');
  addToCartWrapper.setAttribute('title', 'Add to cart');

  menuDishList.appendChild(dishEl);

  dishEl.appendChild(dishName);
  dishEl.appendChild(dishWeight);
  dishEl.appendChild(dishPrice);
  dishEl.appendChild(addToCartWrapper);

  dishEl.setAttribute('class', 'menu-dish-list-item');

  addToCartWrapper.addEventListener('click', function(){   
    cart.didAlreadyIn();
  });
}

var tempCout = 0;

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
  menuRequest.addEventListener('load', function(){
    menuList = JSON.parse(menuRequest.response); // convert it to an object
    for (let dish of menuList.menu[containerIndex]){
      createMenuPoint(dish);
    }
  });
}

//Lazy-load of images
var lazyLoad = (function() {
  var bLazy = new Blazy({
    offset: 600
  });
})();

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

  var containerMenu = document.getElementById('container-menu');
  var contactContainer = document.getElementById('container-contact');

  if(window.innerWidth >= '1024' || window.innerWidth < '600'){
    unwrapContainer(containerMenu);
    unwrapContainer(contactContainer);
  }
};

menuDishList.onmouseover = function(e){
  var target = e.target;
  while (target != this) {
    if (target.tagName == 'LI') {
      overIndex = getElementIndex(target);//index of mouseover li element
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
    containerMenu = document.getElementById('container-menu');
    contactContainer = document.getElementById('container-contact');
    unwrapContainer(containerMenu);
    unwrapContainer(contactContainer);
  } else{
    wrapContainers();
  }
  checkAndResizeGrids();
});

/**
 * Cart things..begins from variables
*/

var dishInCart = [];
var cartTable = document.getElementById('cart-table');
var cartModal = document.getElementById('cart-modal');
var openCart = document.getElementById('cart-open');
var closeModal = document.getElementById('close-cart-modal');
var allCartDishTotal = document.getElementById('cart-total');
var cartIsEmpty = document.getElementsByClassName('cart-is-empty');
var overIndexInCart;

/**
 * Class
*/

class Cart{
  add(){
    let dish = menuList.menu[containerIndex][overIndex]; 
    dishInCart.push(dish);

    let newItemWrapper = document.createElement('span');
    let newItemRemove = document.createElement('span');
    let newItemName = document.createElement('span');
    let newItemQuantity = document.createElement('span');
    let newItemNumber = document.createElement('span');
    let newItemPrice = document.createElement('span');
    let newItemTotal = document.createElement('span');

    newItemWrapper.setAttribute('class', 'cart-table-row');
    newItemRemove.setAttribute('class', 'cart-remove-item');
    newItemRemove.setAttribute('title', 'Click for remove');
    newItemRemove.textContent = closeModal.textContent;
    newItemRemove.addEventListener('click', () => this.remove());
    newItemName.setAttribute('class', 'cart-item-name');
    newItemName.textContent = dish.name;
    newItemPrice.textContent = dish.price;
    dish.number = 1;

    addPlus(newItemQuantity);
    newItemNumber.textContent = dish.number;
    newItemNumber.setAttribute('class', 'cart-item-number');
    newItemQuantity.setAttribute('class', 'cart-quantity');
    newItemQuantity.appendChild(newItemNumber);
    addMinus(newItemQuantity);

    newItemTotal.setAttribute('class', 'cart-item-total');
    newItemTotal.textContent = dish.price;

    cartTable.appendChild(newItemWrapper);
    newItemWrapper.appendChild(newItemRemove);
    newItemWrapper.appendChild(newItemName);
    newItemWrapper.appendChild(newItemQuantity);
    newItemWrapper.appendChild(newItemPrice);
    newItemWrapper.appendChild(newItemTotal);

    cartTable.children[cartTable.children.length-1].after(cartTable.children[cartTable.children.length-2]);

    updateAllDishTotal();
  }

  remove(){
    let cartTableRow = document.getElementsByClassName('cart-table-row');
    cartTableRow[overIndexInCart].remove();
    dishInCart.splice(overIndexInCart, 1);
    if (cartTableRow.length == 2) {
      dishInCart = [];
      cartIsEmpty[0].style.display = 'grid';
      cartTable.style.display = 'none';
    }
    updateAllDishTotal();
  }

  getOverIndex(e){
    let target = e.target;
      while (target != this){
        if (target){
          if (target.className == 'cart-table-row') {
            overIndexInCart = getElementIndex(target);//index of mouseover 
            return;
          } else target = target.parentNode;
        } else break;
      }
  }

  didAlreadyIn(){
    for (let i = 0; i < dishInCart.length; i++){
      if (dishInCart[i] != undefined && dishInCart[i].name == menuList.menu[containerIndex][overIndex].name){
        let dishNumbers = document.getElementsByClassName('cart-item-number');
        dishNumbers[i].textContent++;
        updateTotalOfDish(i);
        tempCout = 0;
        break;    
      } else {
        tempCout++;
      }
    }
    if (tempCout == dishInCart.length) {
      cart.add();
      tempCout = 0;
    }
  }
}

var cart = new Cart();

/**
 * Functions
*/

function addPlus(parentNode){
  let spanItem = document.createElement('span');
  let plus = document.createElement('i');

  plus.setAttribute('class', 'far fa-plus-square');
  spanItem.setAttribute('class', 'cart-plus');
  spanItem.setAttribute('title', 'Add one');

  spanItem.appendChild(plus);
  parentNode.appendChild(spanItem);

  spanItem.addEventListener('click', function(){
    incrementCartItem(this);
  });
}

function addMinus(parentNode){
  let spanItem = document.createElement('span');
  let minus = document.createElement('i');

  minus.setAttribute('class', 'far fa-minus-square');
  spanItem.setAttribute('class', 'cart-minus');
  spanItem.setAttribute('title', 'Remove one');

  spanItem.appendChild(minus);
  parentNode.appendChild(spanItem);

  spanItem.addEventListener('click', function(){
    decrementCartItem(this);
  });
}

function incrementCartItem(item){
  let list = item.parentNode.childNodes;
  for (let listItem of list){
    if (listItem.className === 'cart-item-number') {
      listItem.textContent++;
      updateTotalOfDish(overIndexInCart - 1);
      break;
    }
  }
}

function decrementCartItem(item){
  let list = item.parentNode.childNodes;
  for (let listItem of list){
    if (listItem.className === 'cart-item-number') {
      listItem.textContent--;
      
      updateTotalOfDish(overIndexInCart - 1);
      if (listItem.textContent == '0') { //if zero number,  then delete
        cart.remove();
      }
      break;
    }
  }
}

function updateTotalOfDish(i){
  let dishNumbers = document.getElementsByClassName('cart-item-number');
  let dishTotal = document.getElementsByClassName('cart-item-total');
  let regEx = dishInCart[i].price.replace(/\$/, '');

  dishInCart[i].total = dishNumbers[i].textContent * regEx;
  dishTotal[i].textContent = '$' + Number(dishInCart[i].total).toFixed(2);

  updateAllDishTotal();
}

function updateAllDishTotal(){
  let temp = 0;
  let dishTotal = document.getElementsByClassName('cart-item-total');

  for (let dishItem of dishTotal) {
    let regEx = Number(dishItem.textContent.replace(/\$/, ''));
    if(temp != 0){
      temp += regEx;
    } else temp = regEx;
  }

  allCartDishTotal.textContent = '$' + Number(temp).toFixed(2);
}

/**
 * Events
*/

cartTable.onmouseover = e => cart.getOverIndex(e);

//open the modal
openCart.onclick = function() {
  cartModal.style.display = 'flex';
  if (dishInCart.length == 0) {
    cartIsEmpty[0].style.display = 'grid';
  } else cartTable.style.display = 'grid';
};

//close the modal
closeModal.onclick = function() {
  cartModal.style.display = 'none';
  cartTable.style.display = 'none';
  cartIsEmpty[0].style.display = 'none';
};

// close modal if clicks anywhere outside
window.onclick = function(e) {
  if (e.target == cartModal) {
    cartModal.style.display = 'none';
  }
}; 




