import React, { Component } from 'react'
import "./index.styl"
import Close from "../../img/close.png"
import * as Api from '../../api/api'
import { Toast} from 'antd-mobile'
export default class Code extends Component {
    constructor(props){
        super(props)
        this.state={
            isErr:false,
        }
    }
    submit=async ()=>{
        let courseld=this.props.courseId
        let codeName=this.state.Code
        // console.log(courseld,codeName)
        let res=await Api.getIvite(courseld,codeName)
        if(res.code===1){
            this.props.closeCode(false,courseld)
            this.props.closeSuccess(true)
            window.localStorage.setItem("codeName",codeName)
        }
        else if(res.code===56){
            Toast.fail(res.msg, 2)
            this.props.closeCode(false)
        }else{
            this.setState({
                isErr:true
            })
        } 
    }
    //输入框聚焦，错误提醒消失
    err=()=>{
        this.setState({
            isErr:false
        })
    }
    render() {
        return (
            <div id="Code">
                <div className="Box">
                    <div className="title">填写邀请码</div>
                    <div className="border"></div>
                    <div className="formBox">
                        <input type="text" placeholder="请填写7位邀请码" maxLength="7" onChange={e=>this.setState({Code:e.target.value})} value={this.state.Code || ''} onFocus={this.err}/>
                    </div>
                    {
                        this.state.isErr&&<div className="errMessage">邀请码不正确，请重新填写</div>
                    }
                    <div className="submit" onClick={this.submit}>
                        提交预约
                    </div>
                    <div className="close" onClick={()=>this.props.closeCode(false)}>
                        <img src={Close} alt=""/>
                    </div>
                    
                </div>
            </div>
        )
    }
}
