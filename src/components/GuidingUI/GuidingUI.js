import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

// 从下方飘入的动画
const slideUpFadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(50px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-sizing: border-box;
  overflow: hidden;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 15px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin-top: 0;
  opacity: 0;
  animation: ${props => props.show ? slideUpFadeIn : 'none'} 1s ease-out forwards;
  animation-delay: 0.2s;
`;

const Description = styled.p`
  font-size: 1.2rem;
  margin-bottom: 30px;
  line-height: 1.6;
  opacity: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 0;
  animation: ${props => props.show ? slideUpFadeIn : 'none'} 1s ease-out forwards;
  animation-delay: 0.8s;
`;

const LoginButton = styled(Link)`
  display: inline-block;
  padding: 12px 25px;
  font-size: 1.1rem;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  text-decoration: none;
  border-radius: 25px;
  border: 2px solid white;
  transition: all 0.3s ease;
  opacity: 0;
  animation: ${props => props.show ? slideUpFadeIn : 'none'} 1s ease-out forwards;
  animation-delay: 1.4s;
  
  &:hover {
    background-color: white;
    color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const GuidingUI = () => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // 组件挂载后立即开始动画
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Container>
      <Title show={showAnimation}>欢迎使用智能家居系统</Title>
      <Description show={showAnimation}>您的智能家居助手已准备就绪，为您提供便捷的家居控制体验</Description>
      <LoginButton to="/login" show={showAnimation}>立即登录</LoginButton>
    </Container>
  );
};

export default GuidingUI;