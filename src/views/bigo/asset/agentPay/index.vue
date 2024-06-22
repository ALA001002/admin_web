<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
<!--      <el-form-item label="类型" prop="checkStatus">
        <el-select
          v-model="queryParams.type"
          placeholder="类型"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>-->
<!--      <el-form-item label="状态" prop="checkStatus">
        <el-select
          v-model="queryParams.checkStatus"
          placeholder="审核状态"
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
      </el-form-item>-->
<!--      <el-form-item label="用户ID" prop="uids">
        <el-input
          v-model="queryParams.uids"
          placeholder="请输入用户ID"
          clearable
          size="small"
          style="width: 720px"
        />
      </el-form-item>-->
<!--      <el-form-item label="代理ID" prop="username">
        <el-input
          v-model="queryParams.agentId"
          placeholder="请输入用户代理ID"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="登录名" prop="username">
        <el-input
          v-model="queryParams.username"
          placeholder="请输入用户登录名"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>-->
<!--      <el-form-item label="币种" prop="coin">
        <el-select
          v-model="queryParams.coin"
          placeholder="币种"
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
      </el-form-item>-->
      <el-form-item label="收币地址" prop="username">
        <el-input
          v-model="queryParams.toAddress"
          placeholder="请输入收币地址"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="提交时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="审核时间">
        <el-date-picker
          v-model="auditDateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
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
          icon="el-icon-edit"
          size="mini"
          @click="handleBatchEnable"
          v-hasPermi="['bigo:withdraw:agentPay']"
        >手动代付</el-button>
      </el-col>
    </el-row>
<!--    <el-row :gutter="10" style="padding-top: 15px">
      <el-col :span="1.5" style="color: red">待审核：</el-col>
      <el-col :span="1.5"><font color="red">{{ auditRecordForm.unreviewedUSDT }}</font> USDT</el-col>
      <el-col :span="1.5"><font color="red">{{ auditRecordForm.unreviewedETH }}</font> ETH</el-col>
      <el-col :span="1.5"><font color="red">{{ auditRecordForm.unreviewedBTC }}</font> BTC</el-col>
      <el-col :span="1.5" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-col>
      <el-col :span="1.5" style="color: red">累计提现：</el-col>
      <el-col :span="1.5"><font color="red">{{ auditRecordForm.successUSDT }}</font> USDT</el-col>
      <el-col :span="1.5"><font color="red">{{ auditRecordForm.successETH }}</font> ETH</el-col>
      <el-col :span="1.5"><font color="red">{{ auditRecordForm.successBTC }}</font> BTC</el-col>
    </el-row>-->

    <el-table ref="withdraw" v-loading="loading" :data="bigoUserList" style="width: 100%;padding-top: 10px"
              @selection-change="handleSelectionChange">
<!--      <el-table-column type="selection" width="55" align="center" />-->
      <el-table-column label="记录ID" prop="id" width="80"/>
      <el-table-column label="币种" prop="coin" width="80" />
      <el-table-column label="类型" prop="type" width="80" >
        <template slot-scope="scope">
          <span v-html="typeFormat(scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" width="80" >
        <template slot-scope="scope">
          <span v-html="statusFormat(scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column label="金额" prop="money" width="120" />
      <el-table-column label="收币地址" prop="toAddress" min-width="390"/>
      <el-table-column label="备注" prop="remark"  min-width="100"/>
      <el-table-column label="提交时间" align="center" prop="createTime" min-width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核人" prop="operatorName"  min-width="100"/>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 添加或修改参数配置对话框 -->
