// src/services/api.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';
const ACCESS_URL = 'http://127.0.0.1:10086';  // 环境监测服务器地址

// 用户相关接口
export const login = async (username, password) => {
  return axios.post(`${API_URL}/user/login`, { username, password });
};

export const register = async (username, password) => {
  return axios.post(`${API_URL}/user/register`, { username, password });
};

// 场景配置相关接口
export const addScene = async (sceneData) => {
  return axios.post(`${API_URL}/config/scene/add`, sceneData);
};

export const removeScene = async (sceneId) => {
  return axios.post(`${API_URL}/config/scene/remove`, { scene_id: sceneId });
};

export const updateScene = async (sceneData) => {
  return axios.post(`${API_URL}/config/scene/update`, sceneData);
};

export const getAllScenes = async () => {
  return axios.post(`${API_URL}/config/scene/findAll`);
};

export const getSceneById = async (sceneId) => {
  return axios.post(`${API_URL}/config/scene/findById`, { scene_id: sceneId });
};

// 规则配置相关接口
export const addRule = async (sceneId, ruleData) => {
  return axios.post(`${API_URL}/config/rule/add`, { scene_id: sceneId, ...ruleData });
};

export const removeRule = async (sceneId, ruleId) => {
  return axios.post(`${API_URL}/config/rule/remove`, { scene_id: sceneId, rule_id: ruleId });
};

export const updateRule = async (sceneId, ruleId, ruleData) => {
  return axios.post(`${API_URL}/config/rule/update`, { 
    scene_id: sceneId, 
    rule_id: ruleId, 
    ...ruleData 
  });
};

export const getAllRules = async (sceneId) => {
  return axios.post(`${API_URL}/config/rule/findAll`, { scene_id: sceneId });
};

export const getRuleById = async (sceneId, ruleId) => {
  return axios.post(`${API_URL}/config/rule/findById`, { 
    scene_id: sceneId, 
    rule_id: ruleId 
  });
};

// 场景执行相关接口
export const switchScene = async (sceneId) => {
  return axios.post(`${API_URL}/execute/switch`, { scene_id: sceneId });
};

export const switchToDefaultScene = async () => {
  return axios.post(`${API_URL}/execute/default`);
};

// 场景历史记录相关接口
export const getAllBehaviors = async (sceneId) => {
  return axios.post(`${API_URL}/history/behavior/findAll`, { scene_id: sceneId });
};

export const getUserBehaviors = async (userId, sceneId) => {
  return axios.post(`${API_URL}/history/behavior/findByUsername`, { 
    user_id: userId, 
    scene_id: sceneId 
  });
};

export const recoverScene = async (sceneId) => {
  return axios.post(`${API_URL}/history/bin/recover`, { scene_id: sceneId });
};

export const clearRecycleBin = async () => {
  return axios.post(`${API_URL}/history/bin/remove`);
};

export const getRecycleBinScenes = async () => {
  return axios.post(`${API_URL}/history/bin/findAll`);
};

// 场景推荐相关接口
export const getRecommendations = async () => {
  return axios.post(`${API_URL}/recommend`);
};

// 设备配置相关接口
export const updateDeviceState = async (payload) => {
  return await axios.post(`${API_URL}/device/update`, payload, {
    headers: {'Content-Type': 'application/json'}
  });
};

export const getAllDeviceStates = async () => {
  return axios.post(`${API_URL}/device/states`);
};

// 环境状态接口
export const getEnvironmentStatus = async () => {
  return axios.get(`${ACCESS_URL}/environment`);
};