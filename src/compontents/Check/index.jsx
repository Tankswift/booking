import React, { Component } from 'react'
import "./index.styl"
import Phone from "../../img/phone.png"
import Name from "../../img/name.png"
import Tri from "../../img/tri.png"
import { Toast, Picker } from 'antd-mobile'
import 'antd-mobile/lib/picker/style/css'
import Close from "../../img/close.png"
import * as homeActions from '../../redux/actions/home'
import * as Api from '../../api/api'
import { connect } from 'react-redux'
import Store from '../../redux/store/Store';
import * as actionTypes from '../../redux/constants/actionTypes'
class Check extends Component {
    constructor(props) {
        super(props)
        this.state = {
            gradeArr: [
                { "id": "1", "value": "-9", "label": "托班" },
                { "id": "2", "value": "-8", "label": "小班" },
                { "id": "3", "value": "-7", "label": "中班" },
                { "id": "4", "value": "-6", "label": "大班" },
                { "id": "5", "value": "1", "label": "一年级" },
                { "id": "6", "value": "2", "label": "二年级" },
                { "id": "7", "value": "3", "label": "三年级" },
                { "id": "8", "value": "4", "label": "四年级" },
                { "id": "9", "value": "5", "label": "五年级" },
                { "id": "10", "value": "6", "label": "六年级" },
                { "id": "11", "value": "7", "label": "七年级" },
                { "id": "12", "value": "8", "label": "八年级" },
                { "id": "13", "value": "9", "label": "九年级" },
                { "id": "14", "value": "10", "label": "高中一年级" },
                { "id": "15", "value": "11", "label": "高中二年级" },
                { "id": "16", "value": "12", "label": "高中三年级" },
            ],
            grade: "", //年级
            gradeChoose: "选择在读年级",
            gradeText: "选择在读年级",
            status: true,
            codeNum: 0,
            timer: null

        }
    }

    //关闭页面
    close = () => {
        this.props.closeCheck(this.state.close)
    }
    //手机验证码成功切换到姓名和年级页面
    change = () => {
        this.setState({
            status: false
        })
    }
    //提交
    submit = async () => {
        clearInterval(this.state.timer)
        console.log(this.state.phone, this.state.code)
        if (this.state.status) {
            if (!(/^1\d{10}$/.test(this.state.phone))) {
                Toast.fail("手机号不正确", 1.5)
                return false;
            }
            if (!(/^\d{6}$/.test(this.state.code))) {
                Toast.fail("验证码不正确", 1.5)
                return
            }
            let res = await Api.bindInfo(this.state.code, this.state.phone)
            if (res.code === 1) {
                if (res.data.is_edit == '0') { // 验证完善信息
                    clearInterval(this.state.timer)
                    this.setState({
                        pUid: res.data.pUid,
                        status: false
                    })
                } else {
                    Store.dispatch({
                        type: actionTypes.UPDATA_isEdit,
                         
                    })
            
                    this.close()
                }
            } else {
                Toast.fail(res.msg, 2);
            }
        }
        else {
            // console.log(this.state.name, this.state.grade, this.state.grade)
            if (this.state.name === '') {
                Toast.fail("姓名为空", 1.5)
                return false;
            }
            if (this.state.grade === '') {
                Toast.fail("年级为空", 1.5)
                return
            }
            let res = await Api.completeUserInfo(this.state.name, this.state.grade, this.state.pUid)
            if (res.code === 1) {
                Store.dispatch({
                    type: actionTypes.UPDATA_isEdit,
                     
                })

                this.close()

            } else {
                Toast.fail(res.msg, 2);
            }
        }
    }
    getCode = async () => {      // 获取验证码s
        let num = 60;
        if (this.codeNum > 0) {
            return;
        }
        if (!(/^1\d{10}$/.test(this.state.phone))) {
            Toast.fail("手机号不正确", 1.5);
            return false;
        }
        let res = await Api.getPhoneCode(this.state.phone)
        if (res.code === 1) {
            Toast.success("验证码已发送", 1.5)
            this.setState({
                codeNum: num
            })
            this.setState({
                timer: setInterval(() => {
                    num--
                    this.setState({
                        codeNum: num
                    })
                    if (num <= 0) {
                        clearInterval(this.state.timer)
                    }
                }, 1000)
            })
        } else {
            Toast.fail(res.msg, 2);
        }
    }
    getGradeTextByGradeId = (gradeList, gradeId) => {
        let data = gradeList.filter(item => item.value === gradeId)
        return data.length === 0 ? "在读年级" : data[0].label
    }
    scroll = () => {
        setTimeout(function () {
            var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
            window.scrollTo(0, Math.max(scrollHeight - 1, 0));
        }, 100);
    }

    render() {
        return (
            <div id="Check">
                <div className="Box">
                    <div className="title">{this.state.status ? "手机号快速登录" : "完善学员信息"}</div>
                    <div className={`border1 ${this.state.status ? "border2" : null}`}></div>
                    <div className="formBox">
                        {
                            this.state.status ?
                                <div className="item_top"><input type="text" placeholder="请输入手机号" maxLength="11" style={{ marginRight: "20.5vw" }} onChange={e => this.setState({ phone: e.target.value })} value={this.state.phone || ''} /><img src={Phone} alt="" style={{ width: "3.2vw", height: "4.9vw" }} /></div>
                                : <div className="item_top"><input type="text" placeholder="请输入学员姓名" style={{ marginRight: "20.5vw" }} onChange={e => this.setState({ name: e.target.value })} value={this.state.name || ''} /><img src={Name} alt="" style={{ width: "4vw", height: "4.7vw" }} /></div>
                        }
                        {
                            this.state.status ?
                                <div className="item_top" style={{ marginTop: "8.9vw", paddingBottom: "1.1vw" }}>
                                    <input type="text" placeholder="请输入验证码" maxLength="11" style={{ marginRight: "7vw" }} onChange={e => this.setState({ code: e.target.value })}
                                        onBlur={this.scroll} />
                                    <div className="getCode" onClick={this.getCode}>
                                        {this.state.codeNum === 0 ? "获取验证码" : `${this.state.codeNum}s`}
                                    </div>
                                </div> :
                                <Picker
                                    title="在读年级"
                                    cols={1}
                                    data={this.state.gradeArr}
                                    value={[this.state.grade]}
                                    onOk={v => {
                                        this.setState({
                                            grade: v[0],
                                            gradeText: this.getGradeTextByGradeId(this.state.gradeArr, v[0])

                                        })

                                    }
                                    }
                                >
                                    <div className="item_top" style={{ marginTop: "8.9vw", paddingBottom: "3.3vw" }}>
                                        <div className="choose">{this.state.gradeText}</div>
                                        <img src={Tri} alt="" style={{ width: "4vw", height: "3.2vw" }} />
                                    </div>
                                </Picker>
                        }
                    </div>
                    <div className="nextStep" onClick={this.submit}>
                        {this.state.status ? "下一步" : "登录"}
                    </div>
                    <div className="close" onClick={this.close}>
                        <img src={Close} alt="" />
                    </div>
                </div>
            </div>
        )
    }
}
 
export default  Check 
