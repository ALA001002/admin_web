<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="代理商ID" prop="agentId" v-if="agentInfo == null">
        <el-input
          v-model="queryParams.uid"
          placeholder="请输入代理商ID"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="代理商名称" prop="agentName" v-if="agentInfo == null">
        <el-input
          v-model="queryParams.username"
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
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="审核状态"
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
      <el-form-item label="提交时间">
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
      <el-col :span="3"><div class="grid-content bg-purple">邀请码：{{ agentInfo.agentCode }}</div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple">USDT余额：{{ agentInfo.usdtBalance }}</div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple">ETH余额：{{ agentInfo.ethBalance }}</div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple">COIN_BASE余额：{{ agentInfo.bigoBalance }}</div></el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          @click="handleWithdraw"
          v-hasPermi="['bigo:agent:withdraw']"
        >提现</el-button>
      </el-col>
    </el-row>

    <el-table ref="withdraw" v-loading="loading" :data="withdrawList" style="width: 100%"
      :row-class-name="tableRowClassName">
      <el-table-column label="记录ID" prop="id" width="80"/>
      <el-table-column label="代理商ID" prop="agentId" width="80"/>
      <el-table-column label="代理商名称" prop="agentName" width="120"/>
      <el-table-column label="币种" prop="coin" width="80" />
      <el-table-column label="金额" prop="amount" width="120" />
      <el-table-column label="收币地址" prop="toAddress" min-width="390"/>
      <el-table-column label="交易哈希" prop="hash"  min-width="150"/>
      <el-table-column label="审核状态" align="center" prop="status" min-width="100">
        <template slot-scope="scope">
          <span v-html="statusFormat(scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" align="center" prop="createTime" min-width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核时间" align="center" prop="operateTime" min-width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.operateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核人" prop="operatorName"  min-width="100"/>
      <el-table-column label="操作" v-if="agentInfo == null" align="center" class-name="small-padding fixed-width" min-width="120" fixed="right">
        <template slot-scope="scope" v-if="scope.row.status == 0">
          <el-button
            size="mini"
            type="text"
            :disabled="scope.row.status != 0"
            icon="el-icon-warning-outline"
            @click="handleBanner(scope.row)"
            v-hasPermi="['agent:withdraw:check']"
          >驳回</el-button>
          <el-button
            size="mini"
            type="text"
            :disabled="scope.row.status != 0"
            icon="el-icon-edit"
            @click="handleEnable(scope.row)"
            v-hasPermi="['agent:withdraw:check']"
          >通过</el-button>
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
        <el-form-item label="收币地址" prop="toAddress">
          <el-input v-model="form.toAddress"  placeholder="请输入收币地址" />
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
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>

<script>
import { listWithdraw, checkWithdraw, withdraw } from "@/api/bigo/agentWithdraw";

export default {
  name: "withdraw",
  data() {
    return {
      agentInfo: null,
      // 遮罩层
      loading: true,
      open: false,
      title:'提币',
      // 总条数
      total: 0,
      // 币种数据字典
      coinOptions: [],
      // 角色表格数据
      withdrawList: [],
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [
        {dictLabel: '待审核', dictValue: 0},
        {dictLabel: '已通过', dictValue: 1},
        {dictLabel: '已驳回', dictValue: 2}
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        agentId: undefined,
        agentName: undefined,
        coin: undefined,
        status: undefined
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
        ],
        toAddress: [
          { required: true, message: "收币地址不能为空", trigger: "blur" }
        ],
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
      listWithdraw(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.withdrawList = response.tableDate.rows;
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
    // 认证状态显示
    statusFormat(row, column) {
      if(row.status == 0){
        return '待审核';
      }else if(row.status == 1){
        return '<font color="green">通过</font>';
      }else if(row.status == 2){
        return '<font color="red">驳回</font>';
      }
      return '未知状态';
    },
    tableRowClassName({row, rowIndex}) {
      if (row.status == 2) {
        return 'warning-row';
      } else if (row.status == 1) {
        return 'success-row';
      }
      return '';
    },
    /** 驳回按钮操作 */
    handleBanner(row) {
      const id = row.id
      this.$confirm('是否驳回记录ID为"' + id + '"的提币申请?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return checkWithdraw(id, 2);
        }).then(() => {
          this.getList();
          this.msgSuccess("提币申请驳回成功");
        }).catch(function() {});
    },
    /** 通过按钮操作 */
    handleEnable(row) {
      const id = row.id
      this.$prompt('是否通过记录ID为"' + id + '"的提币申请?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPlaceholder: "请填入交易哈希（非必填）",
          type: "warning"
        }).then(({ value }) => {
          return checkWithdraw(id, 1, value);
        }).then(() => {
          this.getList();
          this.msgSuccess("提币申请通过成功");
        }).catch(function() {});

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
