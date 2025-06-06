import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

// 页面整体容器，设置背景图片
const PageContainer = styled.div`
  min-height: 100vh;
  background-image: url('/figures/background.jpg'); /* 您需要将背景图片放到public/figures/目录下 */
  background-size: cover;
  background-position: center center;
  background-attachment: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Arial, sans-serif;
  margin: 0;
`;

// 半透明容器
const Container = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 40px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  opacity: 0.95;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// Logo容器
const LogoContainer = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

// Logo图片样式
const LogoImage = styled.img`
  width: 400px;
  height: auto;
  max-width: 100%;
`;

// 表单容器
const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  margin-top: 80px;
`;

// 输入框容器
const InputContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 10px;
  position: relative;
`;

// 图标样式
const InputIcon = styled.i`
  font-size: 25px;
  color: #888;
  margin-right: 8px;
  position: absolute;
  left: 10px;
  z-index: 1;
`;

// 分隔符
const Separator = styled.span`
  font-size: 18px;
  color: #888;
  margin-right: 8px;
  position: absolute;
  left: 35px;
  z-index: 1;
`;

// 输入框样式
const Input = styled.input`
  padding: 10px;
  padding-left: 50px;
  font-size: 16px;
  border-radius: 4px;
  width: 100%;
  border: 1px solid #ddd;
  box-sizing: border-box;
`;

// 登录按钮样式
const LoginButton = styled.button`
  background-color: rgb(0, 60, 0);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
  margin: 20px 0 10px 0;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: rgb(0, 40, 0);
  }
`;

// 注册链接样式
const RegisterLink = styled(Link)`
  text-align: center;
  color: #007bff;
  text-decoration: none;
  margin-top: 10px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const LoginRegisterUI = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    navigate('/main');
  };

  return (
    <PageContainer>
      <Container>
        <LogoContainer>
          {/* 您需要将logo图片放到public/figures/目录下 */}
          <LogoImage src="/figures/platform_logo.png" alt="智能家居平台" />
        </LogoContainer>
        <Form>
          <InputContainer>
            <InputIcon className="fas fa-user"></InputIcon>
            <Separator>|</Separator>
            <Input
              type="text"
              placeholder="用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </InputContainer>
          <InputContainer>
            <InputIcon className="fas fa-lock"></InputIcon>
            <Separator>|</Separator>
            <Input
              type="password"
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </InputContainer>
          <LoginButton onClick={handleLogin}>登录</LoginButton>
          <RegisterLink to="/register">注册新账户</RegisterLink>
        </Form>
      </Container>
    </PageContainer>
  );
};

export default LoginRegisterUI;