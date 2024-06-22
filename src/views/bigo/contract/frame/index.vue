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
      <el-form-item label="订单号" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
          placeholder="请输入订单号"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="操作类型"
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

    <el-table ref="frameTable" v-loading="loading" :data="frameList" style="width: 100%" >
      <el-table-column label="订单ID" prop="contractId" width="80"/>
      <el-table-column label="用户ID" prop="uid" width="80"/>
      <el-table-column label="用户账号" prop="username" min-width="180"/>
      <el-table-column label="订单号" prop="orderNo" min-width="200"/>
      <el-table-column label="类型" prop="type" width="120" :formatter="typeFormat" />
      <el-table-column label="平仓价格" prop="framePrice" min-width="120"/>
      <el-table-column label="真实价格" prop="realPrice" min-width="120"/>
      <el-table-column label="操作人" prop="operatorName" width="120" />
      <el-table-column label="操作时间" align="center" prop="createTime" min-width="160">
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
import { listFrame } from "@/api/bigo/contract";

export default {
  name: "frame",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 操作类型字典
      typeOptions: [
        {dictLable: '一键止损', dictValue: 1},
        {dictLable: '一键止盈', dictValue: 2}
      ],
      // 角色表格数据
      frameList: [],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        contractId: undefined,
        uid: undefined,
        orderNo: undefined,
        type: undefined,
        username: undefined
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询合约列表 */
    getList() {
      this.loading = true;
      listFrame(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.frameList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 合约类型格式化
    typeFormat(row, column) {
      if(row.type == 1){
        return '一键止损';
      }else if(row.type == 2){
        return '一键止盈';
      }else{
        return '-';
      }
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
    }
  }

};
</script>