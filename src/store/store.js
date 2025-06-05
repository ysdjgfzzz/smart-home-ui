// src/store/store.js
import { createStore } from 'redux';

const initialState = {
  user: null,
  scenes: [],
  devices: [],
  recommendations: [],
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_SCENES':
      return { ...state, scenes: action.payload };
    case 'SET_DEVICES':
      return { ...state, devices: action.payload };
    case 'SET_RECOMMENDATIONS':
      return { ...state, recommendations: action.payload };
    default:
      return state;
  }
};

const store = createStore(rootReducer);

export default store;