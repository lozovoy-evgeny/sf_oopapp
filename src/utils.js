import { appState } from "./app";
import noAccessTemplate from "./templates/noAccess.html";
import { User } from "./models/User";

export const getFromStorage = function (key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
};

export const addToStorage = function (obj, key) {
  const storageData = getFromStorage(key);
  storageData.push(obj);
  localStorage.setItem(key, JSON.stringify(storageData));
};

export const generateTestUser = function (User, login, password, storageKey) {
  /* localStorage.clear(); */
  const testUser = new User(login, password, storageKey);
  User.save(testUser);
};

export const generateTaskField = function (taskFieldTemplate, dropdownMenuTemplate, dropdownMenuTemplateAdmin) {
  document.querySelector("#content").innerHTML = taskFieldTemplate;
  document.querySelector("#navbar").innerHTML = dropdownMenuTemplate;
  backlogLogick();
  dropdownMenuСompletion();
  if (appState.currentUser.storageKey == 'admins') {
    document.querySelector("#navbar").innerHTML = dropdownMenuTemplateAdmin;
    chooseKabnanDropdown();
    addListenerEditUsers();
  }
  rotateDropdown();
  completionTaskField();
  countTask();
  hello();
  taskEditorLogik();
};

function taskEditorLogik() {
  let btnDelete = document.querySelector('.tasks-editor-btn__delete');
  btnDelete.addEventListener('click', function() {
    let editor = document.querySelector('.tasks-editor');
    deleteTask(editor.id);
  });
}

export const generateNoAccess = function (noAccessTemplate) {
  document.querySelector("#content").innerHTML = noAccessTemplate;
  let alert = document.querySelector('.alert');
  alert.prepend(`Неверный логин или пароль!!!`);
};

function hello() {
  let node = document.querySelector('.navbar-brand');
  node.insertAdjacentHTML('afterend', noAccessTemplate);
  let alert = document.querySelector('.alert'); 
  alert.prepend(`Hello ${appState.currentUser.login}!!!`);
}

function completionTaskField() {
  let tasks = appState.currentUser.tasks;
  for (let index = 0; index < tasks.length; index++) {
    createNode(tasks[index]);
    addListenerToEditTask(tasks[index].id);
  };
};

function chooseKabnanDropdown() {
  let chooseDropdown = document.getElementById('choose-kanban-dropdown-menu');  
  let child = chooseDropdown.lastElementChild;
  while (child) {
    chooseDropdown.removeChild(child);
    child = chooseDropdown.lastElementChild;
  }
  

  let users = getFromStorage('users');
  for (let i=0; i < users.length; i++) {
    let li = document.createElement('li');
    let a = document.createElement('a');
    a.setAttribute("id", users[i].id);
    a.textContent = users[i].login;
    a.classList.add('dropdown-item');
    li.append(a);
    chooseDropdown.prepend(li);
  }
  let li = document.createElement('li');
  let a = document.createElement('a');
  a.setAttribute("id", appState.currentUser.id);
  a.textContent = 'My tasks';
  a.classList.add('dropdown-item');
  li.append(a);
  chooseDropdown.prepend(li);
  addChooseKanbanListener(chooseDropdown);
}

function addChooseKanbanListener(chooseDropdown) {
  for (let i=0; i < chooseDropdown.childNodes.length - 1; i++) {
    chooseDropdown.childNodes[i].addEventListener('click', function() {
      let id = chooseDropdown.childNodes[i].childNodes[0].getAttribute('id');
      let currentUser = findUser(id);
      appState.currentUser = currentUser;
      deleteNode();
      completionTaskField();
      countTask();
    });
  }
}

function deleteNode() {
  let node = document.querySelectorAll('.tasks-zone__task');
  if((typeof(node) !== "undefined")){
    for(let i = 0; i < node.length; i++) {
      node[i].remove();
    }
  }
}

function findUser(id) {
  let users = getFromStorage('users');
  let admins = getFromStorage('admins');
  for (let i=0; i < users.length; i++) {
    if (users[i].id == id) {
      return users[i];
    }
  }
  for (let i=0; i < admins.length; i++) {
    if (admins[i].id == id) {
      return admins[i];
    }
  }
}

function countTask() {
  let activeTask = document.querySelector('.active-tasks');
  let finihedTask = document.querySelector('.finished-tasks');
  let tasks = appState.currentUser.tasks;
  let countActive = 0;
  let countFinished = 0;
  for (let index = 0; index < tasks.length; index++) {
    if (tasks[index].stat == 'progress') {
      countActive++;
    };
    if (tasks[index].stat == 'finished') {
      countFinished++;
    }
  };

  activeTask.innerHTML = `Active tasks: ${countActive}`;
  finihedTask.innerHTML = `Finished tasks: ${countFinished}`;
}

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
    document.getElementById('backlog_input').value = '';
    document.getElementById('backlog_btn__add').style.display = 'none';
  });

  let form = document.getElementById('backlog_input');
  form.addEventListener('focusout', function() {
    document.getElementById('backlog_btn__sabmit').style.display = 'none';
    document.getElementById('backlog_input').style.display = 'none';
    document.getElementById('backlog_btn__add').style.display = 'block';
      
    addTaskInLocalStorage(form.value);
    dropdownMenuСompletion();
  });
}

