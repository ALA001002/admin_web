<template>
  <div class="app-container">
    
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
      <el-form-item label="用户id" prop="uid">
        <el-input
          v-model="queryParams.uid"
          placeholder="请输入用户id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
    </el-form-item>
    <el-form-item label="用户账号" prop="uid">
        <el-input
          v-model="queryParams.username"
          placeholder="请输入用户账号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="代付状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择支付状态" clearable size="small">
            <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="代付订单号" prop="transOrderId">
        <el-input
          v-model="queryParams.transOrderId"
          placeholder="请输入代付订单ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上游订单号" prop="channelOrderId">
        <el-input
          v-model="queryParams.channelOrderId"
          placeholder="请输入上游订单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      



      
      <el-form-item label="转账成功时间" prop="transSuccTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.transSuccTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择转账成功时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['pay:trans:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['pay:trans:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['pay:trans:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['pay:trans:export']"
        >导出</el-button>
      </el-col>
    </el-row> -->

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-warning-outline"
          size="mini"
          @click="handleBatchBanner"
          v-hasPermi="['pay:trans:check']"
        >驳回</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          @click="handleBatchEnable"
          v-hasPermi="['pay:trans:check']"
        >通过</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="transList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="用户id" align="center" prop="uid" />
      <el-table-column label="用户账号" align="center" prop="username" width="200px"/>
      <el-table-column label="代付订单号" align="center" prop="transOrderId" />
      <el-table-column label="上游订单号" align="center" prop="channelOrderId" />
      <el-table-column label="金额(USDT)" align="center" prop="amount" />
      <el-table-column label="手续费" align="center" prop="fee" />
      <el-table-column label="真实金额" align="center" prop="currencyAmount" />
      <el-table-column label="代付状态" align="center" prop="status" >
         <template slot-scope="scope">
          <span v-html="statusFormat(scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column label="货币代码" align="center" prop="currency" />

      <el-table-column label="转账成功时间" align="center" prop="transSuccTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.transSuccTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['pay:trans:edit']"
          >详情</el-button>
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['pay:trans:remove']"
          >删除</el-button> -->
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

    <!-- 添加或修改代付对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="代付订单ID" prop="transOrderId">
          <el-input v-model="form.transOrderId" placeholder="请输入代付订单ID" />
        </el-form-item>
        <el-form-item label="上游订单号" prop="channelOrderId">
          <el-input v-model="form.channelOrderId" placeholder="请输入上游订单号" />
        </el-form-item>
        <el-form-item label="用户id" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="代付金额(USDT)" prop="amount">
          <el-input v-model="form.amount" placeholder="请输入代付金额" />
        </el-form-item>
        <el-form-item label="手续费" prop="fee">
          <el-input v-model="form.fee" placeholder="请输入手续费" />
        </el-form-item>
        <el-form-item label="真实货币金额" prop="currencyAmount">
          <el-input v-model="form.currencyAmount" placeholder="请输入货币金额" />
        </el-form-item>
        <el-form-item label="代付状态" prop="currency">
          <el-select
            v-model="form.status"
            placeholder="请选择代付状态"
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
        <el-form-item label="通道id" prop="payPassageId">
          <el-input v-model="form.payPassageId" placeholder="请输入通道id" />
        </el-form-item>
        <el-form-item label="提现id" prop="withdrawId">
          <el-input v-model="form.withdrawId" placeholder="请输入提现id" />
        </el-form-item>
        <el-form-item label="货币代码" prop="currency">
          <el-input v-model="form.currency" placeholder="请输入三位货币代码:美元USD" />
        </el-form-item>
        <el-form-item label="开户行名称" prop="bankName">
          <el-input v-model="form.bankName" placeholder="请输入开户行名称" />
        </el-form-item>
        <el-form-item label="银行代码" prop="bankCode">
          <el-input v-model="form.bankCode" placeholder="请输入收款银行代码" />
        </el-form-item>
        <el-form-item label="开户名" prop="accountName">
          <el-input v-model="form.accountName" placeholder="请输入账户名" />
        </el-form-item>
        <el-form-item label="开户账号" prop="accountNo">
          <el-input v-model="form.accountNo" placeholder="请输入账户号" />
        </el-form-item>
        
        <el-form-item label="收款人手机" prop="receiverPhone">
          <el-input v-model="form.receiverPhone" placeholder="请输入收款人当地手机号码" />
        </el-form-item>
        <el-form-item label="扩展参数" prop="extra">
          <el-input v-model="form.extra" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="转账成功时间" prop="transSuccTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.transSuccTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择转账成功时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="回调地址" prop="notifyUrl">
          <el-input v-model="form.notifyUrl" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button type="primary" @click="submitForm">确 定</el-button> -->
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

