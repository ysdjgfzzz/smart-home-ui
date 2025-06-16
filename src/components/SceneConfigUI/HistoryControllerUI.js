import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getRecycleBinScenes, recoverScene, clearRecycleBin } from '../../services/api';
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
  font-weight: 500;
`;

const InfoValue = styled.span`
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
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
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  color: white;
  text-align: center;
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

const HistoryControllerUI = ({ onSceneRecover }) => {
  const [scenes, setScenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showClearModal, setShowClearModal] = useState(false);
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
                <SceneDescription>
                  {scene.description || '暂无描述'}
                </SceneDescription>
                
                <SceneInfo>
                  <InfoRow>
                    <InfoLabel>场景ID:</InfoLabel>
                    <InfoValue>{scene.scene_id}</InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>创建者:</InfoLabel>
                    <InfoValue>{scene.creator || '未知'}</InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>优先级:</InfoLabel>
                    <InfoValue>{scene.priority || 0}</InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>创建时间:</InfoLabel>
                    <InfoValue>{formatDate(scene.created_at)}</InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>更新时间:</InfoLabel>
                    <InfoValue>{formatDate(scene.updated_at)}</InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>状态:</InfoLabel>
                    <InfoValue>{scene.enabled ? '启用' : '禁用'}</InfoValue>
                  </InfoRow>
                  {scene.config && scene.config.length > 0 && (
                    <InfoRow>
                      <InfoLabel>设备配置:</InfoLabel>
                      <InfoValue>{scene.config.length} 个设备</InfoValue>
                    </InfoRow>
                  )}
                </SceneInfo>

                <ButtonGroup>
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
    </PageContainer>
  );
};

export default HistoryControllerUI;