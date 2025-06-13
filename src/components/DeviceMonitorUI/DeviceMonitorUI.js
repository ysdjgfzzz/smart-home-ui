// src/components/DeviceMonitorUI/DeviceMonitorUI.js
import React from 'react';
import styled from 'styled-components';
import { getEnvironmentStatus, getAllDeviceStates, updateDeviceState } from '../../services/api';

// 设备类型常量
const DEVICE_TYPES = {
  CONDITIONER: 'conditioner',
  LAMP: 'lamp',
  DEHUMIDIFIER: 'dehumidifier',
  CURTAIN: 'curtain'
};

// 设备配置范围
const DEVICE_RANGES = {
  [DEVICE_TYPES.CONDITIONER]: {
    temperature: { min: 16, max: 30, step: 1, unit: '°C' },
    speeds: ['low', 'medium', 'high'],
    modes: ['cool', 'heat']
  },
  [DEVICE_TYPES.LAMP]: {
    brightness: { min: 0, max: 1400, step: 200, unit: 'lm' },
    colors: ['warm', 'neutral', 'cool']
  },
  [DEVICE_TYPES.DEHUMIDIFIER]: {
    humidity: { min: 30, max: 80, step: 10, unit: '%' },
    levels: ['auto', 'powerful', 'quiet']
  },
  [DEVICE_TYPES.CURTAIN]: {
    position: { min: 0, max: 100, step: 20, unit: '%' },
    styles: ['sunshade', 'sheer', 'blind']
  }
};

// 页面整体容器 - 使用与登录注册界面相同的渐变背景
const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  font-family: Arial, sans-serif;
  padding: 20px;
  box-sizing: border-box;
  color: white;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  gap: 20px;
  width: 100%;
  max-width: 1200px;
`;

const Title = styled.h1`
  color: white;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 30px;
  width: 100%;
  max-width: 1200px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const DeviceSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const EnvironmentSection = styled.div`
  width: 300px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const DeviceCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
  }
`;

const DeviceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const DeviceName = styled.h3`
  margin: 0;
  color: white;
  font-size: 1.2em;
`;

const DeviceStatus = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  background-color: ${props => props.online ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)'};
  color: ${props => props.online ? '#2ecc71' : '#e74c3c'};
  border: 1px solid ${props => props.online ? 'rgba(46, 204, 113, 0.3)' : 'rgba(231, 76, 60, 0.3)'};
`;

const DeviceControls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 15px 0;
`;

