<template>
  <div class="box">
    <div class="wechat">

      <div class="sidestrip">
        <div class="am-dropdown" data-am-dropdown>
          <!--头像插件-->
          <div class="own_head am-dropdown-toggle"></div>
        </div>
        <!--三图标-->
          <div class="sidestrip_icon">
            <a id="si_1" style="background: url(images/icon/head_2_1.png) no-repeat;"></a>
          </div>

      </div>
      <!--聊天列表-->
      <div class="middle on" >
        <div class="wx_search">
          <p> &nbsp; </p>
        </div>
        <div class="office_text">
          <ul class="user_list">
            <li v-for="item of userList" :key="item.uid" :id="item.uid" @click= "changeUser(item)">
              <el-badge :hidden="item.unreadNum == 0" :value="item.unreadNum" class="item">
                <div class="user_head"><img :src="item.avatar"/></div>
                <div class="user_text">
                  <p class="user_name">{{item.username}}</p>
                  <p class="user_message">ID:{{item.uid}}</p>
                </div>
                <div class="user_time">{{formatMsgTime(item.timestamp, false)}}</div>
              </el-badge>
              <!--<div class="user_time">${data[i].user_time}</div>-->
            </li>
          </ul>
        </div>
      </div>
      <!--聊天窗口-->
      <div class="talk_window" v-if="selectUser.uid != null">
        <div class="windows_top">
          <div class="windows_top_box">
            <span>{{selectUser.username}}</span>
            <ul class="window_icon">
              <li>
                <!--<a href=""><img src="../../../assets/images/icon/icon10.png"/></a>-->
              </li>
            </ul>
          </div>
        </div>

        <!--聊天内容-->
        <div class="windows_body">
          <div class="office_text" id="chatWindow" style="height: 100%; overflow:auto">
            <ul class="content" id="chatbox">
              <li v-for="item of historyList" :key="item.id" :class="[item.sender== selectUser.uid?'other':'me']">
                <div v-if="item.sender == selectUser.uid" class="user_time" style="float:left">{{formatMsgTime(item.timestamp, true)}}</div>
                <div v-else class="user_time" style="text-align:center">{{formatMsgTime(item.timestamp, true)}}</div>
                <br/>
                <img v-if="item.sender == selectUser.uid" :src="selectUser.avatar" class="avater"/>
                <img v-else src="../../../assets/logo/logo.png" class="avater"/>
                <span v-if="item.type == 0">{{item.content}}</span>
                <span v-else-if="item.type == 1"><img :src="item.content" class="chatImg"/> </span>
              </li>
            </ul>
          </div>
        </div>

        <div class="windows_input" id="talkbox">
          <div class="input_icon" >
            <!--<a href="" @click.prevent="sendImg"></a>
            <input style="display:none" type="file" accept="image/*" ref="choosePhoto" id="file">-->
            <el-upload
              action="#"
              :multiple = "false"
              :show-file-list="false"
              :before-upload="sendImg"
              >
              <a href="javascript:;"></a>
            </el-upload>
          </div>
          <div class="input_box">
            <!-- <textarea name="" rows="" cols="" id="input_box"></textarea> -->
            <div name="" rows="" cols="" id="input_box" @input="changeInput($event)" contenteditable="true" ref="input_box">
            </div>
            <button id="send" @click="sendChatMsg">发送</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/styles/main.css'
