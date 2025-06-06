import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../services/api';
import { showSuccessTip, showErrorTip, showNormalTip } from '../../services/tools';
import styled from 'styled-components';

// 页面整体容器，设置背景图片
const PageContainer = styled.div`
  min-height: 100vh;
  background-image: url('/figures/background.jpg');
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

// 注册按钮样式
const RegisterButton = styled.button`
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

// 登录链接样式
const LoginLink = styled(Link)`
  text-align: center;
  color: #007bff;
  text-decoration: none;
  margin-top: 10px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const RegisterUI = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await register(username, password);
      const { code, msg } = response.data;
      
      if (code === 202) {
        showSuccessTip('注册成功！请登录。');
        navigate('/login');
      } else if (code === 504) {
        showErrorTip('注册失败，该用户名已被使用');
      } else if (code === 503) {
        showErrorTip('请输入用户名和密码');
      } else {
        showErrorTip(msg || '注册失败，请重试');
      }
    } catch (error) {
      showErrorTip('服务器错误，请稍后重试');
    }
  };

  return (
    <PageContainer>
      <Container>
        <LogoContainer>
          <LogoImage src="/figures/platform_logo.png" alt="智能家居平台" />
        </LogoContainer>
        <Form onSubmit={(e) => {
          e.preventDefault();
          handleRegister();
        }}>
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
          <RegisterButton type="button" onClick={handleRegister}>注册</RegisterButton>
          <LoginLink to="/login">返回登录</LoginLink>
        </Form>
      </Container>
    </PageContainer>
  );
};

export default RegisterUI;