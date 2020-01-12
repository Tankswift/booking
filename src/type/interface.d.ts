import React from 'react';
import { History, Location } from "history"
import { match } from "react-router-dom"
import {AnswerType} from './data'
export interface Props extends React.Props<any> {  // 参数类型审查
    match: match;
    history: History;
    Location: Location;
    home: any;
    homeActions: any
  }  
export interface HomeState{ // 首页State
    ruleOff:boolean         // 规则显示
    bindOff:boolean         // 绑定洞察
    isJoined:number        // 查看是否还有红包
    isHasGoods:number      // 是否有实物礼品
}
interface infoType{
  money:number;
  nickName:string
}
export interface AnswerState{    // 答题页面State
  itemIndex:"E"|"A"|"B"|"C"|"D"; // 选项状态
  questionIndex:number;          // 题目索引
  randomNum1:number;             // 随机趣味题
  randomNum2:number;             // 随机新诊题
  nowQuestion:AnswerType;        // 当前题目数据
  resultOff:boolean;             // 结果弹窗显示
  infoArr:infoType[];
  shareStatus:number;           // 分享红包状态 0 未拆 1 已拆 2 已提
  titleStatus:number;           // 答题红包状态 0 未拆 1 已拆 2 已提 
}
export interface LeftMoneyState{// 提现页面State
  leftMoney:number;             // 可提现金额
  nowType:number;               // 提现红包类型 0 答题红包 1 分享红包
  shareStatus:number;           // 分享红包状态 0 未拆 1 已拆 2 已提
  titleStatus:number;           // 答题红包状态 0 未拆 1 已拆 2 已提 
  totalMoney:number;            // 总获得金额
  timeArr:string[];             // 倒计时时间数组
  goodsName:string;             // 实物奖品名称
  imgUrl:string;                // 实物奖品图片
  getMoneyOff:boolean;          // 提现弹窗控件
  SubsribeOff:boolean;          // 关注弹窗控件
}
export interface ShareState{    // 分享页面State
  shareOff:boolean;

}