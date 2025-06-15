// src/components/SceneConfigUI/SceneConfigUI.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getAllScenes, addScene, updateScene, removeScene, updateSceneField, updateSceneDevice, executeActivate, executeDeactivate, getAllRules, ruleUpdateField, addRule, removeRule } from '../../services/api';
import { DEVICE_TYPES, DEVICE_TYPES_CN, DEVICE_RANGES } from '../../constants/deviceTypes';
import { showSuccessTip, showErrorTip } from '../../services/tools';

const PageContainer = styled.div`
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  font-family: Arial, sans-serif;
  padding: 20px;
  box-sizing: border-box;
  color: white;
  position: relative;
  overflow-y: auto;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1200px;
  width: 100%;
`;

const SceneList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
  margin-top: 20px;
`;

const SceneCard = styled.div`
  background: ${props => props.isActive ? 'rgba(66, 133, 244, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.isActive ? 'rgba(66, 133, 244, 0.4)' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: white;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
  }
`;

const ActiveBadge = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  background: rgba(66, 133, 244, 0.9);
  color: white;
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(66, 133, 244, 0.8);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  white-space: nowrap;
  flex-shrink: 0;
  min-width: fit-content;

  &:hover {
    background: rgba(51, 103, 214, 0.9);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const DeleteButton = styled(Button)`
  background: rgba(220, 53, 69, 0.8);
  &:hover {
    background: rgba(200, 35, 51, 0.9);
  }
`;

const DeactivateButton = DeleteButton;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 20px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  color: white;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const InputGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
  
  label {
    color: white;
    min-width: 80px;
  }
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const DeviceStateCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  color: white;
`;

const StateItem = styled.div`
  display: flex;
  align-items: center;
  margin: 8px 0;
  
  span {
    margin-right: 10px;
    &:first-child {
      font-weight: bold;
      width: 100px;
    }
  }
`;

const DeviceTitle = styled.h3`
  margin: 0 0 10px 0;
  color: white;
  text-transform: capitalize;
`;

const DeviceInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  margin-bottom: 15px;
  color: white;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const InfoLabel = styled.span`
  font-weight: bold;
  color: white;
`;

const InfoValue = styled.span`
  color: white;
`;

const DeviceConfigSection = styled.div`
  margin-top: 15px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  
  h3 {
    margin: 0 0 10px 0;
    color: white;
  }
`;

const ConfigButton = styled(Button)`
  background: rgba(255, 255, 255, 0.2);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  &.active {
    background: rgba(66, 133, 244, 0.8);
  }
`;

const DeviceStatus = styled.div`
  margin-top: 15px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
`;

const StatusItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
  color: white;
`;

const StatusLabel = styled.span`
  font-weight: bold;
`;

const StatusValue = styled.span`
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
`;

const DeviceControls = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;

const ValueController = styled.div`
  display: flex;
  align-items: center;
`;

const ValueButton = styled.button`
  padding: 4px 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 4px;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const ValueDisplay = styled.span`
  margin: 0 10px;
  color: white;
`;

const EnableButton = styled(Button)`
  background: ${props => props.enabled ? 'rgba(220, 53, 69, 0.8)' : 'rgba(40, 167, 69, 0.8)'};
  
  &:hover {
    background: ${props => props.enabled ? 'rgba(200, 35, 51, 0.9)' : 'rgba(33, 136, 56, 0.9)'};
  }
`;

const SceneDetailHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const SceneDetailTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  
  h2 {
    margin: 0;
  }
`;

const SceneStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  background: ${props => props.enabled ? 'rgba(40, 167, 69, 0.8)' : 'rgba(220, 53, 69, 0.8)'};
`;

const PriorityBadge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.2);
`;

const ActivateButton = styled(Button)`
  background: ${props => props.isActive ? 'rgba(158, 158, 158, 0.3)' : 'rgba(46, 204, 113, 0.8)'};
  cursor: ${props => props.isActive ? 'default' : 'pointer'};
  border: 1px solid ${props => props.isActive ? 'rgba(158, 158, 158, 0.4)' : 'rgba(46, 204, 113, 0.4)'};
  
  &:hover {
    background: ${props => props.isActive ? 'rgba(158, 158, 158, 0.3)' : 'rgba(46, 204, 113, 0.9)'};
    transform: ${props => props.isActive ? 'none' : 'translateY(-1px)'};
  }
`;

const CardActionButtonWrapper = styled.div`
  position: absolute;
  top: 12px;
  right: 16px;
  z-index: 2;
