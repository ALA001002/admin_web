<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="用户ID" prop="uid">
        <el-input
          v-model="queryParams.uid"
          placeholder="请输入用户ID"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="币种" prop="coin">
        <el-input
          v-model="queryParams.coin"
          placeholder="请输入币种USDT/ETH"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="交易类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择交易类型" clearable size="small">
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="转出地址" prop="from">
        <el-input
          v-model="queryParams.from"
          placeholder="请输入转出地址"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="目标地址" prop="to">
        <el-input
          v-model="queryParams.to"
          placeholder="请输入目标地址"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择交易状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="交易哈希" prop="hash">
        <el-input
          v-model="queryParams.hash"
          placeholder="请输入交易哈希"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="生成时间">
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
          v-hasPermi="['wallet:transaction:export']"
        >导出</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="transactionList">
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="用户ID" align="center" prop="uid" />
      <el-table-column label="币种" align="center" prop="coin" />
      <el-table-column label="交易类型" align="center" prop="type"  :formatter="typeFormat"/>
      <el-table-column label="金额" align="center" prop="money" />

      <el-table-column label="转出地址" align="center" prop="from" min-width="400"/>
      <el-table-column label="目标地址" align="center" prop="to" min-width="400"/>
      <el-table-column label="状态" prop="status" width="120" >
        <template slot-scope="scope">
          <span v-html="statusFormat(scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column label="交易哈希" align="center" prop="hash" min-width="400"/>
      <el-table-column label="错误信息" align="center" prop="error" >
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top" v-if="scope.row.error != null">
            <p>{{ scope.row.error }}</p>
            <div slot="reference" class="name-wrapper" >
              <el-tag size="medium">点击查看</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
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


  </div>
</template>

<script>
import { listTransaction,exportTransaction } from "@/api/bigo/transaction";

export default {
  name: "Transaction",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 【请填写功能名称】表格数据
      transactionList: [],
      // 交易类型数据字典
      typeOptions: [
        {dictLabel: '打手续费', dictValue: 0},
        {dictLabel: '充值', dictValue: 1},
        {dictLabel: '提现', dictValue: 2}
      ],
      // 交易类型数据字典
      statusOptions: [
        {dictLabel: '待处理', dictValue: 0},
        {dictLabel: '待确认', dictValue: 1},
        {dictLabel: '成功', dictValue: 2},
        {dictLabel: '失败', dictValue: 3},
        {dictLabel: '待人工确认', dictValue: 4}
      ],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        uid: undefined,
        coin: undefined,
        type: undefined,
        from: undefined,
        to: undefined,
        status: undefined,
        hash: undefined
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      listTransaction(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.transactionList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 订单状态显示
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.type);
    },
    // 账号状态显示
    statusFormat(row, column) {
      if(row.status == 0){
        return '待处理'
      }else if(row.status == 1){
        return '<font color="blue">' + '待确认' +'</font>'
      }else if(row.status == 2){
        return '<font color="green">'+ '成功' +'</font>'
      }else if(row.status == 3){
        return '<font color="red">'+ '失败' +'</font>'
      }else if(row.status == 4){
        return '<font color="red">'+ '待人工确认' +'</font>'
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有交易记录?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return exportTransaction(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function() {});
    },
  }
};
</script>
