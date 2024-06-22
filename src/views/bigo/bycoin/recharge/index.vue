<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="用户id" prop="uid">
         <el-input v-model="queryParams.uid"></el-input>
      </el-form-item>
      <el-form-item label="代理id" prop="topUid">
         <el-input v-model="queryParams.topUid"></el-input>
      </el-form-item>
<!--      <el-form-item label="是否上分" prop="score">
        <el-select
          v-model="queryParams.score"
          placeholder="是否上分"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in scoreOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否归集" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="是否归集"
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
      </el-form-item>-->
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
      <el-table-column label="邮箱" prop="email" width="250"/>
      <el-table-column label="转出地址" prop="fromAddress" width="250"/>
      <el-table-column label="转入地址" prop="toAddress" width="250"/>
      <el-table-column label="交易hash" prop="txid" width="400"/>
      <el-table-column label="金额" prop="amount" width="200"/>
      <el-table-column label="时间" prop="createdAt" width="300"/>
      <el-table-column label="是否上分" prop="score" width="100">
        <template slot-scope="scope">
          <span>
            {{scope.row.score?'否':'是'}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="是否归集" prop="status" width="100">
        <template slot-scope="scope">
          <span v-html="statusFormatter(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="createdAt" width="300">
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-edit"
            size="mini" @click="()=>uploadScore(scope.row)">手动上分</el-button>
          <el-button
            v-if="scope.row.status!=6"
            type="text"
            icon="el-icon-edit"
            size="mini" @click="()=>collect(scope.row)">归集</el-button>
        </template>
      </el-table-column>
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

import {collect, recharges, updateScore} from "../../../../api/bigo/bycoin";

export default {
  name: "recharge",
  data() {
    return {
      loading:false,
      dataList:[],
      scoreOptions: [
        {dictLabel: '未上分', dictValue: false},
        {dictLabel: '已上分', dictValue: true}
      ],
      statusOptions:[
        {dictLabel: '未归集', dictValue: 5},
        {dictLabel: '已归集', dictValue: 4}
      ],
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
  methods: {
    resetQuery(){},
    /** 查询资产变更列表 */
    getList() {
      this.loading = true;
      recharges(this.queryParams).then(
        response => {
          this.dataList = response.data.content;
          this.total = response.data.totalElements;
          this.loading = false;
        }
      );
    },
    async collect(row){
      let {id} = row;
      let res = await collect(id)
      this.$message.success("发送归集消息成功")
    },
    async uploadScore(row){
      let {fromAddress,toAddress,txid,amount,uid} = row;
      let res = await updateScore(toAddress,uid,amount,fromAddress,txid)
      if(res=='SUCCESS'){this.$message.success("上分成功")}else{
        if (res=='has score'){
          this.$message.error("已经上分")
        }else{
          this.$message.error("失败")
        }
      }

    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },
    statusFormatter(row) {
      if(row.status == 2 || row.status == 4){
        return '<font color="green">' + '已归集' +'</font>'
      }else if(row.status == 3 || row.status == 5){
        return '<font color="red">'+ '未归集' +'</font>'
      }
      return '';
    }
  }
};
</script>
