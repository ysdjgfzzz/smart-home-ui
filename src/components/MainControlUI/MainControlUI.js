// src/components/MainControlUI/MainControlUI.js
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px;
`;

const LinkList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px; /* 添加间距 */
`;
const MainControlUI = () => {
  return (
    <Container>
      <h1>Main Control Panel</h1>
      <LinkList>
        <Link to="/device-monitor">Device Monitor</Link>
        <Link to="/scene-config">Scene Configuration</Link>
        <Link to="/recommendation">Recommendation</Link>
      </LinkList>
    </Container>
  );
};

export default MainControlUI;