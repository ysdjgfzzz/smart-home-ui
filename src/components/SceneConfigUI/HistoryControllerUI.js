import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getRecycleBinScenes, recoverScene, clearRecycleBin, getAllRules } from '../../services/api';
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

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: white;
  font-size: 2.5rem;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 15px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(66, 133, 244, 0.8);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
  min-width: fit-content;

  &:hover {
    background: rgba(51, 103, 214, 0.9);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ClearButton = styled(Button)`
  background: rgba(220, 53, 69, 0.8);
  &:hover {
    background: rgba(200, 35, 51, 0.9);
  }
`;

const RefreshButton = styled(Button)`
  background: rgba(40, 167, 69, 0.8);
  &:hover {
    background: rgba(34, 139, 58, 0.9);
  }
`;

const SceneList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
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
  gap: 15px;
  color: white;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
  }
`;

const SceneName = styled.h3`
  margin: 0;
  font-size: 1.3rem;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const SceneDescription = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  line-height: 1.4;
`;

const SceneInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InfoLabel = styled.span`
  font-weight: bold;
  color: white;
`;

const InfoValue = styled.span`
  color: white;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const ViewDetailButton = styled(Button)`
  flex: 1;
`;

const RecoverButton = styled(Button)`
  background: rgba(40, 167, 69, 0.8);
  flex: 1;
  
  &:hover {
    background: rgba(34, 139, 58, 0.9);
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
`;

const EmptyText = styled.p`
  font-size: 1.2rem;
  margin: 0;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  
  &::after {
    content: '';
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top: 3px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
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
  z-index: 1000;
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

const ModalTitle = styled.h3`
  margin: 0 0 15px 0;
  font-size: 1.3rem;
`;

const ModalText = styled.p`
  margin: 0 0 25px 0;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
`;

const DeviceInfo = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
`;

