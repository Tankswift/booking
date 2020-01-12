import React, { Component } from 'react'
import "./index.styl"
import Time from "../../img/time.png"
import Location from "../../img/location.png"
import None from "../../img/none.png"
import Close from "../../img/close.png"
import * as Api from '../../api/api';
export default class Mybooking extends Component {
    constructor(props){
        super(props)
        this.state={
            isBooking:true
        }
    
    }
    componentWillMount(){
        this.requset()
    }
    requset=async ()=>{
        let type=1
        let needInviteData=1
        let res=await Api.getClass(type,"高一","语文",needInviteData)
        if(res.code===1){
            this.setState({
                inviteList:res.data.inviteList,
              })
        }
        
    }
    check=()=>{
        if(this.props.inviteList.length===0){
            this.setState({
                isBooking:false
            })
        }
    }
    render() {
        const {inviteList}=this.state
        return (
            <div id="Mybooking" onClick={()=>this.props.closeMybooking(false)}>
                <div className="Box">
                    <div className="title">
                        我的预约
                    </div>
                    <div className="border"></div>
                    <div className="remind">
                        预约成功参加免费试听，相同学科只能预约一次
                    </div>
                    {
                        this.state.isBooking? <div className="bookingContent">
                            {
                                inviteList&&inviteList.map((item,index)=>
                                <div className="bookingContentItem" key={item.id}>
                                    <div className="head">
                                        {item.course.title}
                                    </div>
                                    <div className="time">
                                        <img src={Time} alt=""/>
                                        <span>上课时间：{item.course.time}</span>
                                    </div>
                                    <div className="place">
                                        <img src={Location} alt=""/>
                                        <span>上课地点：{item.course.address}</span>
                                    </div>
                                </div>
                                )
                            }
                        
                    </div> :<div className="empty">
                        <img src={None} alt=""/>
                        <div className="emptyTxt">暂无预约课程</div>
                    </div>
                    }
                   
                    <div className="close" onClick={()=>this.props.closeMybooking(false)}>
                        <img src={Close} alt=""/>
                    </div>

                    
                </div>
            </div>
        )
    }
}
