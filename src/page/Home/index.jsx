
import React from 'react';
import { connect } from 'react-redux'
import * as homeActions from '../../redux/actions/home'
import SubContent from "../../compontents/SubContent/index";
import { bindActionCreators } from 'redux';
import Check from "../../compontents/Check/index";
import Code from "../../compontents/Code/index";
import Success from "../../compontents/Sucess/index";
import Mybooking from "../../compontents/Mybooking/index"
import * as Api from '../../api/api';
import { Toast } from 'antd-mobile';
import 'antd-mobile/lib/toast/style/css';
import './index.styl';
import {MtaH5} from '../../type/index.d'
import GradeList from "../../config/Grade";
import Subject from "../../config/Subject";
import Teacher from "../../config/Teacher";
class Home extends React.Component {
  constructor(props){
    super(props)
    this.state={
      SubjextNum:0,
      TeacherNum:-1,
      GradeNum:0,
      checkTemp:false,
      codeTemp:false,
      successTemp:false,
      bookingTemp:false,
      subject:"",
      alreadyCourse:[],
      page:1,
      moreOff:true,
      scrollOff:true,
      teacherName:'',
      allSubject:[]
    }
  }
  SubjectActive(index){
    this.setState({
      SubjextNum:index,
      TeacherNum:-1,
      teacherName:""
    },()=>{
        this.request()
    }
    ) 
  }
  TeacherActive(index){
    if(this.state.TeacherNum===index){
      this.setState({
        TeacherNum:-1,
        teacherName:""
      },()=>{
        this.request()
      })
    }else{
      this.setState({
        TeacherNum:index
      },()=>{
        this.request(this.state.teacherList[this.state.TeacherNum].name)
      })
    }
    
  }
   GradeActive= (index)=>{
    this.setState({
      GradeNum:index,
      TeacherNum:-1,
      teacherName:"",
      subject:"",
      SubjextNum:0
    },
      ()=>{
        this.request()

      }
    )
    // console.log(this.state)
    
  }
  //关闭check
  closeCheck(val){
    this.setState({
      checkTemp:val
    })
  }
  //关闭code
  closeCode(val,courseld){
    this.setState({
      codeTemp:val
    })
    let arr = this.state.alreadyCourse
    arr.push(courseld)
    this.setState({
      alreadyCourse:arr
    })
  }
  //关闭success
  closeSuccess(val){
    this.setState({
      successTemp:val
    })
  }
  //关闭预约列表
  closeBooking(val){
    this.setState({
      bookingTemp:val
    })
  }
  //判断是否登录显示预约内容
  isLogin=()=>{
    if(this.props.home.userdata.isEdit=="1"){
      this.request()
      this.setState({bookingTemp:true})
    }
    else{
      this.setState({checkTemp:true})
    }
  }
  // 点击预约获取当前点击的课程id
  getId(id){
    this.setState({
      courseId:id
    })
  }
  //点击预约切换按钮
  getcouseId(id){
    console.log(id)
    this.setState({
      sendId:id
    })
  }
  //数据请求
  request = async (teacherName)=>{
    this.setState({
      page:1,
      teacherName
    })
    let subjectName=""
      if(this.state.allSubject.length>0&&this.state.allSubject[this.state.SubjextNum].id!=0){
        subjectName=this.state.allSubject[this.state.SubjextNum].name
      }
    let type=1
    let needInviteData=1
    let res=await Api.getClass(type,GradeList[this.state.GradeNum],subjectName,needInviteData,teacherName)
    // console.log(res)
    if(res.code===1){
      if(teacherName){
        this.setState({
          courseList:res.data.courseList,
          inviteList:res.data.inviteList,
          subjectList:this.state.SubjextNum===0?res.data.subjects:this.state.subjectList,
          moreOff:res.data.courseList.length>=3
        })
      }
      else{
        
        this.setState({
          courseList:res.data.courseList,
          subjectList:this.state.SubjextNum===0?res.data.subjects:this.state.subjectList,
          teacherList:res.data.teachers,
          inviteList:res.data.inviteList,
          moreOff:res.data.courseList.length>=3
        })

      }
      let listId=[]
      this.state.inviteList&&this.state.inviteList.map(item=>{
        listId.push(item.course.id)
      })
      this.setState({
        alreadyCourse:listId
      })
      let subList=[{id:0,name:"全部"}]
      this.state.subjectList&&this.state.subjectList.map(item=>{
        subList.push(item)
      })
      this.setState({
        allSubject:subList
      })
    }
  }
  