const DeviceTitle = styled.h3`
  margin: 0 0 10px 0;
  color: white;
  text-transform: capitalize;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
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

const HistoryControllerUI = ({ onSceneRecover }) => {
  const [scenes, setScenes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedScene, setSelectedScene] = useState(null);
  const [sceneRules, setSceneRules] = useState({});
  const [operationLoading, setOperationLoading] = useState(false);

  // 获取回收站场景列表
  const fetchRecycleBinScenes = async () => {
    try {
      setLoading(true);
      const response = await getRecycleBinScenes();
      console.log('回收站API响应:', response.data); // 添加调试日志
      
      // 根据实际API响应格式调整判断逻辑
      if (response.data && response.data.code === 200) {
        // 无论data是否为空都正常设置，让界面自然显示空状态
        setScenes(response.data.data || []);
      } else {
        setScenes([]);
      }
    } catch (error) {
      console.error('获取回收站场景失败:', error);
      setScenes([]);
      showErrorTip(`网络请求失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 恢复场景
  const handleRecoverScene = async (sceneId, sceneName) => {
    try {
      setOperationLoading(true);
      const response = await recoverScene(sceneId);
      if (response.data) {
        showSuccessTip(`场景 "${sceneName}" 恢复成功`);
        // 重新获取回收站列表
        await fetchRecycleBinScenes();
        // 通知父组件更新场景配置界面
        if (onSceneRecover) {
          onSceneRecover();
        }
      } else {
        showErrorTip(`恢复场景失败: ${response.data?.message || '未知错误'}`);
      }
    } catch (error) {
      console.error('恢复场景失败:', error);
      showErrorTip(`恢复场景失败: ${error.message}`);
    } finally {
      setOperationLoading(false);
    }
  };

  // 清空回收站
  const handleClearRecycleBin = async () => {
    try {
      setOperationLoading(true);
      const response = await clearRecycleBin();
      if (response.data) {
        showSuccessTip('回收站已清空');
        setScenes([]);
      } else {
        showErrorTip(`清空回收站失败: ${response.data?.message || '未知错误'}`);
      }
    } catch (error) {
      console.error('清空回收站失败:', error);
      showErrorTip(`清空回收站失败: ${error.message}`);
    } finally {
      setOperationLoading(false);
      setShowClearModal(false);
    }
  };

  // 格式化时间
  const formatDate = (dateString) => {
    if (!dateString) return '未知时间';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return '时间格式错误';
    }
  };

  const handleViewDetail = async (scene) => {
    setSelectedScene(scene);
    setShowDetailModal(true);
    try {
      const response = await getAllRules(scene.scene_id);
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

  // 渲染设备状态
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

  // 渲染规则
  const renderRules = (sceneId) => {
    const rules = sceneRules[sceneId];
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

    return (
      <DeviceInfo>
        <DeviceTitle>场景规则</DeviceTitle>
        {rules.map((rule, index) => {
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
                  {condition.temperature && (
                    <div style={{ marginBottom: '10px' }}>
                      <InfoLabel>温度条件：</InfoLabel>
                      {condition.temperature.operator === 'range' ? (
                        <InfoValue>
                          {condition.temperature.min}°C ~ {condition.temperature.max}°C
                        </InfoValue>
                      ) : (
                        <InfoValue>
                          {condition.temperature.operator === 'gt' ? '大于' : 
                           condition.temperature.operator === 'lt' ? '小于' : 
                           condition.temperature.operator === 'eq' ? '等于' : ''} {condition.temperature.value}°C
                        </InfoValue>
                      )}
                    </div>
                  )}
                  {condition.illumination && (
                    <div style={{ marginBottom: '10px' }}>
                      <InfoLabel>光照条件：</InfoLabel>
                      {condition.illumination.operator === 'range' ? (
                        <InfoValue>
                          {condition.illumination.min} lux ~ {condition.illumination.max} lux
                        </InfoValue>
                      ) : (
                        <InfoValue>
                          {condition.illumination.operator === 'gt' ? '大于' : 
                           condition.illumination.operator === 'lt' ? '小于' : 
                           condition.illumination.operator === 'eq' ? '等于' : ''} {condition.illumination.value} lux
                        </InfoValue>
                      )}
                    </div>
                  )}
                  {condition.humidity && (
                    <div style={{ marginBottom: '10px' }}>
                      <InfoLabel>湿度条件：</InfoLabel>
                      {condition.humidity.operator === 'range' ? (
                        <InfoValue>
                          {condition.humidity.min}% ~ {condition.humidity.max}%
                        </InfoValue>
                      ) : (
                        <InfoValue>
                          {condition.humidity.operator === 'gt' ? '大于' : 
                           condition.humidity.operator === 'lt' ? '小于' : 
                           condition.humidity.operator === 'eq' ? '等于' : ''} {condition.humidity.value}%
                        </InfoValue>
                      )}
                    </div>
                  )}
                  {condition.time && (
                    <div style={{ marginBottom: '10px' }}>
                      <InfoLabel>时间条件：</InfoLabel>
                      <InfoValue>
                        {condition.time.start} ~ {condition.time.end}
                      </InfoValue>
                    </div>
                  )}
                  {condition.week && (
                    <div style={{ marginBottom: '10px' }}>
                      <InfoLabel>星期条件：</InfoLabel>
                      <InfoValue>
                        {condition.week.map(day => {
                          const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
                          return weekdays[day] || day;
                        }).join('、')}
                      </InfoValue>
                    </div>
                  )}
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

  useEffect(() => {
    fetchRecycleBinScenes();
  }, []);

  return (
    <PageContainer>
      <Container>
        <Header>
          <Title>回收站</Title>
          <HeaderActions>
            <RefreshButton 
              onClick={fetchRecycleBinScenes}
              disabled={loading || operationLoading}
            >
              刷新
            </RefreshButton>
            <ClearButton 
              onClick={() => setShowClearModal(true)}
              disabled={loading || operationLoading || scenes.length === 0}
            >
              清空回收站
            </ClearButton>
          </HeaderActions>
        </Header>

        {loading ? (
          <LoadingSpinner />
        ) : scenes.length === 0 ? (
          <EmptyState>
            <EmptyIcon>🗑️</EmptyIcon>
            <EmptyText>回收站为空</EmptyText>
          </EmptyState>
        ) : (
          <SceneList>
            {scenes.map((scene) => (
              <SceneCard key={scene.scene_id}>
                <SceneName>{scene.name || '未命名场景'}</SceneName>
                
                <SceneInfo>
                  {scene.config && scene.config.length > 0 && (
                    <InfoRow>
                      <InfoLabel>设备配置:</InfoLabel>
                      <InfoValue>{scene.config.length} 个设备</InfoValue>
                    </InfoRow>
                  )}
                </SceneInfo>

                <ButtonGroup>
                  <ViewDetailButton
                    onClick={() => handleViewDetail(scene)}
                    disabled={operationLoading}
                  >
                    查看详情
                  </ViewDetailButton>
                  <RecoverButton
                    onClick={() => handleRecoverScene(scene.scene_id, scene.name)}
                    disabled={operationLoading}
                  >
                    恢复场景
                  </RecoverButton>
                </ButtonGroup>
              </SceneCard>
            ))}
          </SceneList>
        )}
      </Container>

      {/* 清空回收站确认弹窗 */}
      {showClearModal && (
        <Modal>
          <ModalContent>
            <ModalTitle>确认清空回收站</ModalTitle>
            <ModalText>
              此操作将永久删除回收站中的所有场景，无法恢复。确定要继续吗？
            </ModalText>
            <ModalActions>
              <Button 
                onClick={() => setShowClearModal(false)}
                disabled={operationLoading}
              >
                取消
              </Button>
              <ClearButton 
                onClick={handleClearRecycleBin}
                disabled={operationLoading}
              >
                {operationLoading ? '清空中...' : '确认清空'}
              </ClearButton>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}

      {/* 场景详情模态框 */}
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
    </PageContainer>
  );
};

export default HistoryControllerUI;