<!--    <el-dialog :title="rejectTitle" :visible.sync="rejectOpen" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="ID" >
          <el-input v-model="form.id" disabled/>
        </el-form-item>
        <el-form-item label="用户ID" >
          <el-input v-model="form.uid" disabled/>
        </el-form-item>
        <el-form-item label="币种" >
          <el-input v-model="form.coin" disabled/>
        </el-form-item>
        <el-form-item label="金额" >
          <el-input v-model="form.money" disabled/>
        </el-form-item>
        <el-form-item label="提现地址" >
          <el-input v-model="form.toAddress" disabled/>
        </el-form-item>
        <el-form-item label="驳回原因" prop="error">
          <el-input v-model="form.error" placeholder="请输入驳回原因" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" >
        <el-button type="primary" @click="submitRejectForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    &lt;!&ndash; 添加或修改参数配置对话框 &ndash;&gt;
    <el-dialog :title="enableTitle" :visible.sync="enableOpen" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="ID" >
          <el-input v-model="form.id" disabled/>
        </el-form-item>
        <el-form-item label="币种" >
          <el-input v-model="form.coin" disabled/>
        </el-form-item>
        <el-form-item label="金额" >
          <el-input v-model="form.money" disabled/>
        </el-form-item>
        <el-form-item label="提现地址" >
          <el-input v-model="form.toAddress" disabled/>
        </el-form-item>
        <el-form-item label="谷歌验证码" prop="error">
          <el-input v-model="form.googleCaptcha" placeholder="请输入谷歌验证码" type="number"/>
        </el-form-item>
      </el-form>
      <div slot="footer" >
        <el-button type="primary" @click="submitEnableForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    &lt;!&ndash; 添加或修改参数配置对话框 &ndash;&gt;
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
    </el-dialog>-->

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="batchEnableTitle" :visible.sync="batchEnableOpen" width="800px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="金额" >
          <el-input v-model="form.money" />
        </el-form-item>
        <el-form-item label="提现地址">
          <el-input v-model="form.toAddressArr" type="textarea" placeholder="用逗号隔开"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" type="textarea"/>
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

<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>

<script>
import { listWithdraw, checkWithdraw, batchCheckWithdraw, auditRecord,offlinePay, agentPayWithdraw } from "@/api/bigo/withdraw";
import ClipboardJS from 'clipboard'
import VueQr from "vue-qr";

