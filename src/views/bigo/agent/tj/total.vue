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
          <el-col :xs="12" :sm="12" :lg="7" class="card-panel-col">
            <div class="card-panel" >
              <div class="card-panel-icon-wrapper icon-people">
                <svg-icon icon-class="user" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  <span>今日首充人数</span>
                </div>
                <span class="card-panel-num">{{showData.firstDepositNum}}</span>
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
                <span>用户总资产</span>
                <div class="card-panel-text">
                  USDT: <span class="card-panel-num">{{showData.sumBalanceUSDT}}</span>
                </div>
                <div class="card-panel-text">
                  ETH: <span class="card-panel-num">{{showData.rechargeETH}}</span>
                </div>
                <div class="card-panel-text">
                  BTC: <span class="card-panel-num">{{showData.rechargeBTC}}</span>
                </div>
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
                  <span>今日交易人数</span>
                </div>
                <span class="card-panel-num">{{showData.todayTradeUserNum}}</span>
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
                  <span>总充值人数</span>
                </div>
                <span class="card-panel-num">{{showData.rechargeNum}}</span>
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
                <span>总充值数</span>
                <div class="card-panel-text">
                  USDT: <span class="card-panel-num">{{showData.rechargeUsdt}}</span>
                </div>
                <div class="card-panel-text">
                  ETH: <span class="card-panel-num">{{showData.rechargeEth}}</span>
                </div>
                <div class="card-panel-text">
                  BTC: <span class="card-panel-num">{{showData.rechargeBtc}}</span>
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
                <span>总提现数</span>
                <div class="card-panel-text">
                  USDT: <span class="card-panel-num">{{showData.withdrawUsdt}}</span>
                </div>
                <div class="card-panel-text">
                  ETH: <span class="card-panel-num">{{showData.withdrawEth}}</span>
                </div>
                <div class="card-panel-text">
                  BTC: <span class="card-panel-num">{{showData.withdrawBtc}}</span>
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
                <span>今日充值数</span>
                <div class="card-panel-text">
                  USDT: <span class="card-panel-num">{{showData.todayRechargeUsdt}}</span>
                </div>
                <div class="card-panel-text">
                  ETH: <span class="card-panel-num">{{showData.todayRechargeEth}}</span>
                </div>
                <div class="card-panel-text">
                  BTC: <span class="card-panel-num">{{showData.todayRechargeBtc}}</span>
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
                <span>今日提现数</span>
                <div class="card-panel-text">
                  USDT: <span class="card-panel-num">{{showData.todayWithdrawUsdt}}</span>
                </div>
                <div class="card-panel-text">
                  ETH: <span class="card-panel-num">{{showData.todayWithdrawEth}}</span>
                </div>
                <div class="card-panel-text">
                  BTC: <span class="card-panel-num">{{showData.todayWithdrawBtc}}</span>
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
        firstDepositNum: 0, // 今日首充人数
        todayTradeUserNum: 0,
        rechargeUsdt: 0,
        rechargeEth: 0,
        rechargeBtc: 0,

        withdrawUsdt: 0,
        withdrawEth: 0,
        withdrawBtc: 0,

        todayRechargeUsdt: 0,
        todayRechargeEth: 0,
        todayRechargeBtc: 0,

        todayWithdrawUsdt: 0,
        todayWithdrawEth: 0,
        todayWithdrawBtc: 0,

        sumBalanceUSDT: 0,
        sumBalanceETH: 0,
        sumBalanceBTC: 0,

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
    height: 200px;
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
