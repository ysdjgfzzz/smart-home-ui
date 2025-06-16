import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { connectSocket } from '../../services/socketService';

// 页面整体容器 - 使用与GuidingUI和LoginRegisterUI相同的渐变背景
const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Arial, sans-serif;
  padding: 15px;
  box-sizing: border-box;
  overflow: hidden;
  color: white;
`;

// 主容器 - 使用与登录注册界面相同的半透明样式
const Container = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 50px 35px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 550px;
  width: 100%;
  text-align: center;
  max-height: 95vh;
  overflow: hidden;
`;

// 标题样式 - 使用与GuidingUI相同的样式
const Title = styled.h1`
  color: white;
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 15px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

// 副标题 - 使用与GuidingUI相同的样式
const Subtitle = styled.p`
  color: white;
  font-size: 1.2rem;
  margin-bottom: 30px;
  line-height: 1.6;
`;

// 圆形布局容器 - 添加半透明边框效果
const CircularLayout = styled.div`
  position: relative;
  width: 400px;
  height: 400px;
  margin: 15px auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// 功能按钮样式 - 透明气泡效果
const FeatureButton = styled(Link)`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 130px;
  height: 130px;
  padding: 15px;
  
  /* 透明气泡效果 */
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(15px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  
  /* 气泡阴影效果 */
  box-shadow: 
    0 8px 32px rgba(255, 255, 255, 0.1),
    inset 0 2px 4px rgba(255, 255, 255, 0.2),
    inset 0 -2px 4px rgba(0, 0, 0, 0.1);
  
  color: white;
  text-decoration: none;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  
  /* 气泡高光效果 */
  &::before {
    content: '';
    position: absolute;
    top: 15%;
    left: 20%;
    width: 30%;
    height: 30%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    border: 2px solid rgba(255, 255, 255, 0.5);
    transform: translateY(-3px) scale(1.03);
    box-shadow: 
      0 12px 40px rgba(255, 255, 255, 0.15),
      inset 0 2px 6px rgba(255, 255, 255, 0.3),
      inset 0 -2px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
  
  &:active {
    transform: translateY(-1px) scale(1.01);
    background: rgba(255, 255, 255, 0.2);
    transition: all 0.1s ease;
  }
`;

// 按钮图标 - 增强气泡内的视觉效果
const ButtonIcon = styled.div`
  font-size: 2.2rem;
  margin-bottom: 8px;
  opacity: 0.95;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  position: relative;
  z-index: 2;
`;

// 按钮标题 - 增强文字效果
const ButtonTitle = styled.h3`
  font-size: 1rem;
  font-weight: bold;
  margin: 0;
  text-align: center;
  line-height: 1.2;
  position: relative;
  z-index: 2;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
`;

// 按钮描述 - 增强文字效果
const ButtonDescription = styled.p`
  font-size: 0.7rem;
  opacity: 0.9;
  margin: 3px 0 0 0;
  text-align: center;
  line-height: 1.2;
  position: relative;
  z-index: 2;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

// 退出按钮 - 使用与登录注册界面相同的按钮样式
const LogoutButton = styled(Link)`
  display: inline-block;
  padding: 12px 25px;
  font-size: 1.1rem;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  text-decoration: none;
  border-radius: 25px;
  font-weight: bold;
  margin-top: 25px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
`;

const MainControlUI = () => {
  // 按钮位置和速度状态
  const [buttonPositions, setButtonPositions] = useState([
    { x: 150, y: 30, vx: 0.5, vy: 0.3 }, // 设备监控 - 上方区域
    { x: 30, y: 250, vx: -0.3, vy: -0.4 }, // 场景配置 - 左下区域
    { x: 250, y: 250, vx: 0.4, vy: -0.5 } // 智能推荐 - 右下区域
  ]);
  
  const animationRef = useRef();
  
  // 容器和按钮的尺寸常量
  const CONTAINER_SIZE = 400;
  const BUTTON_SIZE = 130;
  const SPEED = 0.3; // 移动速度倍数
  
  // 定义每个按钮的移动边界
  const buttonBounds = [
    // 设备监控 - 上方区域（上半圆）
    {
      minX: 50,
      maxX: CONTAINER_SIZE - BUTTON_SIZE - 50,
      minY: 0,
      maxY: 70
    },
    // 场景配置 - 左下区域
    {
      minX: 0,
      maxX: 70,
      minY: 180,
      maxY: CONTAINER_SIZE - BUTTON_SIZE
    },
    // 智能推荐 - 右下区域
    {
      minX: 200,
      maxX: CONTAINER_SIZE - BUTTON_SIZE,
      minY: 180,
      maxY: CONTAINER_SIZE - BUTTON_SIZE
    }
  ];
  
  // 动画循环函数
  const animate = () => {
    setButtonPositions(prevPositions => 
      prevPositions.map((pos, index) => {
        const bounds = buttonBounds[index];
        let newX = pos.x + pos.vx * SPEED;
        let newY = pos.y + pos.vy * SPEED;
        let newVx = pos.vx;
        let newVy = pos.vy;
        
        // 边界碰撞检测和反弹（使用各自的边界）
        if (newX <= bounds.minX || newX >= bounds.maxX) {
          newVx = -newVx;
          newX = Math.max(bounds.minX, Math.min(newX, bounds.maxX));
        }
        
        if (newY <= bounds.minY || newY >= bounds.maxY) {
          newVy = -newVy;
          newY = Math.max(bounds.minY, Math.min(newY, bounds.maxY));
        }
        
        // 添加轻微的随机扰动，让运动更自然
        newVx += (Math.random() - 0.5) * 0.02;
        newVy += (Math.random() - 0.5) * 0.02;
        
        // 限制速度范围
        const maxSpeed = 1.2;
        const minSpeed = 0.2;
        const speed = Math.sqrt(newVx * newVx + newVy * newVy);
        if (speed > maxSpeed) {
          newVx = (newVx / speed) * maxSpeed;
          newVy = (newVy / speed) * maxSpeed;
        } else if (speed < minSpeed) {
          newVx = (newVx / speed) * minSpeed;
          newVy = (newVy / speed) * minSpeed;
        }
        
        return {
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy
        };
      })
    );
    
    animationRef.current = requestAnimationFrame(animate);
  };
  
  // 启动和清理动画
  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    
    // 检查是否已登录
    const username = localStorage.getItem('username');
    if (username) {
      // 连接 Socket.IO
      connectSocket();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <PageContainer>
      <Container>
        <Title>智能家居控制中心</Title>
        <Subtitle>欢迎使用智能家居管理系统，请选择您需要的功能模块</Subtitle>
        
        <CircularLayout>
          <FeatureButton 
            to="/device-monitor" 
            style={{
              left: `${buttonPositions[0].x}px`,
              top: `${buttonPositions[0].y}px`
            }}
          >
            <ButtonIcon>📱</ButtonIcon>
            <ButtonTitle>设备监控</ButtonTitle>
            <ButtonDescription>实时查看设备</ButtonDescription>
          </FeatureButton>
          
          <FeatureButton 
            to="/scene-config" 
            style={{
              left: `${buttonPositions[1].x}px`,
              top: `${buttonPositions[1].y}px`
            }}
          >
            <ButtonIcon>🏠</ButtonIcon>
            <ButtonTitle>场景配置</ButtonTitle>
            <ButtonDescription>管理智能场景</ButtonDescription>
          </FeatureButton>
          
          <FeatureButton 
            to="/recommendation" 
            style={{
              left: `${buttonPositions[2].x}px`,
              top: `${buttonPositions[2].y}px`
            }}
          >
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