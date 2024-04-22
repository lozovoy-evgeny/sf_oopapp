import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/style.css";
import taskFieldTemplate from "./templates/taskField.html";
import noAccessTemplate from "./templates/noAccess.html";
import dropdownMenuTemplate from "./templates/dropdownMenu.html";
import dropdownMenuTemplateAdmin from "./templates/dropdownMenuAdmin.html"
import { User } from "./models/User";
import { addToStorageUsers, generateTestUser } from "./utils";
import { generateTaskField } from "./utils";
import { generateNoAccess, getFromStorage } from "./utils";
import { State } from "./state";
import { authUser } from "./services/auth";

export const appState = new State();

const loginForm = document.querySelector("#app-login-form");



/* localStorage.clear(); */
if(localStorage.admins == undefined) {
  generateTestUser(User, 'admin', 'admin', 'admins');
}
if(localStorage.users == undefined) {
  generateTestUser(User, '1', '1', 'users');
}

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(loginForm);
  const login = formData.get("login");
  const password = formData.get("password");

  authUser(login, password)
    ? generateTaskField(taskFieldTemplate, dropdownMenuTemplate, dropdownMenuTemplateAdmin)
    : generateNoAccess(noAccessTemplate);
});

autoLog();

function autoLog() {
  let users = getFromStorage('users');
  let admins = getFromStorage('admins');

  for(let i=0; i < users.length; i++) {
    if(users[i].flag == 'online') {
      appState.currentUser = users[i];
      generateTaskField(taskFieldTemplate, dropdownMenuTemplate, dropdownMenuTemplateAdmin);
    }
  };
  for(let i=0; i < admins.length; i++) {
    if(admins[i].flag == 'online') {
      appState.currentUser = admins[i];
      generateTaskField(taskFieldTemplate, dropdownMenuTemplate, dropdownMenuTemplateAdmin);
    }
  };
}