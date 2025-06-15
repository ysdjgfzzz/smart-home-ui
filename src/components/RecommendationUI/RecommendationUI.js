// src/components/RecommendationUI/RecommendationUI.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { getRecommendations,switchScene } from '../../services/api';

const SOURCE_CONFIG = {
  deepseek: {
    name: 'DeepSeek',
    color: 'linear-gradient(135deg, #8e2de2, #4a00e0)',
    icon: '🔍' 
  },
  zhipu: {
    name: '智谱AI',
    color: 'linear-gradient(135deg, #1890ff, #0052d9)',
    icon: '🧠'
  }
};

const DEVICE_TYPES_CN = {
  conditioner: '空调',
  lamp: '智能灯',
  dehumidifier: '除湿器',
  fan: '风扇',
  curtain: '窗帘'
};

// 样式组件
const DetailsPanel = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
  margin-top: 15px;
  color: #333;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  max-height: 60vh;
  overflow-y: auto;
`;

const DeviceInfo = styled.div`
  background: rgba(255, 255, 255, 0.85);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  color: #333;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border-left: 4px solid ${props => {
    switch(props.deviceType) {
      case 'conditioner': return '#4a00e0';
      case 'lamp': return '#ffc107';
      case 'dehumidifier': return '#2196f3';
      case 'fan': return '#4caf50';
      case 'curtain': return '#9c27b0';
      default: return '#607d8b';
    }
  }};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
`;

const DeviceTitle = styled.h3`
  margin: 0 0 10px 0;
  color: ${props => {
    switch(props.deviceType) {
      case 'conditioner': return '#4a00e0';
      case 'lamp': return '#ff9800';
      case 'dehumidifier': return '#2196f3';
      case 'fan': return '#4caf50';
      case 'curtain': return '#9c27b0';
      default: return '#333';
    }
  }};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed #eee;
  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  font-weight: bold;
  color: #4a00e0;
  min-width: 100px;
`;

const InfoValue = styled.span`
  color: #666;
  background: rgba(0, 0, 0, 0.03);
  padding: 4px 8px;
  border-radius: 4px;
`;

const SourceTag = styled.span`
  background: ${props => props.color};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;


