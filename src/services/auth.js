import { User } from "../models/User";
import { appState } from "../app";

export const authUser = function (login, password) {
  const user = new User(login, password);
  if (!user.hasAccessUsers) return false;
  appState.currentUser.flag = 'online';

  let currentUser = appState.currentUser;
  let allUser = JSON.parse(localStorage.users);
  let allAdmin = JSON.parse(localStorage.admins);

  for(let i=0; i < allUser.length; i++) {
    if(allUser[i].id == currentUser.id) {
      allUser[i] = currentUser;
      localStorage.setItem('users', JSON.stringify(allUser));
    }
  };
  for(let i=0; i < allAdmin.length; i++) {
    if(allAdmin[i].id == currentUser.id) {
      allAdmin[i] = currentUser;
      localStorage.setItem('admins', JSON.stringify(allAdmin));
    }
  };
  return true;
};