<!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="batchRejectTitle" :visible.sync="batchRejectOpen" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="ID" >
          <el-input v-model="form.ids" disabled/>
        </el-form-item>
        <el-form-item label="驳回原因" prop="error">
          <el-input v-model="form.error" placeholder="请输入驳回原因" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" >
        <el-button type="primary" @click="submitBatchRejectForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="batchEnableTitle" :visible.sync="batchEnableOpen" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="ID" >
          <el-input v-model="form.ids" disabled/>
        </el-form-item>
        <el-form-item label="选择支付通道" prop="currency">
          <el-select
            v-model="form.payPassageId"
            placeholder="请选择支付通道"
            clearable
            size="small"
            style="width: 240px"
          >
            <el-option
              v-for="dict in passageList"
              :key="dict.id"
              :label="dict.passageName"
              :value="dict.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="谷歌验证码" prop="error">
          <el-input v-model="form.googleCaptcha" placeholder="请输入谷歌验证码" type="text"/>
        </el-form-item>
      </el-form>
      <div slot="footer" >
        <el-button type="primary" @click="submitBatchEnableForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listTrans, getTrans, delTrans, addTrans, updateTrans, exportTrans, getPassageList ,batchCheckTrans} from "@/api/bigo/trans";

export default {
  name: "Trans",
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
      // 代付表格数据
      transList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      batchRejectOpen: false,
      batchEnableOpen: false,
      batchRejectTitle: "批量驳回",
      batchEnableTitle: "批量通过",
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        transOrderId: undefined,
        channelOrderId: undefined,
        uid: undefined,
        amount: undefined,
        fee: undefined,
        currencyAmount: undefined,
        status: 0,
        payPassageId: undefined,
        withdrawId: undefined,
        currency: undefined,
        bankCode: undefined,
        accountName: undefined,
        accountNo: undefined,
        bankName: undefined,
        receiverPhone: undefined,
        extra: undefined,
        transSuccTime: undefined,
        notifyUrl: undefined,
        username:undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        uid: [
          { required: true, message: "用户id不能为空", trigger: "blur" }
        ],
        withdrawId: [
          { required: true, message: "提现id不能为空", trigger: "blur" }
        ],
      },
         // 状态数据字典
      statusOptions: [
        {dictLabel: '待审核', dictValue: 0},
        {dictLabel: '代付中', dictValue: 1},
        {dictLabel: '代付成功', dictValue: 2},
        {dictLabel: '代付失败', dictValue: 3}
      ],
      passageList:[],
    };
  },
  created() {
    this.getList();
  },
  methods: {
        // 认证状态显示
    statusFormat(row, column) {
      if(row.status == 0){
        return '待审核';
      }else if(row.status == 1){
        return '<font color="blue">代付中</font>';
      }else if(row.status == 2){
        return '<font color="green">代付成功</font>';
      }else if(row.status == 3){
        return '<font color="red">代付失败</font>';
      }
      return '未知状态';
    },
    /** 查询代付列表 */
    getList() {
      this.loading = true;
      listTrans(this.queryParams).then(response => {
        this.transList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.batchRejectOpen = false;
      this.batchEnableOpen = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        ids: undefined,
        transOrderId: undefined,
        channelOrderId: undefined,
        uid: undefined,
        amount: undefined,
        fee: undefined,
        currencyAmount: undefined,
        status: "0",
        payPassageId: undefined,
        withdrawId: undefined,
        currency: undefined,
        bankCode: undefined,
        accountName: undefined,
        accountNo: undefined,
        bankName: undefined,
        receiverPhone: undefined,
        extra: undefined,
        createTime: undefined,
        transSuccTime: undefined,
        notifyUrl: undefined,
        googleCaptcha: undefined,
        payPassageId: undefined,
        checkStatus: undefined
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
      this.title = "添加代付";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getTrans(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改代付";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateTrans(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addTrans(this.form).then(response => {
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
      this.$confirm('是否确认删除代付编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delTrans(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有代付数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportTrans(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
     /** 驳回按钮操作 */
    handleBatchBanner(row) {
      this.reset();
      this.form.ids = this.ids;
      this.batchRejectOpen = true;
    },
    /**
     * 批量驳回
     */
    submitBatchRejectForm: function() {
      this.form.checkStatus = 2;
      batchCheckTrans(this.form).then(response => {
        if (response.code === 200) {
          this.msgSuccess("驳回成功");
          this.batchRejectOpen = false;
          this.reset();
          this.getList();
        }
      });
    },

    /**
     * 通过按钮操作
     */
    handleBatchEnable(row) {
      this.reset();
      this.form.ids = this.ids;
      getPassageList().then(response => {
        if (response.code === 200) {
          this.passageList = response.rows
        }
      });
      this.batchEnableOpen = true;
    },
        /** 通过按钮操作 */
    submitBatchEnableForm: function() {
      this.form.checkStatus = 1;
      batchCheckTrans(this.form).then(response => {
        if (response.code === 200) {
          this.msgSuccess(response.msg);
          this.batchEnableOpen = false;
          this.reset();
          this.getList();
        }
      });
    },
  }
    
};
</script>