// src/components/DeviceMonitorUI/DeviceMonitorUI.js
import React from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px;
`;

const DeviceMonitorUI = () => {
  const [devices, setDevices] = React.useState([]);

  React.useEffect(() => {
    axios.get('/api/devices').then((response) => {
      setDevices(response.data);
    });
  }, []);

  return (
    <Container>
      <h1>Device Monitor</h1>
      <div>
        {devices.map((device) => (
          <div key={device.id}>
            <p>{device.name}</p>
            <p>Status: {device.status}</p>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default DeviceMonitorUI;