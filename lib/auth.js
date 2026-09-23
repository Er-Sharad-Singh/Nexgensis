import api from "./axios";

export function loginUser(username, password) {
  return api.post("/auth/login", {
    username,
    password,
  });
}

export function logoutUser() {
  localStorage.removeItem("token");
}

