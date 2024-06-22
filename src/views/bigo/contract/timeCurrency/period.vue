<template>
  <div class="app-container">
<!--    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="交易对" prop="symbol">
        <el-input
          v-model="queryParams.symbol"
          placeholder="请输入交易对"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="结算周期" prop="period">
        <el-input
          v-model="queryParams.period"
          placeholder="请输入结算周期"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="收益率" prop="yieldRate">
        <el-input
          v-model="queryParams.yieldRate"
          placeholder="请输入收益率"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="亏损率" prop="lossRate">
        <el-input
          v-model="queryParams.lossRate"
          placeholder="请输入亏损率"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态 0-可用 1-不可用" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态 0-可用 1-不可用" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>-->

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['contract:period:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['contract:period:edit']"
        >修改</el-button>
      </el-col>
      <!--<el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['contract:period:remove']"
        >删除</el-button>
      </el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="periodList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键ID" align="center" prop="id" />
      <el-table-column label="交易对" align="center" prop="symbol" />
      <el-table-column label="结算周期(秒)" align="center" prop="period" />
      <el-table-column label="收益率(%)" align="center" prop="yieldRate" />
      <el-table-column label="亏损率(%)" align="center" prop="lossRate" />
      <el-table-column label="最低下單金額" align="center" prop="minMoney" />
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['contract:period:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['contract:period:remove']"
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

    <!-- 添加或修改限时合约周期信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="交易对" prop="symbol">
          <el-input v-model="form.symbol" placeholder="请输入交易对" disabled="true"/>
        </el-form-item>
        <el-form-item label="结算周期(秒)" prop="period">
          <el-input v-model="form.period" placeholder="请输入结算周期" />
        </el-form-item>
        <el-form-item label="收益率(%)" prop="yieldRate">
          <el-input v-model="form.yieldRate" placeholder="请输入收益率" />
        </el-form-item>
        <el-form-item label="亏损率(%)" prop="lossRate">
          <el-input v-model="form.lossRate" placeholder="请输入亏损率" />
        </el-form-item>
        <el-form-item label="最低金額" prop="minMoney">
          <el-input v-model="form.minMoney" placeholder="最低金額" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="item.value" :key="item.value" v-for="(item,index) in status">{{item.label}}</el-radio>
          </el-radio-group>
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
import { listPeriod, getPeriod, delPeriod, addPeriod, updatePeriod, exportPeriod } from "@/api/bigo/period";

export default {
  name: "Period",
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
      // 限时合约周期信息表格数据
      periodList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        symbol: undefined,
        period: undefined,
        yieldRate: undefined,
        lossRate: undefined,
        status: undefined,

      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      symbol: undefined,
      status: [
        { label: "可用", value: 0 },
        { label: "不可用", value: 1 }
      ]
    };
  },
  created() {
    const symbol = this.$route.query && this.$route.query.symbol;
    this.symbol = symbol;
    this.getSymbol(symbol);
    this.form.status = 0;
  },
  methods: {
    getSymbol(symbol) {
      this.queryParams.symbol = symbol;
      this.getList();
    },
    /** 查询限时合约周期信息列表 */
    getList() {
      this.loading = true;
      listPeriod(this.queryParams).then(response => {
        this.periodList = response.rows;
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
        symbol: undefined,
        period: undefined,
        yieldRate: undefined,
        lossRate: undefined,
        status: 0,
        updateTime: undefined,
        minMoney: undefined
      };
      this.resetForm("form");
    },
    statusFormat(row, cloum) {
      if(row.status == 0) {
        return '可用';
      } else {
        return '不可用';
      }
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
      this.form.symbol = this.symbol;
      this.title = "添加限时合约周期信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPeriod(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改限时合约周期信息";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updatePeriod(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addPeriod(this.form).then(response => {
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
      this.$confirm('是否确认删除限时合约周期信息编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPeriod(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有限时合约周期信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportPeriod(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
