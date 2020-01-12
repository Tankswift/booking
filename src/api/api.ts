
import {request, requestJSON} from './request' 
import {Cookies} from '../type/index.d';
import qs from 'querystring';
import store from '../redux/store/Store'
import { Dispatch, AnyAction } from 'redux'
import * as actionTypes from '../redux/constants/actionTypes';
import { MtaH5 } from "../type/index.d"

let wx = require("weixin-js-sdk"); //引入微信jssdk文件
let dispatch: Dispatch<AnyAction> = store.dispatch

export async function getInfoByOpenId(openid: string) { // 根据openid获取个人信息
    return request({
        url: `/auth/getInfoByOpenId`,
        data: { openid }
    });
}
export async function islogin() { // 登录验证接口
    let url: string = window.location.search.replace('?', '')
    let urlObj: any = qs.parse(url)   // 获取url里面参数
    let userdata: any = store.getState().home.userdata // 获取redux里面登录态
    if (userdata.openid) { // 检验redux里面登录态
         
        return true
    } else if (Cookies.get('userdata')) { // 检验cookie里面登录态

        let data_str: string = Cookies.get('userdata') // 获取cookie里面用户数据
        let data: object = JSON.parse(data_str)
        // .................跳转项目首页
        dispatch( // 同步登陆态到redux
            {
                type: actionTypes.SAVE_USERDATA,
                data: {
                    ...data
                }
            }
        )

    } else { // 检验url是否存在openid
  
        if (urlObj.open_id && urlObj.open_id.length > 20) {

            return new Promise((resolve, reject) => {
                getInfoByOpenId(urlObj.open_id) // 通过openid去获取用户数据
                    .then(logins => {
                        if (logins && logins.code === 1) {
                            let data = logins.data
                            dispatch( // 同步用户数据到redux
                                {
                                    type: actionTypes.SAVE_USERDATA,
                                    data: {
                                        ...data
                                    }
                                }
                            )
                        }
                        delete urlObj.open_id
                        delete urlObj.union_id
                        let str = qs.stringify(urlObj)?'?' +qs.stringify(urlObj):''
                        window.location.href = window.location.origin + window.location.pathname + str 
                        resolve()
                    })
            })
        } else { // 跳转北京获取openid
            return new Promise((resolve, reject) => {
                    window.location.href = 'https://minsight.speiyou.com/i/usercenter/api/wxoauth?app_id=wx17745458a8a5358c&callback_url=' + window.location.href
            });
        }
    }
}
export async function wxconfig() { // 微信jssdk授权
    let url = store.getState().home.url ? store.getState().home.url : window.location.href
    return request(
        {
            url: `/auth/getSignature`,
            data: {
                url
            }
        }
    );
}
export async function configShare() { // 验证微信分享
    let res = await wxconfig()
    if (!res) return
    let url = window.location.origin + '/?ADTAG=pen'
    let url1 = window.location.origin + '/?ADTAG=penq'
    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: "wx810853a8355c083e", // 必填，公众号的唯一标识
        // appId: "wx59235dddb44934f3", // 必填，公众号的唯一标识
        timestamp: res.data.timestamp, // 必填，生成签名的时间戳
        nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
        signature: res.data.signature,// 必填，签名
        jsApiList: ['onMenuShareTimeline',
            'onMenuShareAppMessage',
            'previewImage',
            'hideAllNonBaseMenuItem',
            'showMenuItems',
            "startRecord",
            "stopRecord",
            "onVoiceRecordEnd",
            "playVoice",
            "stopVoice",
            "onVoicePlayEnd",
            "uploadVoice"
        ] // 必填，需要使用的JS接口列表
    });
    wx.ready(() => {

        wx.hideAllNonBaseMenuItem();
        wx.showMenuItems({
            menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline'] // 要显示的菜单项，所有menu项见附录3
        });
        wx.onMenuShareTimeline({
            title: '上海学而思高中预约试听', // 分享标题
            link: url1,// 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'http://xueersiimg.xrspy.com/booking_sys/logo/LOGO.jpg', // 分享图标
            success: function () {
                // 用户点击了分享后执行的回调函数
                MtaH5.clickShare('wechat_friend');
                
            }
        })
        wx.onMenuShareAppMessage({
            title: '上海学而思高中预约试听', // 分享标题
            desc: '上海学而思高中试听课正式上线，输入邀请码即可预约！', // 分享描述
            link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'http://xueersiimg.xrspy.com/booking_sys/logo/LOGO.jpg', // 分享图标
            success: function () {
                // 用户点击了分享后执行的回调函数
                MtaH5.clickShare('wechat_moments');
               
            }
        });
    });

}

export async function getPhoneCode(  phone:string ) { //  获取洞察手机验证码
    return request({
        url: `/index/getPhoneCode`,
        data: { phone }
    });
}
export async function bindInfo( code:string,phone:string ) { //  绑定洞察完善信息
    return request({
        url: `/index/phoneLogin`,
        data: {code ,phone}
    });
}
export async function indexIndex( ) { //  获取随机学员的获取红包数据
    return request({
        url: `/index/index`,
        data: { }
    });
}
export async function titleCashOutMoney( ) { //  答题后红包显示
    return request({
        url: `/index/titleCashOutMoney`,
        data: { }
    });
}
export async function completeUserInfo( name:string , grade :string , pUid:string) { //  完善用户信息
    return request({
        url: `/index/completeUserInfo`,
        data: { name ,  grade , pUid}
    });
}
export async function unfoldRedPack( type:"0"|"1" ) { //  拆我的红包操作 
    return request({
        url: `/index/unfoldRedPack`,
        data: { type }
    });
}
export async function giveCash( type:number ) { //  现金红包提现           
    console.log(type)
    return request({
        url: `/index/giveCash`,
        data: { type }
    });
}
export async function showPage( ) { //  抽奖结果页面展示           
    return request({
        url: `/index/showPage`,
        data: { }
    });
}
export async function getRedPack( ) { //  获取中奖纪录           
    return request({
        url: `/index/getRedPack`,
        data: { }
    });
}
export async function getClass(type:number,gradeName:string,subjectName:string,needInviteData:number,teacherName:string){   //获取所有信息（老师，课程，学科）
    return requestJSON({
        url:`/index/show`,
        data:{type,gradeName,subjectName,needInviteData,teacherName}
    });
}
export async function getIvite(courseId:number,codeName:string ){  //开始邀请
    return request({
        url:`/index/invite`,
        data:{courseId,codeName}
    })
}
export async function getMore(type:number,gradeName:string,subjectName1:string,teacherName:string,pageNum:number){//加载更多
    return requestJSON({
        url:`/index/showMore`,
        data:{type,gradeName,subjectName1,teacherName,pageNum}
    })
}












