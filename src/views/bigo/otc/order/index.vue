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
      <el-form-item label="订单号" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
          placeholder="请输入订单号"
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
      <el-form-item label="下单时间">
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
      <el-table-column label="订单ID" prop="id" min-width="80"/>
      <el-table-column label="订单号" prop="orderNo" min-width="130"/>
      <el-table-column label="币种" prop="coin"  min-width="80"/>
      <el-table-column label="数量" prop="amount" min-width="80"/>
      <el-table-column label="单价" prop="price" min-width="80" />
      <el-table-column label="法币" prop="legalCurrency" min-width="60"/>
      <el-table-column label="订单总额" prop="total" min-width="120">
        <template slot-scope="scope">
          <span> {{ scope.row.total + " " + scope.row.legalCurrency }} </span>
        </template>
      </el-table-column>
      <el-table-column label="卖家" prop="sellerId" min-width="80" :formatter="sellerFormat"/>
      <el-table-column label="买家" prop="buyerId" min-width="80" :formatter="buyerFormat"/>
      <el-table-column label="订单状态" prop="status" width="120" >
        <template slot-scope="scope">
          <span v-html="statusFormat(scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column label="收款方式" prop="status" width="120" >
        <template slot-scope="scope">
          <el-popover
            placement="top"
            trigger="click">
            <p >银行名称: {{ scope.row.bankName }}</p>
            <p>开户行: {{ scope.row.bankBranch }}</p>
            <p>银行卡号: {{ scope.row.bankAccount }}</p>
            <p>收款人: {{ scope.row.payee }}</p>
            <div slot="reference">
              <el-link type="primary">点击查看</el-link>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="下单时间" align="center" prop="createTime" min-width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="超时时间" align="center" prop="expireTime" min-width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.expireTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付时间" align="center" prop="payTime" min-width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.payTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="确认时间" align="center" prop="confirmTime" min-width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.confirmTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="160" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status == 0 && scope.row.buyerId == 1"
            size="mini"
            type="primary"
            v-hasPermi="['otc:order:pay']"
            @click="handlePay(scope.row)"
          >已付款</el-button>
          <el-button
            v-if="scope.row.status == 1 && scope.row.sellerId == 1"
            size="mini"
            type="primary"
            @click="handleConfirm(scope.row)"
            v-hasPermi="['otc:order:confirm']"
          >已收款</el-button>
          <el-button
            v-if="scope.row.status == 1 && scope.row.sellerId == 1"
            size="mini"
            type="danger"
            v-hasPermi="['otc:order:appeal']"
            @click="handleAppeal(scope.row)"
          >申诉</el-button>
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
import { listOrder, changeOrderStatus } from "@/api/bigo/otc";

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
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: undefined,
        orderNo: undefined,
        uid: undefined,
        status: undefined
      }
    };
  },
  created() {
    this.getDicts("otc_order_status").then(response => {
      this.statusOptions = response.data;
    });
    this.getList();
    
  },
  methods: {
    /** 查询资产变更列表 */
    getList() {
      this.loading = true;
      listOrder(this.addDateRange(this.queryParams, this.dateRange)).then(
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
    // 认证状态显示
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    /** 标记已付款操作 */
    handlePay(row) {
      const orderId = row.id;
      this.$confirm('是否标记ID为"' + orderId + '"的订单为已付款?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeOrderStatus(orderId, 1);
        }).then(() => {
          this.getList();
          this.msgSuccess("操作成功");
        }).catch(function() {});
    },
    /** 确认已收款操作 */
    handleConfirm(row) {
      const orderId = row.id;
      this.$confirm('是否确认ID为"' + orderId + '"的订单为已收款?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeOrderStatus(orderId, 2);
        }).then(() => {
          this.getList();
          this.msgSuccess("操作成功");
        }).catch(function() {});
    },
    /** 取消订单操作 */
    handleAppeal(row) {
      const orderId = row.id;
      this.$confirm('是否申诉ID为"' + orderId + '"的订单?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeOrderStatus(orderId, 4);
        }).then(() => {
          this.getList();
          this.msgSuccess("操作成功");
        }).catch(function() {});
    },
  }
};
</script>