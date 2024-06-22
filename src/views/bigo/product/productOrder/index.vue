<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="用户ID" prop="productName">
      <el-input
        v-model="queryParams.uid"
        placeholder="请输入用户ID"
        clearable
        size="small"
        @keyup.enter.native="handleQuery"
      />
    </el-form-item>
      <el-form-item label="用户账号" prop="productName">
        <el-input
          v-model="queryParams.username"
          placeholder="请输入用户账号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="产品名称" prop="productName">
        <el-input
          v-model="queryParams.productName"
          placeholder="请输入产品名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--<el-form-item label="购买金额" prop="purchaseAmount">-->
        <!--<el-input-->
          <!--v-model="queryParams.purchaseAmount"-->
          <!--placeholder="请输入购买金额"-->
          <!--clearable-->
          <!--size="small"-->
          <!--@keyup.enter.native="handleQuery"-->
        <!--/>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="收益率" prop="profitRate">-->
        <!--<el-input-->
          <!--v-model="queryParams.profitRate"-->
          <!--placeholder="请输入收益率"-->
          <!--clearable-->
          <!--size="small"-->
          <!--@keyup.enter.native="handleQuery"-->
        <!--/>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="收益金额" prop="profitAmount">-->
        <!--<el-input-->
          <!--v-model="queryParams.profitAmount"-->
          <!--placeholder="请输入收益金额"-->
          <!--clearable-->
          <!--size="small"-->
          <!--@keyup.enter.native="handleQuery"-->
        <!--/>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="币种" prop="currency">-->
        <!--<el-input-->
          <!--v-model="queryParams.currency"-->
          <!--placeholder="请输入币种"-->
          <!--clearable-->
          <!--size="small"-->
          <!--@keyup.enter.native="handleQuery"-->
        <!--/>-->
      <!--</el-form-item>-->
      <el-form-item label="订单状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择订单状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="结算类型" prop="settlementType">
        <el-select
          v-model="form.settlementType"
          placeholder="请选择收益时间类型"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in settlementTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictValue"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="释放时间" prop="beginReleaseTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.beginReleaseTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择开始释放时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="endReleaseTime">
        <el-date-picker clearable size="small" style="width: 200px"
                        v-model="queryParams.endReleaseTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择结束释放时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="创建时间" prop="beginCreateTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.beginCreateTime"
          type="date"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择开始创建时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="endCreateTime">
        <el-date-picker clearable size="small" style="width: 200px"
                        v-model="queryParams.endCreateTime"
                        type="date"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择结束创建时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
