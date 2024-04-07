import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/style.css";
import taskFieldTemplate from "./templates/taskField.html";
import noAccessTemplate from "./templates/noAccess.html";
import dropdownMenuTemplate from "./templates/dropdownMenu.html";
import { User } from "./models/User";
import { generateTestUser } from "./utils";
import { generateTaskField } from "./utils";
import { generateNoAccess } from "./utils";

import { State } from "./state";
import { authUser } from "./services/auth";

export const appState = new State();

const loginForm = document.querySelector("#app-login-form");

localStorage.clear();
generateTestUser(User, '1', '1');
generateTestUser(User, '2', '2');

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(loginForm);
  const login = formData.get("login");
  const password = formData.get("password");

  authUser(login, password)
    ? generateTaskField(taskFieldTemplate, dropdownMenuTemplate)
    : generateNoAccess(noAccessTemplate);
});

