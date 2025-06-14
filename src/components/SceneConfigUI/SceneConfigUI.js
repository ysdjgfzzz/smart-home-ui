// src/components/SceneConfigUI/SceneConfigUI.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getAllScenes, addScene, updateScene, removeScene, updateSceneField, updateSceneDevice } from '../../services/api';
import { DEVICE_TYPES, DEVICE_TYPES_CN, DEVICE_RANGES } from '../../constants/deviceTypes';

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
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: white;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
  }
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
  border: 1px solid rgba(255, 255, 255, 0.3);
  
  &:hover {
    background: rgba(200, 35, 51, 0.9);
    transform: translateY(-1px);
  }
`;

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
  const [formData, setFormData] = useState({
    name: '',
    priority: 0,
    enabled: true,
    device_type: '',
    config: {}
  });

  useEffect(() => {
    fetchScenes();
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
      enabled: true,
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
      enabled: scene.enabled !== false, // 如果 enabled 未定义，默认为 true
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
        console.log('更新场景名称成功');
      } catch (error) {
        console.error('更新场景名称失败:', error);
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
        console.log('更新优先级成功');
      } catch (error) {
        console.error('更新优先级失败:', error);
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
        console.log('更新启用状态成功');
      } catch (error) {
        console.error('更新启用状态失败:', error);
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
            console.log(`更新设备配置: ${deviceType}.${attribute} = ${value}`);
          } catch (error) {
            console.error(`更新设备配置失败: ${deviceType}.${attribute}`, error);
            throw error;
          }
        }
      }
    }
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
      creator: 1,
      config: formData.config,  // 直接使用完整的config对象
      priority: formData.priority || 0,
      enabled: formData.enabled ? 1 : 0  // 将boolean转换为int
    };
    console.log('创建新场景的payload:', payload);
    try {
      const response = await addScene(payload);
      console.log('创建新场景成功:', response);
    } catch (error) {
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

  const handleViewDetail = (scene) => {
    setSelectedScene(scene);
    setShowDetailModal(true);
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

  return (
    <PageContainer>
      <Container>
      <h1>场景配置</h1>
      <Button onClick={handleCreateScene}>创建新场景</Button>
      
      <SceneList>
        {Array.isArray(scenes) && scenes.map((scene) => (
          <SceneCard key={scene.scene_id}>
            <h3>{scene.name}</h3>
            <ButtonGroup>
              <Button onClick={() => handleViewDetail(scene)}>查看详情</Button>
              <Button onClick={() => handleEditScene(scene)}>编辑</Button>
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
                  enabled={formData.enabled}
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    enabled: !prev.enabled
                  }))}
                >
                  {formData.enabled ? '禁用场景' : '启用场景'}
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
            </div>
            <ButtonGroup>
              <Button onClick={() => setShowDetailModal(false)}>关闭</Button>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}
      </Container>
    </PageContainer>
  );
};

export default SceneConfigUI;