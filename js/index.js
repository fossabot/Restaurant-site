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
    let el = createElWithAttr('div', {id : className});

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
  let dishEl = createElWithAttr('li', {class : 'menu-dish-list-item'});
  let dishName = document.createElement('p');
  let dishWeight = document.createElement('p');
  let dishPrice = document.createElement('p');
  let addToCartWrapper = createElWithAttr('p', {class : 'cart-plus'}, {title : 'Add to cart'});
  let addToCart = createElWithAttr('i', {class : 'fas fa-cart-plus'});

  dishName.textContent = dish.name;
  dishWeight.textContent = dish.calories;
  dishPrice.textContent = dish.price;
  addToCartWrapper.appendChild(addToCart);

  menuDishList.appendChild(dishEl);

  dishEl.appendChild(dishName);
  dishEl.appendChild(dishWeight);
  dishEl.appendChild(dishPrice);
  dishEl.appendChild(addToCartWrapper);

  addToCartWrapper.addEventListener('click', function(){   
    cart.didAlreadyIn();
  });
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
  while (target != document.querySelector('body')) {
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

    cart = new Cart(menuList.menu);//

    for (let dish of menuList.menu[containerIndex]){
      createMenuPoint(dish);
    }
  });
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
  let target = e.target;
  while (target != document.getElementById('menu-dish-list')) {
    if (target.tagName == 'LI') {
      overIndex = getElementIndex(target);//index of mouseover li element
      //if (overIndex != -1) { 
        if (menuMainTitle.textContent != 'Beverages') {
          showIngedientsPanel(overIndex);
        }
        changePhoto(overIndex);
      //}
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

var cartTable = document.getElementById('cart-table');
var cartModal = document.getElementById('cart-modal');
var openCart = document.getElementById('cart-open');
var closeModal = document.getElementById('close-cart-modal');
var allCartDishTotal = document.getElementById('cart-total');
var countInsideCart = document.getElementsByClassName('count-inside-cart');
var toCheckoutButton = document.getElementById('to-checkout-button');
var modalContent = document.getElementsByClassName('modal-content')[0];
var cartHeader = document.getElementsByClassName('cart-header');

/**
 * Class
*/

class Cart{
  constructor(dataset){
    this.menu = dataset;
    this.inCart = [];//array of dishes in cart
  }

  open(){
    cartModal.style.display = 'flex';
    if (cart.inCart.length == 0) {
      addSentenceContainer(modalContent, 'Oops! Your cart is empty(');
    } else {
      if (cartHeader[0].textContent != 'Cart'){
        cartHeader[0].textContent = 'Cart';
        cartHeader[0].style.display = 'block';
      }
      cartTable.style.display = 'grid';
      toCheckoutButton.style.display = 'flex';
      this.createCartHeader();
    }
  }

  add(){
    let dish = this.menu[containerIndex][overIndex]; 
    dish.total = Number(dish.price.replace(/\$/, ''));
    this.inCart.push({name : dish.name, price: dish.price, number: 1, total: dish.total});
    this.createCartHeader();

    let newItemWrapper = createElWithAttr('span', {class : 'cart-table-row'});
    cartTable.appendChild(newItemWrapper);

    let lastCartItem = this.inCart[this.inCart.length - 1];
    this.newItemRemoveButton(newItemWrapper);
    newItem(newItemWrapper, lastCartItem.name, 'cart-item-name');
    this.newItemQuantityPart(newItemWrapper, lastCartItem);
    newItem(newItemWrapper, lastCartItem.price);
    newItem(newItemWrapper, lastCartItem.price, 'cart-item-total');

    swapLastTwo(cartTable);

    this.updateAllDishTotal();

    function newItem(parent, text, ...className){
      let item;

      if (className.length == 1){
        item = createElWithAttr('span', {class : className});
      } else if (className.length == 0){
        item = document.createElement('span');
      } else return;
      item.textContent = text;

      parent.appendChild(item);
    }
  }
    
  newItemQuantityPart(parent, dish){
    let newItemQuantity = createElWithAttr('span', {class : 'cart-quantity'});
    let newItemNumber = createElWithAttr('span', {class : 'cart-item-number'});

    cart.addPlus(newItemQuantity);
    newItemNumber.textContent = dish.number;
    newItemQuantity.appendChild(newItemNumber);
    cart.addMinus(newItemQuantity);

    parent.appendChild(newItemQuantity);
  }

  newItemRemoveButton(parent){
    let newItemRemove = createElWithAttr('span', {class : 'cart-remove-item'}, {title : 'Click for remove'});
    newItemRemove.textContent = closeModal.textContent;
    newItemRemove.addEventListener('click', () => this.removeC());

    parent.appendChild(newItemRemove);
  }

  removeC(){
    let cartTableRow = document.getElementsByClassName('cart-table-row');
    cartTableRow[overIndex].remove();
    this.inCart.splice(overIndex - 1, 1);
    if (cartTableRow.length == 2) {
      this.inCart = [];
      cartHeader[0].remove();
      addSentenceContainer(modalContent, 'Oops! Your cart is empty(');
      cartTable.style.display = 'none';
      toCheckoutButton.style.display = 'none';
    }
    this.updateAllDishTotal();
  }

  getOverIndex(e){
    let target = e.target;
      while (target != this){
        if (target){
          if (target.className == 'cart-table-row') {
            overIndex = getElementIndex(target);//index of mouseover 
            return;
          } else target = target.parentNode;
        } else break;
      }
  }

  /*Checks whether the dish is already in the cart. If not, then add*/
  didAlreadyIn(){
    let tempCout = 0;
    for (let i = 0; i < this.inCart.length; i++){
      if (this.inCart[i] != undefined && this.inCart[i].name == menuList.menu[containerIndex][overIndex].name){
        let dishNumbers = document.getElementsByClassName('cart-item-number');
        this.inCart[i].number++;
        dishNumbers[i].textContent = this.inCart[i].number;
        this.updateTotalOfDish(i);
        break;    
      } else {
        tempCout++;
      }
    }
    if (tempCout == this.inCart.length) {
      this.add();
    }
  }

  addPlus(parentNode){
    let spanItem = createElWithAttr('span', {class : 'cart-plus'}, {title : 'Add one'});
    let plus = createElWithAttr('i', {class : 'far fa-plus-square'});

    spanItem.appendChild(plus);
    parentNode.appendChild(spanItem);

    spanItem.addEventListener('click', () => {
      incrementCartItem(spanItem, this);
    });

    function incrementCartItem(item, parentObj){
      let list = item.parentNode.childNodes;
      for (let listItem of list){
        if (listItem.className === 'cart-item-number') {
          parentObj.inCart[overIndex - 1].number++;
          listItem.textContent = parentObj.inCart[overIndex - 1].number;
          parentObj.updateTotalOfDish(overIndex - 1);
          break;
        }
      }
    }
  }

  addMinus(parentNode){
    let spanItem = createElWithAttr('span', {class : 'cart-minus'}, {title : 'Remove one'});
    let minus = createElWithAttr('i', {class : 'far fa-minus-square'});

    spanItem.appendChild(minus);
    parentNode.appendChild(spanItem);

    spanItem.addEventListener('click', () => {
      decrementCartItem(spanItem, this);
    });

    function decrementCartItem(item, parentObj){
      let list = item.parentNode.childNodes;
      for (let listItem of list){
        if (listItem.className === 'cart-item-number') {
          parentObj.inCart[overIndex - 1].number--;
          listItem.textContent = parentObj.inCart[overIndex - 1].number;
          parentObj.updateTotalOfDish(overIndex - 1);
          if (listItem.textContent == '0') { //if zero number,  then delete
            parentObj.removeC();
          }
          break;
        }
      }
    }
  }

  updateTotalOfDish(i){
    let dishTotal = document.getElementsByClassName('cart-item-total');
    let priceRegEx = this.inCart[i].price.replace(/\$/, '');

    this.inCart[i].total = this.inCart[i].number * priceRegEx;
    dishTotal[i].textContent = '$' + this.inCart[i].total.toFixed(2);

    this.updateAllDishTotal();
  }

  updateAllDishTotal(){
    let temp = 0;
    for (let dish of this.inCart){
      if(temp != 0){
        temp += dish.total;
      } else temp = dish.total;
    }

    allCartDishTotal.textContent = '$' + temp.toFixed(2);

    this.allDishesCount();    
  }

  allDishesCount(){
    let allTotal = 0;
    for (let dish of this.inCart){
      allTotal += dish.number;
    }

    if (allTotal == 0){
      countInsideCart[0].textContent = '';
    } else countInsideCart[0].textContent = ' (' + allTotal + ')';    
  }

  createCartHeader(){
    if (document.getElementsByClassName('cart-header').length === 0) {
      let cartHeader = createElWithAttr('h2', {class : 'cart-header'});
      cartHeader.textContent = 'Cart';
      modalContent.insertBefore(cartHeader, cartTable);
      cartHeader = document.getElementsByClassName('cart-header');
    }
  }

  createCashoutButtons(){
    let buttonsContainer = createElWithAttr('div', {class : 'cart-buttons-container'}); 

    backButton();
    nextButton();

    modalContent.appendChild(buttonsContainer);

    function backButton(){
      let button = createElWithAttr('div', {class : 'cart-button'}, {id : 'cashout-back-button'}, {style : 'display : flex'});

      button.addEventListener('click', () => {
        cartTable.style.display = 'grid';
        toCheckoutButton.style.display = 'flex';
        buttonsContainer.remove();
        cartHeader[0].textContent = 'Cart';
        document.getElementById('checkout-container').remove();
      });

      addTextElAndAppend(button, 'span', 'Back');
      buttonsContainer.appendChild(button);
    }

    function nextButton(){
      let button = createElWithAttr('div', {class : 'cart-button'}, {style : 'display : flex'});

      button.addEventListener('click', () => {
        buttonsContainer.remove();
        document.getElementById('checkout-container').remove();
        cartHeader[0].style.display = 'none';
        cart.inCart = [];
        let cartTableRow = document.getElementsByClassName('cart-table-row');
        while(cartTableRow.length > 2) {
          cartTableRow[1].remove();
        }
        cart.updateAllDishTotal();

        addSentenceContainer(modalContent, 'Thanks for Your order!');
      });
      addTextElAndAppend(button, 'span', 'Confirm');
      buttonsContainer.appendChild(button);
    }
  }

  openCheckout(){
    cartTable.style.display = 'none';
    toCheckoutButton.style.display = 'none';
    cartHeader[0].textContent = 'Confirm order list';

    let checkOutContainer = createElWithAttr('div', {id : 'checkout-container'});
    let orderList = createElWithAttr('div', {class : 'order-list'});

    addTextElAndAppend(orderList, 'span', 'Product');
    addTextElAndAppend(orderList, 'span', 'Total');

    for (let dish of cart.inCart) {
      addTextElAndAppend(orderList, 'span', dish.number + ' ' + closeModal.textContent + ' ' + dish.name);
      addTextElAndAppend(orderList, 'span', '$' + dish.total.toFixed(2));
    }
     
    addTextElAndAppend(orderList, 'span', 'Total');
    addTextElAndAppend(orderList, 'span', allCartDishTotal.textContent);  

    checkOutContainer.appendChild(orderList);
    modalContent.appendChild(checkOutContainer);

    this.createCashoutButtons();
  }

  close(){
    cartModal.style.display = 'none';
    cartTable.style.display = 'none';
    toCheckoutButton.style.display = 'none';
    if (document.getElementsByClassName('cart-one-text-container').length != 0) {
      document.getElementsByClassName('cart-one-text-container')[0].remove();
    }
    if (document.getElementById('checkout-container')) {
      document.getElementById('checkout-container').remove();
      document.getElementsByClassName('cart-buttons-container')[0].remove();
    }
  }
}

var cart;

/**
 * Functions
*/

 /*Swap the last two children of the node*/
function swapLastTwo(el){
    let elChild = el.children;//return collection of rows
    elChild[elChild.length-1].after(elChild[elChild.length-2]);//swap the last two rows
  }

function addTextElAndAppend(parent, el, text){
  let newEl = document.createElement(el);
  newEl.textContent = text;
  parent.appendChild(newEl);
}

function addSentenceContainer(parent, text){
  let div = createElWithAttr('div', {class : 'cart-one-text-container'});
  addTextElAndAppend(div, 'h2', text);
  parent.appendChild(div);
}

function createElWithAttr(tagNme, ...attr){
  let el = document.createElement(tagNme);
  for (let temp of attr) {
    for (var key in temp) {
      el.setAttribute(key, temp[key]);
    }
  }
  return el;
}

/**
 * Events
*/

cartTable.onmouseover = e => cart.getOverIndex(e);

//open the modal
openCart.onclick = function() {
  if (!cart){
    cart = new Cart();
  }
  cart.open();
};

//close the modal
closeModal.onclick = () => cart.close();

// close modal if clicks anywhere outside
window.onclick = function(e) {
  if (e.target == cartModal) {
    cart.close();
  }
}; 

toCheckoutButton.onclick = () => cart.openCheckout();

