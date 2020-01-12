import { combineReducers  } from 'redux';

import { home } from './home.d'; // 其余页面逻辑
 
export const appReducer = combineReducers({
    home,
})