`;

const SceneConfigUI = () => {
  const [scenes, setScenes] = useState(() => {
    // 初始化时尝试从 localStorage 获取缓存的场景数据
    const cachedScenes = localStorage.getItem('scenes');
    return cachedScenes ? JSON.parse(cachedScenes) : [];
  });
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingScene, setEditingScene] = useState(null);
  const [selectedScene, setSelectedScene] = useState(null);
  const [sceneRules, setSceneRules] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    priority: 0,
    enabled: 0,
    device_type: '',
    config: {}
  });
  const [currentSceneId, setCurrentSceneId] = useState(null);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [editingRuleScene, setEditingRuleScene] = useState(null);
  const [ruleEditStates, setRuleEditStates] = useState({}); // 新增：规则编辑本地状态
  const [newRule, setNewRule] = useState(null); // 新增：新规则编辑状态
  const [selectedConditionType, setSelectedConditionType] = useState(''); // 新增：选中的条件类型
  const [timeCondition, setTimeCondition] = useState({ start: '08:00', end: '18:00' }); // 新增：时间条件状态
  const [ruleConditionTypes, setRuleConditionTypes] = useState({}); // 新增：每个规则的条件类型
  const [ruleTimeConditions, setRuleTimeConditions] = useState({}); // 新增：每个规则的时间条件
  const [modalConditionType, setModalConditionType] = useState(''); // 新增：模态框的条件类型
  const [modalTimeCondition, setModalTimeCondition] = useState({ start: '08:00', end: '18:00' }); // 新增：模态框的时间条件
  const [weekCondition, setWeekCondition] = useState([1, 2, 3, 4, 5]); // 新增：星期条件状态
  const [ruleWeekConditions, setRuleWeekConditions] = useState({}); // 新增：每个规则的星期条件
  const [modalWeekCondition, setModalWeekCondition] = useState([1, 2, 3, 4, 5]); // 新增：模态框的星期条件
  const [dateCondition, setDateCondition] = useState({ start: '2024-01-01', end: '2024-12-31' }); // 新增：日期条件状态
  const [temperatureCondition, setTemperatureCondition] = useState({ operator: 'gt', value: 25 }); // 新增：温度条件状态
  const [humidityCondition, setHumidityCondition] = useState({ operator: 'gt', value: 60 }); // 新增：湿度条件状态
  const [lightCondition, setLightCondition] = useState({ operator: 'lt', value: 300 }); // 新增：光照条件状态
  const [ruleDateConditions, setRuleDateConditions] = useState({}); // 新增：每个规则的日期条件
  const [modalDateCondition, setModalDateCondition] = useState({ start: '2024-01-01', end: '2024-12-31' }); // 新增：模态框的日期条件
  const [ruleTemperatureConditions, setRuleTemperatureConditions] = useState({}); // 新增：每个规则的温度条件
  const [ruleHumidityConditions, setRuleHumidityConditions] = useState({}); // 新增：每个规则的湿度条件
  const [ruleLightConditions, setRuleLightConditions] = useState({}); // 新增：每个规则的光照条件
  const [modalTemperatureCondition, setModalTemperatureCondition] = useState({ operator: 'gt', value: 25 }); // 新增：模态框的温度条件
  const [modalHumidityCondition, setModalHumidityCondition] = useState({ operator: 'gt', value: 60 }); // 新增：模态框的湿度条件
  const [modalLightCondition, setModalLightCondition] = useState({ operator: 'lt', value: 300 }); // 新增：模态框的光照条件

  useEffect(() => {
    fetchScenes();

    // 监听监控数据更新
    const handleMonitorDataUpdate = (event) => {
      const data = event.detail;
      if (data) {
        setCurrentSceneId(data.active);
      }
    };

    // 初始化时从localStorage读取当前场景
    const savedData = localStorage.getItem('monitorData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setCurrentSceneId(data.active);
    }


    window.addEventListener('monitorDataUpdate', handleMonitorDataUpdate);
    return () => {
      window.removeEventListener('monitorDataUpdate', handleMonitorDataUpdate);
    };
  }, []);

  const fetchScenes = async () => {
    try {
      const response = await getAllScenes();
      const scenesData = response.data.data || [];
      setScenes(scenesData);
      console.log('获取到的场景数据:', response.data);
    } catch (error) {
      console.error('获取场景列表失败:', error);
      setScenes([]);
      // 清除缓存的场景数据
      localStorage.removeItem('scenes');
    }
  };

  const handleCreateScene = () => {
    setEditingScene(null);
    setFormData({
      name: '新建场景',
      priority: 0,
      enabled: 0,
      device_type: '',
      config: {
        conditioner: {
          power: 'off',
          temperature: 24,
          speed: 'medium',
          mode: 'cool'
        },
        lamp: {
          power: 'off',
          brightness: 800,
          color: 'neutral'
        },
        dehumidifier: {
          power: 'off',
          humidity: 50,
          level: 'auto'
        },
        curtain: {
          power: 'off',
          position: 50,
          style: 'sheer'
        }
      }
    });
    setShowModal(true);
  };

  const handleEditScene = (scene) => {
    setEditingScene(scene);
    setFormData({
      name: scene.name,
      priority: scene.priority || 0,
      enabled: scene.enabled || 0,
      device_type: scene.device_type,
      config: scene.config || {}
    });
    setShowModal(true);
  };

  const handleDeleteScene = async (sceneId) => {
    if (window.confirm('确定要删除这个场景吗？')) {
      try {
        await removeScene(sceneId);
        await fetchScenes();
      } catch (error) {
        console.error('删除场景失败:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingScene) {
        await handleEditSubmit();
      } else {
        await handleCreateSubmit();
      }
      setShowModal(false);
      fetchScenes(); // 刷新场景列表
    } catch (error) {
      console.error('表单提交失败:', error);
    }
  };

  const handleEditSubmit = async () => {
    // 更新场景名称
    if (editingScene.name !== formData.name) {
      const payload = {
        scene_id: editingScene.scene_id,
        field: "name",
        value: formData.name
      };
      try {
        await updateSceneField(payload);
        // console.log('更新场景名称成功');
      } catch (error) {
        // console.error('更新场景名称失败:', error);
        throw error;
      }
    }

    // 更新优先级
    if (editingScene.priority !== formData.priority) {
      const payload = {
        scene_id: editingScene.scene_id,
        field: "priority",
        value: formData.priority
      };
      try {
        await updateSceneField(payload);
        // console.log('更新优先级成功');
      } catch (error) {
        // console.error('更新优先级失败:', error);
        throw error;
      }
    }

    // 更新启用状态
    if (editingScene.enabled !== formData.enabled) {
      const payload = {
        scene_id: editingScene.scene_id,
        field: "enabled",
        value: formData.enabled
      };
      try {
        await updateSceneField(payload);
        // console.log('更新启用状态成功');
      } catch (error) {
        // console.error('更新启用状态失败:', error);
        throw error;
      }
    }

    // 更新所有修改过的设备配置
    const oldConfig = editingScene.config || {};
    const newConfig = formData.config || {};
    
    // 遍历所有设备类型
    for (const deviceType of Object.keys(newConfig)) {
      const oldDeviceConfig = oldConfig[deviceType] || {};
      const newDeviceConfig = newConfig[deviceType] || {};
      
      // 比较新旧配置，找出需要更新的属性
      for (const [attribute, value] of Object.entries(newDeviceConfig)) {
        if (value !== oldDeviceConfig[attribute]) {
          const payload = {
            scene_id: editingScene.scene_id,
            device_name: deviceType,
            attribute: attribute,
            value: value
          };
          try {
            await updateSceneDevice(payload);
            // console.log(`更新设备配置: ${deviceType}.${attribute} = ${value}`);
          } catch (error) {
            showErrorTip("场景编辑失败");
            // console.error(`更新设备配置失败: ${deviceType}.${attribute}`, error);
            throw error;
          }
        }
      }
    }
    showSuccessTip("场景编辑成功");
  };

  const handleCreateSubmit = async () => {
    // 创建新场景时的数据处理
    const creator = localStorage.getItem('username');
    if (!creator) {
      console.error('未找到用户信息');
      throw new Error('未找到用户信息');
    }

    // 使用formData中的完整config，包含所有设备的配置
    const payload = {
      name: formData.name,
      creator: creator,
      config: formData.config,  // 直接使用完整的config对象
      priority: formData.priority || 0,
      enabled: formData.enabled || 0
    };
    console.log('创建新场景的payload:', payload);
    try {
      const response = await addScene(payload);
      showSuccessTip("创建新场景成功");
      console.log('创建新场景成功:', response);
    } catch (error) {
      showErrorTip("创建新场景失败");
      console.error('创建新场景失败:', error);
      throw error;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleViewDetail = async (scene) => {
    setSelectedScene(scene);
    setShowDetailModal(true);
    
    // 获取场景规则
    try {
      const response = await getAllRules(scene.scene_id);
      // 确保response.data.data是数组
      const rulesData = Array.isArray(response.data.data) ? response.data.data : [];
      setSceneRules(prev => ({
        ...prev,
        [scene.scene_id]: rulesData
      }));
    } catch (error) {
      console.error('获取场景规则失败:', error);
      setSceneRules(prev => ({
        ...prev,
        [scene.scene_id]: []
      }));
    }
  };

  const handleDeviceConfigChange = (key, value) => {
    const deviceType = formData.device_type;
    const deviceConfig = formData.config[deviceType] || {};
    let newValue = value;

    // 处理数值类型的参数
    if (DEVICE_RANGES[deviceType] && DEVICE_RANGES[deviceType][key]) {
      const range = DEVICE_RANGES[deviceType][key];
      const currentValue = deviceConfig[key] || range.min;
      
      if (value === 'increase') {
        newValue = Math.min(range.max, currentValue + range.step);
      } else if (value === 'decrease') {
        newValue = Math.max(range.min, currentValue - range.step);
      } else {
        // 确保直接设置的值也在范围内
        newValue = Math.max(range.min, Math.min(range.max, value));
      }
    }

    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config,
        [deviceType]: {
          ...prev.config[deviceType],
          [key]: newValue
        }
      }
    }));
  };

  const handleConfigButtonClick = (e, key, value) => {
    e.preventDefault(); // 阻止表单提交
    handleDeviceConfigChange(key, value);
  };

  // 激活场景
  const handleActivateScene = async (sceneId) => {
    try {
      const username = localStorage.getItem('username');
      if (!username) {
        showErrorTip('未找到用户信息');
        return;
      }

      const response = await executeActivate(sceneId, username);
      // console.log(response);
      if (response.data && response.data.code === 501) {
        showErrorTip('操作失败，请先启用该场景');
        return;
      }
      else {
        showSuccessTip('场景已激活');
      }
    } catch (error) {
      console.error('激活场景失败:', error);
      showErrorTip('激活场景失败');
    }
  };

  // 停用场景
  const handleDeactivateScene = async () => {
    try {
      const response = await executeDeactivate();
      console.log(response);
      showSuccessTip('场景已停用');
    } catch (error) {
      console.error('停用场景失败:', error);
      showErrorTip('停用场景失败');
    }
  };

  // 编辑规则按钮点击事件
  const handleEditRule = async (scene) => {
    setEditingRuleScene(scene);
    setShowRuleModal(true);
    // 获取规则（如果未获取过）
    if (!sceneRules[scene.scene_id]) {
      try {
        const response = await getAllRules(scene.scene_id);
        const rulesArr = Array.isArray(response.data.data) ? response.data.data : [];
        setSceneRules(prev => ({
          ...prev,
          [scene.scene_id]: rulesArr
        }));
        // 初始化本地编辑状态
        const editStates = {};
        rulesArr.forEach(rule => {
          editStates[rule.rule_id] = {
            priority: rule.priority,
            enabled: rule.enabled,
            condition: typeof rule.condition === 'string' ? rule.condition : JSON.stringify(rule.condition, null, 2)
          };
        });
        setRuleEditStates(editStates);
      } catch (error) {
        setSceneRules(prev => ({ ...prev, [scene.scene_id]: [] }));
        setRuleEditStates({});
      }
    } else {
      // 已有规则，直接初始化本地编辑状态
      const rulesArr = sceneRules[scene.scene_id];
      const editStates = {};
      rulesArr.forEach(rule => {
        editStates[rule.rule_id] = {
          priority: rule.priority,
          enabled: rule.enabled,
          condition: typeof rule.condition === 'string' ? rule.condition : JSON.stringify(rule.condition, null, 2)
        };
      });
      setRuleEditStates(editStates);
    }
  };

  const renderDeviceState = (deviceType, state) => {
    if (!state) return null;

    switch (deviceType) {
      case 'conditioner':
        return (
          <DeviceInfo>
            <DeviceTitle>空调</DeviceTitle>
            <InfoItem>
              <InfoLabel>电源状态</InfoLabel>
              <InfoValue>{state.power === 'on' ? '开启' : '关闭'}</InfoValue>
            </InfoItem>
            {state.power === 'on' && (
              <>
                <InfoItem>
                  <InfoLabel>当前温度</InfoLabel>
                  <InfoValue>{state.temperature || '--'}°C</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>运行模式</InfoLabel>
                  <InfoValue>
                    {state.mode === 'cool' ? '制冷' : 
                     state.mode === 'heat' ? '制热' : '--'}
                  </InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>风速</InfoLabel>
                  <InfoValue>
                    {state.speed === 'low' ? '低速' :
                     state.speed === 'medium' ? '中速' : 
                     state.speed === 'high' ? '高速' : '--'}
                  </InfoValue>
                </InfoItem>
              </>
            )}
          </DeviceInfo>
        );
      
      case 'lamp':
        return (
          <DeviceInfo>
            <DeviceTitle>智能灯</DeviceTitle>
            <InfoItem>
              <InfoLabel>电源状态</InfoLabel>
              <InfoValue>{state.power === 'on' ? '开启' : '关闭'}</InfoValue>
            </InfoItem>
            {state.power === 'on' && (
              <>
                <InfoItem>
                  <InfoLabel>当前亮度</InfoLabel>
                  <InfoValue>{state.brightness || '--'} lm</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>色温</InfoLabel>
                  <InfoValue>
                    {state.color === 'warm' ? '暖白' :
                     state.color === 'neutral' ? '正白' : 
                     state.color === 'cool' ? '冷白' : '--'}
                  </InfoValue>
                </InfoItem>
              </>
            )}
          </DeviceInfo>
        );

      case 'dehumidifier':
        return (
          <DeviceInfo>
            <DeviceTitle>除湿器</DeviceTitle>
            <InfoItem>
              <InfoLabel>电源状态</InfoLabel>
              <InfoValue>{state.power === 'on' ? '开启' : '关闭'}</InfoValue>
            </InfoItem>
            {state.power === 'on' && (
              <>
                <InfoItem>
                  <InfoLabel>当前设定湿度</InfoLabel>
                  <InfoValue>{state.humidity || '--'}%</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>运行等级</InfoLabel>
                  <InfoValue>
                    {state.level === 'auto' ? '自动' :
                     state.level === 'powerful' ? '强力' : 
                     state.level === 'quiet' ? '静音' : '--'}
                  </InfoValue>
                </InfoItem>
              </>
            )}
          </DeviceInfo>
        );

      case 'fan':
        return (
          <DeviceInfo>
            <DeviceTitle>风扇</DeviceTitle>
            <InfoItem>
              <InfoLabel>电源状态</InfoLabel>
              <InfoValue>{state.power === 'on' ? '开启' : '关闭'}</InfoValue>
            </InfoItem>
            {state.power === 'on' && (
              <InfoItem>
                <InfoLabel>风速</InfoLabel>
                <InfoValue>
                  {state.speed === 'low' ? '低速' :
                   state.speed === 'medium' ? '中速' : 
                   state.speed === 'high' ? '高速' : '--'}
                </InfoValue>
              </InfoItem>
            )}
          </DeviceInfo>
        );

      case 'curtain':
        return (
          <DeviceInfo>
            <DeviceTitle>窗帘</DeviceTitle>
            <InfoItem>
              <InfoLabel>电源状态</InfoLabel>
              <InfoValue>{state.power === 'on' ? '开启' : '关闭'}</InfoValue>
            </InfoItem>
            {state.power === 'on' && (
              <>
                <InfoItem>
                  <InfoLabel>当前开合度</InfoLabel>
                  <InfoValue>{state.position || '--'}%</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>窗帘样式</InfoLabel>
                  <InfoValue>
                    {state.style === 'sunshade' ? '遮阳帘' :
                     state.style === 'sheer' ? '薄纱帘' : 
                     state.style === 'blind' ? '百叶帘' : '--'}
                  </InfoValue>
                </InfoItem>
              </>
            )}
          </DeviceInfo>
        );

      default:
        return null;
    }
  };

  const renderDeviceConfig = () => {
    if (!formData.device_type) return null;

    const deviceConfig = formData.config[formData.device_type] || {};
    const ranges = DEVICE_RANGES[formData.device_type] || {};

    switch (formData.device_type) {
      case DEVICE_TYPES.CONDITIONER:
        return (
          <DeviceConfigSection>
            <h3>空调</h3>
            <DeviceControls>
              <ConfigButton 
                onClick={(e) => handleConfigButtonClick(e, 'power', deviceConfig.power === 'on' ? 'off' : 'on')}
                className={deviceConfig.power === 'on' ? 'active' : ''}
                type="button"
              >
                {deviceConfig.power === 'on' ? '关闭' : '开启'}
              </ConfigButton>
              {deviceConfig.power === 'on' && (
                <>
                  {ranges.modes.map(mode => (
                    <ConfigButton 
                      key={mode}
                      onClick={(e) => handleConfigButtonClick(e, 'mode', mode)}
                      className={deviceConfig.mode === mode ? 'active' : ''}
                      type="button"
                    >
                      {mode === 'cool' ? '制冷' : '制热'}
                    </ConfigButton>
                  ))}
                  {ranges.speeds.map(speed => (
                    <ConfigButton 
                      key={speed}
                      onClick={(e) => handleConfigButtonClick(e, 'speed', speed)}
                      className={deviceConfig.speed === speed ? 'active' : ''}
                      type="button"
                    >
                      {speed === 'low' ? '低速' :
                       speed === 'medium' ? '中速' : '高速'}
                    </ConfigButton>
                  ))}
                </>
              )}
            </DeviceControls>
            {deviceConfig.power === 'on' && (
              <DeviceInfo>
                <InfoItem>
                  <InfoLabel>温度设置</InfoLabel>
                  <ValueController>
                    <ValueButton 
                      onClick={(e) => handleConfigButtonClick(e, 'temperature', 'decrease')}
                      type="button"
                    >-</ValueButton>
                    <ValueDisplay>
                      {(deviceConfig.temperature || ranges.temperature.min) + ranges.temperature.unit}
                    </ValueDisplay>
                    <ValueButton 
                      onClick={(e) => handleConfigButtonClick(e, 'temperature', 'increase')}
                      type="button"
                    >+</ValueButton>
                  </ValueController>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>运行模式</InfoLabel>
                  <InfoValue>
                    {deviceConfig.mode === 'cool' ? '制冷' : 
                     deviceConfig.mode === 'heat' ? '制热' : '--'}
                  </InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>风速</InfoLabel>
                  <InfoValue>
                    {deviceConfig.speed === 'low' ? '低速' :
                     deviceConfig.speed === 'medium' ? '中速' : 
                     deviceConfig.speed === 'high' ? '高速' : '--'}
                  </InfoValue>
                </InfoItem>
              </DeviceInfo>
            )}
          </DeviceConfigSection>
        );

      case DEVICE_TYPES.LAMP:
        return (
          <DeviceConfigSection>
            <h3>智能灯</h3>
            <DeviceControls>
              <ConfigButton 
                onClick={(e) => handleConfigButtonClick(e, 'power', deviceConfig.power === 'on' ? 'off' : 'on')}
                className={deviceConfig.power === 'on' ? 'active' : ''}
                type="button"
              >
                {deviceConfig.power === 'on' ? '关闭' : '开启'}
              </ConfigButton>
              {deviceConfig.power === 'on' && (
                <>
                  {ranges.colors.map(color => (
                    <ConfigButton 
                      key={color}
                      onClick={(e) => handleConfigButtonClick(e, 'color', color)}
                      className={deviceConfig.color === color ? 'active' : ''}
                      type="button"
                    >
                      {color === 'warm' ? '暖白' :
                       color === 'neutral' ? '正白' : '冷白'}
                    </ConfigButton>
                  ))}
                </>
              )}
            </DeviceControls>
            {deviceConfig.power === 'on' && (
              <DeviceInfo>
                <InfoItem>
                  <InfoLabel>亮度设置</InfoLabel>
                  <ValueController>
                    <ValueButton 
                      onClick={(e) => handleConfigButtonClick(e, 'brightness', 'decrease')}
                      type="button"
                    >-</ValueButton>
                    <ValueDisplay>
                      {(deviceConfig.brightness || ranges.brightness.min) + ranges.brightness.unit}
                    </ValueDisplay>
                    <ValueButton 
                      onClick={(e) => handleConfigButtonClick(e, 'brightness', 'increase')}
                      type="button"
                    >+</ValueButton>
                  </ValueController>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>色温</InfoLabel>
                  <InfoValue>
                    {deviceConfig.color === 'warm' ? '暖白' :
                     deviceConfig.color === 'neutral' ? '正白' : 
                     deviceConfig.color === 'cool' ? '冷白' : '--'}
                  </InfoValue>
                </InfoItem>
              </DeviceInfo>
            )}
          </DeviceConfigSection>
        );

      case DEVICE_TYPES.DEHUMIDIFIER:
        return (
          <DeviceConfigSection>
            <h3>除湿器</h3>
            <DeviceControls>
              <ConfigButton 
                onClick={(e) => handleConfigButtonClick(e, 'power', deviceConfig.power === 'on' ? 'off' : 'on')}
                className={deviceConfig.power === 'on' ? 'active' : ''}
                type="button"
              >
                {deviceConfig.power === 'on' ? '关闭' : '开启'}
              </ConfigButton>
              {deviceConfig.power === 'on' && (
                <>
                  {ranges.levels.map(level => (
                    <ConfigButton 
                      key={level}
                      onClick={(e) => handleConfigButtonClick(e, 'level', level)}
                      className={deviceConfig.level === level ? 'active' : ''}
                      type="button"
                    >
                      {level === 'auto' ? '自动' :
                       level === 'powerful' ? '强力' : '静音'}
                    </ConfigButton>
                  ))}
                </>
              )}
            </DeviceControls>
            {deviceConfig.power === 'on' && (
              <DeviceInfo>
                <InfoItem>
                  <InfoLabel>目标湿度</InfoLabel>
                  <ValueController>
                    <ValueButton 
                      onClick={(e) => handleConfigButtonClick(e, 'humidity', 'decrease')}
                      type="button"
                    >-</ValueButton>
                    <ValueDisplay>
                      {(deviceConfig.humidity || ranges.humidity.min) + ranges.humidity.unit}
                    </ValueDisplay>
                    <ValueButton 
                      onClick={(e) => handleConfigButtonClick(e, 'humidity', 'increase')}
                      type="button"
                    >+</ValueButton>
                  </ValueController>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>运行等级</InfoLabel>
                  <InfoValue>
                    {deviceConfig.level === 'auto' ? '自动' :
                     deviceConfig.level === 'powerful' ? '强力' : 
                     deviceConfig.level === 'quiet' ? '静音' : '--'}
                  </InfoValue>
                </InfoItem>
              </DeviceInfo>
            )}
          </DeviceConfigSection>
        );

      case DEVICE_TYPES.CURTAIN:
        return (
          <DeviceConfigSection>
            <h3>窗帘</h3>
            <DeviceControls>
              <ConfigButton 
                onClick={(e) => handleConfigButtonClick(e, 'power', deviceConfig.power === 'on' ? 'off' : 'on')}
                className={deviceConfig.power === 'on' ? 'active' : ''}
                type="button"
              >
                {deviceConfig.power === 'on' ? '关闭' : '开启'}
              </ConfigButton>
              {deviceConfig.power === 'on' && (
                <>
                  {ranges.styles.map(style => (
                    <ConfigButton 
                      key={style}
                      onClick={(e) => handleConfigButtonClick(e, 'style', style)}
                      className={deviceConfig.style === style ? 'active' : ''}
                      type="button"
                    >
                      {style === 'sunshade' ? '遮阳帘' :
                       style === 'sheer' ? '薄纱帘' : '百叶帘'}
                    </ConfigButton>
                  ))}
                </>
              )}
            </DeviceControls>
            {deviceConfig.power === 'on' && (
              <DeviceInfo>
                <InfoItem>
                  <InfoLabel>开合度设置</InfoLabel>
                  <ValueController>
                    <ValueButton 
                      onClick={(e) => handleConfigButtonClick(e, 'position', 'decrease')}
                      type="button"
                    >-</ValueButton>
                    <ValueDisplay>
                      {(deviceConfig.position || ranges.position.min) + ranges.position.unit}
                    </ValueDisplay>
                    <ValueButton 
                      onClick={(e) => handleConfigButtonClick(e, 'position', 'increase')}
                      type="button"
                    >+</ValueButton>
                  </ValueController>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>窗帘样式</InfoLabel>
                  <InfoValue>
                    {deviceConfig.style === 'sunshade' ? '遮阳帘' :
                     deviceConfig.style === 'sheer' ? '薄纱帘' : 
                     deviceConfig.style === 'blind' ? '百叶帘' : '--'}
                  </InfoValue>
                </InfoItem>
              </DeviceInfo>
            )}
          </DeviceConfigSection>
        );

      default:
        return null;
    }
  };

  const renderRules = (sceneId) => {
    const rules = sceneRules[sceneId];
    // 确保rules是数组
    if (!Array.isArray(rules) || rules.length === 0) {
      return (
        <DeviceInfo>
          <DeviceTitle>场景规则</DeviceTitle>
          <InfoItem>
            <InfoValue>暂无规则配置</InfoValue>
          </InfoItem>
        </DeviceInfo>
      );
    }

    // 辅助函数：获取操作符的中文描述
    const getOperatorText = (operator) => {
      const operatorMap = {
        'gt': '大于',
        'lt': '小于',
        'gte': '大于等于',
        'lte': '小于等于',
        'eq': '等于',
        'ne': '不等于',
        'range': '范围'
      };
      return operatorMap[operator] || operator;
    };

    // 辅助函数：获取星期的中文描述
    const getWeekdayText = (weekday) => {
      const weekdayMap = {
        1: '周一',
        2: '周二',
        3: '周三',
        4: '周四',
        5: '周五',
        6: '周六',
        7: '周日'
      };
      return weekdayMap[weekday] || weekday;
    };

    return (
      <DeviceInfo>
        <DeviceTitle>场景规则</DeviceTitle>
        {rules.map((rule, index) => {
          // 解析条件JSON
          let condition = {};
          try {
            condition = typeof rule.condition === 'string' ? JSON.parse(rule.condition) : rule.condition;
          } catch (e) {
            console.error('解析规则条件失败:', e);
            condition = {};
          }

          return (
            <InfoItem key={rule.rule_id || index}>
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <InfoLabel>规则 {index + 1}</InfoLabel>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <StatusBadge enabled={rule.enabled === 1}>
                      {rule.enabled === 1 ? '已启用' : '已禁用'}
                    </StatusBadge>
                    <PriorityBadge>
                      优先级：{rule.priority || 0}
                    </PriorityBadge>
                  </div>
                </div>
                <div style={{ marginLeft: '10px' }}>
                  {/* 温度条件 */}
                  {condition.temperature && (
                    <div style={{ marginBottom: '10px' }}>
                      <InfoLabel>温度条件：</InfoLabel>
                      {condition.temperature.operator === 'range' ? (
                        <InfoValue>
                          {condition.temperature.min}°C ~ {condition.temperature.max}°C
                        </InfoValue>
                      ) : (
                        <InfoValue>
                          {getOperatorText(condition.temperature.operator)} {condition.temperature.value}°C
                        </InfoValue>
                      )}
                    </div>
                  )}

                  {/* 光照条件 */}
                  {condition.illumination && (
                    <div style={{ marginBottom: '10px' }}>
                      <InfoLabel>光照条件：</InfoLabel>
                      {condition.illumination.operator === 'range' ? (
                        <InfoValue>
                          {condition.illumination.min} lux ~ {condition.illumination.max} lux
                        </InfoValue>
                      ) : (
                        <InfoValue>
                          {getOperatorText(condition.illumination.operator)} {condition.illumination.value} lux
                        </InfoValue>
                      )}
                    </div>
                  )}

                  {/* 湿度条件 */}
                  {condition.humidity && (
                    <div style={{ marginBottom: '10px' }}>
                      <InfoLabel>湿度条件：</InfoLabel>
                      {condition.humidity.operator === 'range' ? (
                        <InfoValue>
                          {condition.humidity.min}% ~ {condition.humidity.max}%
                        </InfoValue>
                      ) : (
                        <InfoValue>
                          {getOperatorText(condition.humidity.operator)} {condition.humidity.value}%
                        </InfoValue>
                      )}
                    </div>
                  )}

                  {/* 时间条件 */}
                  {condition.time && (
                    <div style={{ marginBottom: '10px' }}>
                      <InfoLabel>时间条件：</InfoLabel>
                      <InfoValue>
                        {condition.time.start} ~ {condition.time.end}
                      </InfoValue>
                    </div>
                  )}

                  {/* 星期条件 */}
                  {condition.week && (
                    <div style={{ marginBottom: '10px' }}>
                      <InfoLabel>星期条件：</InfoLabel>
                      <InfoValue>
                        {condition.week.map(getWeekdayText).join('、')}
                      </InfoValue>
                    </div>
                  )}

                  {/* 日期条件 */}
                  {condition.date && (
                    <div style={{ marginBottom: '10px' }}>
                      <InfoLabel>日期条件：</InfoLabel>
                      <InfoValue>
                        {condition.date.start} 至 {condition.date.end}
                      </InfoValue>
                    </div>
                  )}
                </div>
              </div>
            </InfoItem>
          );
        })}
      </DeviceInfo>
    );
  };

  return (
    <PageContainer>
      <Container>
      <h1>场景配置</h1>
      <Button onClick={handleCreateScene}>创建新场景</Button>
      <SceneList>
          {scenes.map(scene => (
            <SceneCard 
              key={scene.scene_id} 
              isActive={currentSceneId === scene.scene_id}
            >
              <CardActionButtonWrapper>
                {currentSceneId === scene.scene_id ? (
                  <DeactivateButton
                    onClick={handleDeactivateScene}
                  >
                    停用
                  </DeactivateButton>
                ) : (
                  <ActivateButton
                    onClick={() => handleActivateScene(scene.scene_id)}
                    isActive={false}
                  >
                    激活
                  </ActivateButton>
                )}
              </CardActionButtonWrapper>
              {currentSceneId === scene.scene_id && (
                <ActiveBadge>当前场景</ActiveBadge>
              )}
            <h3>{scene.name}</h3>
            <ButtonGroup>
              <Button onClick={() => handleViewDetail(scene)}>查看详情</Button>
                <Button onClick={() => handleEditScene(scene)}>编辑场景</Button>
                <Button onClick={() => handleEditRule(scene)}>编辑规则</Button>
                <DeleteButton onClick={() => handleDeleteScene(scene.scene_id)}>删除</DeleteButton>
            </ButtonGroup>
          </SceneCard>
        ))}
      </SceneList>

      {showModal && (
        <Modal>
          <ModalContent>
            <h2>{editingScene ? '编辑场景' : '创建场景'}</h2>
            <Form onSubmit={handleSubmit}>
                <InputGroup>
                  <label>场景名称</label>
              <Input
                type="text"
                name="name"
                placeholder="场景名称"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
                </InputGroup>
                <InputGroup>
                  <label>优先级</label>
                  <Input
                    type="number"
                    name="priority"
                    placeholder="优先级"
                    value={formData.priority}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                  />
                  <EnableButton
                    type="button"
                    enabled={formData.enabled === 1}
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      enabled: prev.enabled === 1 ? 0 : 1
                    }))}
                  >
                    {formData.enabled === 1 ? '禁用场景' : '启用场景'}
                  </EnableButton>
                </InputGroup>
              <Select
                name="device_type"
                value={formData.device_type}
                onChange={handleInputChange}
              >
                  <option value="">选择设备类型（可选）</option>
                {Object.values(DEVICE_TYPES).map(type => (
                    <option key={type} value={type}>{DEVICE_TYPES_CN[type]}</option>
                ))}
              </Select>
                {renderDeviceConfig()}
              <ButtonGroup>
                <Button type="submit">保存</Button>
                <Button type="button" onClick={() => setShowModal(false)}>取消</Button>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}

      {showDetailModal && selectedScene && (
        <Modal>
          <ModalContent>
              <SceneDetailHeader>
                <SceneDetailTitle>
            <h2>场景详情：{selectedScene.name}</h2>
                </SceneDetailTitle>
                <SceneStatus>
                  <StatusBadge enabled={selectedScene.enabled === 1}>
                    {selectedScene.enabled === 1 ? '已启用' : '已禁用'}
                  </StatusBadge>
                  <PriorityBadge>
                    优先级：{selectedScene.priority || 0}
                  </PriorityBadge>
                </SceneStatus>
              </SceneDetailHeader>
            <div style={{ marginBottom: '20px', maxHeight: '60vh', overflow: 'auto', padding: '10px' }}>
              {renderDeviceState('conditioner', selectedScene.config?.conditioner)}
              {renderDeviceState('lamp', selectedScene.config?.lamp)}
              {renderDeviceState('dehumidifier', selectedScene.config?.dehumidifier)}
              {renderDeviceState('fan', selectedScene.config?.fan)}
              {renderDeviceState('curtain', selectedScene.config?.curtain)}
              {renderRules(selectedScene.scene_id)}
            </div>
            <ButtonGroup>
              <Button onClick={() => setShowDetailModal(false)}>关闭</Button>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}

      {/* 编辑规则模态框 */}
      {showRuleModal && editingRuleScene && (
        <Modal>
          <ModalContent style={{ maxWidth: '700px', width: '95%' }}>
            <div style={{ 
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)', 
              paddingBottom: '15px', 
              marginBottom: '20px' 
            }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>编辑规则 - {editingRuleScene.name}</h2>
            </div>
            <div style={{ 
              marginBottom: '20px', 
              maxHeight: '65vh', 
              overflow: 'auto', 
              padding: '0 5px',
              scrollbarWidth: 'thin'
            }}>
              {((sceneRules[editingRuleScene.scene_id] || []).length === 0) ? (
                // 没有任何规则时
                newRule ? (
                  <DeviceInfo>
                    <DeviceTitle>新建规则</DeviceTitle>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px', marginBottom: '15px' }}>
                         <InfoItem style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                           <InfoLabel style={{ marginBottom: '8px' }}>优先级：</InfoLabel>
                           <Input
                             type="number"
                             value={newRule.priority}
                             min={0}
                             max={100}
                             onChange={e => setNewRule(prev => ({ ...prev, priority: Number(e.target.value) }))}
                             style={{ width: '100%', padding: '8px 12px', maxWidth: '120px' }}
                           />
                         </InfoItem>
                         <InfoItem style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                           <InfoLabel style={{ marginBottom: '8px' }}>启用状态：</InfoLabel>
                           <EnableButton
                             type="button"
                             enabled={newRule.enabled === 1}
                             onClick={() => setNewRule(prev => ({ ...prev, enabled: newRule.enabled === 1 ? 0 : 1 }))}
                             style={{ width: '100%', maxWidth: '100px', fontSize: '14px', padding: '8px 4px' }}
                           >
                             {newRule.enabled === 1 ? '启用' : '禁用'}
                           </EnableButton>
                         </InfoItem>
                       </div>
                    <InfoItem style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                         <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                           <InfoLabel>条件（JSON格式）：</InfoLabel>
                           <select
                             value={selectedConditionType}
                             onChange={e => {
                               const conditionType = e.target.value;
                               setSelectedConditionType(conditionType);
                               
                               if (conditionType) {
                                 const templates = {
                                   temperature: `{\n  "temperature": {\n    "operator": "${temperatureCondition.operator}",\n    "value": ${temperatureCondition.value}\n  }\n}`,
                                   humidity: `{\n  "humidity": {\n    "operator": "${humidityCondition.operator}",\n    "value": ${humidityCondition.value}\n  }\n}`,
                                   light: `{\n  "light": {\n    "operator": "${lightCondition.operator}",\n    "value": ${lightCondition.value}\n  }\n}`,
                                   motion: '{\n  "motion": {\n    "operator": "eq",\n    "value": true\n  }\n}',
                                   time: `{\n  "time": {\n    "start": "${timeCondition.start}",\n    "end": "${timeCondition.end}"\n  }\n}`,
                                   week: `{\n  "week": [${weekCondition.join(', ')}]\n}`,
                                   date: `{\n  "date": {\n    "start": "${dateCondition.start}",\n    "end": "${dateCondition.end}"\n  }\n}`
                                 };
                                 
                                 setNewRule(prev => ({ ...prev, condition: templates[conditionType] }));
                               }
                             }}
                             style={{
                               padding: '6px 12px',
                               borderRadius: '4px',
                               border: '1px solid rgba(255, 255, 255, 0.3)',
                               background: 'rgba(0, 0, 0, 0.2)',
                               color: 'white',
                               fontSize: '14px'
                             }}
                           >
                             <option value="">选择条件模板...</option>
                             <option value="temperature">温度条件</option>
                             <option value="humidity">湿度条件</option>
                             <option value="light">光照条件</option>
                             <option value="motion">运动检测</option>
                             <option value="time">时间条件</option>
                             <option value="week">星期条件</option>
                             <option value="date">日期条件</option>
                           </select>
                           
                           {/* 时间条件专用输入框 */}
                           {selectedConditionType === 'time' && (
                             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '12px' }}>
                               <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>从</span>
                               <input
                                 type="time"
                                 value={timeCondition.start}
                                 onChange={e => {
                                   const newTimeCondition = { ...timeCondition, start: e.target.value };
                                   setTimeCondition(newTimeCondition);
                                   setNewRule(prev => ({ 
                                     ...prev, 
                                     condition: `{\n  "time": {\n    "start": "${newTimeCondition.start}",\n    "end": "${newTimeCondition.end}"\n  }\n}` 
                                   }));
                                 }}
                                 style={{
                                   padding: '4px 8px',
                                   borderRadius: '4px',
                                   border: '1px solid rgba(255, 255, 255, 0.3)',
                                   background: 'rgba(0, 0, 0, 0.2)',
                                   color: 'white',
                                   fontSize: '14px'
                                 }}
                               />
                               <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>到</span>
                               <input
                                 type="time"
                                 value={timeCondition.end}
                                 onChange={e => {
                                   const newTimeCondition = { ...timeCondition, end: e.target.value };
                                   setTimeCondition(newTimeCondition);
                                   setNewRule(prev => ({ 
                                     ...prev, 
                                     condition: `{\n  "time": {\n    "start": "${newTimeCondition.start}",\n    "end": "${newTimeCondition.end}"\n  }\n}` 
                                   }));
                                 }}
                                 style={{
                                   padding: '4px 8px',
                                   borderRadius: '4px',
                                   border: '1px solid rgba(255, 255, 255, 0.3)',
                                   background: 'rgba(0, 0, 0, 0.2)',
                                   color: 'white',
                                   fontSize: '14px'
                                 }}
                               />
                             </div>
                           )}
                           
                           {/* 温度条件专用选择框 */}
                           {selectedConditionType === 'temperature' && (
                             <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginLeft: '12px', marginTop: '8px' }}>
                               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                 <span style={{ color: 'white', fontSize: '14px' }}>操作:</span>
                                 <select
                                   value={temperatureCondition.operator}
                                   onChange={e => {
                                     const newTemperatureCondition = { ...temperatureCondition, operator: e.target.value };
                                     setTemperatureCondition(newTemperatureCondition);
                                     setNewRule(prev => ({ 
                                       ...prev, 
                                       condition: `{\n  "temperature": {\n    "operator": "${newTemperatureCondition.operator}",\n    "value": ${newTemperatureCondition.value}\n  }\n}` 
                                     }));
                                   }}
                                   style={{
                                     padding: '6px 8px',
                                     border: '1px solid rgba(255, 255, 255, 0.3)',
                                     borderRadius: '4px',
                                     background: 'rgba(0, 0, 0, 0.2)',
                                     color: 'white',
                                     fontSize: '14px'
                                   }}
                                 >
                                   <option value="gt">大于</option>
                                   <option value="lt">小于</option>
                                   <option value="eq">等于</option>
                                 </select>
                               </div>
                               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                 <span style={{ color: 'white', fontSize: '14px' }}>值:</span>
                                 <input
                                   type="number"
                                   value={temperatureCondition.value}
                                   onChange={e => {
                                     const newTemperatureCondition = { ...temperatureCondition, value: parseInt(e.target.value) };
                                     setTemperatureCondition(newTemperatureCondition);
                                     setNewRule(prev => ({ 
                                       ...prev, 
                                       condition: `{\n  "temperature": {\n    "operator": "${newTemperatureCondition.operator}",\n    "value": ${newTemperatureCondition.value}\n  }\n}` 
                                     }));
                                   }}
                                   style={{
                                     padding: '6px 8px',
                                     border: '1px solid rgba(255, 255, 255, 0.3)',
                                     borderRadius: '4px',
                                     background: 'rgba(0, 0, 0, 0.2)',
                                     color: 'white',
                                     fontSize: '14px',
                                     width: '80px'
                                   }}
                                 />
                               </div>
                             </div>
                           )}
                           
                           {/* 湿度条件专用选择框 */}
                           {selectedConditionType === 'humidity' && (
                             <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginLeft: '12px', marginTop: '8px' }}>
                               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                 <span style={{ color: 'white', fontSize: '14px' }}>操作:</span>
                                 <select
                                   value={humidityCondition.operator}
                                   onChange={e => {
                                     const newHumidityCondition = { ...humidityCondition, operator: e.target.value };
                                     setHumidityCondition(newHumidityCondition);
                                     setNewRule(prev => ({ 
                                       ...prev, 
                                       condition: `{\n  "humidity": {\n    "operator": "${newHumidityCondition.operator}",\n    "value": ${newHumidityCondition.value}\n  }\n}` 
                                     }));
                                   }}
                                   style={{
                                     padding: '6px 8px',
                                     border: '1px solid rgba(255, 255, 255, 0.3)',
                                     borderRadius: '4px',
                                     background: 'rgba(0, 0, 0, 0.2)',
                                     color: 'white',
                                     fontSize: '14px'
                                   }}
                                 >
                                   <option value="gt">大于</option>
                                   <option value="lt">小于</option>
                                   <option value="eq">等于</option>
                                 </select>
                               </div>
                               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                 <span style={{ color: 'white', fontSize: '14px' }}>值:</span>
                                 <input
                                   type="number"
                                   value={humidityCondition.value}
                                   onChange={e => {
                                     const newHumidityCondition = { ...humidityCondition, value: parseInt(e.target.value) };
                                     setHumidityCondition(newHumidityCondition);
                                     setNewRule(prev => ({ 
                                       ...prev, 
                                       condition: `{\n  "humidity": {\n    "operator": "${newHumidityCondition.operator}",\n    "value": ${newHumidityCondition.value}\n  }\n}` 
                                     }));
                                   }}
                                   style={{
                                     padding: '6px 8px',
                                     border: '1px solid rgba(255, 255, 255, 0.3)',
                                     borderRadius: '4px',
                                     background: 'rgba(0, 0, 0, 0.2)',
                                     color: 'white',
                                     fontSize: '14px',
                                     width: '80px'
                                   }}
                                 />
                               </div>
                             </div>
                           )}
                           
                           {/* 光照条件专用选择框 */}
                           {selectedConditionType === 'light' && (
                             <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginLeft: '12px', marginTop: '8px' }}>
                               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                 <span style={{ color: 'white', fontSize: '14px' }}>操作:</span>
                                 <select
                                   value={lightCondition.operator}
                                   onChange={e => {
                                     const newLightCondition = { ...lightCondition, operator: e.target.value };
                                     setLightCondition(newLightCondition);
                                     setNewRule(prev => ({ 
                                       ...prev, 
                                       condition: `{\n  "light": {\n    "operator": "${newLightCondition.operator}",\n    "value": ${newLightCondition.value}\n  }\n}` 
                                     }));
                                   }}
                                   style={{
                                     padding: '6px 8px',
                                     border: '1px solid rgba(255, 255, 255, 0.3)',
                                     borderRadius: '4px',
                                     background: 'rgba(0, 0, 0, 0.2)',
                                     color: 'white',
                                     fontSize: '14px'
                                   }}
                                 >
                                   <option value="gt">大于</option>
                                   <option value="lt">小于</option>
                                   <option value="eq">等于</option>
                                 </select>
                               </div>
                               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                 <span style={{ color: 'white', fontSize: '14px' }}>值:</span>
                                 <input
                                   type="number"
                                   value={lightCondition.value}
                                   onChange={e => {
                                     const newLightCondition = { ...lightCondition, value: parseInt(e.target.value) };
                                     setLightCondition(newLightCondition);
                                     setNewRule(prev => ({ 
                                       ...prev, 
                                       condition: `{\n  "light": {\n    "operator": "${newLightCondition.operator}",\n    "value": ${newLightCondition.value}\n  }\n}` 
                                     }));
                                   }}
                                   style={{
                                     padding: '6px 8px',
                                     border: '1px solid rgba(255, 255, 255, 0.3)',
                                     borderRadius: '4px',
                                     background: 'rgba(0, 0, 0, 0.2)',
                                     color: 'white',
                                     fontSize: '14px',
                                     width: '80px'
                                   }}
                                 />
                               </div>
                             </div>
                           )}
                           
                           {/* 星期条件专用选择框 */}
                           {selectedConditionType === 'week' && (
                             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginLeft: '12px', marginTop: '8px' }}>
                               {[
                                 { value: 1, label: '周一' },
                                 { value: 2, label: '周二' },
                                 { value: 3, label: '周三' },
                                 { value: 4, label: '周四' },
                                 { value: 5, label: '周五' },
                                 { value: 6, label: '周六' },
                                 { value: 0, label: '周日' }
                               ].map(day => (
                                 <label key={day.value} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'white', fontSize: '14px', cursor: 'pointer' }}>
                                   <input
                                     type="checkbox"
                                     checked={weekCondition.includes(day.value)}
                                     onChange={e => {
                                       let newWeekCondition;
                                       if (e.target.checked) {
                                         newWeekCondition = [...weekCondition, day.value].sort((a, b) => a - b);
                                       } else {
                                         newWeekCondition = weekCondition.filter(d => d !== day.value);
                                       }
                                       setWeekCondition(newWeekCondition);
                                       setNewRule(prev => ({ 
                                         ...prev, 
                                         condition: `{\n  "week": [${newWeekCondition.join(', ')}]\n}` 
                                       }));
                                     }}
                                     style={{ marginRight: '4px' }}
                                   />
                                   {day.label}
                                 </label>
                               ))}
                             </div>
                           )}
                           
                           {/* 日期条件专用选择框 */}
                           {selectedConditionType === 'date' && (
                             <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginLeft: '12px', marginTop: '8px' }}>
                               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                 <span style={{ color: 'white', fontSize: '14px' }}>从</span>
                                 <input
                                   type="date"
                                   value={dateCondition.start}
                                   onChange={e => {
                                     const newDateCondition = { ...dateCondition, start: e.target.value };
                                     setDateCondition(newDateCondition);
                                     setNewRule(prev => ({ 
                                       ...prev, 
                                       condition: `{\n  "date": {\n    "start": "${newDateCondition.start}",\n    "end": "${newDateCondition.end}"\n  }\n}` 
                                     }));
                                   }}
                                   style={{
                                     padding: '8px 12px',
                                     border: '1px solid rgba(255, 255, 255, 0.3)',
                                     borderRadius: '4px',
                                     background: 'rgba(0, 0, 0, 0.2)',
                                     color: 'white',
                                     fontSize: '14px'
                                   }}
                                 />
                               </div>
                               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                 <span style={{ color: 'white', fontSize: '14px' }}>到</span>
                                 <input
                                   type="date"
                                   value={dateCondition.end}
                                   onChange={e => {
                                     const newDateCondition = { ...dateCondition, end: e.target.value };
                                     setDateCondition(newDateCondition);
                                     setNewRule(prev => ({ 
                                       ...prev, 
                                       condition: `{\n  "date": {\n    "start": "${newDateCondition.start}",\n    "end": "${newDateCondition.end}"\n  }\n}` 
                                     }));
                                   }}
                                   style={{
                                     padding: '8px 12px',
                                     border: '1px solid rgba(255, 255, 255, 0.3)',
                                     borderRadius: '4px',
                                     background: 'rgba(0, 0, 0, 0.2)',
                                     color: 'white',
                                     fontSize: '14px'
                                   }}
                                 />
                               </div>
                             </div>
                           )}
                         </div>
                         <textarea
                           value={newRule.condition}
                           onChange={e => setNewRule(prev => ({ ...prev, condition: e.target.value }))}
                           rows={8}
                           style={{ 
                             width: '100%', 
                             maxWidth: '100%',
                             boxSizing: 'border-box',
                             fontFamily: 'Consolas, Monaco, monospace', 
                             fontSize: '14px',
                             padding: '12px',
                             border: '1px solid rgba(255, 255, 255, 0.3)',
                             borderRadius: '6px',
                             background: 'rgba(0, 0, 0, 0.2)',
                             color: 'white',
                             resize: 'vertical',
                             minHeight: '120px',
                             overflow: 'auto'
                           }}
                           placeholder="请输入JSON格式的条件..."
                         />
                       </InfoItem>
                  </DeviceInfo>
                ) : (
                  <Button onClick={() => {
                    setNewRule({ priority: 0, enabled: 1, condition: '{\n  "temperature": {\n    "operator": "gt", \n    "value": 25\n  }\n}' });
                    setSelectedConditionType('');
                    setTimeCondition({ start: '08:00', end: '18:00' });
                  }} style={{ marginTop: 16 }}>+ 创建新规则</Button>
                )
              ) : (
                <>
                  {(sceneRules[editingRuleScene.scene_id] || []).map((rule, idx) => {
                    const editState = ruleEditStates[rule.rule_id] || {};
                    return (
                      <DeviceInfo key={rule.rule_id} style={{ position: 'relative' }}>
                        {/* 删除按钮 */}
                        <Button
                          style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(220,53,69,0.8)' }}
                          onClick={async () => {
                            if (window.confirm('确定要删除该规则吗？')) {
                              try {
                                await removeRule(rule.rule_id);
                                showSuccessTip('规则已删除');
                                // 刷新规则列表
                                const response = await getAllRules(editingRuleScene.scene_id);
                                setSceneRules(prev => ({
                                  ...prev,
                                  [editingRuleScene.scene_id]: Array.isArray(response.data.data) ? response.data.data : []
                                }));
                              } catch (e) {
                                showErrorTip('规则删除失败');
                              }
                            }
                          }}
                        >删除</Button>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                          <DeviceTitle style={{ margin: 0 }}>规则 {idx + 1}</DeviceTitle>
                          <div style={{ 
                            background: 'rgba(255, 255, 255, 0.1)', 
                            padding: '4px 8px', 
                            borderRadius: '4px', 
                            fontSize: '12px' 
                          }}>
                            ID: {rule.rule_id}
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px', marginBottom: '15px' }}>
                          <InfoItem style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                            <InfoLabel style={{ marginBottom: '8px' }}>优先级：</InfoLabel>
                            <Input
                              type="number"
                              value={editState.priority}
                              min={0}
                              max={100}
                              onChange={e => setRuleEditStates(prev => ({
                                ...prev,
                                [rule.rule_id]: { ...prev[rule.rule_id], priority: Number(e.target.value) }
                              }))}
                              style={{ width: '100%', padding: '8px 12px', maxWidth: '120px' }}
                            />
                          </InfoItem>
                          <InfoItem style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                            <InfoLabel style={{ marginBottom: '8px' }}>启用状态：</InfoLabel>
                            <EnableButton
                              type="button"
                              enabled={editState.enabled === 1}
                              onClick={() => setRuleEditStates(prev => ({
                                ...prev,
                                [rule.rule_id]: { ...prev[rule.rule_id], enabled: editState.enabled === 1 ? 0 : 1 }
                              }))}
                              style={{ width: '100%', maxWidth: '100px', fontSize: '14px', padding: '8px 4px' }}
                            >
                              {editState.enabled === 1 ? '启用' : '禁用'}
                            </EnableButton>
                          </InfoItem>
                        </div>
                        <InfoItem style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                          <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <InfoLabel>条件（JSON格式）：</InfoLabel>
                            <select
                              onChange={e => {
                                if (e.target.value) {
                                  // 更新条件类型
                                  setRuleConditionTypes(prev => ({
                                    ...prev,
                                    [rule.rule_id]: e.target.value
                                  }));
                                  
                                  const templates = {
                                    temperature: `{\n  "temperature": {\n    "operator": "${(ruleTemperatureConditions[rule.rule_id] || { operator: 'gt', value: 25 }).operator}",\n    "value": ${(ruleTemperatureConditions[rule.rule_id] || { operator: 'gt', value: 25 }).value}\n  }\n}`,
                                    humidity: `{\n  "humidity": {\n    "operator": "${(ruleHumidityConditions[rule.rule_id] || { operator: 'gt', value: 60 }).operator}",\n    "value": ${(ruleHumidityConditions[rule.rule_id] || { operator: 'gt', value: 60 }).value}\n  }\n}`,
                                    light: `{\n  "light": {\n    "operator": "${(ruleLightConditions[rule.rule_id] || { operator: 'lt', value: 300 }).operator}",\n    "value": ${(ruleLightConditions[rule.rule_id] || { operator: 'lt', value: 300 }).value}\n  }\n}`,
                                    motion: '{\n  "motion": {\n    "operator": "eq",\n    "value": true\n  }\n}',
                                    week: '{\n  "week": [1, 2, 3, 4, 5]\n}',
                                    date: '{\n  "date": {\n    "start": "2024-01-01",\n    "end": "2024-12-31"\n  }\n}'
                                  };
                                  
                                  if (e.target.value === 'time') {
                                    // 初始化时间条件
                                    const currentTimeCondition = ruleTimeConditions[rule.rule_id] || { start: '08:00', end: '18:00' };
                                    setRuleTimeConditions(prev => ({
                                      ...prev,
                                      [rule.rule_id]: currentTimeCondition
                                    }));
                                    setRuleEditStates(prev => ({
                                      ...prev,
                                      [rule.rule_id]: { 
                                        ...prev[rule.rule_id], 
                                        condition: `{\n  "time": {\n    "start": "${currentTimeCondition.start}",\n    "end": "${currentTimeCondition.end}"\n  }\n}` 
                                      }
                                    }));
                                  } else if (e.target.value === 'week') {
                                    // 初始化星期条件
                                    const currentWeekCondition = ruleWeekConditions[rule.rule_id] || [1, 2, 3, 4, 5];
                                    setRuleWeekConditions(prev => ({
                                      ...prev,
                                      [rule.rule_id]: currentWeekCondition
                                    }));
                                    setRuleEditStates(prev => ({
                                      ...prev,
                                      [rule.rule_id]: { 
                                        ...prev[rule.rule_id], 
                                        condition: `{\n  "week": [${currentWeekCondition.join(', ')}]\n}` 
                                      }
                                    }));
                                  } else if (e.target.value === 'date') {
                                    // 初始化日期条件
                                    const currentDateCondition = ruleDateConditions[rule.rule_id] || { start: '2024-01-01', end: '2024-12-31' };
                                    setRuleDateConditions(prev => ({
                                      ...prev,
                                      [rule.rule_id]: currentDateCondition
                                    }));
                                    setRuleEditStates(prev => ({
                                      ...prev,
                                      [rule.rule_id]: { 
                                        ...prev[rule.rule_id], 
                                        condition: `{\n  "date": {\n    "start": "${currentDateCondition.start}",\n    "end": "${currentDateCondition.end}"\n  }\n}` 
                                      }
                                    }));
                                  } else if (e.target.value === 'temperature') {
                                    // 初始化温度条件
                                    const currentTemperatureCondition = ruleTemperatureConditions[rule.rule_id] || { operator: 'gt', value: 25 };
                                    setRuleTemperatureConditions(prev => ({
                                      ...prev,
                                      [rule.rule_id]: currentTemperatureCondition
                                    }));
                                    setRuleEditStates(prev => ({
                                      ...prev,
                                      [rule.rule_id]: { 
                                        ...prev[rule.rule_id], 
                                        condition: `{\n  "temperature": {\n    "operator": "${currentTemperatureCondition.operator}",\n    "value": ${currentTemperatureCondition.value}\n  }\n}` 
                                      }
                                    }));
                                  } else if (e.target.value === 'humidity') {
                                    // 初始化湿度条件
                                    const currentHumidityCondition = ruleHumidityConditions[rule.rule_id] || { operator: 'gt', value: 60 };
                                    setRuleHumidityConditions(prev => ({
                                      ...prev,
                                      [rule.rule_id]: currentHumidityCondition
                                    }));
                                    setRuleEditStates(prev => ({
                                      ...prev,
                                      [rule.rule_id]: { 
                                        ...prev[rule.rule_id], 
                                        condition: `{\n  "humidity": {\n    "operator": "${currentHumidityCondition.operator}",\n    "value": ${currentHumidityCondition.value}\n  }\n}` 
                                      }
                                    }));
                                  } else if (e.target.value === 'light') {
                                    // 初始化光照条件
                                    const currentLightCondition = ruleLightConditions[rule.rule_id] || { operator: 'lt', value: 300 };
                                    setRuleLightConditions(prev => ({
                                      ...prev,
                                      [rule.rule_id]: currentLightCondition
                                    }));
                                    setRuleEditStates(prev => ({
                                      ...prev,
                                      [rule.rule_id]: { 
                                        ...prev[rule.rule_id], 
                                        condition: `{\n  "light": {\n    "operator": "${currentLightCondition.operator}",\n    "value": ${currentLightCondition.value}\n  }\n}` 
                                      }
                                    }));
                                  } else {
                                    setRuleEditStates(prev => ({
                                      ...prev,
                                      [rule.rule_id]: { ...prev[rule.rule_id], condition: templates[e.target.value] }
                                    }));
                                  }
                                }
                              }}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '4px',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                background: 'rgba(0, 0, 0, 0.2)',
                                color: 'white',
                                fontSize: '14px'
                              }}
                            >
                              <option value="">选择条件模板...</option>
                              <option value="temperature">温度条件</option>
                              <option value="humidity">湿度条件</option>
                              <option value="light">光照条件</option>
                              <option value="motion">运动检测</option>
                              <option value="time">时间条件</option>
                              <option value="week">星期条件</option>
                              <option value="date">日期条件</option>
                            </select>
                          </div>
                          {ruleConditionTypes[rule.rule_id] === 'time' && (
                            <div style={{ marginBottom: '12px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: 'white', fontSize: '14px' }}>从</span>
                                <input
                                  type="time"
                                  value={ruleTimeConditions[rule.rule_id]?.start || '08:00'}
                                  onChange={e => {
                                    const newRuleTimeCondition = { 
                                      ...ruleTimeConditions[rule.rule_id], 
                                      start: e.target.value 
                                    };
                                    setRuleTimeConditions(prev => ({
                                      ...prev,
                                      [rule.rule_id]: newRuleTimeCondition
                                    }));
                                    setRuleEditStates(prev => ({ 
                                      ...prev, 
                                      [rule.rule_id]: {
                                        ...prev[rule.rule_id],
                                        condition: `{\n  "time": {\n    "start": "${newRuleTimeCondition.start}",\n    "end": "${newRuleTimeCondition.end}"\n  }\n}`
                                      }
                                    }));
                                  }}
                                  style={{
                                    padding: '8px 12px',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    borderRadius: '4px',
                                    background: 'rgba(0, 0, 0, 0.2)',
                                    color: 'white',
                                    fontSize: '14px'
                                  }}
                                />
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: 'white', fontSize: '14px' }}>到</span>
                                <input
                                  type="time"
                                  value={ruleTimeConditions[rule.rule_id]?.end || '18:00'}
                                  onChange={e => {
                                    const newRuleTimeCondition = { 
                                      ...ruleTimeConditions[rule.rule_id], 
                                      end: e.target.value 
                                    };
                                    setRuleTimeConditions(prev => ({
                                      ...prev,
                                      [rule.rule_id]: newRuleTimeCondition
                                    }));
                                    setRuleEditStates(prev => ({ 
                                      ...prev, 
                                      [rule.rule_id]: {
                                        ...prev[rule.rule_id],
                                        condition: `{\n  "time": {\n    "start": "${newRuleTimeCondition.start}",\n    "end": "${newRuleTimeCondition.end}"\n  }\n}`
                                      }
                                    }));
                                  }}
                                  style={{
                                    padding: '8px 12px',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    borderRadius: '4px',
                                    background: 'rgba(0, 0, 0, 0.2)',
                                    color: 'white',
                                    fontSize: '14px'
                                  }}
                                />
                              </div>
                            </div>
                          )}
                          
                          {/* 星期条件专用选择框 */}
                          {ruleConditionTypes[rule.rule_id] === 'week' && (
                            <div style={{ marginBottom: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                              {[
                                { value: 1, label: '周一' },
                                { value: 2, label: '周二' },
                                { value: 3, label: '周三' },
                                { value: 4, label: '周四' },
                                { value: 5, label: '周五' },
                                { value: 6, label: '周六' },
                                { value: 0, label: '周日' }
                              ].map(day => (
                                <label key={day.value} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'white', fontSize: '14px', cursor: 'pointer' }}>
                                  <input
                                    type="checkbox"
                                    checked={(ruleWeekConditions[rule.rule_id] || []).includes(day.value)}
                                    onChange={e => {
                                      const currentWeekCondition = ruleWeekConditions[rule.rule_id] || [1, 2, 3, 4, 5];
                                      let newWeekCondition;
                                      if (e.target.checked) {
                                        newWeekCondition = [...currentWeekCondition, day.value].sort((a, b) => a - b);
                                      } else {
                                        newWeekCondition = currentWeekCondition.filter(d => d !== day.value);
                                      }
                                      setRuleWeekConditions(prev => ({
                                        ...prev,
                                        [rule.rule_id]: newWeekCondition
                                      }));
                                      setRuleEditStates(prev => ({ 
                                        ...prev, 
                                        [rule.rule_id]: {
                                          ...prev[rule.rule_id],
                                          condition: `{\n  "week": [${newWeekCondition.join(', ')}]\n}`
                                        }
                                      }));
                                    }}
                                    style={{ marginRight: '4px' }}
                                  />
                                  {day.label}
                                </label>
                              ))}
                            </div>
                          )}
                          
                          {/* 日期条件专用选择框 */}
                          {ruleConditionTypes[rule.rule_id] === 'date' && (
                            <div style={{ marginBottom: '12px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: 'white', fontSize: '14px' }}>从</span>
                                <input
                                  type="date"
                                  value={ruleDateConditions[rule.rule_id]?.start || '2024-01-01'}
                                  onChange={e => {
                                    const newRuleDateCondition = { 
                                      ...ruleDateConditions[rule.rule_id], 
                                      start: e.target.value 
                                    };
                                    setRuleDateConditions(prev => ({
                                      ...prev,
                                      [rule.rule_id]: newRuleDateCondition
                                    }));
                                    setRuleEditStates(prev => ({ 
                                      ...prev, 
                                      [rule.rule_id]: {
                                        ...prev[rule.rule_id],
                                        condition: `{\n  "date": {\n    "start": "${newRuleDateCondition.start}",\n    "end": "${newRuleDateCondition.end}"\n  }\n}`
                                      }
                                    }));
                                  }}
                                  style={{
                                    padding: '8px 12px',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    borderRadius: '4px',
                                    background: 'rgba(0, 0, 0, 0.2)',
                                    color: 'white',
                                    fontSize: '14px'
                                  }}
                                />
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: 'white', fontSize: '14px' }}>到</span>
                                <input
                                  type="date"
                                  value={ruleDateConditions[rule.rule_id]?.end || '2024-12-31'}
                                  onChange={e => {
                                    const newRuleDateCondition = { 
                                      ...ruleDateConditions[rule.rule_id], 
                                      end: e.target.value 
                                    };
                                    setRuleDateConditions(prev => ({
                                      ...prev,
                                      [rule.rule_id]: newRuleDateCondition
                                    }));
                                    setRuleEditStates(prev => ({ 
                                      ...prev, 
                                      [rule.rule_id]: {
                                        ...prev[rule.rule_id],
                                        condition: `{\n  "date": {\n    "start": "${newRuleDateCondition.start}",\n    "end": "${newRuleDateCondition.end}"\n  }\n}`
                                      }
                                    }));
                                  }}
                                  style={{
                                    padding: '8px 12px',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    borderRadius: '4px',
                                    background: 'rgba(0, 0, 0, 0.2)',
                                    color: 'white',
                                    fontSize: '14px'
                                  }}
                                />
                              </div>
                            </div>
                          )}
                          
                          <textarea
                            value={editState.condition}
                            onChange={e => setRuleEditStates(prev => ({
                              ...prev,
                              [rule.rule_id]: { ...prev[rule.rule_id], condition: e.target.value }
                            }))}
                            rows={8}
                            style={{ 
                              width: '100%', 
                              maxWidth: '100%',
                              boxSizing: 'border-box',
                              fontFamily: 'Consolas, Monaco, monospace', 
                              fontSize: '14px',
                              padding: '12px',
                              border: '1px solid rgba(255, 255, 255, 0.3)',
                              borderRadius: '6px',
                              background: 'rgba(0, 0, 0, 0.2)',
                              color: 'white',
                              resize: 'vertical',
                              minHeight: '120px',
                              overflow: 'auto'
                            }}
                            placeholder="请输入JSON格式的条件..."
                          />
                        </InfoItem>
                      </DeviceInfo>
                    );
                  })}
                  {newRule ? (
                    <DeviceInfo>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <DeviceTitle style={{ margin: 0 }}>新建规则</DeviceTitle>
                        <div style={{ 
                          background: 'rgba(34, 197, 94, 0.2)', 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          fontSize: '12px',
                          color: '#22c55e'
                        }}>
                          新规则
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px', marginBottom: '15px' }}>
                        <InfoItem style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                          <InfoLabel style={{ marginBottom: '8px' }}>优先级：</InfoLabel>
                          <Input
                            type="number"
                            value={newRule.priority}
                            min={0}
                            max={100}
                            onChange={e => setNewRule(prev => ({ ...prev, priority: Number(e.target.value) }))}
                            style={{ width: '100%', padding: '8px 12px', maxWidth: '120px' }}
                          />
                        </InfoItem>
                        <InfoItem style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                          <InfoLabel style={{ marginBottom: '8px' }}>启用状态：</InfoLabel>
                          <EnableButton
                            type="button"
                            enabled={newRule.enabled === 1}
                            onClick={() => setNewRule(prev => ({ ...prev, enabled: newRule.enabled === 1 ? 0 : 1 }))}
                            style={{ width: '100%', maxWidth: '100px', fontSize: '14px', padding: '8px 4px' }}
                          >
                            {newRule.enabled === 1 ? '启用' : '禁用'}
                          </EnableButton>
                        </InfoItem>
                      </div>
                      <InfoItem style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                        <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <InfoLabel>条件（JSON格式）：</InfoLabel>
                          <select
                            onChange={e => {
                              if (e.target.value) {
                                // 更新条件类型
                                setModalConditionType(e.target.value);
                                
                                const templates = {
                                  temperature: '{\n  "temperature": {\n    "operator": "gt",\n    "value": 25\n  }\n}',
                                  humidity: '{\n  "humidity": {\n    "max": 60,\n    "min": 40,\n    "operator": "range"\n  }\n}',
                                  light: '{\n  "light": {\n    "operator": "lt",\n    "value": 300\n  }\n}',
                                  motion: '{\n  "motion": {\n    "operator": "eq",\n    "value": true\n  }\n}',
                                  week: '{\n  "week": [1, 2, 3, 4, 5]\n}',
                                  date: '{\n  "date": {\n    "start": "2024-01-01",\n    "end": "2024-12-31"\n  }\n}'
                                };
                                
                                if (e.target.value === 'time') {
                                  // 使用当前时间条件生成模板
                                  setNewRule(prev => ({ 
                                    ...prev, 
                                    condition: `{\n  "time": {\n    "start": "${modalTimeCondition.start}",\n    "end": "${modalTimeCondition.end}"\n  }\n}` 
                                  }));
                                } else if (e.target.value === 'week') {
                                   // 使用当前星期条件生成模板
                                   setNewRule(prev => ({ 
                                     ...prev, 
                                     condition: `{\n  "week": [${modalWeekCondition.join(', ')}]\n}` 
                                   }));
                                 } else if (e.target.value === 'date') {
                                   // 使用当前日期条件生成模板
                                   setNewRule(prev => ({ 
                                     ...prev, 
                                     condition: `{\n  "date": {\n    "start": "${modalDateCondition.start}",\n    "end": "${modalDateCondition.end}"\n  }\n}` 
                                   }));
                                 } else {
                                   setNewRule(prev => ({ ...prev, condition: templates[e.target.value] }));
                                 }
                              }
                            }}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '4px',
                              border: '1px solid rgba(255, 255, 255, 0.3)',
                              background: 'rgba(0, 0, 0, 0.2)',
                              color: 'white',
                              fontSize: '14px'
                            }}
                          >
                            <option value="">选择条件模板...</option>
                            <option value="temperature">温度条件</option>
                            <option value="humidity">湿度条件</option>
                            <option value="light">光照条件</option>
                            <option value="motion">运动检测</option>
                            <option value="time">时间条件</option>
                            <option value="week">星期条件</option>
                            <option value="date">日期条件</option>
                          </select>
                        </div>
                        {modalConditionType === 'time' && (
                          <div style={{ marginBottom: '12px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ color: 'white', fontSize: '14px' }}>从</span>
                              <input
                                type="time"
                                value={modalTimeCondition.start}
                                onChange={e => {
                                  const newModalTimeCondition = { ...modalTimeCondition, start: e.target.value };
                                  setModalTimeCondition(newModalTimeCondition);
                                  setNewRule(prev => ({ 
                                    ...prev, 
                                    condition: `{\n  "time": {\n    "start": "${newModalTimeCondition.start}",\n    "end": "${newModalTimeCondition.end}"\n  }\n}` 
                                  }));
                                }}
                                style={{
                                  padding: '8px 12px',
                                  border: '1px solid rgba(255, 255, 255, 0.3)',
                                  borderRadius: '4px',
                                  background: 'rgba(0, 0, 0, 0.2)',
                                  color: 'white',
                                  fontSize: '14px'
                                }}
                              />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ color: 'white', fontSize: '14px' }}>到</span>
                              <input
                                type="time"
                                value={modalTimeCondition.end}
                                onChange={e => {
                                  const newModalTimeCondition = { ...modalTimeCondition, end: e.target.value };
                                  setModalTimeCondition(newModalTimeCondition);
                                  setNewRule(prev => ({ 
                                    ...prev, 
                                    condition: `{\n  "time": {\n    "start": "${newModalTimeCondition.start}",\n    "end": "${newModalTimeCondition.end}"\n  }\n}` 
                                  }));
                                }}
                                style={{
                                  padding: '8px 12px',
                                  border: '1px solid rgba(255, 255, 255, 0.3)',
                                  borderRadius: '4px',
                                  background: 'rgba(0, 0, 0, 0.2)',
                                  color: 'white',
                                  fontSize: '14px'
                                }}
                              />
                            </div>
                          </div>
                        )}
                        
                        {/* 星期条件专用选择框 */}
                        {modalConditionType === 'week' && (
                          <div style={{ marginBottom: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {[
                              { value: 1, label: '周一' },
                              { value: 2, label: '周二' },
                              { value: 3, label: '周三' },
                              { value: 4, label: '周四' },
                              { value: 5, label: '周五' },
                              { value: 6, label: '周六' },
                              { value: 0, label: '周日' }
                            ].map(day => (
                              <label key={day.value} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'white', fontSize: '14px', cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={modalWeekCondition.includes(day.value)}
                                  onChange={e => {
                                    let newModalWeekCondition;
                                    if (e.target.checked) {
                                      newModalWeekCondition = [...modalWeekCondition, day.value].sort((a, b) => a - b);
                                    } else {
                                      newModalWeekCondition = modalWeekCondition.filter(d => d !== day.value);
                                    }
                                    setModalWeekCondition(newModalWeekCondition);
                                    setNewRule(prev => ({ 
                                      ...prev, 
                                      condition: `{\n  "week": [${newModalWeekCondition.join(', ')}]\n}` 
                                    }));
                                  }}
                                  style={{ marginRight: '4px' }}
                                />
                                {day.label}
                              </label>
                            ))}
                          </div>
                        )}
                        
                        {/* 日期条件专用选择框 */}
                        {modalConditionType === 'date' && (
                          <div style={{ marginBottom: '12px' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: 'white', fontSize: '14px' }}>从:</span>
                                <input
                                  type="date"
                                  value={modalDateCondition.start}
                                  onChange={e => {
                                    const newModalDateCondition = { ...modalDateCondition, start: e.target.value };
                                    setModalDateCondition(newModalDateCondition);
                                    setNewRule(prev => ({ 
                                      ...prev, 
                                      condition: `{\n  "date": {\n    "start": "${newModalDateCondition.start}",\n    "end": "${newModalDateCondition.end}"\n  }\n}` 
                                    }));
                                  }}
                                  style={{
                                    padding: '6px 8px',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    borderRadius: '4px',
                                    background: 'rgba(0, 0, 0, 0.2)',
                                    color: 'white',
                                    fontSize: '14px'
                                  }}
                                />
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: 'white', fontSize: '14px' }}>到:</span>
                                <input
                                  type="date"
                                  value={modalDateCondition.end}
                                  onChange={e => {
                                    const newModalDateCondition = { ...modalDateCondition, end: e.target.value };
                                    setModalDateCondition(newModalDateCondition);
                                    setNewRule(prev => ({ 
                                      ...prev, 
                                      condition: `{\n  "date": {\n    "start": "${newModalDateCondition.start}",\n    "end": "${newModalDateCondition.end}"\n  }\n}` 
                                    }));
                                  }}
                                  style={{
                                    padding: '6px 8px',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    borderRadius: '4px',
                                    background: 'rgba(0, 0, 0, 0.2)',
                                    color: 'white',
                                    fontSize: '14px'
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <textarea
                          value={newRule.condition}
                          onChange={e => setNewRule(prev => ({ ...prev, condition: e.target.value }))}
                          rows={8}
                          style={{ 
                            width: '100%', 
                            maxWidth: '100%',
                            boxSizing: 'border-box',
                            fontFamily: 'Consolas, Monaco, monospace', 
                            fontSize: '14px',
                            padding: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            borderRadius: '6px',
                            background: 'rgba(0, 0, 0, 0.2)',
                            color: 'white',
                            resize: 'vertical',
                            minHeight: '120px',
                            overflow: 'auto'
                          }}
                          placeholder="请输入JSON格式的条件..."
                        />
                      </InfoItem>
                      <div style={{ 
                        display: 'flex', 
                        gap: '12px', 
                        marginTop: '20px',
                        paddingTop: '15px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        <Button
                          onClick={() => {
                            // 这里可以添加验证逻辑
                            showSuccessTip('规则已准备就绪，点击保存按钮完成创建');
                          }}
                          style={{ flex: 1 }}
                        >
                          验证规则
                        </Button>
                        <Button
                          onClick={() => {
                            setNewRule(null);
                            setModalConditionType('');
                            setModalTimeCondition({ start: '08:00', end: '18:00' });
                            setModalWeekCondition([1, 2, 3, 4, 5]);
                          }}
                          style={{ 
                            flex: 1,
                            background: 'rgba(108, 117, 125, 0.3)',
                            borderColor: 'rgba(108, 117, 125, 0.5)'
                          }}
                        >
                          取消创建
                        </Button>
                      </div>
                    </DeviceInfo>
                  ) : (
                    <Button onClick={() => setNewRule({ priority: 0, enabled: 1, condition: '{\n  \"temperature\": {\n    \"operator\": \"gt\", \n    \"value\": 25\n  }\n}' })} style={{ marginTop: 16 }}>+ 创建新规则</Button>
                  )}
                </>
              )}
            </div>
            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: '2px solid rgba(255, 255, 255, 0.1)'
            }}>
              <Button
                onClick={async () => {
                  const rules = sceneRules[editingRuleScene.scene_id] || [];
                  let hasError = false;
                  for (const rule of rules) {
                    const editState = ruleEditStates[rule.rule_id];
                    if (!editState) continue;
                    // 优先级
                    if (editState.priority !== rule.priority) {
                      try {
                        await ruleUpdateField(rule.scene_id, rule.rule_id, 'priority', editState.priority);
                      } catch (e) {
                        showErrorTip(`规则${rule.rule_id}优先级保存失败`);
                        hasError = true;
                      }
                    }
                    // 启用
                    if (editState.enabled !== rule.enabled) {
                      try {
                        await ruleUpdateField(rule.scene_id, rule.rule_id, 'enabled', editState.enabled);
                      } catch (e) {
                        showErrorTip(`规则${rule.rule_id}启用状态保存失败`);
                        hasError = true;
                      }
                    }
                    // condition
                    try {
                      let condObj = editState.condition;
                      if (typeof condObj === 'string') {
                        condObj = JSON.parse(condObj);
                      }
                      if (JSON.stringify(condObj) !== JSON.stringify(rule.condition)) {
                        await ruleUpdateField(rule.scene_id, rule.rule_id, 'condition', condObj);
                      }
                    } catch (e) {
                      showErrorTip(`规则${rule.rule_id}条件保存失败，格式需为合法JSON`);
                      hasError = true;
                    }
                  }
                  // 新建规则
                  if (newRule) {
                    try {
                      let condObj = newRule.condition;
                      if (typeof condObj === 'string') {
                        condObj = JSON.parse(condObj);
                      }
                      await addRule(
                        editingRuleScene.scene_id,
                        condObj,
                        newRule.priority,
                        newRule.enabled
                      );
                      showSuccessTip('新规则已创建');
                      setNewRule(null);
                    } catch (e) {
                      showErrorTip('新规则创建失败，条件需为合法JSON');
                      hasError = true;
                    }
                  }
                  if (!hasError) {
                    showSuccessTip('所有规则已保存');
                    // 可选：刷新规则列表
                    const response = await getAllRules(editingRuleScene.scene_id);
                    setSceneRules(prev => ({
                      ...prev,
                      [editingRuleScene.scene_id]: Array.isArray(response.data.data) ? response.data.data : []
                    }));
                    setShowRuleModal(false);
                  }
                }}
                style={{ 
                  flex: 1,
                  background: 'rgba(34, 197, 94, 0.3)',
                  borderColor: 'rgba(34, 197, 94, 0.5)',
                  fontSize: '16px',
                  padding: '12px 24px'
                }}
              >💾 保存所有规则</Button>
              <Button 
                onClick={() => setShowRuleModal(false)}
                style={{ 
                  flex: 1,
                  background: 'rgba(108, 117, 125, 0.3)',
                  borderColor: 'rgba(108, 117, 125, 0.5)',
                  fontSize: '16px',
                  padding: '12px 24px'
                }}
              >❌ 关闭</Button>
            </div>
          </ModalContent>
        </Modal>
      )}
      </Container>
      
      {/* 回收站按钮 */}
      <Button
        style={{
          position: 'absolute',
          bottom: '80px',
          right: '80px',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          zIndex: 1000
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.2)';
          e.target.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.1)';
          e.target.style.transform = 'scale(1)';
        }}
        onClick={() => {
          // 这里可以添加回收站功能
          showSuccessTip('回收站功能待实现');
        }}
        title="回收站"
      >
        🗑️
      </Button>
    </PageContainer>
  );
};

export default SceneConfigUI;