const ControlButton = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: ${props => props.active ? 'rgba(66, 133, 244, 0.8)' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;

  &:hover {
    background: ${props => props.active ? 'rgba(51, 103, 214, 0.9)' : 'rgba(255, 255, 255, 0.2)'};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const DeviceInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 15px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
`;

const InfoLabel = styled.span`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
`;

const InfoValue = styled.span`
  font-size: 16px;
  color: white;
  font-weight: 500;
`;

// 数值控制器样式
const ValueController = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 5px;
  background: rgba(255, 255, 255, 0.05);
  padding: 8px;
  border-radius: 8px;
`;

const ValueButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 18px;
  padding: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ValueDisplay = styled.span`
  min-width: 80px;
  text-align: center;
  font-size: 16px;
  color: white;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.1);
  padding: 6px 12px;
  border-radius: 6px;
`;

const Value = styled.span`
  color: rgba(255, 255, 255, 0.8);
`;


const DeviceMonitorUI = () => {
  const [environmentStatus, setEnvironmentStatus] = React.useState({
    temperature: '--',
    illumination: '--',
    humidity: '--'
  });
  const [error, setError] = React.useState(null);
  const [devices, setDevices] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // 获取环境状态
  const fetchEnvironmentStatus = async () => {
    try {
      const response = await getEnvironmentStatus();
      if (response && response.data) {
        setEnvironmentStatus({
          temperature: response.data.temperature,
          illumination: response.data.illumination,
          humidity: response.data.humidity
        });
        setError(null);
      } else {
        setError('响应数据格式错误');
        console.error('响应数据格式错误:', response);
      }
    } catch (error) {
      setError(error.message || '获取环境状态失败');
      console.error('获取环境状态失败:', error);
    }
  };

  // 获取所有设备状态
  const fetchDeviceStates = async () => {
    try {
      setLoading(true);
      const response = await getAllDeviceStates();

      let deviceData = [];
      if (response?.data) {
        deviceData = response.data.data;
      }
      console.log(deviceData);

      // 转换设备数据格式
      const formattedDevices = deviceData.map(device => {
        // 设备类型就是设备名称
        const deviceType = device.name?.toLowerCase() || 'unknown';
        
        return {
          name: getDeviceDisplayName(device.name),
          type: deviceType,
          ...device.state
        };
      });
      
      // 将格式化后的设备数据存入本地缓存
      localStorage.setItem('deviceStates', JSON.stringify(formattedDevices));
      
      // 输出缓存内容到控制台
      console.log('设备状态缓存:', JSON.parse(localStorage.getItem('deviceStates')));
      
      setDevices(formattedDevices || []);
      setError(null);
    } catch (error) {
      console.error('获取设备状态失败:', error);
      setError('获取设备状态失败');
      setDevices([]); // 出错时设置为空数组
    } finally {
      setLoading(false);
    }
  };

  // 获取设备显示名称
  const getDeviceDisplayName = (name) => {
    const displayNames = {
      'conditioner': '空调',
      'lamp': '智能灯',
      'dehumidifier': '除湿器',
      'curtain': '窗帘'
    };
    return displayNames[name] || name;
  };

  // 通用设备状态更新函数
  const updateDeviceStateLocal = async (deviceType, property, value) => {
    try {
      const device = devices.find(d => d.type === deviceType);
      if (!device) return;

      // 从本地缓存获取设备状态
      const cachedDevices = JSON.parse(localStorage.getItem('deviceStates') || '[]');
      const cachedDevice = cachedDevices.find(d => d.type === deviceType);
      if (!cachedDevice) return;

      // 从本地存储获取用户名
      const username = localStorage.getItem('username');
      if (!username) {
        setError('未找到用户信息');
        return;
      }

      // 根据设备类型构建新的状态对象
      let newState = { power: cachedDevice.power || 'off' };
      
      switch (deviceType) {
        case DEVICE_TYPES.CONDITIONER:
          newState = {
            ...newState,
            temperature: cachedDevice.temperature || 24,
            speed: cachedDevice.speed || 'medium',
            mode: cachedDevice.mode || 'cool'
          };
          break;
        case DEVICE_TYPES.LAMP:
          newState = {
            ...newState,
            brightness: cachedDevice.brightness || 800,
            color: cachedDevice.color || 'neutral'
          };
          break;
        case DEVICE_TYPES.DEHUMIDIFIER:
          newState = {
            ...newState,
            humidity: cachedDevice.humidity || 50,
            level: cachedDevice.level || 'auto'
          };
          break;
        case DEVICE_TYPES.CURTAIN:
          newState = {
            ...newState,
            position: cachedDevice.position || 50,
            style: cachedDevice.style || 'sheer'
          };
          break;
        default:
          console.error('未知的设备类型:', deviceType);
          return;
      }

      // 更新特定属性的值
      newState[property] = value;

      // 构建请求体
      const payload = {
        device_name: deviceType,
        state: newState,
        username: username
      };

      // 调用API更新设备状态
      await updateDeviceState(payload);

      // 更新成功后重新获取所有设备状态
      await fetchDeviceStates();
    } catch (error) {
      console.error(`更新设备${property}失败:`, error);
      setError(`更新设备${property}失败`);
    }
  };

  // 处理设备开关
  const handlePowerToggle = async (deviceType) => {
    const device = devices.find(d => d.type === deviceType);
    if (!device) return;

    // 从本地缓存获取设备状态
    const cachedDevices = JSON.parse(localStorage.getItem('deviceStates') || '[]');
    const cachedDevice = cachedDevices.find(d => d.type === deviceType);
    if (!cachedDevice) return;

    // 从本地存储获取用户名
    const username = localStorage.getItem('username');
    if (!username) {
      setError('未找到用户信息');
      return;
    }

    // 根据设备类型构建新的状态对象
    let newState = { power: cachedDevice.power === 'on' ? 'off' : 'on' };
    
    switch (deviceType) {
      case DEVICE_TYPES.CONDITIONER:
        newState = {
          ...newState,
          temperature: cachedDevice.temperature || 24,
          speed: cachedDevice.speed || 'medium',
          mode: cachedDevice.mode || 'cool'
        };
        break;
      case DEVICE_TYPES.LAMP:
        newState = {
          ...newState,
          brightness: cachedDevice.brightness || 800,
          color: cachedDevice.color || 'neutral'
        };
        break;
      case DEVICE_TYPES.DEHUMIDIFIER:
        newState = {
          ...newState,
          humidity: cachedDevice.humidity || 50,
          level: cachedDevice.level || 'auto'
        };
        break;
      case DEVICE_TYPES.CURTAIN:
        newState = {
          ...newState,
          position: cachedDevice.position || 50,
          style: cachedDevice.style || 'sheer'
        };
        break;
      default:
        console.error('未知的设备类型:', deviceType);
        return;
    }

    // 构建请求体
    const payload = {
      device_name: deviceType,
      state: newState,
      username: username
    };

    // 调用API更新设备状态
    try {
      await updateDeviceState(payload);
      // 更新成功后重新获取所有设备状态
      await fetchDeviceStates();
    } catch (error) {
      console.error('更新设备开关状态失败:', error);
      setError('更新设备开关状态失败');
    }
  };

  // 处理空调模式切换
  const handleModeChange = async (deviceType, mode) => {
    await updateDeviceStateLocal(deviceType, 'mode', mode);
  };

  // 处理设备风速切换
  const handleSpeedChange = async (deviceType, speed) => {
    await updateDeviceStateLocal(deviceType, 'speed', speed);
  };

  // 处理灯光色温切换
  const handleColorChange = async (deviceType, color) => {
    await updateDeviceStateLocal(deviceType, 'color', color);
  };

  // 处理除湿器等级切换
  const handleLevelChange = async (deviceType, level) => {
    await updateDeviceStateLocal(deviceType, 'level', level);
  };

  // 处理窗帘样式切换
  const handleStyleChange = async (deviceType, style) => {
    await updateDeviceStateLocal(deviceType, 'style', style);
  };

  // 处理数值类型属性变化（温度、亮度、湿度、开合度）
  const handleValueChange = async (deviceType, property, value, range) => {
    // 确保值在范围内
    const newValue = Math.min(Math.max(value, range.min), range.max);
    await updateDeviceStateLocal(deviceType, property, newValue);
  };

  // 处理数值增减变化
  const handleValueAdjustment = async (deviceType, property, isUp) => {
    try {
      // 检查设备是否存在
      const device = devices.find(d => d.type === deviceType);
      if (!device) {
        console.error('设备不存在:', deviceType);
        return;
      }

      // 检查设备是否开启
      if (device.power !== 'on') {
        console.error('设备未开启:', deviceType);
        return;
      }

      // 获取设备的配置范围
      const deviceConfig = DEVICE_RANGES[deviceType];
      if (!deviceConfig || !deviceConfig[property]) {
        console.error('无效的属性配置:', property);
        return;
      }

      const range = deviceConfig[property];
      const currentValue = device[property] || range.min;
      const step = range.step;
      
      // 计算新值
      let newValue;
      if (isUp) {
        newValue = Math.min(currentValue + step, range.max);
      } else {
        newValue = Math.max(currentValue - step, range.min);
      }

      // 如果值没有变化，说明已经达到上下限
      if (newValue === currentValue) {
        return;
      }

      // 更新设备状态
      await updateDeviceStateLocal(deviceType, property, newValue);
    } catch (error) {
      console.error(`调整${property}失败:`, error);
      setError(`调整${property}失败`);
    }
  };

  // 渲染设备控制界面
  const renderDeviceControls = (device) => {
    if (!device || !device.type) {
      console.error('无效的设备数据:', device);
      return null;
    }

    const renderPowerButton = () => (
      <ControlButton 
        active={device.power === 'on'} 
        onClick={() => handlePowerToggle(device.type)}
      >
        {device.power === 'on' ? '关闭' : '开启'}
      </ControlButton>
    );

    const renderValueController = (property, value, range) => {
      const decrease = () => {
        const newValue = Math.max(range.min, value - range.step);
        handleValueAdjustment(device.type, property, false);
      };

      const increase = () => {
        const newValue = Math.min(range.max, value + range.step);
        handleValueAdjustment(device.type, property, true);
      };

      return (
        <ValueController>
          <ValueButton 
            onClick={decrease}
            disabled={value <= range.min}
          >
            -
          </ValueButton>
          <ValueDisplay>
            {value || '--'}{range.unit}
          </ValueDisplay>
          <ValueButton 
            onClick={increase}
            disabled={value >= range.max}
          >
            +
          </ValueButton>
        </ValueController>
      );
    };

    switch (device.type.toLowerCase()) {
      case DEVICE_TYPES.CONDITIONER:
        return (
          <>
            <DeviceControls>
              {renderPowerButton()}
              <ControlButton 
                onClick={() => handleValueAdjustment(device.type, 'temperature', true)}
                disabled={device.power !== 'on' || device.temperature >= DEVICE_RANGES[DEVICE_TYPES.CONDITIONER].temperature.max}
              >
                升温
              </ControlButton>
              <ControlButton 
                onClick={() => handleValueAdjustment(device.type, 'temperature', false)}
                disabled={device.power !== 'on' || device.temperature <= DEVICE_RANGES[DEVICE_TYPES.CONDITIONER].temperature.min}
              >
                降温
              </ControlButton>
              {device.power === 'on' && DEVICE_RANGES[DEVICE_TYPES.CONDITIONER] && (
                <>
                  {DEVICE_RANGES[DEVICE_TYPES.CONDITIONER].modes.map(mode => (
                    <ControlButton 
                      key={mode}
                      active={device.mode === mode}
                      onClick={() => handleModeChange(device.type, mode)}
                    >
                      {mode === 'cool' ? '制冷' : '制热'}
                    </ControlButton>
                  ))}
                  {DEVICE_RANGES[DEVICE_TYPES.CONDITIONER].speeds.map(speed => (
                    <ControlButton 
                      key={speed}
                      active={device.speed === speed}
                      onClick={() => handleSpeedChange(device.type, speed)}
                    >
                      {speed === 'low' ? '低速' :
                       speed === 'medium' ? '中速' : '高速'}
                    </ControlButton>
                  ))}
                </>
              )}
            </DeviceControls>
            <DeviceInfo>
              <InfoItem>
                <InfoLabel>当前温度</InfoLabel>
                <InfoValue>{device.temperature || '--'}°C</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>运行模式</InfoLabel>
                <InfoValue>
                  {device.mode === 'cool' ? '制冷' : 
                   device.mode === 'heat' ? '制热' : '--'}
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>风速</InfoLabel>
                <InfoValue>
                  {device.speed === 'low' ? '低速' :
                   device.speed === 'medium' ? '中速' : 
                   device.speed === 'high' ? '高速' : '--'}
                </InfoValue>
              </InfoItem>
            </DeviceInfo>
          </>
        );
      
      case DEVICE_TYPES.LAMP:
        return (
          <>
            <DeviceControls>
              {renderPowerButton()}
              {device.power === 'on' && DEVICE_RANGES[DEVICE_TYPES.LAMP] && (
                <>
                  {DEVICE_RANGES[DEVICE_TYPES.LAMP].colors.map(color => (
                    <ControlButton 
                      key={color}
                      active={device.color === color}
                      onClick={() => handleColorChange(device.type, color)}
                    >
                      {color === 'warm' ? '暖白' :
                       color === 'neutral' ? '正白' : '冷白'}
                    </ControlButton>
                  ))}
                </>
              )}
            </DeviceControls>
            <DeviceInfo>
              <InfoItem>
                <InfoLabel>当前亮度</InfoLabel>
                <InfoValue>{device.brightness || '--'} lm</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>亮度设置</InfoLabel>
                {device.power === 'on' && renderValueController(
                  'brightness',
                  device.brightness,
                  DEVICE_RANGES[DEVICE_TYPES.LAMP].brightness
                )}
              </InfoItem>
              <InfoItem>
                <InfoLabel>色温</InfoLabel>
                <InfoValue>
                  {device.color === 'warm' ? '暖白' :
                   device.color === 'neutral' ? '正白' : 
                   device.color === 'cool' ? '冷白' : '--'}
                </InfoValue>
              </InfoItem>
            </DeviceInfo>
          </>
        );

      case DEVICE_TYPES.DEHUMIDIFIER:
        return (
          <>
            <DeviceControls>
              {renderPowerButton()}
              {device.power === 'on' && DEVICE_RANGES[DEVICE_TYPES.DEHUMIDIFIER] && (
                <>
                  {DEVICE_RANGES[DEVICE_TYPES.DEHUMIDIFIER].levels.map(level => (
                    <ControlButton 
                      key={level}
                      active={device.level === level}
                      onClick={() => handleLevelChange(device.type, level)}
                    >
                      {level === 'auto' ? '自动' :
                       level === 'powerful' ? '强力' : '静音'}
                    </ControlButton>
                  ))}
                </>
              )}
            </DeviceControls>
            <DeviceInfo>
              <InfoItem>
                <InfoLabel>当前湿度</InfoLabel>
                <InfoValue>{device.humidity || '--'}%</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>目标湿度</InfoLabel>
                {device.power === 'on' && renderValueController(
                  'humidity',
                  device.humidity,
                  DEVICE_RANGES[DEVICE_TYPES.DEHUMIDIFIER].humidity
                )}
              </InfoItem>
              <InfoItem>
                <InfoLabel>运行等级</InfoLabel>
                <InfoValue>
                  {device.level === 'auto' ? '自动' :
                   device.level === 'powerful' ? '强力' : 
                   device.level === 'quiet' ? '静音' : '--'}
                </InfoValue>
              </InfoItem>
            </DeviceInfo>
          </>
        );

      case DEVICE_TYPES.CURTAIN:
        return (
          <>
            <DeviceControls>
              {renderPowerButton()}
              {device.power === 'on' && DEVICE_RANGES[DEVICE_TYPES.CURTAIN] && (
                <>
                  {DEVICE_RANGES[DEVICE_TYPES.CURTAIN].styles.map(style => (
                    <ControlButton 
                      key={style}
                      active={device.style === style}
                      onClick={() => handleStyleChange(device.type, style)}
                    >
                      {style === 'sunshade' ? '遮阳帘' :
                       style === 'sheer' ? '薄纱帘' : '百叶帘'}
                    </ControlButton>
                  ))}
                </>
              )}
            </DeviceControls>
            <DeviceInfo>
              <InfoItem>
                <InfoLabel>当前开合度</InfoLabel>
                <InfoValue>{device.position || '--'}%</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>开合度设置</InfoLabel>
                {device.power === 'on' && renderValueController(
                  'position',
                  device.position,
                  DEVICE_RANGES[DEVICE_TYPES.CURTAIN].position
                )}
              </InfoItem>
              <InfoItem>
                <InfoLabel>窗帘样式</InfoLabel>
                <InfoValue>
                  {device.style === 'sunshade' ? '遮阳帘' :
                   device.style === 'sheer' ? '薄纱帘' : 
                   device.style === 'blind' ? '百叶帘' : '--'}
                </InfoValue>
              </InfoItem>
            </DeviceInfo>
          </>
        );
    }
  };

  // 组件加载时获取设备状态
  React.useEffect(() => {
    const loadData = async () => {
      try {
        await fetchEnvironmentStatus();
        await fetchDeviceStates();
      } catch (error) {
        console.error('加载数据失败:', error);
        setError('加载数据失败');
      }
    };

    loadData();
  }, []);

  return (
    <PageContainer>
    <Container>
        <Title>设备监控</Title>
        <ContentWrapper>
          <DeviceSection>
            {loading ? (
              <DeviceCard>
                <DeviceHeader>
                  <DeviceName>加载中...</DeviceName>
                </DeviceHeader>
              </DeviceCard>
            ) : error ? (
              <DeviceCard>
                <DeviceHeader>
                  <DeviceName style={{color: 'rgba(217, 48, 37, 0.9)'}}>错误</DeviceName>
                </DeviceHeader>
                <DeviceInfo>
                  <InfoItem>
                    <InfoValue style={{color: 'rgba(217, 48, 37, 0.9)'}}>{error}</InfoValue>
                  </InfoItem>
                </DeviceInfo>
              </DeviceCard>
            ) : Array.isArray(devices) && devices.length > 0 ? (
              devices.map(device => (
                <DeviceCard key={device.id}>
                  <DeviceHeader>
                    <DeviceName>{device.name || device.type}</DeviceName>
                    <DeviceStatus online={device.power === 'on'}>
                      {device.power === 'on' ? '运行中' : '已关闭'}
                    </DeviceStatus>
                  </DeviceHeader>
                  {renderDeviceControls(device)}
                </DeviceCard>
              ))
            ) : (
              <DeviceCard>
                <DeviceHeader>
                  <DeviceName>暂无设备</DeviceName>
                </DeviceHeader>
              </DeviceCard>
            )}
          </DeviceSection>
          <EnvironmentSection>
            <DeviceCard>
              <DeviceHeader>
                <DeviceName>环境监控</DeviceName>
              </DeviceHeader>
              <DeviceInfo>
                {error ? (
                  <InfoItem>
                    <InfoLabel style={{color: 'rgba(217, 48, 37, 0.9)'}}>错误</InfoLabel>
                    <InfoValue style={{color: 'rgba(217, 48, 37, 0.9)'}}>{error}</InfoValue>
                  </InfoItem>
                ) : (
                  <>
                    <InfoItem>
                      <InfoLabel>温度</InfoLabel>
                      <InfoValue>{environmentStatus.temperature || '--'} °C</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>光照</InfoLabel>
                      <InfoValue>{environmentStatus.illumination || '--'} lx</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>湿度</InfoLabel>
                      <InfoValue>{environmentStatus.humidity || '--'} %</InfoValue>
                    </InfoItem>
                  </>
                )}
              </DeviceInfo>
            </DeviceCard>
          </EnvironmentSection>
        </ContentWrapper>
    </Container>
    </PageContainer>
  );
};

export default DeviceMonitorUI;