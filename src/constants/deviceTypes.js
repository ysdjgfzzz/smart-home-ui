// 设备类型
export const DEVICE_TYPES = {
  CONDITIONER: 'conditioner',
  LAMP: 'lamp',
  DEHUMIDIFIER: 'dehumidifier',
  CURTAIN: 'curtain'
};

// 设备类型中文映射
export const DEVICE_TYPES_CN = {
  'conditioner': '空调',
  'lamp': '智能灯',
  'dehumidifier': '除湿器',
  'curtain': '窗帘'
};

// 设备配置范围
export const DEVICE_RANGES = {
  [DEVICE_TYPES.CONDITIONER]: {
    temperature: { min: 16, max: 30, step: 1, unit: '°C' },
    speeds: ['low', 'medium', 'high'],
    modes: ['cool', 'heat']
  },
  [DEVICE_TYPES.LAMP]: {
    brightness: { min: 0, max: 1400, step: 200, unit: 'lm' },
    colors: ['warm', 'neutral', 'cool']
  },
  [DEVICE_TYPES.DEHUMIDIFIER]: {
    humidity: { min: 30, max: 80, step: 10, unit: '%' },
    levels: ['auto', 'powerful', 'quiet']
  },
  [DEVICE_TYPES.CURTAIN]: {
    position: { min: 0, max: 100, step: 20, unit: '%' },
    styles: ['sunshade', 'sheer', 'blind']
  }
};