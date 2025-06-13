// src/components/SceneConfigUI/SceneConfigUI.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getAllScenes, addScene, updateScene, removeScene } from '../../services/api';
import { DEVICE_TYPES, DEVICE_RANGES } from '../../constants/deviceTypes';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const SceneList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
  margin-top: 20px;
`;

const SceneCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  background: #007bff;
  color: white;
  cursor: pointer;
  &:hover {
    background: #0056b3;
  }
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const DeleteButton = styled(Button)`
  background: #dc3545;
  &:hover {
    background: #c82333;
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
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
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
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const DeviceStateCard = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
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
  color: #333;
  text-transform: capitalize;
`;

const DeviceInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 15px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const InfoLabel = styled.span`
  font-weight: bold;
  color: #666;
`;

const InfoValue = styled.span`
  color: #333;
`;

const SceneConfigUI = () => {
  const [scenes, setScenes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingScene, setEditingScene] = useState(null);
  const [selectedScene, setSelectedScene] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    device_type: '',
    state: {}
  });

  useEffect(() => {
    fetchScenes();
  }, []);

  const fetchScenes = async () => {
    try {
      const response = await getAllScenes();
      setScenes(response.data.data || []);
      console.log('获取到的场景数据:', response.data);
    } catch (error) {
      console.error('获取场景列表失败:', error);
      setScenes([]);
    }
  };

  const handleCreateScene = () => {
    setEditingScene(null);
    setFormData({
      name: '',
      device_type: '',
      state: {}
    });
    setShowModal(true);
  };

  const handleEditScene = (scene) => {
    setEditingScene(scene);
    setFormData({
      name: scene.name,
      device_type: scene.device_type,
      state: scene.state
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
        await updateScene({
          scene_id: editingScene.id,
          ...formData
        });
      } else {
        await addScene(formData);
      }
      setShowModal(false);
      await fetchScenes();
    } catch (error) {
      console.error('保存场景失败:', error);
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

  return (
    <Container>
      <h1>场景配置</h1>
      <Button onClick={handleCreateScene}>创建新场景</Button>
      
      <SceneList>
        {Array.isArray(scenes) && scenes.map((scene) => (
          <SceneCard key={scene.id}>
            <h3>{scene.name}</h3>
            <ButtonGroup>
              <Button onClick={() => handleViewDetail(scene)}>查看详情</Button>
              <Button onClick={() => handleEditScene(scene)}>编辑</Button>
              <DeleteButton onClick={() => handleDeleteScene(scene.id)}>删除</DeleteButton>
            </ButtonGroup>
          </SceneCard>
        ))}
      </SceneList>

      {showModal && (
        <Modal>
          <ModalContent>
            <h2>{editingScene ? '编辑场景' : '创建场景'}</h2>
            <Form onSubmit={handleSubmit}>
              <Input
                type="text"
                name="name"
                placeholder="场景名称"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <Select
                name="device_type"
                value={formData.device_type}
                onChange={handleInputChange}
                required
              >
                <option value="">选择设备类型</option>
                {Object.values(DEVICE_TYPES).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Select>
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
            <h2>场景详情：{selectedScene.name}</h2>
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
  );
};

export default SceneConfigUI;