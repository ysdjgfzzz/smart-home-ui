// src/components/DeviceMonitorUI/DeviceMonitorUI.js
import React from 'react';
import styled from 'styled-components';
import { getEnvironmentStatus } from '../../services/api';

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
`;

const DeviceSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const EnvironmentSection = styled.div`
  width: 300px;
`;

const DeviceCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const DeviceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const DeviceName = styled.h3`
  margin: 0;
  color: white;
`;

const DeviceStatus = styled.span`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
  background-color: ${props => props.online ? 'rgba(30, 142, 62, 0.8)' : 'rgba(217, 48, 37, 0.8)'};
  color: white;
  border: 1px solid ${props => props.online ? 'rgba(30, 142, 62, 0.3)' : 'rgba(217, 48, 37, 0.3)'};
`;

const DeviceControls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const ControlButton = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: ${props => props.active ? 'rgba(66, 133, 244, 0.8)' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);

  &:hover {
    background: ${props => props.active ? 'rgba(51, 103, 214, 0.9)' : 'rgba(255, 255, 255, 0.2)'};
    transform: translateY(-1px);
  }
`;

const DeviceInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoLabel = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
`;

const InfoValue = styled.span`
  font-size: 14px;
  color: white;
  font-weight: 500;
`;

const StatusCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const StatusItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  
  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.span`
  font-weight: 500;
  color: white;
`;

const Value = styled.span`
  color: rgba(255, 255, 255, 0.8);