import { getToken } from '@/utils/auth'
export default {
   data() {
    return {
      chatMap: new Map(),
      selectUser:{},
      websock: null,
      csId: null,
      otherImg: null,
      meImg: null,
      userList:[],
      historyList:[],
      inputText:null,
    };
  },
  created() {
    this.initWebSocket();
  },
  destroyed() {
    this.websock.close() //离开路由之后断开websocket连接
  },
  methods: {
    initWebSocket(){ //初始化weosocket
      const wsuri = `ws://127.0.0.1:8081/ws`;
      // const wsuri = "wss://wss.facebookdiem.cc/ws";
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
      console.log("连接聊天服务器成功！");
    },
    websocketonopen(){
      //连接建立之后登录
      this.websocketsend(JSON.stringify(this.formatMsg("LOGIN",getToken())));
    },
    websocketonerror(){//连接建立失败重连
      this.initWebSocket();
    },
    websocketonmessage(e){ //数据接收
      const wsData = JSON.parse(e.data);
      if(wsData.code != 200){
        alert("消息错误：" + JSON.stringify(e));
      }
      if(wsData.type == "CONTRACT_LIST"){
        this.userList = wsData.data;
        this.sortBykey(this.userList,'unreadNum');
      }else if(wsData.type == "HISTORY"){
        this.historyList = wsData.data;
      }else if(wsData.type == "MESSAGE"){
        let message = wsData.data;
        if(message.sender == this.selectUser.uid || message.receiver == this.selectUser.uid){
          this.historyList.push(message);
          for(var i = 0;i<this.userList.length;i++){
            if(this.userList[i].uid == message.sender){
              this.userList[i].timestamp = message.timestamp;
            }
          }
        }else{
          let history = null;
          let index = null;
          for(var i = 0;i<this.userList.length;i++){
            if(this.userList[i].uid == message.sender){
              this.userList[i].unreadNum++;
              this.userList[i].timestamp = message.timestamp;
              history = this.userList[i];
              index = i;
              break;
            }
          }
          if(history != null && index != null){
            this.userList.splice(index,1);
            this.userList.unshift(history);
          }else{
            this.websocketsend(JSON.stringify(this.formatMsg("CONTRACT_LIST")));
          }
        }
      }else if(wsData.type == "LOGIN"){
        //登录成功后请求负责用户列表
        this.websocketsend(JSON.stringify(this.formatMsg("CONTRACT_LIST")));
      }
    },
    websocketsend(data){//数据发送
      this.websock.send(data);
    },
    websocketclose(e){  //关闭
      console.log('断开连接',e);
      this.initWebSocket();
    },
    /** 格式化消息 */
    formatMsg(type,msg){
      let data = {
        "type": type,
        "data": msg
      }
      return data;
    },
    /** 选择聊天列表的用户 */
    changeUser(user){
      user.unreadNum = 0;
      this.selectUser = user;
      this.getChatHistory(user.uid);
    },
    /** 获取聊天历史 */
    getChatHistory(uid){
      this.websocketsend(JSON.stringify(this.formatMsg("HISTORY",uid)));
    },
    changeInput(e) {
      this.inputText = e.target.innerText;
    },
    /** 发送消息 */
    sendChatMsg(){
      if(this.inputText == null || this.inputText=='') return;

      let receiver = this.selectUser.uid;
      let message = {
        "type": 0,
        "content": this.inputText,
        "receiver": receiver
      };
      this.websocketsend(JSON.stringify(this.formatMsg("MESSAGE",message)));
      this.inputText = null;
      this.$refs.input_box.innerHTML = ''
    },
    sendImg: function(file) {
      if (!/image\/\w+/.test(file.type)) {
        alert("请选择图片");
        return false;
      }
      let receiver = this.selectUser.uid;
      let reader = new FileReader()
      reader.readAsDataURL(file)
      let self = this
      reader.onload = function(e) {
          let base64Str = e.target.result
          console.log("base64:"+base64Str);
          let message = {
            "type": 1,
            "content": base64Str,
            "receiver": receiver
          };
          self.websocketsend(JSON.stringify(self.formatMsg("MESSAGE",message)));
      }
      return false;
    },
    sortBykey:function(ary, key) {
      return ary.sort(function (a, b) {
        let x = a[key]
        let y = b[key]
        return ((x < y) ? 1 : (x > y) ? -1 : 0)
      })
    },
    formatDate: function(date, fmt) {
      var o = {
                "M+": date.getMonth() + 1, //月份
                "d+": date.getDate(), //日
                "h+": date.getHours(), //小时
                "m+": date.getMinutes(), //分
                "s+": date.getSeconds(), //秒
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                "S": date.getMilliseconds() //毫秒
        };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
              if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                      return fmt;
    },
    formatMsgTime: function(timestamp, mustIncludeTime){
      // 当前时间
        var currentDate = new Date();
        // 目标判断时间
        var srcDate = new Date(parseInt(timestamp));

        var currentYear = currentDate.getFullYear();
        var currentMonth = (currentDate.getMonth()+1);
        var currentDateD = currentDate.getDate();

        var srcYear = srcDate.getFullYear();
        var srcMonth = (srcDate.getMonth()+1);
        var srcDateD = srcDate.getDate();

        var ret = "";

        // 要额外显示的时间分钟
        var timeExtraStr = (mustIncludeTime?" "+this.formatDate(srcDate, "hh:mm"):"");

        // 当年
        if(currentYear == srcYear) {
                var currentTimestamp = currentDate.getTime();
                var srcTimestamp = timestamp;
                // 相差时间（单位：毫秒）
                var deltaTime = (currentTimestamp-srcTimestamp);

                // 当天（月份和日期一致才是）
                if(currentMonth == srcMonth && currentDateD == srcDateD) {
                // 时间相差60秒以内
                if(deltaTime < 60 * 1000)
                        ret = "刚刚";
                // 否则当天其它时间段的，直接显示“时:分”的形式
                else
                        ret = this.formatDate(srcDate, "hh:mm");
                }
                // 当年 && 当天之外的时间（即昨天及以前的时间）
                else {
                        // 昨天（以“现在”的时候为基准-1天）
                        var yesterdayDate = new Date();
                        yesterdayDate.setDate(yesterdayDate.getDate()-1);

                        // 前天（以“现在”的时候为基准-2天）
                        var beforeYesterdayDate = new Date();
                        beforeYesterdayDate.setDate(beforeYesterdayDate.getDate()-2);

                        // 用目标日期的“月”和“天”跟上方计算出来的“昨天”进行比较，是最为准确的（如果用时间戳差值
                        // 的形式，是不准确的，比如：现在时刻是2019年02月22日1:00、而srcDate是2019年02月21日23:00，
                        // 这两者间只相差2小时，直接用“deltaTime/(3600 * 1000)” > 24小时来判断是否昨天，就完全是扯蛋的逻辑了）
                        if(srcMonth == (yesterdayDate.getMonth()+1) && srcDateD == yesterdayDate.getDate())
                                ret = "昨天"+timeExtraStr;// -1d
                        // “前天”判断逻辑同上
                        else if(srcMonth == (beforeYesterdayDate.getMonth()+1) && srcDateD == beforeYesterdayDate.getDate())
                                ret = "前天"+timeExtraStr;// -2d
                        else{
                                // 跟当前时间相差的小时数
                                var deltaHour = (deltaTime/(3600 * 1000));

                                // 如果小于或等 7*24小时就显示星期几
                                if (deltaHour <= 7*24){
                                var weekday=new Array(7);
                                weekday[0]="星期日";
                                weekday[1]="星期一";
                                weekday[2]="星期二";
                                weekday[3]="星期三";
                                weekday[4]="星期四";
                                weekday[5]="星期五";
                                weekday[6]="星期六";

                                // 取出当前是星期几
                                var weedayDesc = weekday[srcDate.getDay()];
                                ret = weedayDesc+timeExtraStr;
                                }
                                // 否则直接显示完整日期时间
                                else
                                ret = this.formatDate(srcDate, "yyyy/M/d")+timeExtraStr;
                        }
                }
        }
        // 往年
        else{
          ret = this.formatDate(srcDate, "yyyy/M/d")+timeExtraStr;
        }
        return ret;
    }

  },
  /** 聊天定位到底部*/
  mounted(){
    let ele = document.getElementById('chatWindow');
    if(ele != null){
      ele.scrollTop = ele.scrollHeight;
    }
  },
  updated(){
    let ele = document.getElementById('chatWindow');
    if(ele != null){
      ele.scrollTop = ele.scrollHeight;
    }

  },

}
</script>