function addTaskInLocalStorage(input) {
  if (appState.currentUser.tasks === undefined) {
    appState.currentUser.tasks = new Array();
  }

  let taskAttributs = {
    id:generateId(),
    name: input,
    description:"",
    stat:"backlog",
  }

  appState.currentUser.tasks.push(taskAttributs);
  createNode(taskAttributs);
  addListenerToEditTask(taskAttributs.id);
  addToStorageUsers();
};

function createNode(taskAttributs) {
  let div = document.createElement('div');
  div.className = "container tasks-zone__task pt-2 pb-2 mt-2 mb-2 text-break";
  div.id = taskAttributs.id;
  div.append(taskAttributs.name);

  let nodeTask = document.getElementById(taskAttributs.stat);
  nodeTask.append(div);
};

function addToStorageUsers() {
  let currentUser = appState.currentUser;
  let allUser = JSON.parse(localStorage.users);
  let allAdmin = JSON.parse(localStorage.admins);
  
  for(let i=0; i < allUser.length; i++) {
    if(allUser[i].id == currentUser.id) {
      allUser[i] = currentUser;
      /* localStorage.clear(); */
      console.log();
      localStorage.setItem('users', JSON.stringify(allUser));
    }
  };
  for(let i=0; i < allAdmin.length; i++) {
    if(allAdmin[i].id == currentUser.id) {
      allAdmin[i] = currentUser;
      /* localStorage.clear(); */
      localStorage.setItem('admins', JSON.stringify(allAdmin));
    }
  };
  countTask();
}

function generateId() {
  let id = new Date().getTime();
  return id;
}

function addListenerToEditTask(id) {
  let element = document.getElementById(`${id}`);
  element.addEventListener('click', function a(){
    let editor = document.querySelector('.tasks-editor');
    editor.style.display = 'block';
    editor.id = id;
    let task = findTask(id);
    document.querySelector('.tasks-editor__name').value = task.name;
    document.querySelector('.tasks-editor__description').value = task.description;
    addChangeTaskInStorage(task);
/*     deleteTask(id); */
    element.removeEventListener('click', a);
  });
}

function deleteTask(id) {
    let tasks = appState.currentUser.tasks;
    for (let i=0; i < tasks.length; i++) {
      if (tasks[i].id == id) {
        tasks.splice(i, 1);
      }
    };
    addToStorageUsers();
    let deleteTask = document.getElementById(`${id}`);
    deleteTask.remove();
    dropdownMenuСompletion();
    document.querySelector('.tasks-editor').style.display = 'none';
/*     btn.removeEventListener('click', a); */
}

function addChangeTaskInStorage(task) {
  let btn = document.getElementById('tasks-editor__btn');
  btn.addEventListener('click', function a(){
    task.name = document.querySelector('.tasks-editor__name').value;
    task.description = document.querySelector('.tasks-editor__description').value;
    findAndChengeTask(task.id, task);
    replacementTaskOnScreen(task);
    dropdownMenuСompletion();
    btn.removeEventListener('click', a);
  });
}

function replacementTaskOnScreen(task) {
  let remoteNode = document.getElementById(`${task.id}`);
  remoteNode.remove();
  createNode(task);
  addListenerToEditTask(task.id);
  document.querySelector('.tasks-editor').style.display = 'none';
}

function findTask(id) {
  let tasks = appState.currentUser.tasks;
  for (let i=0; i < tasks.length; i++) {
    if (tasks[i].id == id) {
      return tasks[i];
    }
  }
}

function findAndChengeTask(id, task) {
  let tasks = appState.currentUser.tasks;
  for (let i=0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      appState.currentUser.tasks[i] = task;
    }
  }
  addToStorageUsers();
}

