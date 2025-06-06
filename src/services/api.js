// src/services/api.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

export const login = async (username, password) => {
  return axios.get(`${API_URL}/user/login`, { params: { username, password } });
};

export const register = async (username, password) => {
  return axios.post(`${API_URL}/user/register`, { username, password });
};

export const getDevices = async () => {
  return axios.get(`${API_URL}/devices`);
};

export const getScenes = async () => {
  return axios.get(`${API_URL}/scenes`);
};

export const getRecommendations = async () => {
  return axios.get(`${API_URL}/recommendations`);
};