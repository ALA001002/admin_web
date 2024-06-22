<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="80px">
      <el-form-item label="订单号" prop="orderId">
        <el-input
          v-model="queryParams.orderId"
          placeholder="请输入订单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户id" prop="uid">
        <el-input
          v-model="queryParams.uid"
          placeholder="请输入用户id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="交易对" prop="symbol">
        <el-select v-model="queryParams.symbol" placeholder="请选择交易对" clearable size="small">
          <el-option
            v-for="dict in spotSymbolOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>

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
      <el-form-item label="订单类型" prop="orderType">
        <el-select v-model="queryParams.orderType" placeholder="请选择订单类型" clearable size="small">
          <el-option
            v-for="dict in orderTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="订单方向" prop="side">
        <el-select v-model="queryParams.side" placeholder="请选择方向" clearable size="small">
          <el-option
            v-for="dict in sideOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="成交时间" prop="workingTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.workingTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择成交时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="primary"-->
<!--          icon="el-icon-plus"-->
<!--          size="mini"-->
<!--          @click="handleAdd"-->
<!--          v-hasPermi="['ico:spot:add']"-->
<!--        >新增</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="success"-->
<!--          icon="el-icon-edit"-->
<!--          size="mini"-->
<!--          :disabled="single"-->
<!--          @click="handleUpdate"-->
<!--          v-hasPermi="['ico:spot:edit']"-->
<!--        >修改</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="danger"-->
<!--          icon="el-icon-delete"-->
<!--          size="mini"-->
<!--          :disabled="multiple"-->
<!--          @click="handleDelete"-->
<!--          v-hasPermi="['ico:spot:remove']"-->
<!--        >删除</el-button>-->
<!--      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['ico:spot:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="spotList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="订单号" align="center" prop="orderId" width="90px"/>
      <el-table-column label="用户id" align="center" prop="uid" />
      <el-table-column label="用户账号" align="center" prop="username" width="200px"/>
      <el-table-column label="交易对" align="center" prop="symbol" :formatter="symbolFormat"/>
      <el-table-column label="订单状态" align="center" prop="status" >
        <template slot-scope="scope">
          <span v-html="statusFormat(scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column label="订单类型" align="center" prop="orderType" :formatter="orderTypeFormat" />
      <el-table-column label="方向" align="center" prop="side">
        <template slot-scope="scope">
          <span v-html="sideFormat(scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column label="总数量" align="center" prop="origQty" />
      <el-table-column label="成交数量" align="center" prop="executedQty" />
      <el-table-column label="均价" align="center" prop="executedPrice" />
      <el-table-column label="价格" align="center" prop="price" />
      <el-table-column label="手续费" align="center" prop="fee" />
      <el-table-column label="成交额" align="center" prop="executedQuoteQty" />
      <el-table-column label="成交时间" align="center" prop="workingTime" width="180">
      </el-table-column>
<!--      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['ico:spot:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ico:spot:remove']"
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

    <!-- 添加或修改现货交易记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="订单号" prop="orderId">
          <el-input v-model="form.orderId" placeholder="请输入订单号" />
        </el-form-item>
        <el-form-item label="用户id" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="交易对" prop="symbol">
          <el-input v-model="form.symbol" placeholder="请输入交易对" />
        </el-form-item>
        <el-form-item label="订单状态：NEW-进行中,FILLED-已成交,CANCELED-已取消">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="报价币种" prop="baseCoin">
          <el-input v-model="form.baseCoin" placeholder="请输入报价币种" />
        </el-form-item>
        <el-form-item label="基础币种" prop="quoteCoin">
          <el-input v-model="form.quoteCoin" placeholder="请输入基础币种" />
        </el-form-item>
        <el-form-item label="订单类型：Limit-限价单，Market-市价单">
          <el-select v-model="form.orderType" placeholder="请选择订单类型：Limit-限价单，Market-市价单">
            <el-option
              v-for="dict in orderTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="方向：BUY-买入，SELL-卖出" prop="side">
          <el-input v-model="form.side" placeholder="请输入方向：BUY-买入，SELL-卖出" />
        </el-form-item>
        <el-form-item label="总数量" prop="origQty">
          <el-input v-model="form.origQty" placeholder="请输入总数量" />
        </el-form-item>
        <el-form-item label="成交数量" prop="executedQty">
          <el-input v-model="form.executedQty" placeholder="请输入成交数量" />
        </el-form-item>
        <el-form-item label="均价" prop="executedPrice">
          <el-input v-model="form.executedPrice" placeholder="请输入均价" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="form.price" placeholder="请输入价格" />
        </el-form-item>
        <el-form-item label="手续费" prop="fee">
          <el-input v-model="form.fee" placeholder="请输入手续费" />
        </el-form-item>
        <el-form-item label="成交额" prop="executedQuoteQty">
          <el-input v-model="form.executedQuoteQty" placeholder="请输入成交额" />
        </el-form-item>
        <el-form-item label="成交时间" prop="workingTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.workingTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择成交时间">
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
import { listSpot, getSpot, delSpot, addSpot, updateSpot, exportSpot } from "@/api/bigo/icoSpot";

export default {
  name: "Spot",
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
      // 现货交易记录表格数据
      spotList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 订单状态：NEW-进行中,FILLED-已成交,CANCELED-已取消字典
      statusOptions: [],
      spotSymbolOptions: [],
      // 订单类型：Limit-限价单，Market-市价单字典
      orderTypeOptions: [],
      sideOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderId: undefined,
        uid: undefined,
        symbol: undefined,
        status: undefined,
        baseCoin: undefined,
        quoteCoin: undefined,
        orderType: undefined,
        side: undefined,
        origQty: undefined,
        executedQty: undefined,
        executedPrice: undefined,
        price: undefined,
        fee: undefined,
        executedQuoteQty: undefined,
        workingTime: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.queryParams.uid = undefined;
    const uid = this.$route.query && this.$route.query.uid;
    this.queryParams.uid = uid;
    this.getList();
    this.getDicts("spot_status").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("spot_symbol_type").then(response => {
      this.spotSymbolOptions = response.data;
    });
    this.getDicts("spot_type").then(response => {
      this.orderTypeOptions = response.data;
    });
    this.getDicts("spot_side").then(response => {
      this.sideOptions = response.data;
    });
  },
  methods: {
    /** 查询现货交易记录列表 */
    getList() {
      this.loading = true;
      listSpot(this.queryParams).then(response => {
        this.spotList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 订单状态：NEW-进行中,FILLED-已成交,CANCELED-已取消字典翻译
    statusFormat(row, column) {
      // return this.selectDictLabel(this.statusOptions, row.status);
      if(row.status === 'FILLED') {
        return '<font color="green">' + '已成交' +'</font>'
      }else if(row.status === 'CANCELED') {
        return '<font color="red">'+ '已取消' +'</font>'
      }else {
        return '<font color="blue">'+ 'NEW' +'</font>'
      }
    },
    symbolFormat(row) {
      return this.selectDictLabel(this.spotSymbolOptions, row.symbol);
    },
    // 订单类型：Limit-限价单，Market-市价单字典翻译
    orderTypeFormat(row, column) {
      // return this.selectDictLabel(this.orderTypeOptions, row.orderType);
      if(row.orderType === 'LIMIT') {
        return '限价单'
      }else {
        return '市价单'
      }
    },
    sideFormat(row, column) {
      // return this.selectDictLabel(this.orderTypeOptions, row.orderType);
      if(row.side === 'BUY') {
        return '<font color="green">' + '买入' +'</font>'
      }else {
        return '<font color="red">'+ '卖出' +'</font>'
      }
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
        orderId: undefined,
        uid: undefined,
        symbol: undefined,
        status: "0",
        baseCoin: undefined,
        quoteCoin: undefined,
        orderType: undefined,
        side: undefined,
        origQty: undefined,
        executedQty: undefined,
        executedPrice: undefined,
        price: undefined,
        fee: undefined,
        executedQuoteQty: undefined,
        createTime: undefined,
        updateTime: undefined,
        workingTime: undefined
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
      this.title = "添加现货交易记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getSpot(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改现货交易记录";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateSpot(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addSpot(this.form).then(response => {
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
      this.$confirm('是否确认删除现货交易记录编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delSpot(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有现货交易记录数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportSpot(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
