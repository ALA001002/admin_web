<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="用户id" prop="uid">
        <el-input
          v-model="queryParams.uid"
          placeholder="请输入用户id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>


      <el-form-item label="借款天数" prop="loansNumber">
        <el-select v-model="queryParams.loansNumber" placeholder="请选择借款天数" clearable size="small">
          <el-option
            v-for="dict in loansNumberOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="借贷状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择借贷状态" clearable size="small">
          <el-option
            v-for="dict in loansStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="还款时间" prop="paybackTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.paybackTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择还款时间">
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
          v-hasPermi="['loans:LoansInfo:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['loans:LoansInfo:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['loans:LoansInfo:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-col :span="1.5">
          <el-button
            type="success"
            icon="el-icon-edit"
            size="mini"
            :disabled="multiple"
            @click="handleBatchEnable"
            v-hasPermi="['loans:LoansInfo:check']"
          >通过</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            icon="el-icon-warning-outline"
            size="mini"
            :disabled="multiple"
            @click="handleBatchBanner"
            v-hasPermi="['loans:LoansInfo:check']"
          >驳回</el-button>
        </el-col>
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['loans:LoansInfo:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="LoansInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="用户id" align="center" prop="uid" />
      <el-table-column label="借款金额" align="center" prop="amount" />
      <el-table-column label="利息金额" align="center" prop="interestAmount" />
      <el-table-column label="最低还款费率(%)" align="center" prop="minRepaymentRate" min-width="180"/>
      <el-table-column label="总还款金额" align="center" prop="totalAmount" />
      <el-table-column label="已偿还金额" align="center" prop="repaidAmount" />
      <el-table-column label="实际充值金额" align="center" prop="rechargeAmount" />
      <el-table-column label="借款天数" align="center" prop="loansNumber"/>
      <el-table-column label="累計充值" align="center" prop="totalRecharge"/>
      <el-table-column label="累計提現" align="center" prop="totalWithdraw"/>
      <el-table-column label="借贷状态" align="center" prop="status" >
              <template slot-scope="scope">
                    <span v-html="loansStatusFormat(scope.row)"></span>
                  </template>
      </el-table-column>
      <el-table-column label="还款时间" align="center" prop="paybackTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.paybackTime, '{y}-{m}-{d} {h}:{m}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{m}:{s}') }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['loans:LoansInfo:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['loans:LoansInfo:remove']"
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

    <!-- 添加或修改借款信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户id" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="借款金额" prop="amount">
          <el-input v-model="form.amount" placeholder="请输入借款金额" />
        </el-form-item>
        <el-form-item label="利息金额" prop="interestAmount">
          <el-input v-model="form.interestAmount" placeholder="请输入利息金额" />
        </el-form-item>
        <el-form-item label="总还款金额" prop="totalAmount">
          <el-input v-model="form.totalAmount" placeholder="请输入总还款金额" />
        </el-form-item>
        <el-form-item label="已偿还金额" prop="repaidAmount">
          <el-input v-model="form.repaidAmount" placeholder="请输入已偿还金额" />
        </el-form-item>
        <el-form-item label="实际充值金额" prop="repaidAmount">
          <el-input v-model="form.rechargeAmount" placeholder="请输入已偿还金额" />
        </el-form-item>
        <el-form-item label="借款天数" prop="loansNumber">
          <el-input v-model="form.loansNumber" placeholder="请输入借款天数" />
        </el-form-item>

        <el-form-item label="1-申请借款，2-审核失败，3-待还款，4-已还款未审核，5-还款成功">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="还款时间" prop="paybackTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.paybackTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择还款时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="batchEnableTitle" :visible.sync="batchEnableOpen" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="ID" >
          <el-input v-model="form.ids" disabled/>
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
    <el-dialog :title="batchRejectTitle" :visible.sync="batchRejectOpen" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="ID" >
          <el-input v-model="form.ids" disabled/>
        </el-form-item>
      </el-form>
      <div slot="footer" >
        <el-button type="primary" @click="submitBatchRejectForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listLoansInfo, getLoansInfo, delLoansInfo, addLoansInfo, updateLoansInfo, exportLoansInfo, batchCheck } from "@/api/bigo/loansInfo";

export default {
  name: "LoansInfo",
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
      // 借款信息表格数据
      LoansInfoList: [],
      loansNumberOptions: [],
      loansStatusOptions: [],
      // 弹出层标题
      title: "",
      batchRejectTitle: "批量驳回",
      batchEnableTitle: "批量通过",
      // 是否显示弹出层
      open: false,
      batchEnableOpen: false,
      batchRejectOpen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        uid: undefined,
        amount: undefined,
        interestAmount: undefined,
        totalAmount: undefined,
        repaidAmount: undefined,
        loansNumber: undefined,
        status: undefined,
        paybackTime: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        uid: [
          { required: true, message: "用户id不能为空", trigger: "blur" }
        ],
        amount: [
          { required: true, message: "借款金额不能为空", trigger: "blur" }
        ],
        interestAmount: [
          { required: true, message: "利息金额不能为空", trigger: "blur" }
        ],
        totalAmount: [
          { required: true, message: "总还款金额不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("bigo_loans_number").then(response => {
      this.loansNumberOptions = response.data;
    });
    this.getDicts("bigo_loans_status").then(response => {
      this.loansStatusOptions = response.data;
    });
  },
  methods: {
    /** 查询借款信息列表 */
    getList() {
      this.loading = true;
      listLoansInfo(this.queryParams).then(response => {
        this.LoansInfoList = response.rows;
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
        uid: undefined,
        amount: undefined,
        interestAmount: undefined,
        totalAmount: undefined,
        repaidAmount: undefined,
        loansNumber: undefined,
        status: "0",
        paybackTime: undefined,
        createTime: undefined
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
      this.title = "添加借款信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getLoansInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改借款信息";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateLoansInfo(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addLoansInfo(this.form).then(response => {
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
      this.$confirm('是否确认删除借款信息编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delLoansInfo(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有借款信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportLoansInfo(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    loansStatusFormat(row, column) {
      // return this.selectDictLabel(this.loansStatusOptions, row.status);
      if(row.status == 1){
        return '<font color="black">'+ '申请借款' +'</font>'
      }else if(row.status == 2){
        return '<font color="red">'+ '审核失败' +'</font>'
      }else if(row.status == 3){
        return '<font color="blue">'+ '待还款' +'</font>'
      }else if(row.status == 4){
        return '<font color="green">'+ '还款成功' +'</font>'
      }
      return '-';
    },
    handleBatchEnable(row) {
      this.reset();
      this.form.ids = this.ids;
      this.batchEnableOpen = true;
    },
    /** 通过按钮操作 */
    submitBatchEnableForm: function() {
      this.form.status = 3;
      batchCheck(this.form).then(response => {
        if (response.code === 200) {
          this.msgSuccess("批量通过成功");
          this.batchEnableOpen = false;
          this.reset();
          this.getList();
        }
      });
    },
    /** 驳回按钮操作 */
    handleBatchBanner(row) {
      this.reset();
      this.form.ids = this.ids;
      this.batchRejectOpen = true;
    },
    submitBatchRejectForm: function() {
      this.form.checkStatus = 2;
      batchCheck(this.form).then(response => {
        if (response.code === 200) {
          this.msgSuccess("驳回成功");
          this.batchRejectOpen = false;
          this.reset();
          this.getList();
        }
      });
    },
  }
};
</script>