function dropdownMenuСompletion() {
  let menuReady = document.querySelector(".dropdown__ready");
  let btnReady = document.querySelector(".ready__btn");
  let menuProgress = document.querySelector(".dropdown__progress");
  let btnProgress = document.querySelector(".progress__btn");
  let menuFinished = document.querySelector(".dropdown__finished");
  let btnFinished = document.querySelector(".finished__btn");
  let tasks = appState.currentUser.tasks;

  while (menuReady.firstChild) {
    menuReady.removeChild(menuReady.firstChild);
  }
  while (menuProgress.firstChild) {
    menuProgress.removeChild(menuProgress.firstChild);
  }
  while (menuFinished.firstChild) {
    menuFinished.removeChild(menuFinished.firstChild);
  }

  for (let i=0; i < tasks.length; i++) {
    if (tasks[i].stat === "backlog") {
      let li = document.createElement('li');
      let a = document.createElement('a');
      a.setAttribute("id", tasks[i].id);
      a.textContent = tasks[i].name;
      a.classList.add('dropdown-item');
      li.append(a);
      menuReady.prepend(li);
    }
  }

  for (let i=0; i < tasks.length; i++) {
    if (tasks[i].stat === "ready") {
      let li = document.createElement('li');
      let a = document.createElement('a');
      a.setAttribute("id", tasks[i].id);
      a.textContent = tasks[i].name;
      a.classList.add('dropdown-item');
      li.append(a);
      menuProgress.prepend(li);
    }
  }

  for (let i=0; i < tasks.length; i++) {
    if (tasks[i].stat === "progress") {
      let li = document.createElement('li');
      let a = document.createElement('a');
      a.setAttribute("id", tasks[i].id);
      a.textContent = tasks[i].name;
      a.classList.add('dropdown-item');
      li.append(a);
      menuFinished.prepend(li);
    }
  }

  if (menuReady.hasChildNodes()) {
    btnReady.classList.remove("disabled");
  } else {
    btnReady.classList.add("disabled");
    menuReady.classList.remove("show");
  }
  if (menuProgress.hasChildNodes()) {
    btnProgress.classList.remove("disabled");
  } else {
    btnProgress.classList.add("disabled");
    menuProgress.classList.remove("show");
  }
  if (menuFinished.hasChildNodes()) {
    btnFinished.classList.remove("disabled");
  } else {
    btnFinished.classList.add("disabled");
    menuFinished.classList.remove("show");
  }
  addTaskToReady();
  addTaskToProgress();
  addTaskToFinished();
}

function addTaskToReady() {
  let menu = document.querySelector(".dropdown__ready");
  for (let i=0; i < menu.childNodes.length; i++) {
    menu.childNodes[i].addEventListener('click', function() {
      chengeStatusTask(menu.childNodes[i].childNodes[0].getAttribute('id'), "ready");
      dropdownMenuСompletion();
    });
  }
}

function addTaskToProgress() {
  let menu = document.querySelector(".dropdown__progress");
  for (let i=0; i < menu.childNodes.length; i++) {
    menu.childNodes[i].addEventListener('click', function() {
      chengeStatusTask(menu.childNodes[i].childNodes[0].getAttribute('id'), "progress");
      dropdownMenuСompletion();
    });
  }
}

function addTaskToFinished() {
  let menu = document.querySelector(".dropdown__finished");
  for (let i=0; i < menu.childNodes.length; i++) {
    menu.childNodes[i].addEventListener('click', function() {
      chengeStatusTask(menu.childNodes[i].childNodes[0].getAttribute('id'), "finished");
      dropdownMenuСompletion();
    });
  }
}


function chengeStatusTask(deleteNodeId, stat) {
  let deleteTask = document.getElementById(`${deleteNodeId}`);
  deleteTask.remove();
  dropdownMenuСompletion();
  let task = findTask(deleteNodeId);
  task.stat = stat;
  createNode(task);
  findAndChengeTask(deleteNodeId, task);
  addToStorageUsers();
  addListenerToEditTask(task.id);
}


function addListenerEditUsers() {
  let btnHeader = document.querySelector('.header-btn__add-users');
  let btnClose = document.getElementById('admin-editor__btn');
  let btnAdd = document.querySelector('.admin-editor-btn__add-user');
  let btnDelete = document.querySelector('.admin-editor-btn__delete');
  let inputLoginAdd = document.querySelector('.admin-editor__login-add');
  let inputPassordAdd = document.querySelector('.admin-editor__password-add');
  let inputLoginDelete = document.querySelector('.admin-editor__login-delete');
  let inputPassordDelete = document.querySelector('.admin-editor__password-delete');
  let addInfo = document.querySelector('.add-info');
  let deleteInfo = document.querySelector('.delete-info');

  btnHeader.addEventListener('click', function(){
    document.querySelector('.admin-editor').style.display = 'block';
  });

  
  btnClose.addEventListener('click', function(){
    document.querySelector('.admin-editor').style.display = 'none';
    if(inputLoginAdd.value !== '') {
      inputLoginAdd.value = '';
    }
    if(inputPassordAdd.value !== '') {
      inputPassordAdd.value = '';
    }
    if(inputLoginDelete.value !=='') {
      inputLoginDelete.value = '';
    }
    if(inputPassordDelete.value !== '') {
      inputPassordDelete.value = '';
    }
    addInfo.innerText = 'Add user to LocalStorage';
    deleteInfo.innerText = 'Remove user from LocalStorage'
  });

  
  btnAdd.addEventListener('click', function(){
    generateTestUser(User, inputLoginAdd.value, inputPassordAdd.value, 'users');
    addInfo.innerText = `User ${inputLoginAdd.value} added in LocalStorege`;
    chooseKabnanDropdown();
  });

  btnDelete.addEventListener('click', function(){
    deleteUser(inputLoginDelete.value, inputPassordDelete.value);
    deleteInfo.innerText = `User ${inputLoginDelete.value} removed from LocalStorege`
  });

}

function deleteUser(login, password) {
  let users = getFromStorage('users');
  for (let i=0; i < users.length; i++) {
    if (users[i].login == login && users[i].password == password) {
      users.splice(i, 1);
    }
  }
  localStorage.setItem('users', JSON.stringify(users));
  chooseKabnanDropdown();
}
