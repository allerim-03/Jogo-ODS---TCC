import axios from "axios";

const API_URL = "http://localhost:5000"; // ajustar se for deploy

export async function login(email, senha) {
  return axios.post(`${API_URL}/login`, { email, senha });
}

export async function cadastro(email, senha) {
  return axios.post(`${API_URL}/cadastro`, { email, senha });
}
