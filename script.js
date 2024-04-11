const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let IsEditMode = false;





function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach(item => addItemToDOM(item));

  checkUi();
}


function onAddItemSubmit(e) {
    e.preventDefault();

    const newItem = itemInput.value;

    // Validate Input
    if (newItem === '') { 
        alert('Please add an item');
        return;
    }
    // Check For Edit Mode
    if (IsEditMode) {
      const ItemToEdit = itemList.querySelector('.edit-mode');

      removeItemFromStorage(ItemToEdit.textContent);
      ItemToEdit.classList.remove('edit-mode');
      ItemToEdit.remove();
      IsEditMode = false;
    } else {
      if (checkIfItemExists(newItem)) {
        alert('That Item Already Exists!');
        return;
      }
    }

    // create item dom element
    addItemToDOM(newItem);

    // Add to Local Storage 
    addItemToStorage(newItem);


    checkUi();

    itemInput.value = ''; 
}

function addItemToDOM(item) {
  const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));

    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);

    // Add li to the DOM
    itemList.appendChild(li);
}

function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();

// Add new item to array
  itemsFromStorage.push(item);


  // Convert to JSON string and set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}


function getItemsFromStorage() {
  let itemsFromStorage;

  if (localStorage.getItem('items') === null) {
    itemsFromStorage =[];
  } else {
    itemsFromStorage = JSON.parse
    (localStorage.getItem('items'));
  }

  return itemsFromStorage;
}
 
function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon); // Fixed here
    return button;
}

function createIcon(classes) {
    const icon = document.createElement('i')
    icon.className = classes;
    return icon;
}

function onClickItem (e) {
  if (e.target.parentElement.classList.contains
    ('remove-item')) {
      removeItem(e.target.parentElement.parentElement);
    } else {
      setItemToEdit(e.target);
    }
}

function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
  
}

function setItemToEdit(item) {
  IsEditMode = true;

itemList
.querySelectorAll('li')
.forEach((i) => i.classList.remove('edit-mode'));

  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  formBtn.style.backgroundColor = '#228B22'
  itemInput.value = item.textContent;
}


function removeItem(item) {
    if (confirm('Are you sure ?')) {
      // Remove Item From DOM
      item.remove();

      //Remove Item From Storage
      removeItemFromStorage(item.textContent);
      
      checkUi();
    }

}

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();


  // Filter Out Item To Be Removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);
  
  //Re-set To Local Storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems() {
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }

    // Clear From Local Storage
    localStorage.removeItem('items');

    checkUi();
}

function filterItems (e) {
    const items = itemList.querySelectorAll('li');
    const text = e.target.value.toLowerCase();

    items.forEach(item => {
        const itemName = item.firstChild.textContent.toLocaleLowerCase();
           
        if (itemName.indexOf(text) != -1 ) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';

        }
    });
}


function checkUi() {

  itemInput.value = '';

    const items = itemList.querySelectorAll('li');
    if (items.length === 0) {
        clearBtn.style.display = 'none';
        itemFilter.style.display = 'none';
    } else {
        clearBtn.style.display = 'block';
        itemFilter.style.display = 'block';
    }

    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';

    IsEditMode = false;
}

// Inilialize app
function init () {
 // Event Listeners
itemForm.addEventListener('submit', onAddItemSubmit);
itemList.addEventListener('click', onClickItem);
clearBtn.addEventListener('click', clearItems);
itemFilter.addEventListener('input', filterItems);
document.addEventListener('DOMContentLoaded', displayItems);

checkUi();
}

init ();