import { BaseModel } from "./BaseModel";
import { getFromStorage, addToStorage } from "../utils";
import { appState } from "../app";

export class User extends BaseModel {
  constructor(login, password, storageKey) {
    super();
    this.login = login;
    this.password = password;
    this.storageKey = storageKey;
    this.tasks = new Array();
    this.flag = '';
  }
  get hasAccessUsers() {
    let users = getFromStorage('users');
    let admins = getFromStorage('admins');
    if (users.length == 0 || admins.length == 0) return false;
    for (let user of users) {
      if (user.flag == 'onlane') {
        appState.currentUser = user;
        return true;
      }
      if (user.login == this.login && user.password == this.password) {
        appState.currentUser = user;
        return true;
      }    
    }
    for (let admin of admins) {
      if (admin.flag == 'onlane') {
        appState.currentUser = admin;
        return true;
      }
      if (admin.login == this.login && admin.password == this.password) {
        appState.currentUser = admin;
        return true;
      }    
    }
    return false;
  }
  static save(user) {
    try {
      addToStorage(user, user.storageKey);
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }
}
