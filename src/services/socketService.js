import io from 'socket.io-client';
import { showNormalTip, showErrorTip } from './tools';

let socket = null;

export const connectSocket = () => {
  if (socket && socket.connected) {
    return socket;
  }

  try {
    socket = io('http://localhost:8000');

    socket.on('connect', () => {
      console.log('Socket.IO已连接, id=', socket.id);
      showNormalTip('实时监控已连接');
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket.IO已断开:', reason);
    });

    socket.on('monitor_data', (payload) => {
      console.log('收到监控数据:', payload);
      if (payload) {
        // 将完整的监控数据存储到localStorage
        const monitorData = {
          ...payload,
          lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('monitorData', JSON.stringify(monitorData));
        
        // 触发一个自定义事件,通知其他组件数据已更新
        const event = new CustomEvent('monitorDataUpdate', { 
          detail: monitorData 
        });
        window.dispatchEvent(event);
      }
    });

    socket.on('scene_update', (payload) => {
      console.log('收到场景更新:', payload);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket.IO连接错误:', err.message);
    });

    return socket;
  } catch (error) {
    console.error('Socket.IO连接失败:', error);
    showErrorTip('实时监控连接失败');
    return null;
  }
};

export const getSocket = () => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}; 