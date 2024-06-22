<template>
  <div style="margin:20px">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="代理ID" prop="username">
        <el-input
          v-model="queryParams.agentId"
          placeholder="请输入用户代理ID"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-tabs v-model="activeName" v-show="show">
      <template>
        <el-row :gutter="35" class="panel-group">
          <el-col :xs="12" :sm="12" :lg="7" class="card-panel-col">
            <div class="card-panel" >
              <div class="card-panel-icon-wrapper icon-people">
                <svg-icon icon-class="peoples" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  <span>用户总数</span>
                </div>
                <span class="card-panel-num">{{showData.totalMember}}</span>
              </div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="7" class="card-panel-col">
            <div class="card-panel" >
              <div class="card-panel-icon-wrapper icon-people">
                <svg-icon icon-class="user" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  <span>今日新增人数</span>
                </div>
                <span class="card-panel-num">{{showData.todayRegisterUser}}</span>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="35" class="panel-group">
          <el-col :xs="12" :sm="12" :lg="7" class="card-panel-col">
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
          </el-col>
        </el-row>
        <el-row :gutter="35" class="panel-group">
          <el-col :xs="12" :sm="12" :lg="7" class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper icon-shopping">
                <svg-icon icon-class="exit-fullscreen" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  本月充值
                </div>
                <div class="card-panel-text">
                  总充值: <span class="card-panel-num">{{showData.rechargeUsdt}}</span>
                </div>
                <div class="card-panel-text">
                  线上充值: <span class="card-panel-num">{{showData.onlineRechargeUsdt}}</span>
                </div>
                <div class="card-panel-text">
                  线下充值: <span class="card-panel-num">{{showData.offlineRechargeUsdt}}</span>
                </div>
                <div class="card-panel-text">
                  人工存入: <span class="card-panel-num">{{showData.manualRechargeUsdt}}</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="7" class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper icon-money">
                <svg-icon icon-class="fullscreen" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">本月提现</div>
                <div class="card-panel-text">
                  总提现: <span class="card-panel-num">{{showData.withdrawUsdt}}</span>
                </div>
                <div class="card-panel-text">
                  线上提现: <span class="card-panel-num">{{showData.onlineWithdrawUsdt}}</span>
                </div>
                <div class="card-panel-text">
                  线下提现: <span class="card-panel-num">{{showData.offlineWithdrawUsdt}}</span>
                </div>
                <div class="card-panel-text">
                  三方代付: <span class="card-panel-num">{{showData.passageWithdrawUsdt}}</span>
                </div>
                <div class="card-panel-text">
                  人工代付: <span class="card-panel-num">{{showData.manualWithdrawUsdt}}</span>
                </div>
              </div>
            </div>
          </el-col>
          </el-row>
        <el-row :gutter="35" class="panel-group">
          <el-col :xs="12" :sm="12" :lg="7" class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper icon-shopping">
                <svg-icon icon-class="exit-fullscreen" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">昨日充值数</div>
                <div class="card-panel-text">
                  总充值: <span class="card-panel-num">{{showData.yesterdayRechargeUsdt}}</span>
                </div>
                <div class="card-panel-text">
                  线上充值: <span class="card-panel-num">{{showData.yesterdayOnlineRechargeUsdt}}</span>
                </div>
                <div class="card-panel-text">
                  线下充值: <span class="card-panel-num">{{showData.yesterdayOfflineRechargeUsdt}}</span>
                </div>
                <div class="card-panel-text">
                  人工存入: <span class="card-panel-num">{{showData.yesterdayManualRechargeUsdt}}</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="7" class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper icon-money">
                <svg-icon icon-class="fullscreen" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">昨日提现数</div>
                <div class="card-panel-text">
                  总提现: <span class="card-panel-num">{{showData.yesterdayWithdrawUsdt}}</span>
                </div>
                <div class="card-panel-text">
                  线上提现: <span class="card-panel-num">{{showData.yesterdayOnlineWithdrawUsdt}}</span>
                </div>
                <div class="card-panel-text">
                  线下提现: <span class="card-panel-num">{{showData.yesterdayOfflineWithdrawUsdt}}</span>
                </div>
                <div class="card-panel-text">
                  三方代付: <span class="card-panel-num">{{showData.yesterdayPassageWithdrawUsdt}}</span>
                </div>
                <div class="card-panel-text">
                  人工代付: <span class="card-panel-num">{{showData.yesterdayManualWithdrawUsdt}}</span>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="35" class="panel-group">
          <el-col :xs="12" :sm="12" :lg="7" class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper icon-shopping">
                <svg-icon icon-class="exit-fullscreen" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">今日充值数</div>
                <div class="card-panel-text">
                  总充值: <span class="card-panel-num">{{showData.todayRechargeUsdt}}</span>
                </div>
                <div class="card-panel-text">
                  线上充值: <span class="card-panel-num">{{showData.todayOnlineRechargeUsdt}}</span>
                </div>
                <div class="card-panel-text">
                  线下充值: <span class="card-panel-num">{{showData.todayOfflineRechargeUsdt}}</span>
                </div>
                <div class="card-panel-text">
                  人工存入: <span class="card-panel-num">{{showData.todayManualRechargeUsdt}}</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xs="14" :sm="14" :lg="7" class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper icon-money">
                <svg-icon icon-class="fullscreen" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">今日提现数</div>
                <div class="card-panel-text">
                  总提现: <span class="card-panel-num">{{showData.todayWithdrawUsdt}}</span>
                </div>
                <div class="card-panel-text">
                  线上提现: <span class="card-panel-num">{{showData.todayOnlineWithdrawUsdt}}</span>
                </div>
                <div class="card-panel-text">
                  线下提现: <span class="card-panel-num">{{showData.todayOfflineWithdrawUsdt}}</span>
                </div>
                <div class="card-panel-text">
                  三方代付: <span class="card-panel-num">{{showData.todayPassageWithdrawUsdt}}</span>
                </div>
                <div class="card-panel-text">
                  人工代付: <span class="card-panel-num">{{showData.todayManualWithdrawUsdt}}</span>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="35" class="panel-group">
          <el-col :xs="12" :sm="12" :lg="7" class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper icon-shopping">
                <svg-icon icon-class="exit-fullscreen" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">盈亏对比</div>
                <div class="card-panel-text">
                  本月盈亏: <span class="card-panel-num">{{showData.profitLoss}}</span>
                </div>
                <div class="card-panel-text">
                  昨日盈亏: <span class="card-panel-num">{{showData.yesterdayProfitLoss}}</span>
                </div>
                <div class="card-panel-text">
                  今日盈亏: <span class="card-panel-num">{{showData.todayProfitLoss}}</span>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </template>
    </el-tabs>

  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import { totalStatistics } from "@/api/bigo/agent";
