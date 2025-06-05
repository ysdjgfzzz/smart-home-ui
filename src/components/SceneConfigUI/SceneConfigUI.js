// src/components/SceneConfigUI/SceneConfigUI.js
import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px;
`;

const SceneConfigUI = () => {
  const [scenes, setScenes] = useState([]);

  const fetchScenes = async () => {
    const response = await axios.get('/api/scenes');
    setScenes(response.data);
  };

  React.useEffect(() => {
    fetchScenes();
  }, []);

  return (
    <Container>
      <h1>Scene Configuration</h1>
      <div>
        {scenes.map((scene) => (
          <div key={scene.id}>
            <p>{scene.name}</p>
            <button onClick={() => alert('Edit scene')}>Edit</button>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default SceneConfigUI;