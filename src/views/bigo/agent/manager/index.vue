<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="代理商ID" prop="agentId">
        <el-input
          v-model="queryParams.agentId"
          placeholder="请输入代理商ID"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="代理商名称" prop="agentName">
        <el-input
          v-model="queryParams.agentName"
          placeholder="请输入代理商名称"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="账号状态"
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
      <el-form-item label="注册时间">
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
          v-hasPermi="['bigo:agent:add']"
        >新增代理商</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-edit-outline"
          size="mini"
          :disabled="singleUpdate"
          @click="handleUpdate"
          v-hasPermi="['bigo:agent:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-warning-outline"
          size="mini"
          :disabled="singleBanner"
          @click="handleBanner"
          v-hasPermi="['bigo:agent:banner']"
        >冻结</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-check"
          size="mini"
          :disabled="singleEnable"
          @click="handleEnable"
          v-hasPermi="['bigo:agent:enable']"
        >解禁</el-button>
      </el-col>
<!--      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          @click="handleAddBalance"
          v-hasPermi="['bigo:wallet:balance']"
        >内部钱包充币</el-button>
      </el-col>-->
    </el-row>

    <el-table ref="agentTable" v-loading="loading" :data="agentList" stripe style="width: 100%"
      @selection-change="handleSelectionChange"
      @select-all="onSelectAll">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="代理商ID" prop="agentId" min-width="80"/>
      <el-table-column label="代理商名称" prop="agentName" min-width="120"/>
      <el-table-column label="登陆账号" prop="loginName" min-width="100"/>
      <el-table-column label="邀请码" prop="agentCode" min-width="80"/>
      <el-table-column label="状态" prop="status" width="80" >
        <template slot-scope="scope">
          <span v-html="statusFormat(scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column label="备付金(USDT)" prop="cashDeposit" min-width="110" />
      <el-table-column label="头寸分成比例" prop="feeShareRate" min-width="110">
        <template slot-scope="scope">
          <span>{{ rateFormat(scope.row.profitShareRate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易手续费分成比例" prop="feeShareRate" min-width="150">
        <template slot-scope="scope">
          <span>{{ rateFormat(scope.row.feeShareRate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="USDT余额" prop="usdtBalance" min-width="100" />
      <el-table-column label="ETH余额" prop="ethBalance" min-width="90" />
      <el-table-column label="COIN余额" prop="bigoBalance" min-width="90" />
      <el-table-column label="注册时间" align="center" prop="createTime" min-width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
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

    <!-- 添加代理商对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="auto">
        <el-row>
          <el-col :span="24">
            <el-form-item label="代理商名称" prop="nickName" >
              <el-input v-model="form.nickName" placeholder="请输入代理商名称" style="width:500"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="12">
            <el-form-item v-if="form.agentId == null" label="登录账号" prop="userName">
              <el-input v-model="form.userName" placeholder="请输入登录账号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.agentId == null" label="登录密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入登录密码" type="password" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="form.agentId == null" label="手机号码" prop="phoneNumber">
              <el-input v-model="form.phoneNumber" placeholder="请输入手机号码" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.agentId == null" label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="头寸分成比例" prop="profitShareRate">
              <el-input type="number" v-model.number="form.profitShareRate" placeholder="请设置头寸分成比例" maxlength="50" >
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="手续费分成比例" prop="feeShareRate">
              <el-input type="number" v-model.number="form.feeShareRate" placeholder="请设置手续费分成比例" maxlength="50" >
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item v-if="form.agentId == null" label="备付金" prop="cashDeposit">
              <el-input v-model.number="form.cashDeposit" type="number" placeholder="请输入备付金" >
                <template slot="append">USDT</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="rechargeTitle" :visible.sync="rechargeOpen" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="用户ID" prop="id">
          <el-input v-model="form.uid" placeholder="请输入内部用户ID"/>
        </el-form-item>
        <el-form-item label="充币数量" prop="dictType">
          <el-input v-model="form.amount" :min="0" placeholder="请输入充币数量" type="number"/>
        </el-form-item>
        <el-form-item label="选择币种" prop="dictType">
          <el-select v-model="form.currency">
            <el-option
              v-for="dict in coinOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="选择类型" prop="dictType">
          <el-select v-model="form.editType">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-link icon="el-icon-warn" type="danger" disabled>注意：只有内部账号可以使用此功能充币</el-link>
      <div slot="footer" >
        <el-button type="primary" @click="rechargeSubmitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
import { listAgent, addAgent, updateAgent,changeStatus,recharge } from "@/api/bigo/agent";

export default {
  name: "agent",
  data() {
    return {
      // 遮罩层
      loading: true,
      singleBanner: true,
      singleEnable: true,
      singleUpdate:true,
      selectAgent: null,
      // 弹出层标题
      title: "",
      rechargeTitle: "",
      // 是否显示弹出层
      open: false,
      rechargeOpen: false,
      // 总条数
      total: 0,
      // 角色表格数据
      agentList: [],
      // 日期范围
      dateRange: [],
      // 币种数据字典
      coinOptions: [],
      // 状态数据
      statusOptions: [
        {dictLabel: "正常", dictValue: 0},
        {dictLabel: "冻结", dictValue: 1}
      ],
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        agentId: undefined,
        agentName: undefined,
        status: undefined
      },
      // 表单校验
      rules: {
        userName: [
          { required: true, message: "登录名称不能为空", trigger: "blur" }
        ],
        nickName: [
          { required: true, message: "代理商名称不能为空", trigger: "blur" }
        ],
        profitShareRate: [
          { required: true, message: "头寸分成比例不能为空", trigger: "blur" },
          {
            type: "number",
            message: "头寸分成比例不合法",
            min: 0.1,
            max: 100
          }
        ],
        feeShareRate: [
          { required: true, message: "手续费分成比例不能为空", trigger: "blur" },
          {
            type: "number",
            message: "手续费分成比例不合法",
            min: 0.1,
            max: 100
          }
        ],
        cashDeposit: [
          { required: true, message: "备付金不能为空", trigger: "blur" },
          {
            type: "number",
            message: "备付金数量不合法",
            min: 1,
            max: 99999999
          }
        ],
        password: [
          { required: true, message: "用户密码不能为空", trigger: "blur" }
        ],
        email: [
          { required: true, message: "邮箱地址不能为空", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phoneNumber: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      },
      options: [{
        value: 1,
        label: '增加'
      },{
        value: 19,
        label: '扣除'
      }],
      relocateOptions: [{
        value: 1,
        label: '正常余额'
      },{
        value: 2,
        label: '冻结余额'
      }]
    };
  },
  created() {
    this.getList();
    this.getDicts("bigo_coin_type").then(response => {
      this.coinOptions = response.data;
    });
  },
  methods: {
    /** 查询资产变更列表 */
    getList() {
      this.loading = true;
      listAgent(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.agentList = response.rows;
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
    // 比例数值格式化
    rateFormat(rate) {
      return rate * 100 + "%";
    },
    // 代理商状态显示
    statusFormat(row, column) {
      if(row.status == 0){
        return '<font color="green">' + '正常' +'</font>'
      }else if(row.status == 1){
        return '<font color="red">'+ '冻结' +'</font>'
      }
      return '-';
    },
    onSelectAll () {
			this.$refs.agentTable.clearSelection()//这个是清除所有选择项，当选择全部时，清除所有选择项
    },
    handleAddBalance() {
      this.reset();
      this.rechargeOpen = true;
    },
    handleSelectionChange(row) {
      if(row.length == 1){
        this.selectAgent = row[0];
        if(this.selectAgent.status == 0){
          this.singleBanner = false;
          this.singleEnable = true;
        }else if(this.selectAgent.status == 1){
          this.singleBanner = true;
          this.singleEnable = false;
        }
        this.singleUpdate = false;
      }else{
        this.singleBanner = true;
        this.singleEnable = true;
        this.singleUpdate = true;
      }
    },
    /** 禁用按钮操作 */
    handleBanner(row) {
      const agentId = row.agentId || this.selectAgent.agentId;
      this.$confirm('是否冻结ID为"' + agentId + '"的代理商?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeStatus(agentId, 1);
        }).then(() => {
          this.getList();
          this.msgSuccess("冻结成功");
        }).catch(function() {});
    },
    /** 解禁按钮操作 */
    handleEnable(row) {
      const agentId = row.agentId || this.selectAgent.agentId;
      this.$confirm('是否解禁ID为"' + agentId + '"的代理商?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeStatus(agentId, 0);
        }).then(() => {
          this.getList();
          this.msgSuccess("解禁成功");
        }).catch(function() {});
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.rechargeOpen = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        agentId: undefined,
        userName: undefined,
        nickName: undefined,
        password: undefined,
        phoneNumber: undefined,
        email: undefined,
        feeShareRate: undefined,
        profitShareRate: undefined,
        cashDeposit:undefined,
        uid:undefined,
        currency:undefined,
        amount:undefined,
        editType:undefined
      };
      this.resetForm("form");
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let formData = this.form;
          formData.feeShareRate = this.form.feeShareRate/100;
          formData.profitShareRate = this.form.profitShareRate/100;
          if (this.form.agentId != undefined) {
            updateAgent(formData).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addAgent(formData).then(response => {
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
    rechargeSubmitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          console.log(this.form.uid)
          recharge(this.form.uid,this.form.amount,this.form.currency,this.form.editType).then(response => {
            if (response.code === 200) {
              this.msgSuccess("内部账号充值成功");
              this.rechargeOpen = false;
              this.getList();
            }
          });
        }
      });
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加代理商";
    },
    /** 修改按钮操作 */
    handleUpdate() {
      this.reset();
      this.form.agentId = this.selectAgent.agentId;
      this.form.feeShareRate = this.selectAgent.feeShareRate * 100;
      this.form.profitShareRate = this.selectAgent.profitShareRate * 100;
      this.form.nickName = this.selectAgent.agentName;
      this.open = true;
      this.title = "修改代理商信息";
    },
  }
};
</script>
