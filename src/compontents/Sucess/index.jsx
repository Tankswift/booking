import React, { Component } from 'react'
import "./index.styl"
import Succes from "../../img/success.png"
import Close from "../../img/close.png"
export default class Success extends Component {
    render() {
        return (
            <div id="Success">
                <div className="Box">
                    <div className="title">
                        恭喜您
                        预约成功
                    </div>
                    <div className="successImg">
                        <img src={Succes} alt=""/>
                    </div>
                    <div className="remind">
                        记得准时参加参加试听课程哦~
                    </div>
                    <div className="button" onClick={()=>{this.props.closeSuccess(false)}}>
                        知道了
                    </div>
                    <div className="close" onClick={()=>this.props.closeSuccess(false)}>
                        <img src={Close} alt=""/>
                    </div>
                </div>
            </div>
        )
    }
}
