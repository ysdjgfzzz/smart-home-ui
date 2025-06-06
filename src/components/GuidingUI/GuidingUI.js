// src/components/GuidingUI/GuidingUI.js
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

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
`;

const Description = styled.p`
  font-size: 1.2rem;
  margin-bottom: 30px;
  line-height: 1.6;
  opacity: 0.9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 0;
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
  
  &:hover {
    background-color: white;
    color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const GuidingUI = () => {
  return (
    <Container>
      <Title>欢迎使用智能家居系统</Title>
      <Description>您的智能家居助手已准备就绪，为您提供便捷的家居控制体验</Description>
      <LoginButton to="/login">立即登录</LoginButton>
    </Container>
  );
};

export default GuidingUI;