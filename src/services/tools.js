import styled from 'styled-components';

// 创建弹窗样式
const AlertContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  z-index: 1000;
  display: none;
  transition: opacity 0.3s ease;

  &.show {
    display: block;
    animation: fadeInOut 0.3s ease;
  }

  @keyframes fadeInOut {
    0% { opacity: 0; transform: translate(-50%, -20px); }
    20% { opacity: 1; transform: translate(-50%, 0); }
    80% { opacity: 1; transform: translate(-50%, 0); }
    100% { opacity: 0; transform: translate(-50%, -20px); }
  }
`;

// 创建并插入弹窗DOM元素
function createAlertElement() {
  const alertElement = document.createElement('div');
  alertElement.id = 'customAlert';
  document.body.appendChild(alertElement);
  return alertElement;
}

// 获取或创建弹窗元素
function getAlertElement() {
  let alertElement = document.getElementById('customAlert');
  if (!alertElement) {
    alertElement = createAlertElement();
  }
  return alertElement;
}

// 通用弹窗函数
export function showAlert(message, duration = 1000, backgroundColor = 'rgba(0, 0, 0, 0.8)') {
  const alertElement = getAlertElement();
  
  // 应用样式
  alertElement.style.position = 'fixed';
  alertElement.style.top = '20px';
  alertElement.style.left = '50%';
  alertElement.style.transform = 'translateX(-50%)';
  alertElement.style.backgroundColor = backgroundColor;
  alertElement.style.color = 'white';
  alertElement.style.padding = '10px 20px';
  alertElement.style.borderRadius = '4px';
  alertElement.style.zIndex = '1000';
  alertElement.style.display = 'none';
  
  // 设置消息
  alertElement.textContent = message;
  
  // 显示弹窗
  alertElement.style.display = 'block';
  alertElement.classList.add('show');

  // 设置定时隐藏
  setTimeout(() => {
    alertElement.classList.remove('show');
    setTimeout(() => {
      alertElement.style.display = 'none';
    }, 300);
  }, duration);
}

// 普通提示（1秒）
export function showNormalTip(message) {
  showAlert(message, 1000, 'rgba(0, 0, 0, 0.8)');
}

// 重要提示（2秒）
export function showImportantTip(message) {
  showAlert(message, 2000, 'rgba(0, 0, 0, 0.8)');
}

// 错误提示（2秒，红色背景）
export function showErrorTip(message) {
  showAlert(message, 2000, 'rgba(220, 53, 69, 0.9)');
}

// 成功提示（1.5秒，绿色背景）
export function showSuccessTip(message) {
  showAlert(message, 1500, 'rgba(40, 167, 69, 0.9)');
}
