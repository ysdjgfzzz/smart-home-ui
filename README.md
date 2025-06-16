*前端项目*
**项目结构**：
```
.
├── App.js
├── assets
│   ├── images
│   └── styles
├── components
│   ├── DeviceMonitorUI
│   │   └── DeviceMonitorUI.js
│   ├── GuidingUI
│   │   └── GuidingUI.js
│   ├── LoginRegisterUI
│   │   └── LoginRegisterUI.js
│   ├── MainControlUI
│   │   └── MainControlUI.js
│   ├── RecommendationUI
│   │   └── RecommendationUI.js
│   ├── RegisterUI
│   │   └── RegisterUI.js
│   └── SceneConfigUI
│       ├── HistoryControllerUI.js
│       └── SceneConfigUI.js
├── constants
│   └── deviceTypes.js
├── index.js
├── reportWebVitals.js
├── services
│   ├── api.js
│   ├── socketService.js
│   └── tools.js
└── store
    ├── actions.js
    ├── reducers.js
    └── store.js
```
**文件说明**：
- App.js：项目入口文件，渲染根组件。
- assets：静态资源目录，包括图片和样式文件。
- components：组件目录，包括各个页面组件。
- constants：常量目录，包括设备类型常量。
- index.js：项目入口文件，渲染根组件。
- reportWebVitals.js：性能监控文件。
- services：服务目录，包括API接口、Socket服务、工具类。
- store：状态管理目录，包括Redux相关文件。
  
**使用方式**：
- 测试：
```
npm start
```
- 打包：
```
npm run build
```
