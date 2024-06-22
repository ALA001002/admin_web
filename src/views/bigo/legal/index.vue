<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="法币编码" prop="legalCurrency">
        <el-input
          v-model="queryParams.legalCurrency"
          placeholder="请输入法币编码"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="法币名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入法币名称"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="可用状态"
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
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['otc:legal:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="mini"
          :disabled="singleEnable"
          @click="handleUpdate"
          v-hasPermi="['otc:legal:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="singleEnable"
          @click="handleDel"
          v-hasPermi="['otc:legal:del']"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table ref="legalTable" v-loading="loading" :data="legalList" stripe
      @selection-change="handleSelectionChange" 
      @select-all="onSelectAll">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="法币ID" prop="id" width="80" />
      <el-table-column label="法币编码" prop="legalCurrency" width="120"/>
      <el-table-column label="法币名称" prop="name"  />
      <el-table-column label="买入汇率" prop="buyRate" width="120"/>
      <el-table-column label="卖出汇率" prop="sellRate" width="120"/>
      <el-table-column label="状态" prop="status" width="80" :formatter="statusFormat"/>
      <el-table-column label="收款银行" prop="bankName" min-width="120"/>
      <el-table-column label="开户支行" prop="bankBranch" min-width="220"/>
      <el-table-column label="收款卡号" prop="bankAccount" min-width="220"/>
      <el-table-column label="收款人" prop="payee" min-width="120"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime) }}</span>
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

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="法币编码" prop="legalCurrency" >
          <el-input v-model="form.legalCurrency" placeholder="请输入法币编码" width="240"/>
        </el-form-item>
        <el-form-item label="法币名称" prop="name" >
          <el-input v-model="form.name" placeholder="请输入法币名称" width="240"/>
        </el-form-item>
        <el-form-item label="买入汇率" prop="buyRate" >
          <el-input v-model="form.buyRate" type="number" placeholder="请输入买入汇率" width="240"/>
        </el-form-item>
        <el-form-item label="卖出汇率" prop="sellRate" >
          <el-input v-model="form.sellRate" type="number" placeholder="请输入卖出汇率" width="240"/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="form.status" label="0">可用</el-radio>
          <el-radio v-model="form.status" label="1">不可用</el-radio>
        </el-form-item>
        <el-form-item label="收款银行" prop="bankName" >
          <el-input v-model="form.bankName" placeholder="请输入收款银行" width="240"/>
        </el-form-item>
        <el-form-item label="开户支行" prop="bankBranch" >
          <el-input v-model="form.bankBranch" placeholder="请输入开户支行" width="240"/>
        </el-form-item>
        <el-form-item label="收款卡号" prop="bankAccount" >
          <el-input v-model="form.bankAccount" placeholder="请输入收款卡号" width="240"/>
        </el-form-item>
        <el-form-item label="收款人" prop="payee" >
          <el-input v-model="form.payee" placeholder="请输入收款人" width="240"/>
        </el-form-item>
      </el-form>
      <div  style="text-align:center">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listLegalCurrency,addLegal,updateLegal,delLegal } from "@/api/bigo/legal";

export default {
  name: "legal",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      title: null,
      isEdit: false,
      singleEnable: true,
      // 是否显示弹出层
      open: false,
      selectLegal: {},
      // 法币表格数据
      legalList: [],
      // 表单参数
      form: {},
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [
        {dictLabel: '可用', dictValue: 0},
        {dictLabel: '不可用', dictValue: 1}
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        legalCurrency: undefined,
        name: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        legalCurrency: [
          { required: true, message: "请输入法币编码", trigger: "blur" }
        ],
        name: [
          { required: true, message: "请输入法币名称", trigger: "blur" }
        ],
        buyRate: [
          { required: true, message: "请输入买入汇率", trigger: "blur" }
        ],
        sellRate: [
          { required: true, message: "请输入卖出汇率", trigger: "blur" }
        ],
        status: [
          { required: true, message: "请选择状态", trigger: "blur" }
        ],
        bankName: [
          { required: true, message: "请输入收款银行", trigger: "blur" }
        ],
        bankAccount: [
          { required: true, message: "请输入收款卡号", trigger: "blur" }
        ],
        payee: [
          { required: true, message: "请输入收款人", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询资产变更列表 */
    getList() {
      this.loading = true;
      listLegalCurrency(this.queryParams).then(
        response => {
          this.legalList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 状态翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
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
    handleAdd() {
      this.reset();
      this.title = "新增法币";
      this.form.status = "0";
      this.isEdit = false;
      this.open = true;
    },
    handleUpdate() {
      this.reset();
      this.title = "修改法币信息";
      this.form.status = this.selectLegal.status+"";
      this.form.id = this.selectLegal.id;
      this.form.legalCurrency = this.selectLegal.legalCurrency;
      this.form.name = this.selectLegal.name;
      this.form.buyRate = this.selectLegal.buyRate;
      this.form.sellRate = this.selectLegal.sellRate;
      this.form.bankName = this.selectLegal.bankName;
      this.form.bankAccount = this.selectLegal.bankAccount;
      this.form.bankBranch = this.selectLegal.bankBranch;
      this.form.payee = this.selectLegal.payee;
      this.isEdit = true;
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
        id: undefined,
        legalCurrency: undefined,
        name: undefined,
        buyRate: undefined,
        sellRate: undefined,
        status: undefined,
        bankName: undefined,
        bankBranch: undefined,
        bankAccount: undefined,
        payee: undefined
      };
      this.resetForm("form");
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if(this.isEdit){
            updateLegal(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改法币信息成功");
                this.open = false;
                this.getList();
              }
            });
          }else{
            addLegal(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增法币成功");
                this.open = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    handleSelectionChange(row) {
      if (row.length == 1) {
        this.selectLegal = row[0];
        this.singleEnable = false;
      }else{
        this.singleEnable = true;
      }
    },
    onSelectAll () {
			this.$refs.legalTable.clearSelection()//这个是清除所有选择项，当选择全部时，清除所有选择项
    },
    /** 删除操作 */
    handleDel() {
      const id = this.selectLegal.id;
      this.$confirm('是否删除ID为"' + id + '"的法币?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delLegal(id);
        }).then(() => {
          this.getList();
          this.msgSuccess("法币删除成功");
        }).catch(function() {});
    }
  }
};
</script>