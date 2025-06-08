import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { login } from '../../services/api';
import { showSuccessTip, showErrorTip, showNormalTip } from '../../services/tools';

// 页面整体容器，使用与GuidingUI相同的渐变背景
const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Arial, sans-serif;
  margin: 0;
  color: white;
`;

// 半透明容器 - 缩短水平宽度，保持高度不变
const Container = styled.div`
  max-width: 400px;
  width: 75%;
  margin: 20px auto;
  padding: 50px 35px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

// 返回按钮样式 - 稍微增大
const BackButton = styled(Link)`
  position: absolute;
  top: 18px;
  left: 18px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  font-size: 26px;
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
  transition: all 0.3s ease;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    transform: translateX(-2px);
  }
`;

// Logo容器 - 适度增大字体
const LogoContainer = styled.h1`
  text-align: center;
  margin-bottom: 36px;
  font-size: 2.3rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  color: white;
`;

// 表单容器 - 保持原有比例
const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 360px;
`;

// 输入框容器 - 适度增大间距
const InputContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 24px;
  position: relative;
`;

// 图标样式 - 适度增大图标
const InputIcon = styled.i`
  font-size: 22px;
  color: rgba(255, 255, 255, 0.8);
  margin-right: 8px;
  position: absolute;
  left: 17px;
  z-index: 1;
`;

// 分隔符 - 调整位置
const Separator = styled.span`
  font-size: 17px;
  color: rgba(255, 255, 255, 0.6);
  margin-right: 8px;
  position: absolute;
  left: 45px;
  z-index: 1;
`;

// 输入框样式 - 适度增大尺寸
const Input = styled.input`
  padding: 16px;
  padding-left: 65px;
  font-size: 17px;
  border-radius: 28px;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  box-sizing: border-box;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
    font-size: 15px;
  }
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.6);
    background: rgba(255, 255, 255, 0.15);
  }
`;

// 登录按钮样式 - 适度增大尺寸
const LoginButton = styled.button`
  padding: 16px 32px;
  font-size: 1.2rem;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  border-radius: 28px;
  cursor: pointer;
  margin: 24px 0 18px 0;
  transition: all 0.3s ease;
  font-weight: 500;
  
  &:hover {
    background-color: white;
    color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

// 注册链接样式 - 适度增大字体
const RegisterLink = styled(Link)`
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  margin-top: 12px;
  font-size: 1.05rem;
  transition: all 0.3s ease;
  
  &:hover {
    color: white;
    text-decoration: underline;
  }
`;

const LoginRegisterUI = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await login(username, password);
      const { code, msg } = response.data;
      
      if (code === 203) {
        showSuccessTip('登录成功！');
        navigate('/main');
      } else if (code === 504) {
        showErrorTip('用户名或密码错误');
      } else if (code === 503) {
        showErrorTip('请输入用户名和密码');
      } else {
        showErrorTip(msg || '登录失败，请重试');
      }
    } catch (error) {
      showErrorTip('服务器错误，请稍后重试');
    }
  };

  return (
    <PageContainer>
      <Container>
        <BackButton to="/">
          <i className="fas fa-arrow-left"></i>
        </BackButton>
        <LogoContainer>
          智能家居系统
        </LogoContainer>
        <Form onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
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
          <LoginButton type="button" onClick={handleLogin}>登录</LoginButton>
          <RegisterLink to="/register">注册新账户</RegisterLink>
        </Form>
      </Container>
    </PageContainer>
  );
};

export default LoginRegisterUI;