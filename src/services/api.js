// src/services/api.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';
const ACCESS_URL = 'http://127.0.0.1:10086';  // 环境监测服务器地址

// 用户相关接口
export const login = async (username, password) => {
  return axios.get(`${API_URL}/user/login`, { params: { username, password } });
};

export const register = async (username, password) => {
  return axios.post(`${API_URL}/user/register`, { username, password });
};

// 场景相关接口
export const addScene = async (sceneData) => {
  return axios.put(`${API_URL}/config/scene/add`, sceneData);
};

export const removeScene = async (sceneId) => {
  return axios.put(`${API_URL}/config/scene/remove`, { scene_id: sceneId });
};

export const updateScene = async (sceneData) => {
  return axios.put(`${API_URL}/config/scene/update`, sceneData);
};

export const getAllScenes = async () => {
  return axios.get(`${API_URL}/config/scene/findAll`);
};

export const getSceneById = async (sceneId) => {
  return axios.get(`${API_URL}/config/scene/findById`, { params: { scene_id: sceneId } });
};

// 规则相关接口
export const addRule = async (ruleData) => {
  return axios.put(`${API_URL}/config/rule/add`, ruleData);
};

export const removeRule = async (ruleId) => {
  return axios.put(`${API_URL}/config/rule/remove`, { rule_id: ruleId });
};

export const updateRule = async (ruleData) => {
  return axios.put(`${API_URL}/config/rule/update`, ruleData);
};

export const getAllRules = async (sceneId) => {
  return axios.get(`${API_URL}/config/rule/findAll`, { params: { scene_id: sceneId } });
};

export const getRuleById = async (sceneId, ruleId) => {
  return axios.get(`${API_URL}/config/rule/findById`, { 
    params: { 
      scene_id: sceneId,
      rule_id: ruleId 
    } 
  });
};

// 环境状态接口
export const getEnvironmentStatus = async () => {
  return axios.get(`${ACCESS_URL}/status`);
};