export default {
  name: 'Index',
  components: {
    CountTo
  },
  data() {
    return {
      activeName: 'today',
      show: true,
      // 查询参数
      queryParams: {
      },
      dateRange: [],
      showData: {
        totalMember: 0,  // 总会员人数
        todayRegisterUser: 0, // 今日充值会员人数

        rechargeUsdt: 0,
        onlineRechargeUsdt: 0,
        offlineRechargeUsdt: 0,
        manualRechargeUsdt: 0,

        withdrawUsdt: 0,
        onlineWithdrawUsdt: 0,
        offlineWithdrawUsdt: 0,
        manualWithdrawUsdt: 0,
        passageWithdrawUsdt:0,
        profitLoss: 0,

        todayRechargeUsdt: 0,
        todayOnlineRechargeUsdt: 0,
        todayOfflineRechargeUsdt: 0,
        todayManualRechargeUsdt: 0,

        todayWithdrawUsdt: 0,
        todayOnlineWithdrawUsdt: 0,
        todayOfflineWithdrawUsdt: 0,
        todayPassageWithdrawUsdt:0,
        todayManualWithdrawUsdt: 0,
        todayProfitLoss: 0,

        yesterdayRechargeUsdt: 0,
        yesterdayOnlineRechargeUsdt: 0,
        yesterdayOfflineRechargeUsdt: 0,
        yesterdayManualRechargeUsdt: 0,

        yesterdayWithdrawUsdt: 0,
        yesterdayOnlineWithdrawUsdt: 0,
        yesterdayOfflineWithdrawUsdt: 0,
        yesterdayPassageWithdrawUsdt: 0,
        yesterdayManualWithdrawUsdt: 0,
        yesterdayProfitLoss: 0,
      }
    }
  },
  created() {
    this.getInfo();
  },
  methods: {
    handleQuery() {
      this.getInfo();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    getInfo() {
      totalStatistics(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.showData = response.data;
      });
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

/*  .card-panel-col {
    margin-bottom: 32px;
  }*/

  .card-panel {
    height: 250px;
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
      font-size: 32px;
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

/*  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }*/
}
</style>
