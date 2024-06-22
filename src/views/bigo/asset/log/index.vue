<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
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
      <el-form-item label="代理ID" prop="agentId">
        <el-input
          v-model="queryParams.agentId"
          placeholder="代理ID"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="币种" prop="coin">
        <el-select
          v-model="queryParams.coin"
          placeholder="币种"
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
      <el-form-item label="变更类型" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="余额变更类型"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="操作时间">
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
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['bigo:assetLog:export']"
        >导出</el-button>
      </el-col>

    </el-row>
    <el-row :gutter="10" style="padding-top: 15px">
      <el-col :span="1.5" style="color: red">总充值：</el-col>
      <el-col :span="1.5"><font color="red">{{ totalForm.rechargeUSDT }}</font> USDT</el-col>
      <el-col :span="1.5"><font color="red">{{ totalForm.rechargeETH }}</font> ETH</el-col>
      <el-col :span="1.5"><font color="red">{{ totalForm.rechargeBTC }}</font> BTC</el-col>
      <el-col :span="1.5" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-col>
      <el-col :span="1.5" style="color: red">总提现：</el-col>
      <el-col :span="1.5"><font color="red">{{ totalForm.withdrawUSDT }}</font> USDT</el-col>
      <el-col :span="1.5"><font color="red">{{ totalForm.withdrawETH }}</font> ETH</el-col>
      <el-col :span="1.5"><font color="red">{{ totalForm.withdrawBTC }}</font> BTC</el-col>
    </el-row>

    <el-table v-loading="loading" :data="assetLogList" stripe>
      <el-table-column label="记录ID" prop="id" width="120" />
      <el-table-column label="用户ID" prop="uid"  />
      <el-table-column label="账号" prop="username"  />
      <el-table-column label="账号类型" prop="userStatus" width="120" >
        <template slot-scope="scope">
          <span v-html="userStatusFormat(scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column label="币种" prop="coin" width="150" />
      <el-table-column label="变更类型" prop="type" :formatter="typeFormat"  />
      <el-table-column label="变更子类型" prop="subType" :formatter="subTypeFormat" width="150" />
      <el-table-column label="数量" align="center" prop="amount">
        <template slot-scope="scope">
          <span v-html="amountFormat(scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column label="最后登录IP" align="center" prop="lastLoginIp" min-width="180"/>
      <el-table-column label="登录归属地址" align="center" prop="lastLoginArea" min-width="180"/>
      <el-table-column label="变更时间" align="center" prop="operateTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.operateTime) }}</span>
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

<script>
import { listAssetLog,exportBigoUser,getTotalForm } from "@/api/bigo/assetLog";

export default {
  name: "assetLog",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 角色表格数据
      assetLogList: [],
      // 弹出层标题
      title: "",
      // 日期范围
      dateRange: [],
      // 币种数据字典
      coinOptions: [],
      // 资产变更类型数据字典
      typeOptions: [],
      // 资产变更子类型数据字典
      subTypeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        uid: undefined,
        coin: undefined,
        type: undefined,
        username: undefined
      },
      // 表单参数
      form: {},
      totalForm: {
        rechargeUSDT: 0,
        rechargeETH: 0,
        rechargeBTC: 0,
        withdrawUSDT: 0,
        withdrawETH: 0,
        withdrawBTC: 0,
      }
    };
  },
  created() {
    this.getList();
    this.getTotalForm();
    this.getDicts("bigo_coin_type").then(response => {
      this.coinOptions = response.data;
    });
    this.getDicts("asset_log_type").then(response => {
      this.typeOptions = response.data;
    });
    this.getDicts("asset_log_sub_type").then(response => {
      this.subTypeOptions = response.data;
    });
  },
  methods: {
    /** 查询资产变更列表 */
    getList() {
      this.loading = true;
      listAssetLog(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.assetLogList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    getTotalForm() {
      getTotalForm(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.totalForm = response.data;
        }
      );
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有用户资产明细数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return exportBigoUser(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function() {});
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
      this.getTotalForm();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 语种字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.type);
    },
    // 语种字典翻译
    subTypeFormat(row, column) {
      return this.selectDictLabel(this.subTypeOptions, row.subType);
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
    // 数量显示
    amountFormat(row, column) {
      if(row.dim == 0){
        return '<font color="green">' + '+' + row.amount +'</font>'
      }else if(row.dim == 1){
        return '<font color="red">'+ '-' + row.amount +'</font>'
      }
      return '-';
    },
  }
};
</script>
