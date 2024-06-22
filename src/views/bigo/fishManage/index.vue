<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="交易对" prop="symbol">
        <el-select
          v-model="queryParams.symbol"
          placeholder="滑点交易对"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in symbolOptions"
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

<!--    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['marketsituation:slipConfig:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['marketsituation:slipConfig:edit']"
        >修改</el-button>
      </el-col>
&lt;!&ndash;      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['marketsituation:slipConfig:remove']"
        >删除</el-button>
      </el-col>&ndash;&gt;
&lt;!&ndash;      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['marketsituation:slipConfig:export']"
        >导出</el-button>
      </el-col>&ndash;&gt;
    </el-row>-->

    <el-table v-loading="loading" :data="fishManageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="rowId" width="200" />
      <el-table-column label="地址" align="center" prop="address" />
      <el-table-column label="授权地址" align="center" prop="approveAddress" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="100" />
      <el-table-column label="更新时间" align="center" prop="updateTime" width="100" />
<!--      <el-table-column label="交易数量" align="center" prop="addAmount" />-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-warning-outline"
            @click="handleGetBalance(scope.row)"
            v-hasPermi="['bigo:fish:balance']"
          >查询余额</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleWithdraw(scope.row)"
            v-hasPermi="['bigo:fish:withdraw']"
          >提现</el-button>
        </template>
      </el-table-column>
    </el-table>

<!--    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />-->

    <!-- 添加或修改滑点配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="ID" prop="rowId">
          <el-input v-model="form.rowId" disabled />
        </el-form-item>
        <el-form-item label="提现地址" prop="withdrawAddress">
          <el-input v-model="form.withdrawAddress" />
        </el-form-item>
        <el-form-item label="金额" prop="value">
          <el-input v-model="form.value" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="titleBalance" :visible.sync="openBalance" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="ID" prop="rowId">
          <el-input v-model="form.rowId" disabled />
        </el-form-item>
        <el-form-item label="地址" prop="address" >
          <el-input v-model="form.address" disabled/>
        </el-form-item>
        <el-form-item label="余额(USDT)" prop="value">
          <el-input v-model="form.balance" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
<!--        <el-button type="primary" @click="submitForm">确 定</el-button>-->
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listFishManage, getBalance, withdraw } from "@/api/bigo/fishManage";

export default {
  name: "SlipConfig",
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
      // 滑点配置表格数据
      fishManageList: [],
      symbolOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      titleBalance: "",
      // 是否显示弹出层
      openBalance: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 100,
        startTime: undefined,
        endTime: undefined,
        openFlag: undefined,
        addValue: undefined,
        symbol: undefined,
        intervalTime: undefined,
        addAmount: undefined,
        openFlagInter: undefined
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
    /** 查询列表 */
    getList() {
      this.loading = true;
      listFishManage(this.queryParams).then(response => {
        this.fishManageList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.openBalance =false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        rowId: undefined,
        withdrawAddress: undefined,
        value: undefined,
        address: undefined,
        balance: undefined
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
    handleWithdraw(row) {
      this.reset();
      this.form.rowId = row.rowId;
      this.open = true;
      this.title = "添加滑点配置";
    },
    /** 修改按钮操作 */
    handleGetBalance(row) {
      this.reset();
      const address = row.address
      getBalance(address).then(response => {
        this.form.rowId = row.rowId;
        this.form.address = row.address;
        this.form.balance = response.data;
        this.openBalance = true;
        this.titleBalance = "查看余额";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
            withdraw(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("提现成功");
                this.open = false;
                this.getList();
              }
            });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除滑点配置编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delSlipConfig(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有滑点配置数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportSlipConfig(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },// 邀请人格式化
    openFlagFormatter(row, column) {
      if(row.openFlagInter == 1){
        return '<font color="green">' + '开启' +'</font>'
      }else{
        return '<font color="red">'+ '关闭' +'</font>'
      }
    },
    delFlagFormatter(row, column) {
      if(row.delFlagInter == 1){
        return '已删除';
      }else{
        return '未删除';
      }
    },
    symbolFormat(row, column) {
      return this.selectDictLabel(this.symbolOptions, row.symbol);
    },

    handleOpen(row) {
      const id = row.id;
      this.$confirm('是否开启id为"' + id + '"的记录?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return updateStatus(id, 1);
      }).then(() => {
        this.getList();
        this.msgSuccess("开启成功");
      }).catch(function() {});
    },
    handleClose(row) {
      const id = row.id;
      this.$confirm('是否关闭id为"' + id + '"的记录?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return updateStatus(id, 0);
      }).then(() => {
        this.getList();
        this.msgSuccess("关闭成功");
      }).catch(function() {});
    },
  }
};
</script>
