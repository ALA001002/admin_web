<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="订单ID" prop="orderId">
        <el-input
          v-model="queryParams.orderId"
          placeholder="请输入订单ID"
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
      <el-form-item label="申诉人ID" prop="uid">
        <el-input
          v-model="queryParams.uid"
          placeholder="请输入申诉人ID"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="处理状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="处理状态"
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
      <el-form-item label="申诉时间">
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

    <el-table ref="orderTable" v-loading="loading" :data="orderList" stripe style="width: 100%" >
      <el-table-column label="申诉ID" prop="id" min-width="80"/>
      <el-table-column label="订单ID" prop="orderId" min-width="80"/>
      <el-table-column label="订单号" prop="orderNo" min-width="130"/>
      <el-table-column label="申诉人" prop="uid" :formatter="appealerFormat"  min-width="80"/>
      <el-table-column label="申诉内容" prop="status" width="120" >
        <template slot-scope="scope">
          <el-popover
            placement="top"
            trigger="click"
            v-if="scope.row.content != null">
            <p >{{ scope.row.content }}</p>
            <div slot="reference">
              <el-link type="primary">点击查看</el-link>
            </div>
          </el-popover>
          <p v-else>无</p>
        </template>
      </el-table-column>
      <el-table-column label="申诉状态" prop="status" width="120" >
        <template slot-scope="scope">
          <span v-html="statusFormat(scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column label="卖家" prop="sellerId" min-width="80" :formatter="sellerFormat"/>
      <el-table-column label="买家" prop="buyerId" min-width="80" :formatter="buyerFormat"/>
      <el-table-column label="订单状态" prop="orderStatus" width="120" >
        <template slot-scope="scope">
          <span v-html="orderStatusFormat(scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column label="申诉时间" align="center" prop="createTime" min-width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核人" prop="operatorName"  min-width="80"/>
      <el-table-column label="审核时间" align="center" prop="operateTime" min-width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.operateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center"  min-width="150" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status == 0"
            size="mini"
            type="success"
            v-hasPermi="['otc:appeal:pass']"
            @click="handlePass(scope.row)"
          >通过</el-button>
          <el-button
            v-if="scope.row.status == 0"
            size="mini"
            type="danger"
            @click="handleReject(scope.row)"
            v-hasPermi="['otc:appeal:reject']"
          >驳回</el-button>
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
import { listAppeal, changeAppealStatus } from "@/api/bigo/otc";

export default {
  name: "otc",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 角色表格数据
      orderList: [],
      // 日期范围
      dateRange: [],
      // 状态数据
      statusOptions: [
        {dictLabel: "待处理", dictValue: 0},
        {dictLabel: "已通过", dictValue: 1},
        {dictLabel: "已驳回", dictValue: 2}
      ],
      // 订单状态数据字典
      orderStatusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderId: undefined,
        orderNo: undefined,
        uid: undefined,
        status: undefined
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("otc_order_status").then(response => {
      this.orderStatusOptions = response.data;
    });
  },
  methods: {
    /** 查询资产变更列表 */
    getList() {
      this.loading = true;
      listAppeal(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.orderList = response.rows;
          this.total = response.total;
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
    // 卖家格式化
    sellerFormat(row, column) {
      if(row.sellerId == 1){
        return '系统';
      }else{
        return row.sellerId;
      }
    },
    // 买家格式化
    buyerFormat(row, column) {
      if(row.buyerId == 1){
        return '系统';
      }else{
        return row.buyerId;
      }
    },
    // 卖家格式化
    appealerFormat(row, column) {
      if(row.uid == 1){
        return '系统';
      }else{
        return row.uid;
      }
    },
    // 申诉状态显示
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 订单状态显示
    orderStatusFormat(row, column) {
      return this.selectDictLabel(this.orderStatusOptions, row.orderStatus);
    },
    /** 通过申诉操作 */
    handlePass(row) {
      const id = row.id;
      this.$confirm('是否通过ID为"' + id + '"的申诉?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeAppealStatus(id, 1);
        }).then(() => {
          this.getList();
          this.msgSuccess("操作成功");
        }).catch(function() {});
    },
    /** 驳回申诉操作 */
    handleReject(row) {
      const id = row.id;
      this.$confirm('是否驳回ID为"' + id + '"的申诉?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeAppealStatus(id, 2);
        }).then(() => {
          this.getList();
          this.msgSuccess("操作成功");
        }).catch(function() {});
    },
  }
};
</script>