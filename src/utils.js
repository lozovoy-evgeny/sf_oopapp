import newTask from "./templates/newTask.html";


export const getFromStorage = function (key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
};

export const addToStorage = function (obj, key) {
  const storageData = getFromStorage(key);
  storageData.push(obj);
  localStorage.setItem(key, JSON.stringify(storageData));
};

export const generateTestUser = function (User) {
  localStorage.clear();
  const testUser = new User("1", "1");
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
    
    let input = document.getElementById('backlog');
    input.insertAdjacentHTML('beforebegin', newTask);

  });
}