const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 30px 20px;
  background: linear-gradient(135deg, #8e2de2, #4a00e0);
  color: white;
`;

const Title = styled.h1`
  margin-bottom: 30px;
  color: white;
  text-align: center;
`;

const CardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 25px;
  width: 100%;
  max-width: 1200px;
`;

const RecommendationCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 500px;
  color: #333;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const SceneName = styled.h2`
  color: #4a00e0;
  margin: 0;
`;

const ReasonText = styled.p`
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:first-child {
    background-color: #4a00e0;
    color: white;
    
    &:hover {
      background-color: #3a00b0;
    }
  }
  
  &:last-child {
    background-color: #f0f0f0;
    
    &:hover {
      background-color: #e0e0e0;
    }
  }
`;

const DetailsButton = styled.button`
  background: none;
  border: none;
  color: #4a00e0;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  font-size: 14px;
  align-self: flex-start;
`;



const DetailItem = styled.div`
  margin-bottom: 10px;
  
  h4 {
    margin: 0 0 5px 0;
    color: #4a00e0;
  }
  
  pre {
    background: #f8f8f8;
    padding: 10px;
    border-radius: 4px;
    overflow-x: auto;
    margin: 0;
    font-size: 13px;
  }
`;

const NoRecommendations = styled.p`
  text-align: center;
  font-size: 18px;
  color: white;
  margin-top: 50px;
`;

// 主组件
const RecommendationUI = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getRecommendations();
        console.log('API响应:', response.data);

        if (response.data?.code === 200 && response.data?.data) {
          const scenes = Object.entries(response.data.data).map(([source, scene]) => ({
            ...scene,
            source, // 'deepseek' 或 'zhipu'
            sourceName: SOURCE_CONFIG[source]?.name || source,
            sourceColor: SOURCE_CONFIG[source]?.color,
            sourceIcon: SOURCE_CONFIG[source]?.icon,
            uid: `${source}-${scene.scene_id}`, // 唯一标识
            scene_config: {
              fan: { power: 'off', speed: 'medium' }, // 补充默认值
              ...scene.scene_config
            }
          }));
          setRecommendations(scenes);
        } else {
          throw new Error(response.data?.msg || '数据格式不符合预期');
        }
      } catch (err) {
        console.error('获取推荐失败:', err);
        setError(err);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);
  const formatDeviceValue = (deviceType, key, value) => {
  const units = {
    temperature: '°C',
    humidity: '%',
    position: '%',
    brightness: 'lm'
  };

  const mappings = {
    mode: {
      cool: '制冷',
      heat: '制热'
    },
    speed: {
      low: '低速',
      medium: '中速',
      high: '高速'
    },
    // 其他映射...
  };

  if (mappings[key]?.[value]) return mappings[key][value];
  if (units[key]) return `${value}${units[key]}`;
  return value;
};
  const acceptRecommendation = async (sceneId, Username) => {
    try {
      setLoading(true);
      const response = await switchScene(sceneId, Username);
      
      if (response.data.code === 200) {
        alert(`场景切换成功: ${response.data.msg}`);
      } else {
        throw new Error(response.data.msg || '切换场景失败');
      }
    } catch (error) {
      console.error('切换场景失败:', error);
      alert(`切换场景失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderDeviceState = (deviceType, state) => {
  if (!state) return null;

  return (
    <DeviceInfo deviceType={deviceType}>
      <DeviceTitle deviceType={deviceType}>
        {DEVICE_TYPES_CN[deviceType] || deviceType}
      </DeviceTitle>
      
      <InfoItem>
        <InfoLabel>电源状态</InfoLabel>
        <InfoValue>{state.power === 'on' ? '开启' : '关闭'}</InfoValue>
      </InfoItem>

      {state.power === 'on' && (
        <>
          {Object.entries(state).map(([key, value]) => {
            if (key === 'power') return null;
            return (
              <InfoItem key={key}>
                <InfoLabel>
                  {{
                    temperature: '目标温度',
                    mode: '运行模式',
                    speed: '风速',
                    brightness: '亮度',
                    color: '色温',
                    humidity: '目标湿度',
                    level: '运行等级',
                    position: '开合度',
                    style: '窗帘样式'
                  }[key] || key}
                </InfoLabel>
                <InfoValue>
                  {formatDeviceValue(deviceType, key, value)}
                </InfoValue>
              </InfoItem>
            );
          })}
        </>
      )}
    </DeviceInfo>
  );
};

  if (loading) {
    return <Container><Title>智能场景推荐</Title><NoRecommendations>加载中...</NoRecommendations></Container>;
  }

  if (error) {
    return (
      <Container>
        <Title>智能场景推荐</Title>
        <NoRecommendations>
          加载失败: {error.message}
          <Button onClick={() => window.location.reload()}>重试</Button>
        </NoRecommendations>
      </Container>
    );
  }

  return (
    <Container>
      <Title>智能场景推荐</Title>
      
      {recommendations.length > 0 ? (
        <CardsContainer>
          {recommendations.map((recommendation) => (
            <RecommendationCard key={recommendation.uid}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px'
              }}>
                <SceneName>{recommendation.scene_name}</SceneName>
                <SourceTag 
                  color={recommendation.sourceColor}
                  title={`来自${recommendation.sourceName}的推荐`}
                >
                  {recommendation.sourceIcon} {recommendation.sourceName}
                </SourceTag>
              </div>

              <ReasonText>{recommendation.reason}</ReasonText>
              
              <DetailsButton onClick={() => setExpandedCard(
                expandedCard === recommendation.uid ? null : recommendation.uid
              )}>
                {expandedCard === recommendation.uid ? '隐藏详情' : '查看详情'}
              </DetailsButton>
              
              {expandedCard === recommendation.uid && (
                <DetailsPanel>
                  {renderDeviceState('conditioner', recommendation.scene_config?.conditioner)}
                  {renderDeviceState('lamp', recommendation.scene_config?.lamp)}
                  {renderDeviceState('dehumidifier', recommendation.scene_config?.dehumidifier)}
                  {renderDeviceState('fan', recommendation.scene_config?.fan)}
                  {renderDeviceState('curtain', recommendation.scene_config?.curtain)}
                </DetailsPanel>
              )}
              
              <ButtonGroup>
                <Button 
                  onClick={() => acceptRecommendation(
                    recommendation.scene_id,
                    localStorage.getItem('username')
                  )}
                  disabled={loading}
                >
                  {loading ? '处理中...' : '接受推荐'}
                </Button>
                <Button onClick={() => alert('已忽略此推荐')}>
                  忽略
                </Button>
              </ButtonGroup>
            </RecommendationCard>
          ))}
        </CardsContainer>
      ) : (
        <NoRecommendations>暂无推荐场景</NoRecommendations>
      )}
    </Container>
  );
};

export default RecommendationUI;