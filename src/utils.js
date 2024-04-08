import { appState } from "./app";

export const getFromStorage = function (key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
};

export const addToStorage = function (obj, key) {
  const storageData = getFromStorage(key);
  storageData.push(obj);
  localStorage.setItem(key, JSON.stringify(storageData));
};

export const generateTestUser = function (User, login, password) {
  /* localStorage.clear(); */
  const testUser = new User(login, password);
  User.save(testUser);
};

export const generateTaskField = function (taskFieldTemplate, dropdownMenuTemplate) {
  document.querySelector("#content").innerHTML = taskFieldTemplate;
  document.querySelector("#navbar").innerHTML = dropdownMenuTemplate;
  rotateDropdown();
  backlogLogick();
};

export const generateNoAccess = function (noAccessTemplate) {
  document.querySelector("#content").innerHTML = noAccessTemplate;
};

function rotateDropdown() {
  let dropdown = document.querySelector('#dropdownMenu');

  dropdown.addEventListener('show.bs.dropdown', function() {
    let arrow = document.querySelector('.arrow');
    arrow.classList.add('rotated');
  });

  dropdown.addEventListener('hide.bs.dropdown', function() {
    let arrow = document.querySelector('.arrow');
    arrow.classList.remove('rotated');
  });
};

function backlogLogick () {
  let button = document.getElementById('backlog_btn__add');
  button.addEventListener('click', function () {
    document.getElementById('backlog_btn__sabmit').style.display = 'block';
    document.getElementById('backlog_input').style.display = 'block';
    document.getElementById('backlog_btn__add').style.display = 'none';
  });

  let form = document.getElementById('backlog_input');
  form.addEventListener('focusout', function() {
    document.getElementById('backlog_btn__sabmit').style.display = 'none';
    document.getElementById('backlog_input').style.display = 'none';
    document.getElementById('backlog_btn__add').style.display = 'block';
      
    addTaskInLocalStorage(form.value);
  });
}

function addTaskInLocalStorage(input) {
  if (appState.currentUser.backlog === undefined) {
    appState.currentUser.backlog = new Array();
  }
  appState.currentUser.backlog.push(input);
  createNodeBacklog(input, 'backlog');
  addToStorageUsers();
};

function createNodeBacklog(task, node) {
  let div = document.createElement('div');
  div.className = "container tasks-zone__task pt-2 pb-2 mt-2 mb-2 text-break";
  div.append(task);

  let nodeTask = document.getElementById(node);
  nodeTask.append(div);
};

function addToStorageUsers() {
  let currentUser = appState.currentUser;
  console.log(currentUser);
  let allUser = JSON.parse(localStorage.users);
  console.log(allUser);
  
  for(let i=0; i<allUser.length; i++) {
    if(allUser[i].id === currentUser.id) {
      allUser[i] = currentUser;
      localStorage.clear();
      localStorage.setItem('users', JSON.stringify(allUser));
    }
  };
}