<template>
  <div style="margin:20px">
    <el-row :gutter="10" class="mb8" >
      <el-col :span="1.5">
        <el-button v-if="show" type="primary" icon="el-icon-minus" size="mini" @click="handleShow" v-hasPermi="['bigo:index:info']">
          <span>隐藏统计数据</span>
        </el-button>
        <el-button v-else type="primary" icon="el-icon-plus" size="mini" @click="handleShow" v-hasPermi="['bigo:index:info']">
          <span >显示统计数据</span>
        </el-button>
      </el-col>
    </el-row>
    <el-tabs v-model="activeName" @tab-click="handleClick" v-show="show">
      <el-tab-pane label="今日概览" name="today"></el-tab-pane>
      <el-tab-pane label="昨日概览" name="yesterday"></el-tab-pane>
      <el-tab-pane label="总览" name="total"></el-tab-pane>
      <template>
        <el-row :gutter="35" class="panel-group">
          <el-col :xs="12" :sm="12" :lg="7" class="card-panel-col">
            <div class="card-panel" >
              <div class="card-panel-icon-wrapper icon-people">
                <svg-icon icon-class="peoples" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  <span v-if="activeName == 'total'">用户总数</span>
                  <span v-else>新增用户</span>
                </div>
                <span class="card-panel-num">{{showData.userNum}}</span>
              </div>
            </div>
          </el-col>
<!--          <el-col :xs="12" :sm="12" :lg="7" class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper icon-message">
                <svg-icon icon-class="shopping" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  合约订单: <span class="card-panel-num">{{showData.orderNum}}</span>
                </div>
                <div class="card-panel-text">
                  合约交易额: <span class="card-panel-num">{{showData.orderMoney}}</span>
                </div>
                <div class="card-panel-text">
                  合约手续费: <span class="card-panel-num">{{showData.orderFee}}</span>
                </div>
              </div>
            </div>
          </el-col>-->
<!--          <el-col :xs="12" :sm="12" :lg="7" class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper icon-money">
                <svg-icon icon-class="druid" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  合约平台盈: <span class="card-panel-num">{{showData.loss}}</span>
                </div>
                <div class="card-panel-text">
                  合约平台亏: <span class="card-panel-num">{{showData.profit}}</span>
                </div>
              </div>
            </div>
          </el-col>-->
<!--          <el-col :xs="12" :sm="12" :lg="7" class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper icon-money">
                <svg-icon icon-class="education" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  充币: <span class="card-panel-num">{{showData.recharge}}</span>
                </div>
                <div class="card-panel-text">
                  提币: <span class="card-panel-num">{{showData.withdraw}}</span>
                </div>
                <div class="card-panel-text">
                  提币手续费: <span class="card-panel-num">{{showData.withdrawFee}}</span>
                </div>
              </div>
            </div>
          </el-col>-->
<!--          <el-col :xs="12" :sm="12" :lg="7" class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper icon-message">
                <svg-icon icon-class="shopping" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  期权订单: <span class="card-panel-num">{{showData.timeOrderNum}}</span>
                </div>
                <div class="card-panel-text">
                  期权交易额: <span class="card-panel-num">{{showData.timeOrderMoney}}</span>
                </div>
                <div class="card-panel-text">
                  期权手续费: <span class="card-panel-num">{{showData.timeOrderFee}}</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="7" class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper icon-money">
                <svg-icon icon-class="druid" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  期权平台盈: <span class="card-panel-num">{{showData.timeLoss}}</span>
                </div>
                <div class="card-panel-text">
                  期权平台亏: <span class="card-panel-num">{{showData.timeProfit}}</span>
                </div>
              </div>
            </div>
          </el-col>-->
        </el-row>
      </template>
    </el-tabs>

  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import { getIndexInfo } from "@/api/system/index";
export default {
  name: 'Index',
  components: {
    CountTo
  },
  data() {
    return {
      activeName: 'today',
      show: false,
      showData: {
        userNum: 0,
        orderNum: 0,
        orderMoney: 0,
        profit: 0,
        loss: 0,
        recharge: 0,
        orderFee: 0,
        withdraw: 0,
        withdrawFee: 0,
        timeOrderNum: 0,
        timeOrderMoney: 0,
        timeOrderFee: 0,
        timeProfit: 0,
        timeLoss: 0
      }
    }
  },
  methods: {
    getInfo(date) {
      getIndexInfo(date).then(response => {
        this.showData = response.data;
      });
    },
    handleClick(tab, event) {
      this.getInfo(this.activeName);
    },
    handleShow(){
      if(this.show){
        this.show = false;
      }else{
        this.getInfo(this.activeName);
        this.show = true;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
}
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: left;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:600px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
