import React, { Component } from 'react'
import "./index.styl";
import Time from "../../img/time.png"
import Location from "../../img/location.png"
import Audition from "../../img/Audition.png"
import Complete from "../../img/complete.png"
import { connect } from 'react-redux'
import subject from '../../config/Subject';
import * as Api from "../../api/api"
import gradeList from '../../config/Grade';
import { Toast,ListView } from 'antd-mobile';
import ReactPullLoad,{STATS} from 'react-pullload'
class SubContent extends Component {
    constructor(props){
        // console.log("1212",JSON.parse(window.localStorage.getItem("clickCourse")).courseId)
        super(props)
        this.state={     
        }
    }
    change=async (id)=>{
        // console.log(id,window.localStorage.getItem("codeName"))
        if(this.props.home.userdata.isEdit=="1"){
            if(window.localStorage.getItem("codeName")){
                let res=await Api.getIvite(id,window.localStorage.getItem("codeName"))
                if(res.code===1){
                    this.props.closeSuccess(true)
                }else if(res.code===56){
                    Toast.fail(res.msg, 2)
                }
            }else{
                this.props.closeCode(true)
                this.props.courseId(id)
            }
                 
        }
        else{
            this.props.closeCheck(true)
        }
    //     this.setState({
    //         alreadyNum:false
    //     })
    //     this.props.closeSuccess(true)
    }
    render() {
        const{courseList,alreadyId}=this.props
        return (
            <div>
                         {
                
                            courseList && courseList.map((item,index)=>
                            <div id="SubContent" key={item.id}>
                                <div className="title">
                                    {item.title}
                                </div>
                                <div className="des">
                                    {item.teacherName}
                                </div>
                                <div className="time">
                                    <img src={Time} alt="" className="time_left"/>
                                    <div className="time_right">上课时间：{item.time}</div>
                                </div>
                                <div className="place">
                                    <img src={Location} alt="" className="time_left"/>
                                    <div className="time_right">上课地点：{item.address}</div>
                                </div>
                                <div className="number_submit">
                                    <div className="number">
                                        <span className="number_left">剩余名额</span>
                                        <span className="number_right">{item.number}</span>
                                    </div>
                                    {
                                        item.number===0?<div className="button" style={{background:"linear-gradient(-77deg,rgba(216,216,216,1) 0%,rgba(206,206,206,1) 100%)"}}>
                                        <span>预约已满</span>
                                    </div>:(alreadyId.indexOf(item.id)===-1?<div className="button" onClick={this.change.bind(this,item.id)}>
                                        <span>预约试听</span>
                                        <img src={Audition} alt=""/>
                                    </div>:<div className="button" style={{background:"linear-gradient(-77deg,rgba(72,232,115,1) 0%,rgba(30,206,74,1) 100%)"}}>
                                    <span>已预约</span>
                                    <img src={Complete} alt=""/>
                                </div>
                                    )   
                        }
                    
                        
                    </div>
                </div>
                
                )
            }

           
            </div>      
        )
    }
}
const mapState = (state) => ({
    home: state.home
  });
  const mapDispatchToProps = (dispatch) => {
    return {
      
    }
  }
  export default connect(mapState, mapDispatchToProps)(SubContent);