  async componentWillMount() {
    await Api.islogin()
    await Api.configShare()
    // console.log(this.state.grade,this.state.subject)
    this.request();
    // 滚动加载逻辑
  window.onscroll= async ()=>{ // 监听页面滚动
    //文档内容实际高度（包括超出视窗的溢出部分）
        var scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
        //滚动条滚动距离
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        //窗口可视范围高度
        var clientHeight = window.innerHeight || Math.min(document.documentElement.clientHeight,document.body.clientHeight);
        if(clientHeight + scrollTop >= scrollHeight&&this.state.moreOff){
          if(!this.state.scrollOff)return
          this.setState({
            scrollOff:false
          })
          let page = this.state.page + 1 
          let subjectName=this.state.subject
          let res = await Api.getMore(1,GradeList[this.state.GradeNum],subjectName,this.state.teacherName,page )
          this.setState({
            scrollOff:true
          })
          if(!res)return
          if(res.code===1){

            let moreOff= res.data.length>=20
            let itemArr = this.state.courseList
            if(res.data.length!==0){
              res.data.map((item)=>itemArr.push(item))
            }
            this.setState({
              courseList:itemArr,
              moreOff,
              page
            })

          }
        }
 }
   
    
  }
  componentWillReceiveProps(){  
    // console.log(this.state.grade,this.state.subject)
  }
  componentDidMount() {
    
  }
  componentDidUpdate(){
    
  }
  componentWillUnmount() {

  }
  render() {
    const {teacherList,courseList,subjectList,inviteList,allSubject}=this.state
    return (
      <div id="Home">
          <div className="Grade">
            {
              GradeList.map((item,index)=>
                <div className="GradeItem" key={item} onClick={()=>this.GradeActive(index)  }>
                  <div className={`txt ${index===this.state.GradeNum?"txtActive":null}`}>{item}</div>
                  <div className={`border ${index===this.state.GradeNum?"borderActive":null}`}></div>
                </div>
              )
            }
          </div>
          <div style={{marginTop:"10.5vw",marginBottom:"14vw"}}>
              <div className="Subject">
                  {
                    allSubject&&allSubject.map((item,index)=>
                      <div className={`SubjectItem ${index===this.state.SubjextNum?"SubjectActive":null}`} onClick={this.SubjectActive.bind(this,index)} key={item.id}>{item.name}</div>
                    )
                  }
              </div>
              <div className="Teacher">
                  {
                    teacherList&&teacherList.map((item,index)=>
                      <div className={`item-teacher ${index===this.state.TeacherNum?"TeacherActive":null}`} onClick={this.TeacherActive.bind(this,index)} key={index}>
                        <div className="item-icon" style={{backgroundImage:`url(${item.imgUrl})`}}>
                        </div>
                        <div className="item-name">{item.name}</div>
                      </div>
                    )
                    
                  }
              </div>
              <SubContent closeSuccess={this.closeSuccess.bind(this)} isEdit={this.props.home.userdata.isEdit} closeCheck={this.closeCheck.bind(this)} closeCode={this.closeCode.bind(this)} courseList={courseList} courseId={this.getId.bind(this)} alreadyId={this.state.alreadyCourse}/>
          </div>
        <div className="Footer" onClick={this.isLogin}>
            查看我的预约
        </div>
        {
          this.state.checkTemp?<Check closeCheck={this.closeCheck.bind(this)}/>:<div></div>
        }
        {
          this.state.codeTemp?<Code closeCode={this.closeCode.bind(this)} closeSuccess={this.closeSuccess.bind(this)} courseId={this.state.courseId}/>:<div></div>
        }
        {
          this.state.successTemp?<Success closeSuccess={this.closeSuccess.bind(this)} />:<div></div>
        }
        {
          this.state.bookingTemp?<Mybooking closeMybooking={this.closeBooking.bind(this)}/>:<div></div>
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
    homeActions: bindActionCreators(homeActions, dispatch)
  }
}
export default connect(mapState, mapDispatchToProps)(Home);
