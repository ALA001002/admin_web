<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">

      <el-form-item label="用户ID" prop="collectTxId">
        <el-input
          v-model="queryParams.uid"
          placeholder="用户ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合约地址" prop="contractAddress">
        <el-input
          v-model="queryParams.contractAddress"
          placeholder="请输入合约地址"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="来源地址" prop="fromAddress">
        <el-input
          v-model="queryParams.fromAddress"
          placeholder="请输入来源地址"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="转向地址" prop="toAddress">
        <el-input
          v-model="queryParams.toAddress"
          placeholder="请输入转向地址"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="hash_txid" prop="txid">
        <el-input
          v-model="queryParams.txid"
          placeholder="请输入txid"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

<!--    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['wallet:tronTransaction:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['wallet:tronTransaction:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['wallet:tronTransaction:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['wallet:tronTransaction:export']"
        >导出</el-button>
      </el-col>
    </el-row>-->

    <el-table v-loading="loading" :data="tronTransactionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="用户ID" align="center" prop="uid" />
      <el-table-column label="币种" align="center" prop="symbol" />
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat"/>
      <el-table-column label="金额" align="center" prop="amount" />
      <el-table-column label="是否上分" prop="score" width="120" >
        <template slot-scope="scope">
          <span v-html="scoreFormat(scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column label="来源地址" align="center" prop="fromAddress" />
      <el-table-column label="转向地址" align="center" prop="toAddress" />
      <el-table-column label="txid" align="center" prop="txid" />
      <el-table-column label="创建时间" align="center" prop="createdAt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdAt, '{y}-{m}-{d} {h}:{m}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="uploadScore(scope.row)"
            v-hasPermi="['wallet:tronTransaction:uploadScore']"
          >手动上分</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="uploadCollect(scope.row)"
            v-hasPermi="['wallet:tronTransaction:collect']"
          >归集</el-button>
        </template>
      </el-table-column>
<!--      <el-table-column label="确认区块数" align="center" prop="blockNum" />
      <el-table-column label="归集错误信息" align="center" prop="collectErrors" />
      <el-table-column label="归集时间" align="center" prop="collectTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.collectTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="归集id" align="center" prop="collectTxId" />
      <el-table-column label="确认区块数" align="center" prop="confirmBlock" />
      <el-table-column label="确认时间" align="center" prop="confirmTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.confirmTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合约地址" align="center" prop="contractAddress" />

      <el-table-column label="错误信息" align="center" prop="errors" />
      <el-table-column label="手续费id" align="center" prop="feeTxId" />

      <el-table-column label="初始数量" align="center" prop="originAmount" />
      <el-table-column label="父级交易id" align="center" prop="parentTxId" />
      <el-table-column label="是否上分标志" align="center" prop="score" />




      <el-table-column label="0提现 1充值" align="center" prop="type" />
      <el-table-column label="updated_at" align="center" prop="updatedAt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updatedAt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['wallet:tronTransaction:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['wallet:tronTransaction:remove']"
          >删除</el-button>
        </template>
      </el-table-column>-->
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改Trx充提对话框 -->
<!--    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="金额" prop="amount">
          <el-input v-model="form.amount" placeholder="请输入金额" />
        </el-form-item>
        <el-form-item label="确认区块数" prop="blockNum">
          <el-input v-model="form.blockNum" placeholder="请输入确认区块数" />
        </el-form-item>
        <el-form-item label="归集错误信息" prop="collectErrors">
          <el-input v-model="form.collectErrors" placeholder="请输入归集错误信息" />
        </el-form-item>
        <el-form-item label="归集时间" prop="collectTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.collectTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择归集时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="归集id" prop="collectTxId">
          <el-input v-model="form.collectTxId" placeholder="请输入归集id" />
        </el-form-item>
        <el-form-item label="确认区块数" prop="confirmBlock">
          <el-input v-model="form.confirmBlock" placeholder="请输入确认区块数" />
        </el-form-item>
        <el-form-item label="确认时间" prop="confirmTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.confirmTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择确认时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="合约地址" prop="contractAddress">
          <el-input v-model="form.contractAddress" placeholder="请输入合约地址" />
        </el-form-item>
        <el-form-item label="created_at" prop="createdAt">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.createdAt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择created_at">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="错误信息" prop="errors">
          <el-input v-model="form.errors" placeholder="请输入错误信息" />
        </el-form-item>
        <el-form-item label="手续费id" prop="feeTxId">
          <el-input v-model="form.feeTxId" placeholder="请输入手续费id" />
        </el-form-item>
        <el-form-item label="来源地址" prop="fromAddress">
          <el-input v-model="form.fromAddress" placeholder="请输入来源地址" />
        </el-form-item>
        <el-form-item label="初始数量" prop="originAmount">
          <el-input v-model="form.originAmount" placeholder="请输入初始数量" />
        </el-form-item>
        <el-form-item label="父级交易id" prop="parentTxId">
          <el-input v-model="form.parentTxId" placeholder="请输入父级交易id" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="代币" prop="symbol">
          <el-input v-model="form.symbol" placeholder="请输入代币" />
        </el-form-item>
        <el-form-item label="转向地址" prop="toAddress">
          <el-input v-model="form.toAddress" placeholder="请输入转向地址" />
        </el-form-item>
        <el-form-item label="txid" prop="txid">
          <el-input v-model="form.txid" placeholder="请输入txid" />
        </el-form-item>
        <el-form-item label="0提现 1充值">
          <el-select v-model="form.type" placeholder="请选择0提现 1充值">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="updated_at" prop="updatedAt">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.updatedAt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择updated_at">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>-->
  </div>
</template>

<script>
import { listTronTransaction, getTronTransaction, delTronTransaction, addTronTransaction, updateTronTransaction, exportTronTransaction, collect, updateScore } from "@/api/bigo/tronTransaction";

export default {
  name: "TronTransaction",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // Trx充提表格数据
      tronTransactionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        amount: undefined,
        blockNum: undefined,
        collectErrors: undefined,
        collectTime: undefined,
        collectTxId: undefined,
        confirmBlock: undefined,
        confirmTime: undefined,
        contractAddress: undefined,
        createdAt: undefined,
        errors: undefined,
        feeTxId: undefined,
        fromAddress: undefined,
        originAmount: undefined,
        parentTxId: undefined,
        score: undefined,
        status: undefined,
        symbol: undefined,
        toAddress: undefined,
        txid: undefined,
        type: undefined,
        updatedAt: undefined
      },
      statusOptions:[],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("trx_withdraw_status").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询Trx充提列表 */
    getList() {
      this.loading = true;
      listTronTransaction(this.queryParams).then(response => {
        this.tronTransactionList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        amount: undefined,
        blockNum: undefined,
        collectErrors: undefined,
        collectTime: undefined,
        collectTxId: undefined,
        confirmBlock: undefined,
        confirmTime: undefined,
        contractAddress: undefined,
        createdAt: undefined,
        errors: undefined,
        feeTxId: undefined,
        fromAddress: undefined,
        originAmount: undefined,
        parentTxId: undefined,
        score: undefined,
        status: "0",
        symbol: undefined,
        toAddress: undefined,
        txid: undefined,
        type: undefined,
        updatedAt: undefined
      };
      this.resetForm("form");
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加Trx充提";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getTronTransaction(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改Trx充提";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateTronTransaction(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addTronTransaction(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    async uploadCollect(row){
      let {id} = row;
      let res = await collect(id)
      this.$message.success("发送归集消息成功")
    },
    /** 手动上分 */
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
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除Trx充提编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delTronTransaction(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有Trx充提数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportTronTransaction(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 账号状态显示
    scoreFormat(row, column) {
      if(row.score == 1){
        return '<font color="green">' + '已上分' +'</font>'
      }else if(row.score == 0){
        return '<font color="red">'+ '未上分' +'</font>'
      }
      return '-';
    },
  }
};
</script>
