<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="订单ID" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入订单ID"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="用户ID" prop="uid">
        <el-input
          v-model="queryParams.uid"
          placeholder="请输入用户ID"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="用户账号" prop="username">
        <el-input
          v-model="queryParams.username"
          placeholder="请输入用户账号"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="订单号" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
          placeholder="请输入订单号"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="交易对" prop="symbol">
        <el-select
          v-model="queryParams.symbol"
          placeholder="订单交易对"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in symbolOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="币种" prop="currency">
        <el-select
          v-model="queryParams.currency"
          placeholder="购买币种"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in coinOptions"
            :key="dict.dictValue"
            :label="dict.dictValue"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="订单状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="订单状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="建仓时间">
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

    <el-table ref="contractTable" v-loading="loading" :data="contractList" style="width: 100%" 
      :row-class-name="tableRowClassName">
      <!--<el-table-column type="selection" width="55" align="center" />-->
      <el-table-column label="订单ID" prop="id" width="80"/>
      <el-table-column label="用户ID" prop="uid" width="80"/>
      <el-table-column label="用户账号" prop="username" min-width="180"/>
      <el-table-column label="账号类型" prop="userStatus" width="120" >
        <template slot-scope="scope">
          <span v-html="userStatusFormat(scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column label="订单号" prop="orderNo" min-width="200"/>
      <el-table-column label="交易对" prop="symbol" width="120" />
      <el-table-column label="购买币种" prop="currency" width="80" />
      <el-table-column label="类型" prop="tradeType" width="120" :formatter="typeFormat" />
      <el-table-column label="金额" prop="money" width="120" />
      <el-table-column label="杠杆(倍)" prop="contractMultiple" width="120" />
      <el-table-column label="留仓费" prop="capitalFee" width="120" />
      <el-table-column label="手续费" prop="fee" width="120" />
      <el-table-column label="补仓费" prop="replenish" width="120" />
      <el-table-column label="留仓费" prop="capitalFee" width="120" />
      <el-table-column label="止盈价格" prop="stopSurplus" width="120" />
      <el-table-column label="止损价格" prop="stopLoss" width="120" />
      <el-table-column label="预估强平仓价" prop="predictPrice" width="120" />
      <el-table-column label="收益" prop="profit" width="120" :formatter="profitFormat"/>
      <el-table-column label="状态" align="center" prop="status" min-width="100">
        <template slot-scope="scope">
          <span v-html="statusFormat(scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column label="建仓价" prop="buyPrice" width="120" />
      <el-table-column label="建仓时间" align="center" prop="buyTime" min-width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.buyTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平仓价" prop="sellPrice" width="120" />
      <el-table-column label="平仓时间" align="center" prop="sellTime" min-width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.sellTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="180" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            :disabled="scope.row.status != 0"
            icon="el-icon-warning-outline"
            @click="handleLoss(scope.row)"
            v-hasPermi="['bigo:contract:loss']"
          >一键止损</el-button>
          <el-button
            size="mini"
            type="text"
            :disabled="scope.row.status != 0"
            icon="el-icon-warning-outline"
            @click="handleSurplus(scope.row)"
            v-hasPermi="['bigo:contract:surplus']"
          >一键止盈</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

  </div>
</template>

<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>

<script>
import { listContract, stopLoss, stopSurplus } from "@/api/bigo/contract";

export default {
  name: "contract",
  data() {
    return {
      radio:"",
      singleBanner: true,
      singleEnable: true,
      selectWithdraw: {},
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 交易对数据字典
      symbolOptions: [],
      // 币种数据字典
      coinOptions: [],
      // 角色表格数据
      contractList: [],
      // 弹出层标题
      title: "",
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: undefined,
        uid: undefined,
        orderNo: undefined,
        symbol: undefined,
        currency: undefined,
        username: undefined,
        status: undefined
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("bigo_coin_type").then(response => {
      this.coinOptions = response.data;
    });
    this.getDicts("bigo_symbol_type").then(response => {
      this.symbolOptions = response.data;
    });
    this.getDicts("bigo_contract_status_type").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询合约列表 */
    getList() {
      this.loading = true;
      listContract(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.contractList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 合约类型格式化
    typeFormat(row, column) {
      if(row.tradeType == 1){
        return '做多';
      }else{
        return '做空';
      }
    },
    // 收益金额格式化
    profitFormat(row, column) {
      if(row.profitType == 1){
        return '+'+row.profit;
      }else if(row.profitType == 2){
        return '-'+row.profit;
      }else{
        return row.profit;
      }
    },
    // 账号状态显示
    userStatusFormat(row, column) {
      if(row.userStatus == 0 || row.userStatus == 1){
        return '<font color="green">' + '普通玩家' +'</font>'
      }else if(row.userStatus == 2){
        return '<font color="red">'+ '内部账号' +'</font>'
      }
      return '-';
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 订单状态显示
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    tableRowClassName({row, rowIndex}) {
      if (row.profitType == 2) {
        return 'warning-row';
      } else if (row.profitType == 1) {
        return 'success-row';
      }
      return '';
    },
    /** 一键强平操作 */
    handleLoss(row) {
      const id = row.id
      this.$confirm('是否止损ID为"' + id + '"订单? 该操作无法撤销，请慎重操作！', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return stopLoss(id);
        }).then(() => {
          this.getList();
          this.msgSuccess("一键止损成功");
        }).catch(function() {});
    },
    /** 一键止盈操作 */
    handleSurplus(row) {
      const id = row.id
      this.$confirm('是否止盈ID为"' + id + '"订单? 该操作无法撤销，请慎重操作！', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return stopSurplus(id);
        }).then(() => {
          this.getList();
          this.msgSuccess("一键止盈成功");
        }).catch(function() {});
    }
  }

};
</script>