`;


// 模拟设备数据
const mockDevices = [
  {
    id: 1,
    name: '客厅空调',
    type: 'AC',
    online: true,
    power: true,
    temperature: 26,
    mode: 'cool',
    fanSpeed: 'auto',
    lastActive: '2025-06-08 15:30:22'
  },
  {
    id: 2,
    name: '主卧灯',
    type: 'LIGHT',
    online: true,
    power: false,
    brightness: 80,
    colorTemp: 4000,
    lastActive: '2025-06-08 15:28:15'
  },
  {
    id: 3,
    name: '厨房新风',
    type: 'VENTILATION',
    online: false,
    power: false,
    speed: 'medium',
    lastActive: '2025-06-08 14:55:33'
  }
];

const DeviceMonitorUI = () => {
  const [environmentStatus, setEnvironmentStatus] = React.useState({
    temperature: '--',
    illumination: '--',
    humidity: '--'
  });
  const [error, setError] = React.useState(null);
  const [devices, setDevices] = React.useState(mockDevices);

  React.useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await getEnvironmentStatus();
        if (response && response.data) {
          setEnvironmentStatus(response.data);
          setError(null);
        } else {
          setError('响应数据格式错误');
          console.error('响应数据格式错误:', response);
        }
      } catch (error) {
        setError(error.message);
        console.error('获取环境状态失败:', error);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  // 处理设备开关
  const handlePowerToggle = (deviceId) => {
    setDevices(devices.map(device => 
      device.id === deviceId 
        ? { ...device, power: !device.power }
        : device
    ));
    // TODO: 调用后端接口更新设备状态
  };

  // 处理空调模式切换
  const handleModeChange = (deviceId, mode) => {
    setDevices(devices.map(device =>
      device.id === deviceId
        ? { ...device, mode }
        : device
    ));
    // TODO: 调用后端接口更新设备状态
  };

  // 渲染设备控制界面
  const renderDeviceControls = (device) => {
    switch (device.type) {
      case 'AC':
        return (
          <>
            <DeviceControls>
              <ControlButton 
                active={device.power} 
                onClick={() => handlePowerToggle(device.id)}
              >
                {device.power ? '关闭' : '开启'}
              </ControlButton>
              {device.power && (
                <>
                  <ControlButton 
                    active={device.mode === 'cool'}
                    onClick={() => handleModeChange(device.id, 'cool')}
                  >
                    制冷
                  </ControlButton>
                  <ControlButton 
                    active={device.mode === 'heat'}
                    onClick={() => handleModeChange(device.id, 'heat')}
                  >
                    制热
                  </ControlButton>
                  <ControlButton 
                    active={device.mode === 'dry'}
                    onClick={() => handleModeChange(device.id, 'dry')}
                  >
                    除湿
                  </ControlButton>
                </>
              )}
            </DeviceControls>
            <DeviceInfo>
              <InfoItem>
                <InfoLabel>当前温度</InfoLabel>
                <InfoValue>{device.temperature}°C</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>运行模式</InfoLabel>
                <InfoValue>
                  {device.mode === 'cool' ? '制冷' :
                   device.mode === 'heat' ? '制热' :
                   device.mode === 'dry' ? '除湿' : '自动'}
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>风速</InfoLabel>
                <InfoValue>{device.fanSpeed === 'auto' ? '自动' : device.fanSpeed}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>最后活动</InfoLabel>
                <InfoValue>{device.lastActive}</InfoValue>
              </InfoItem>
            </DeviceInfo>
          </>
        );
      
      case 'LIGHT':
        return (
          <>
            <DeviceControls>
              <ControlButton 
                active={device.power} 
                onClick={() => handlePowerToggle(device.id)}
              >
                {device.power ? '关闭' : '开启'}
              </ControlButton>
            </DeviceControls>
            <DeviceInfo>
              <InfoItem>
                <InfoLabel>亮度</InfoLabel>
                <InfoValue>{device.brightness}%</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>色温</InfoLabel>
                <InfoValue>{device.colorTemp}K</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>最后活动</InfoLabel>
                <InfoValue>{device.lastActive}</InfoValue>
              </InfoItem>
            </DeviceInfo>
          </>
        );

      case 'VENTILATION':
        return (
          <>
            <DeviceControls>
              <ControlButton 
                active={device.power} 
                onClick={() => handlePowerToggle(device.id)}
              >
                {device.power ? '关闭' : '开启'}
              </ControlButton>
            </DeviceControls>
            <DeviceInfo>
              <InfoItem>
                <InfoLabel>风速</InfoLabel>
                <InfoValue>
                  {device.speed === 'low' ? '低速' :
                   device.speed === 'medium' ? '中速' : '高速'}
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>最后活动</InfoLabel>
                <InfoValue>{device.lastActive}</InfoValue>
              </InfoItem>
            </DeviceInfo>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <PageContainer>
      <Container>
        <Title>设备监控</Title>
        <ContentWrapper>
          <DeviceSection>
            {devices.map(device => (
              <DeviceCard key={device.id}>
                <DeviceHeader>
                  <DeviceName>{device.name}</DeviceName>
                  <DeviceStatus online={device.online}>
                    {device.online ? '在线' : '离线'}
                  </DeviceStatus>
                </DeviceHeader>
                {device.online && renderDeviceControls(device)}
              </DeviceCard>
            ))}
          </DeviceSection>
          <EnvironmentSection>
            <StatusCard>
              <DeviceName style={{marginBottom: '15px'}}>环境监控</DeviceName>
              {error ? (
                <StatusItem>
                  <Label style={{color: 'rgba(217, 48, 37, 0.9)'}}>错误</Label>
                  <Value style={{color: 'rgba(217, 48, 37, 0.9)'}}>{error}</Value>
                </StatusItem>
              ) : (
                <>
                  <StatusItem>
                    <Label>温度</Label>
                    <Value>{environmentStatus.temperature} °C</Value>
                  </StatusItem>
                  <StatusItem>
                    <Label>光照</Label>
                    <Value>{environmentStatus.illumination} lx</Value>
                  </StatusItem>
                  <StatusItem>
                    <Label>湿度</Label>
                    <Value>{environmentStatus.humidity} %</Value>
                  </StatusItem>
                </>
              )}
            </StatusCard>
          </EnvironmentSection>
        </ContentWrapper>
      </Container>
    </PageContainer>
  );
};

export default DeviceMonitorUI;