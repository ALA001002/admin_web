<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="代理商ID" prop="agentId" v-if="agentInfo == null">
        <el-input
          v-model="queryParams.agentId"
          placeholder="请输入代理商ID"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="代理商名称" prop="agentName" v-if="agentInfo == null">
        <el-input
          v-model="queryParams.agentName"
          placeholder="请输入代理商名称"
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
      <el-form-item label="类型" prop="type">
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

    <el-row :gutter="10" class="mb8" v-if="agentInfo != null" >
      <el-col :span="4"><div class="grid-content bg-purple">USDT余额：{{ agentInfo.usdtBalance }}</div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple">ETH余额：{{ agentInfo.ethBalance }}</div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple">COIN_BASE余额：{{ agentInfo.bigoBalance }}</div></el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          @click="handleWithdraw"
          v-hasPermi="['bigo:agent:withdraw']"
        >提现</el-button>
      </el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="assetLogList" stripe>
      <el-table-column label="记录ID" prop="id" width="100" />
      <el-table-column label="代理商ID" prop="agentId" />
      <el-table-column label="代理商名称" prop="agentName" />
      <el-table-column label="币种" prop="coin" width="150" />
      <el-table-column label="变更类型" prop="type" :formatter="typeFormat" />
      <el-table-column label="数量" align="center" prop="amount">
        <template slot-scope="scope">
          <span v-html="amountFormat(scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column label="关联订单ID" prop="contractId" />
      <el-table-column label="变更时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
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

    <!-- 提币对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="币种" prop="coin">
        <el-select
          v-model="form.coin"
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
        <el-form-item label="提币数量" prop="amount">
          <el-input v-model="form.amount" :min="1" placeholder="请输入提币数量" type="amount"/>
        </el-form-item>
      </el-form>
      <div slot="footer" >
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<style>
  .el-row {
    margin-bottom: 20px;
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #eceff1;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 29px;
    /*flex 布局*/
    display: flex;
    /*实现垂直居中*/
    align-items: center;
    /*实现水平居中*/
    justify-content: center;

    text-align: justify;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
<script>
import { listAssetLog,withdraw } from "@/api/bigo/agent";

export default {
  name: "assetLog",
  data() {
    return {
      agentInfo: null,
      // 遮罩层
      loading: true,
      open: false,
      title:'提币',
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
      typeOptions: [
        {dictLabel:"分成", dictValue:0},
        {dictLabel:"提现", dictValue:1},
        {dictLabel:"提现失败-返还金额", dictValue:2}
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        agentId: undefined,
        coin: undefined,
        type: undefined,
        agentName: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        coin: [
          { required: true, message: "请选择提现币种", trigger: "blur" }
        ],
        amount: [
          { required: true, message: "提币数量不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("bigo_coin_type").then(response => {
      this.coinOptions = response.data;
    });
  },
  methods: {
    /** 查询资产变更列表 */
    getList() {
      this.loading = true;
      listAssetLog(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.assetLogList = response.tableDate.rows;
          this.total = response.tableDate.total;
          this.agentInfo = response.agent;
          this.loading = false;
        }
      );
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
    // 语种字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.type);
    },
    // 数量显示
    amountFormat(row, column) {
      if(row.dim == 0){
        if(row.fee == null){
          return '<font color="green">' + row.amount +'</font>'
        }else{
          var total = row.amount+row.fee;
          return '<font color="green">' + total +'</font>'
        }
      }else if(row.dim == 1){
        var total =  row.fee - row.amount ;
        if(total >= 0){
          return '<font color="green">' + total +'</font>'
        }else{
          return '<font color="red">' + total +'</font>'
        }
      }
      return '-';
    },
    handleWithdraw() {
      this.reset();
      this.open = true;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        coin: undefined,
        amount: undefined
      };
      this.resetForm("form");
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if(this.form.amount < 1){
            alert("提币数量不能小于1");
            return;
          }
          withdraw(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess("提币申请提交成功！");
              this.open = false;
              this.getList();
            }
          });
        }
      });
    },
  }
};
</script>