<!--      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['product:productOrder:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['product:productOrder:edit']"
        >修改</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-warning-outline"
          size="mini"
          @click="handleBatchBanner"
          v-hasPermi="['bigo:productOrder:end']"
        >强制中断</el-button>
      </el-col>
<!--      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['product:productOrder:export']"
        >导出</el-button>
      </el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="productOrderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" width="50"/>
      <el-table-column label="用户ID" align="center" prop="uid" />
      <el-table-column label="用户账号" align="center" prop="username" width="200"/>
      <el-table-column label="产品名称" align="center" prop="productName" width="100"/>
      <el-table-column label="购买金额" align="center" prop="purchaseAmount" />
      <el-table-column label="收益天数" align="center" prop="profitTime" >
        <template slot-scope="scope">
          <span>{{ scope.row.profitTime }}天</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="收益类型" align="center" prop="profitTimeType" width="120" :formatter="profitTimeTypeFormat" />-->
      <el-table-column label="每日收益率" align="center" prop="profitRate" >
      <template slot-scope="scope">
        <span>{{ scope.row.profitRate }}%</span>
      </template>
      </el-table-column>
      <el-table-column label="收益金额" align="center" prop="profitAmount" />
      <!--<el-table-column label="币种" align="center" prop="currency" />-->
<!--      <el-table-column label="结算类型" align="center" prop="settlementType" :formatter="settlementTypeFormat"/>-->
      <el-table-column label="订单状态" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="结束释放时间" align="center" prop="endReleaseTime" width="180"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            :disabled="scope.row.status != 1"
            @click="stopRelease(scope.row)"
            v-hasPermi="['product:productOrder:end']"
          >强制中断</el-button>
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

    <el-dialog :title="batchEndTitle" :visible.sync="batchEndOpen" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="ID" >
          <el-input v-model="form.ids" disabled/>
        </el-form-item>
        <el-form-item label="谷歌验证码" prop="googleCaptcha">
          <el-input v-model="form.googleCaptcha" placeholder="请输入谷歌验证码" type="text"/>
        </el-form-item>
      </el-form>
      <div slot="footer" >
        <el-button type="primary" @click="submitBatchEndForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改理财产品订单对话框 -->
    <!--<el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户ID" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="产品名称" prop="productName">
          <el-input v-model="form.productName" placeholder="请输入产品名称" />
        </el-form-item>
        <el-form-item label="购买金额" prop="purchaseAmount">
          <el-input v-model="form.purchaseAmount" placeholder="请输入购买金额" />
        </el-form-item>
        <el-form-item label="收益率" prop="profitRate">
          <el-input v-model="form.profitRate" placeholder="请输入收益率" />
        </el-form-item>
        <el-form-item label="收益金额" prop="profitAmount">
          <el-input v-model="form.profitAmount" placeholder="请输入收益金额" />
        </el-form-item>
        <el-form-item label="币种" prop="currency">
          <el-input v-model="form.currency" placeholder="请输入币种" />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="parseInt(dict.dictValue)"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="释放时间" prop="releaseTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.releaseTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择释放时间">
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
import { listProductOrder, getProductOrder, delProductOrder, addProductOrder, updateProductOrder, exportProductOrder, stopRelease,batchStopRelease } from "@/api/bigo/productOrder";

export default {
  name: "ProductOrder",
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
      // 理财产品订单表格数据
      productOrderList: [],
      settlementTypeOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      batchEndOpen: false,
      batchEndTitle: "批量中断订单",
      // 订单状态字典
      statusOptions: [
        {dictLabel: '冻结', dictValue: 1},
        {dictLabel: '已释放', dictValue: 2}
      ],
      profitTimeTypeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        productName: undefined,
        purchaseAmount: undefined,
        profitRate: undefined,
        profitAmount: undefined,
        currency: undefined,
        status: 1,
        beginReleaseTime: undefined,
        endReleaseTime: undefined,
        beginCreateTime: undefined,
        endCreateTime: undefined,
        uid: undefined,
        username: undefined,
        settlementType: undefined
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
    this.getDicts("product_status").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("profit_time_Type").then(response => {
      this.profitTimeTypeOptions = response.data;
    });
    this.getDicts("bigo_product_settlement").then(response => {
      this.settlementTypeOptions = response.data;
    });
  },
  methods: {
    /** 查询理财产品订单列表 */
    getList() {
      this.loading = true;
      listProductOrder(this.queryParams).then(response => {
        this.productOrderList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 订单状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.batchEndOpen = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        uid: undefined,
        productName: undefined,
        purchaseAmount: undefined,
        profitRate: undefined,
        profitAmount: undefined,
        currency: undefined,
        status: "0",
        releaseTime: undefined,
        createTime: undefined
      };
      this.resetForm("form");
    },
    /** 批量驳回按钮操作 */
    handleBatchBanner(row) {
      this.reset();
      this.form.ids = this.ids;
      this.batchEndOpen = true;
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
      this.title = "添加理财产品订单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getProductOrder(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改理财产品订单";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateProductOrder(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addProductOrder(this.form).then(response => {
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
    submitBatchEndForm: function() {
      batchStopRelease(this.form.ids,this.form.googleCaptcha).then(response => {
        if (response.code === 200) {
          this.msgSuccess("批量中断订单成功");
          this.batchEndOpen = false;
          this.reset();
          this.getList();
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除理财产品订单编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delProductOrder(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有理财产品订单数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportProductOrder(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    /** 删除按钮操作 */
    stopRelease(row) {
      console.log(111)
      const ids = row.id || this.ids;
      this.$confirm('是否确认中断释放理财产品订单编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return stopRelease(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("中断释放成功");
      }).catch(function() {});
    },
    profitTimeTypeFormat(row, column) {
      return this.selectDictLabel(this.profitTimeTypeOptions, row.profitTimeType);
    },
    settlementTypeFormat(row, column) {
      return this.selectDictLabel(this.settlementTypeOptions, row.settlementType);
    }
  }
};
</script>
