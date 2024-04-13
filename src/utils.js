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
  dropdownMenuСompletion();
  completionTaskField();
  countTask();
};

export const generateNoAccess = function (noAccessTemplate) {
  document.querySelector("#content").innerHTML = noAccessTemplate;
};

function completionTaskField() {
  let tasks = appState.currentUser.tasks;
  for (let index = 0; index < tasks.length; index++) {
    createNode(tasks[index]);
    addListenerToEditTask(tasks[index].id);
  };
};

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
  
  for(let i=0; i < allUser.length; i++) {
    if(allUser[i].id === currentUser.id) {
      allUser[i] = currentUser;
      localStorage.clear();
      localStorage.setItem('users', JSON.stringify(allUser));
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
  element.addEventListener('click', function(){
    let editor = document.querySelector('.tasks-editor');
    editor.style.display = 'block';
    let task = findTask(id);
    document.querySelector('.tasks-editor__name').value = task.name;
    document.getElementById('tasks-editor__btn').value = task.description;

    addChangeTaskInStorage(task);
  });
}

function addChangeTaskInStorage(task) {
  let btn = document.getElementById('tasks-editor__btn');
  btn.addEventListener('click', function(){
    task.name = document.querySelector('.tasks-editor__name').value;
    task.description = document.querySelector('.tasks-editor__description').value;
    findAndChengeTask(task.id, task);
    replacementTaskOnScreen(task.id, task);
    dropdownMenuСompletion();
  });
}

function replacementTaskOnScreen(id, task) {
  let remoteNode = document.getElementById(`${id}`);
  remoteNode.remove();
  createNode(task);
  addListenerToEditTask(id);
  document.querySelector('.tasks-editor').style.display = 'none';
  addToStorageUsers();
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


function chengeStatusTask (deleteNodeId, stat) {
  let deleteTask = document.getElementById(`${deleteNodeId}`);
  deleteTask.remove();
  dropdownMenuСompletion();
  let task = findTask(deleteNodeId);
  task.stat = stat;
  createNode(task);
  findAndChengeTask(deleteNodeId, task);
  addToStorageUsers();
  addListenerToEditTask(deleteNodeId);
}

