// src/components/MainControlUI/MainControlUI.js
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// 页面整体容器 - 使用背景图片
const PageContainer = styled.div`
  min-height: 100vh;
  background: url('/background.jpg') center/cover no-repeat,
              linear-gradient(135deg, #74b9ff 0%, #0984e3 50%, #6c5ce7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  padding: 15px;
  box-sizing: border-box;
  overflow: hidden;
`;

// 主容器
const Container = styled.div`
  background: rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 30px 25px;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  max-width: 550px;
  width: 100%;
  text-align: center;
  max-height: 95vh;
  overflow: hidden;
`;

// 标题样式
const Title = styled.h1`
  color:rgb(255, 255, 255);
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

// 副标题
const Subtitle = styled.p`
  color:rgb(255, 255, 255);
  font-size: 0.9rem;
  margin-bottom: 25px;
  line-height: 1.4;
`;

// 圆形布局容器
const CircularLayout = styled.div`
  position: relative;
  width: 400px;
  height: 400px;
  margin: 15px auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// 功能按钮样式
const FeatureButton = styled(Link)`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 130px;
  height: 130px;
  padding: 15px;
  background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
  color: white;
  text-decoration: none;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(116, 185, 255, 0.3);
  
  &:hover {
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 15px 35px rgba(116, 185, 255, 0.4);
    background: linear-gradient(135deg, #0984e3 0%, #74b9ff 100%);
  }
  
  &:active {
    transform: translateY(-2px) scale(1.02);
  }
  
  /* 上方按钮位置 - 0度角 */
  &.top {
    top: 25px;
    left: 50%;
    transform: translateX(-50%);
  }
  
  /* 左下角按钮位置 - 240度角 */
  &.bottom-left {
    bottom: 25px;
    left: 25px;
  }
  
  /* 右下角按钮位置 - 120度角 */
  &.bottom-right {
    bottom: 25px;
    right: 25px;
  }
`;

// 按钮图标
const ButtonIcon = styled.div`
  font-size: 2.2rem;
  margin-bottom: 8px;
  opacity: 0.9;
`;

// 按钮标题
const ButtonTitle = styled.h3`
  font-size: 1rem;
  font-weight: bold;
  margin: 0;
  text-align: center;
  line-height: 1.2;
`;

// 按钮描述
const ButtonDescription = styled.p`
  font-size: 0.7rem;
  opacity: 0.8;
  margin: 3px 0 0 0;
  text-align: center;
  line-height: 1.2;
`;

// 退出按钮
const LogoutButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 20px;
  background: linear-gradient(135deg, #fd79a8 0%, #e84393 100%);
  color: white;
  text-decoration: none;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
  margin-top: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(232, 67, 147, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(232, 67, 147, 0.4);
    background: linear-gradient(135deg, #e84393 0%, #fd79a8 100%);
  }
`;

const MainControlUI = () => {
  return (
    <PageContainer>
      <Container>
        <Title>智能家居控制中心</Title>
        <Subtitle>欢迎使用智能家居管理系统，请选择您需要的功能模块</Subtitle>
        
        <CircularLayout>
          <FeatureButton to="/device-monitor" className="top">
            <ButtonIcon>📱</ButtonIcon>
            <ButtonTitle>设备监控</ButtonTitle>
            <ButtonDescription>实时查看设备</ButtonDescription>
          </FeatureButton>
          
          <FeatureButton to="/scene-config" className="bottom-left">
            <ButtonIcon>🏠</ButtonIcon>
            <ButtonTitle>场景配置</ButtonTitle>
            <ButtonDescription>管理智能场景</ButtonDescription>
          </FeatureButton>
          
          <FeatureButton to="/recommendation" className="bottom-right">
            <ButtonIcon>💡</ButtonIcon>
            <ButtonTitle>智能推荐</ButtonTitle>
            <ButtonDescription>获取使用建议</ButtonDescription>
          </FeatureButton>
        </CircularLayout>
        
        <LogoutButton to="/">
          🚪 退出登录
        </LogoutButton>
      </Container>
    </PageContainer>
  );
};

export default MainControlUI;