export default {
  name: "withdraw",
  data() {
    return {
      radio:"",
      config:{
        open:false,
        address:"",//显示的值、跳转的地址
      },
      singleBanner: true,
      singleEnable: true,
      selectWithdraw: {},
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 币种数据字典
      coinOptions: [],
      // 选中数组
      ids: [],
      // 表单参数
      form: {},
      // 角色表格数据
      bigoUserList: [],
      rejectOpen: false,
      enableOpen: false,
      batchRejectOpen: false,
      batchEnableOpen: false,
      // 弹出层标题
      title: "",
      rejectTitle: "驳回",
      enableTitle: '通过',
      batchRejectTitle: "批量驳回",
      batchEnableTitle: "批量通过",
      // 日期范围
      dateRange: [],
      auditDateRange: [],
      // 状态数据字典
      statusOptions: [
        {dictLabel: '待审核', dictValue: 0},
        {dictLabel: '已通过', dictValue: 1},
        {dictLabel: '已驳回', dictValue: 2}
      ],
      typeOptions: [
        {dictLabel: '内转', dictValue: 1},
        {dictLabel: '外提', dictValue: 2}
      ],
      // 等级数据字典
      levelOptions: [
        {dictLabel: 'Lv1', dictValue: 1},
        {dictLabel: 'Lv2', dictValue: 2},
        {dictLabel: 'Lv3', dictValue: 3}
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        uid: undefined,
        username: undefined,
        coin: undefined,
        type: 1
      },
      // 表单校验
      rules: {
      },
      auditRecordForm: {
        unreviewedUSDT: 0,
        unreviewedETH: 0,
        unreviewedBTC: 0,
        successUSDT: 0,
        successETH: 0,
        successBTC: 0,
      }
    };
  },
  created() {
    this.getList();
    this.getAuditRecord();
    this.getDicts("bigo_coin_type").then(response => {
      this.coinOptions = response.data;
    });
  },
  components:{
    VueQr
  },
  methods: {
    copy(){
      const clipboard = new ClipboardJS('#copyNode', {
      text: trigger => {
        const codeStr = this.generateCode()
        this.$notify({
          title: '成功',
          message: '代码已复制到剪切板，可粘贴。',
          type: 'success'
        })
        return codeStr
      }
    })
    clipboard.on('error', e => {
      this.$message.error('代码复制失败')
    })
    },
    offlinePay(id){
      const self = this
      offlinePay(id).then(
        response => {
          self.config.open = false
         Message.success("线下提现成功")
        }
      );
    },
    showQrCode(row){
      this.config = {open:true,address:row.toAddress}
    },
    getAuditRecord() {
      this.queryParams.auditBeginTime = "";
      this.queryParams.auditEndTime = "";
      if (null != this.auditDateRange && '' != this.auditDateRange) {
        this.queryParams.auditBeginTime = this.auditDateRange[0];
        this.queryParams.auditEndTime = this.auditDateRange[1];
      }
      auditRecord(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
            this.auditRecordForm = response.data;
        }
      );
    },
    /** 查询资产变更列表 */
    getList() {
      this.loading = true;
      this.queryParams.auditBeginTime = "";
      this.queryParams.auditEndTime = "";
      if (null != this.auditDateRange && '' != this.auditDateRange) {
        this.queryParams.auditBeginTime = this.auditDateRange[0];
        this.queryParams.auditEndTime = this.auditDateRange[1];
      }
      listWithdraw(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.bigoUserList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
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
    // 认证状态显示
    checkStatusFormat(row, column) {
      if(row.checkStatus == 0){
        return '待审核';
      }else if(row.checkStatus == 1){
        return '<font color="green">通过</font>';
      }else if(row.checkStatus == 2){
        return '<font color="red">驳回</font>';
      }
      return '未知状态';
    },
    onSelectAll () {
			this.$refs.withdraw.clearSelection()//这个是清除所有选择项，当选择全部时，清除所有选择项
		},
    handleSelectionChange(row) {
      this.ids = row.map(item => item.id)
      this.single = row.length!=1
      this.multiple = !row.length
    },
    // 取消按钮
    cancel() {
      this.rejectOpen = false;
      this.batchRejectOpen = false;
      this.batchEnableOpen = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        ids: undefined,
        uid: undefined,
        money: undefined,
        coin: undefined,
        toAddress: undefined,
        error: undefined,
        googleCaptcha: undefined,
        checkStatus: undefined,
        toAddressArr: undefined
      };
      this.resetForm("form");
    },
    /** 驳回按钮操作 */
    handleBanner(row) {
      this.reset();
      this.form.id = row.id || this.selectWithdraw.id;
      this.form.uid = row.uid;
      this.form.coin = row.coin;
      this.form.money = row.money;
      this.form.toAddress = row.toAddress;
      this.rejectOpen = true;
    },
    submitRejectForm: function() {
      this.form.checkStatus = 2;
      checkWithdraw(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess("驳回成功");
              this.rejectOpen = false;
              this.reset();
              this.getList();
            }
          });
    },

    handleEnable(row) {
      this.reset();
      this.form.id = row.id || this.selectWithdraw.id;
      this.form.uid = row.uid;
      this.form.coin = row.coin;
      this.form.money = row.money;
      this.form.toAddress = row.toAddress;
      this.enableOpen = true;
    },

    /** 通过按钮操作 */
    submitEnableForm: function() {
      this.form.checkStatus = 1;
      checkWithdraw(this.form).then(response => {
        if (response.code === 200) {
          this.msgSuccess("通过成功");
          this.enableOpen = false;
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
    handleBatchEnable(row) {
      this.reset();
      this.form.ids = this.ids;
      this.batchEnableOpen = true;
    },
    submitBatchRejectForm: function() {
      this.form.checkStatus = 2;
      batchCheckWithdraw(this.form).then(response => {
        if (response.code === 200) {
          this.msgSuccess("驳回成功");
          this.batchRejectOpen = false;
          this.reset();
          this.getList();
        }
      });
    },

    /** 通过按钮操作 */
    submitBatchEnableForm: function() {
      this.form.checkStatus = 1;
      agentPayWithdraw(this.form).then(response => {
        if (response.code === 200) {
          this.msgSuccess("手动代付成功");
          this.batchEnableOpen = false;
          this.reset();
          this.getList();
        }
      });
    },
    // 账号状态显示
    typeFormat(row, column) {
      if(row.type == 1){
        return '<font color="red">' + '手动代付' +'</font>'
      }
      return '-';
    },
    statusFormat(row, column) {
      if(row.checkStatus == 1){
        return '<font color="green">' + '代付成功' +'</font>'
      }else if (row.checkStatus == 0) {
        return '<font color="blue">' + '代付中' +'</font>'
      }else if (row.checkStatus == 2) {
        return '<font color="red">' + '代付失败' +'</font>'
      }
      return '-';
    },
    expand(index){
      this.bigoUserList[index].collapse = !this.bigoUserList[index].collapse
      this.bigoUserList = [...this.bigoUserList]
    }
  }
};
</script>
