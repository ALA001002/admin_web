<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="地址" prop="address">
        <el-input v-model="queryParams.address"></el-input>
      </el-form-item>
      <el-form-item label="代理id" prop="topUid">
        <el-input v-model="queryParams.topUid"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table ref="withdraw" v-loading="loading" :data="dataList" style="width: 100%">
      <!--<el-table-column type="selection" width="55" align="center" />-->
      <el-table-column label="币种" prop="symbol" width="80"/>
      <el-table-column label="用户id" prop="uid" width="80"/>
      <el-table-column label="代理id" prop="topUid" width="80"/>
      <el-table-column label="邮箱" prop="email" width="80"/>
      <el-table-column label="转出地址" prop="fromAddress" width="250"/>
      <el-table-column label="转入地址" prop="toAddress" width="250"/>
      <el-table-column label="交易hash" prop="txid" width="400"/>
      <el-table-column label="金额" prop="amount" width="200"/>
      <el-table-column label="时间" prop="createdAt" width="300"/>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNo"
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

import {withdraws} from "../../../../api/bigo/bycoin";


export default {
  name: "withdraw",
  data() {
    return {
      open:false,
      loading:false,
      dataList:[],
      config:{

        value:"https://www.baidu.com",//显示的值、跳转的地址
      },
      total:0,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        address: undefined
      }
    };
  },
  created() {
    this.getList()
  },
  // components:{VueQr},
  methods: {
    resetQuery(){},
    /** 查询资产变更列表 */
    getList() {
      this.loading = true;
      withdraws(this.queryParams).then(
        response => {
          this.dataList = response.data.content;
          this.total = response.data.totalElements;
          this.loading = false;
        }
      );
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    }
  }
};
</script>
