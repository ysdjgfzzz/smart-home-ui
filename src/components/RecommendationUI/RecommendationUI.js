// src/components/RecommendationUI/RecommendationUI.js
import React from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px;
`;

const RecommendationUI = () => {
  const [recommendations, setRecommendations] = React.useState([]);

  React.useEffect(() => {
    axios.get('/api/recommendations').then((response) => {
      setRecommendations(response.data);
    });
  }, []);

  return (
    <Container>
      <h1>Recommendation</h1>
      <div>
        {recommendations.map((recommendation) => (
          <div key={recommendation.id}>
            <p>{recommendation.sceneName}</p>
            <button onClick={() => alert('Accept recommendation')}>Accept</button>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default RecommendationUI;