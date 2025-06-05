import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GuidingUI from './components/GuidingUI/GuidingUI';
import LoginRegisterUI from './components/LoginRegisterUI/LoginRegisterUI';
import MainControlUI from './components/MainControlUI/MainControlUI';
import DeviceMonitorUI from './components/DeviceMonitorUI/DeviceMonitorUI';
import SceneConfigUI from './components/SceneConfigUI/SceneConfigUI';
import RecommendationUI from './components/RecommendationUI/RecommendationUI';
import RegisterUI from './components/RegisterUI/RegisterUI';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<GuidingUI />} />
        <Route path="/login" element={<LoginRegisterUI />} />
        <Route path="/main" element={<MainControlUI />} />
        <Route path="/device-monitor" element={<DeviceMonitorUI />} />
        <Route path="/scene-config" element={<SceneConfigUI />} />
        <Route path="/recommendation" element={<RecommendationUI />} />
        <Route path="/register" element={<RegisterUI />} />
      </Routes>
    </Router>
  );
};

export default App;