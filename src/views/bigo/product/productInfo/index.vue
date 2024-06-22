<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="产品名称" prop="productName">
        <el-input
          v-model="queryParams.productName"
          placeholder="请输入产品名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.createTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择创建时间">
        </el-date-picker>
      </el-form-item>
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
          v-hasPermi="['product:productInfo:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['product:productInfo:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['product:productInfo:remove']"
        >删除</el-button>
      </el-col>
      <!--<el-col :span="1.5">-->
        <!--<el-button-->
          <!--type="warning"-->
          <!--icon="el-icon-download"-->
          <!--size="mini"-->
          <!--@click="handleExport"-->
          <!--v-hasPermi="['product:productInfo:export']"-->
        <!--&gt;导出</el-button>-->
      <!--</el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="productInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="产品名称" align="center" prop="productName" />
      <el-table-column label="产品类型" align="center" prop="type" :formatter="productTypeFormat"/>
      <el-table-column label="是否热门" align="center" prop="type" :formatter="isTopFormat"/>
      <el-table-column label="每小时收益率%" align="center" prop="profitRate" />
      <el-table-column label="总收益率%" align="center" prop="profitRate" :formatter="totalRevenueFormat" />
      <el-table-column label="收益时间(天)" align="center" prop="profitTime" width="180" />
      <el-table-column label="总数量" align="center" prop="totalNumber" width="180" />
      <el-table-column label="剩余数量" align="center" prop="remainingNumber" width="180" />
      <el-table-column label="最低购买金额" align="center" prop="purchaseAmountMin" width="180"/>
      <el-table-column label="最高购买金额" align="center" prop="purchaseAmountMax" width="180"/>
      <el-table-column label="币种" align="center" prop="currency" />
      <el-table-column label="结算类型" align="center" prop="settlementType" :formatter="settlementTypeFormat"  />
<!--      <el-table-column label="倒计时时间" align="center" prop="countdownTime" width="180">-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ parseTime(scope.row.countdownTime, '{y}-{m}-{d}') }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['product:productInfo:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['product:productInfo:remove']"
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

    <!-- 添加或修改理财产品信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="产品类型" prop="typeId">
          <el-select
            v-model="form.typeId"
            placeholder="请选择收益时间类型"
            clearable
            size="small"
            style="width: 240px"
          >
            <el-option
              v-for="type in productTypeOptions"
              :key="type.typeName"
              :label="type.typeName"
              :value="type.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称" prop="productName">
          <el-input v-model="form.productName" placeholder="请输入产品名称" />
        </el-form-item>
        <el-form-item label="是否热门" prop="currency">
          <el-select
            v-model="form.isTop"
            placeholder="请选择"
            clearable
            size="small"
            style="width: 240px"
          >
            <el-option
              v-for="dict in isTopOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="每小时收益率%" prop="profitRate">
          <el-input v-model="form.profitRate" placeholder="请输入收益率" />
        </el-form-item>
        <el-form-item label="收益时间(天)" prop="profitTime">
          <el-input v-model="form.profitTime" placeholder="请输入收益时间次数" />
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
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="币种" prop="currency">
          <el-select
            v-model="form.currency"
            placeholder="请选择币种类型"
            clearable
            size="small"
            style="width: 240px"
          >
            <el-option
              v-for="dict in coinOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="最低购买金额" prop="purchaseAmountMin">
          <el-input v-model="form.purchaseAmountMin" placeholder="请输入最低购买金额" />
        </el-form-item>
        <el-form-item label="最高购买金额" prop="purchaseAmountMax">
          <el-input v-model="form.purchaseAmountMax" placeholder="请输入最高购买金额" />
        </el-form-item>

        <el-form-item label="总数量" prop="totalNumber">
          <el-input v-model="form.totalNumber" placeholder="请输入总数量" />
        </el-form-item>
        <el-form-item label="剩余数量" prop="remainingNumber">
          <el-input v-model="form.remainingNumber" placeholder="请输入剩余数量" />
        </el-form-item>
        <el-form-item v-if="form.typeId == 1" label="倒计时时间" prop="countdownTime">
          <el-date-picker clearable size="small" style="width: 200px"
                          v-model="form.countdownTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="倒计时时间">
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
import { listProductInfo, getProductInfo, delProductInfo, addProductInfo, updateProductInfo, exportProductInfo,listProductType } from "@/api/bigo/productInfo";

export default {
  name: "ProductInfo",
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
      // 理财产品信息表格数据
      productInfoList: [],
      profitTimeTypeOptions: [],
      coinOptions: [],
      settlementTypeOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        productName: undefined,
        createTime: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      productTypeOptions: [],
      isTopOptions:[{"dictLabel":"否","dictValue":0},{"dictLabel":"是","dictValue":1}]
    };
  },
  created() {
    this.getList();
    this.getDicts("profit_time_Type").then(response => {
      this.profitTimeTypeOptions = response.data;
    });
    this.getDicts("bigo_coin_type").then(response => {
      this.coinOptions = response.data;
    });
    this.getDicts("bigo_product_settlement").then(response => {
      this.settlementTypeOptions = response.data;
    });
    listProductType().then().then(response => {
      this.productTypeOptions = response.rows;
    });
  },
  methods: {
    /** 查询理财产品信息列表 */
    getList() {
      this.loading = true;
      listProductInfo(this.queryParams).then(response => {
        this.productInfoList = response.rows;
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
        productName: undefined,
        profitRate: undefined,
        profitTime: undefined,
        purchaseAmountMin: undefined,
        purchaseAmountMax: undefined,
        currency: undefined,
        createTime: undefined,
        createBy: undefined,
        updateTime: undefined,
        updateBy: undefined,
        isDel: undefined,
        profitTimeType: undefined,
        remainingNumber: undefined,
        totalNumber: undefined,
        settlementType: undefined,
        typeId: undefined,
        countdownTime: undefined,
        isTop: undefined
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
      this.title = "添加理财产品信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getProductInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改理财产品信息";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateProductInfo(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addProductInfo(this.form).then(response => {
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
      this.$confirm('是否确认删除理财产品信息编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delProductInfo(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有理财产品信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportProductInfo(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    profitTimeTypeFormat(row, column) {
      return this.selectDictLabel(this.profitTimeTypeOptions, row.profitTimeType);
    },
    settlementTypeFormat(row, column) {
      return this.selectDictLabel(this.settlementTypeOptions, row.settlementType);
    },
    isTopFormat(row, column) {
      return this.selectDictLabel(this.isTopOptions, row.isTop);
    },
    productTypeFormat(row, column) {
      var actions = [];
      var datas = this.productTypeOptions;
      var value = row.typeId;
      Object.keys(datas).map((key) => {
        if (datas[key].id == ('' + value)) {
          actions.push(datas[key].typeName);
          return false;
        }
      })
      return actions.join('');
    },
    totalRevenueFormat(row, column) {
      var num = row.profitRate * row.profitTime;
      num = num.toFixed(3);
      return num;
    }
  }
};
</script>
