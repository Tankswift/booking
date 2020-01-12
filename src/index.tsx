import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux'
import store from './redux/store/Store'
import AppRouter from './router/';
import {MtaH5} from "./type/index.d"
MtaH5.init({
    "sid":'500703076', //必填，统计用的appid
    "cid":'500703077', //如果开启自定义事件，此项目为必填，否则不填
    "autoReport":0,//是否开启自动上报(1:init完成则上报一次,0:使用pgv方法才上报)
    "senseHash":0, //hash锚点是否进入url统计
    "senseQuery":0, //url参数是否进入url统计
    "performanceMonitor":1,//是否开启性能监控
    "ignoreParams":[] //开启url参数上报时，可忽略部分参数拼接上报
  });
ReactDOM.render(
    <Provider store={store}>
        <AppRouter />
    </Provider>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
 
