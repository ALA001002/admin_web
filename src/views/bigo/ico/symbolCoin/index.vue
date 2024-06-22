<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="名称" prop="enumName">
        <el-input
          v-model="queryParams.enumName"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="币种代码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入币种代码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="币种名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入币种名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态：0-锁仓，1-开放" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态：0-锁仓，1-开放" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="锁仓结束时间" prop="lockoutEndTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.lockoutEndTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择锁仓结束时间">
        </el-date-picker>
      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['ico:symbolCoin:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['ico:symbolCoin:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['ico:symbolCoin:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['ico:symbolCoin:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="symbolCoinList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="名称" align="center" prop="enumName" />
      <el-table-column label="币种代码" align="center" prop="code" />
      <el-table-column label="币种名称" align="center" prop="name" />
      <el-table-column label="状态" align="center" prop="status" >
        <template slot-scope="scope">
          <span v-html="statusFormat(scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column label="锁仓结束时间" align="center" prop="lockoutEndTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.lockoutEndTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['ico:symbolCoin:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ico:symbolCoin:remove']"
          >删除</el-button>
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

    <!-- 添加或修改发币对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="名称" prop="enumName">
          <el-input v-model="form.enumName" placeholder="请输入名称（大写字母）" />
        </el-form-item>
        <el-form-item label="交易次數" prop="tradeCount">
          <el-input v-model="form.tradeCount" placeholder="请输入交易次數" />
        </el-form-item>
<!--        <el-form-item label="币种代码" prop="code">-->
<!--          <el-input v-model="form.code" placeholder="请输入币种代码" />-->
<!--        </el-form-item>-->
        <el-form-item label="锁仓结束时间" prop="lockoutEndTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.lockoutEndTime"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择锁仓结束时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listSymbolCoin, getSymbolCoin, delSymbolCoin, addSymbolCoin, updateSymbolCoin, exportSymbolCoin } from "@/api/bigo/symbolCoin";

export default {
  name: "SymbolCoin",
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
      // 发币表格数据
      symbolCoinList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        enumName: undefined,
        code: undefined,
        name: undefined,
        status: undefined,
        lockoutEndTime: undefined,
        tradeCount:undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询发币列表 */
    getList() {
      this.loading = true;
      listSymbolCoin(this.queryParams).then(response => {
        this.symbolCoinList = response.rows;
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
        enumName: undefined,
        code: undefined,
        name: undefined,
        status: "0",
        lockoutEndTime: undefined
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
      this.title = "添加发币";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getSymbolCoin(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改发币";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateSymbolCoin(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addSymbolCoin(this.form).then(response => {
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
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除发币编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delSymbolCoin(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有发币数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportSymbolCoin(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    statusFormat(row, column) {
      if(row.status == 0){
        return '<font color="red">' + '锁仓' +'</font>'
      }else if(row.status == 1){
        return '<font color="green">'+ '开放' +'</font>'
      }
      return '-';
    },
  }
};
</script>
