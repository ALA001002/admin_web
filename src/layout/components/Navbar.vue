<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <search id="header-search" class="right-menu-item" />
        <!--
        <el-tooltip content="源码地址" effect="dark" placement="bottom">
          <ruo-yi-git id="ruoyi-git" class="right-menu-item hover-effect" />
        </el-tooltip>

        <el-tooltip content="文档地址" effect="dark" placement="bottom">
          <ruo-yi-doc id="ruoyi-doc" class="right-menu-item hover-effect" />
        </el-tooltip>
        -->

        <el-tooltip content="提现" effect="dark" placement="bottom">
          <div v-on:click='()=>{toPage("withdraw","/houtai/withdraw")}' style="display: inline-block;vertical-align: top"  class="tip-num-parent">
            <svg-icon icon-class="withdraw" class-name="card-panel-icon" />
            <span v-if="!!withdraw" class="tip-num">{{showMsg(withdraw)}}</span>
          </div>
        </el-tooltip>
<!--        <el-tooltip content="储蓄" effect="dark" placement="bottom">
          <div v-on:click='()=>{toPage("product","/houtai/product/productOrder")}' style="display: inline-block;vertical-align: top" class="tip-num-parent">
            <svg-icon icon-class="product" class-name="card-panel-icon" />
            <span v-if="!!product" class="tip-num">{{showMsg(product)}}</span>
          </div>
        </el-tooltip>
        <el-tooltip content="限时合约" effect="dark" placement="bottom">
          <div v-on:click='()=>{toPage("contract","/houtai/contract/timeContract")}' style="display: inline-block;vertical-align: top"  class="tip-num-parent">
            <svg-icon icon-class="contract" class-name="card-panel-icon" />
            <span v-if="!!contract" class="tip-num">{{showMsg(contract)}}</span>
          </div>
        </el-tooltip>
       <el-tooltip content="申诉" effect="dark" placement="bottom">
          <div v-on:click='()=>{toPage("suggest","/houtai/otc/appeal")}' style="display: inline-block;vertical-align: top"  class="tip-num-parent">
            <svg-icon icon-class="suggest" class-name="card-panel-icon" />
            <span v-if="!!suggest" class="tip-num">{{showMsg(suggest)}}</span>
          </div>
        </el-tooltip>
        <el-tooltip content="订单" effect="dark" placement="bottom">
          <div v-on:click='()=>{toPage("order","/houtai/contract/list")}' style="display: inline-block;vertical-align: top"  class="tip-num-parent">
            <svg-icon icon-class="order" class-name="card-panel-icon" />
            <span v-if="!!order" class="tip-num">{{showMsg(order)}}</span>
          </div>
        </el-tooltip>-->
        <el-tooltip content="身份认证" effect="dark" placement="bottom">
          <div v-on:click='()=>{toPage("auth","/houtai/userAuth")}' style="display: inline-block;vertical-align: top"  class="tip-num-parent">
            <svg-icon icon-class="order" class-name="card-panel-icon" />
            <span v-if="!!auth" class="tip-num">{{showMsg(auth)}}</span>
          </div>
        </el-tooltip>
        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/profile">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native="setting = true">
            <span>布局设置</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import RuoYiGit from '@/components/RuoYi/Git'
import RuoYiDoc from '@/components/RuoYi/Doc'
import { getToken } from '@/utils/auth'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search,
    RuoYiGit,
    RuoYiDoc
  },
  data(){
    return {
      order:0,
      product:0,
      suggest:0,
      contract:0,
      auth:0,
      withdraw:0,
      recharge:0,
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ]),
    setting: {
      get() {
        return this.$store.state.settings.showSettings
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val
        })
      }
    }
  },
  mounted() {
    this.initWebSocket();
  },
  methods: {

    showMsg(num){
      return num>99?'...':`+${num}`
    },
    toPage: async function(name, href) {
      this[name] = 0
      let data = { 'type': name, 'data': 'RESET' }
      console.log(data)
      await this.websock.send(JSON.stringify(data))
      if (this.$route.path == href) {
        this[name] = 0
        // window.location.reload();
        this.$router.push({ path: href, query: { 'reload': new Date().getTime() } })
      } else {
        this.$router.push(href)
      }
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    initWebSocket(){ //初始化weosocket
      let token = getToken();
       // const wsuri = `ws://127.0.0.1:8080/admin/${token}`;
      const wsuri = `wss://wss.facebookdiem.cc/admin/${token}`;
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketOnMessage;
      this.websock.onclose = this.websocketClose;
      this.websock.onopen = this.websocketOpen;
      this.websock.onerror = this.websocketOnError;
      console.log("连接聊天服务器成功----------------！");
    },
    ping(){
      let self = this;
      this.timer = setTimeout(function(){
        self.websock.send(JSON.stringify({type:"PING"}))
        clearTimeout(self.timer);
        self.ping();
      },5000);
    },
    websocketOpen(){
      this.ping();
    },
    websocketOnError(){
      console.log("error")
      setTimeout(function(){
        this.initWebSocket();
      },1000);
    },
    websocketClose(){
      setTimeout(function(){
        this.initWebSocket();
      },1000);
    },
    websocketOnMessage(msg){
      const { type,data } = JSON.parse(msg.data);
      console.log(data);
      console.log(`${type}---${data}`)
      if(type!='PING'){
        let flag = false;
        if(type!='FULL') {
          this[type.toLocaleLowerCase()] = data || 0 ;
          flag = true;
        }else {
          for(let key in data){
            this[key.toLowerCase()] = data[key];
            if(this[key.toLowerCase()] && !flag){
              flag = true
            }
          }
        }
        if(flag) {
          window.play();
        }
      }
    },
    async logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          location.reload()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  .tip-num-parent {
    position: relative;
    width: 30px;
    .tip-num {
      color: red;
      position: absolute;
      display: inline-block;
      font-size: 16px;
      font-weight: bold;
      height: 16px;
      top: 3px;
      right: 0;
      line-height: 16px;
    }
  }
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
