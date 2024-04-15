import { User } from "../models/User";

export const authUser = function (login, password) {
  const user = new User(login, password);
  if (!user.hasAccessUsers) return false;
  return true;
};
