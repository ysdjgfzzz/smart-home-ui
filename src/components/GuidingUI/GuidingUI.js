// src/components/GuidingUI/GuidingUI.js
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  text-align: center;
  padding: 50px;
`;

const GuidingUI = () => {
  return (
    <Container>
      <h1>Welcome to Smart Home System</h1>
      <p>Your smart home assistant is ready to serve you.</p>
      <Link to="/login">Login</Link>
    </Container>
  );
};

export default GuidingUI;