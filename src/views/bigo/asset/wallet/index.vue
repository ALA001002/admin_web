<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="用户ID" prop="uid">
        <el-input
          v-model="queryParams.uids"
          placeholder="请输入用户ID"
          clearable
          size="small"
          style="width: 720px"
        />
      </el-form-item>
      <el-form-item label="代理ID" prop="agentId">
        <el-input
          v-model="queryParams.agentId"
          placeholder="请输入代理ID"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="用户账号" prop="username">
        <el-input
          v-model="queryParams.username"
          placeholder="请输入用户账号"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="币种" prop="currency">
        <el-select
          v-model="queryParams.currency"
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
          @click="handleAddBalance"
          v-hasPermi="['bigo:wallet:balance']"
        >钱包充币</el-button>
      </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            icon="el-icon-shopping-cart-2"
            size="mini"
            @click="handleBuyProduct"
            v-hasPermi="['bigo:wallet:buyProduct']"
          >购买理财</el-button>
        </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="success"-->
<!--          icon="el-icon-edit"-->
<!--          size="mini"-->
<!--          :disabled="singleEnable"-->
<!--          @click="handleScheduling"-->
<!--          v-hasPermi="['bigo:wallet:balance']"-->
<!--        >币种调度</el-button>-->
<!--      </el-col>-->

     <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          @click="btcCollection"
          v-hasPermi="['bigo:wallet:collection']"
        >归集</el-button>
      </el-col>
    </el-row>

    <el-table ref="walletTable" v-loading="loading" :data="walletList" stripe
              @selection-change="handleSelectionChange"
      >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="钱包ID" prop="id" width="120" />
      <el-table-column label="用户ID" prop="uid"  />
      <el-table-column label="用户账号" prop="username"  />
      <el-table-column label="账号类型" prop="userStatus" width="120" >
        <template slot-scope="scope">
          <span v-html="userStatusFormat(scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column label="币种" prop="currency" width="150" />
      <el-table-column label="余额" prop="balance" />
      <el-table-column label="冻结" prop="frozen" />
      <el-table-column label="创建时间" align="center" prop="createTime">
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

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="钱包ID" prop="id">
          <el-input type="text" v-model="form.ids" disabled />
        </el-form-item>
        <el-form-item label="调账数量" prop="dictType">
          <el-input v-model="form.amount" :min="0" placeholder="请输入数量" type="number"/>
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
        <el-form-item label="选择调仓类型" prop="dictType">
          <el-select v-model="form.editRelocateType">
            <el-option
              v-for="item in relocateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="谷歌验证码" prop="dictType">
          <el-input v-model="form.googleCaptcha" placeholder="请输入谷歌验证码" type="number"/>
        </el-form-item>
      </el-form>
<!--      <el-link icon="el-icon-warn" type="danger" disabled>注意：此功能將计</el-link>-->
      <div slot="footer" >
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="btcTitle" :visible.sync="btcOpen" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <!-- <el-form-item label="BTC数量" prop="dictType" >
          <el-input v-model="btcBal" disabled/>
        </el-form-item> -->
<!--        <el-form-item label="归集地址" prop="toAddress">-->
<!--          <el-input v-model="toAddress" placeholder="请输入归集地址" />-->
<!--        </el-form-item>-->
        <!-- <el-form-item label="归集数量" prop="toAddress">
          <el-input v-model="num" placeholder="请输入归集数量" />
        </el-form-item>
        <el-form-item label="超级密码" prop="superPassword">
          <el-input v-model="superPassword" placeholder="请输入超级密码" type="password"/>
        </el-form-item> -->
      </el-form>
      <div slot="footer" >
        <el-button type="primary" @click="submitBtcForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="buyProductTitle" :visible.sync="buyProductOpen" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="钱包ID" prop="id">
          <el-input type="text" v-model="form.ids" disabled />
        </el-form-item>
        <el-form-item label="选择产品" prop="dictType">
          <el-select v-model="form.productId">
            <el-option
              v-for="item in productOptions"
              :key="item.id"
              :label="item.productName+'('+item.profitTime+'天)'"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!--      <el-link icon="el-icon-warn" type="danger" disabled>注意：此功能將计</el-link>-->
      <div slot="footer" >
        <el-button type="primary" @click="submitBuyProductForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listWallet,addBalance,btcBalance,collection,scheduling, listProductInfo,buyProductAll } from "@/api/bigo/wallet";

export default {
  name: "wallet",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      title: '内部钱包充币',
      schedulingTitle:'币种调度',
      btcTitle: 'BTC归集',
      // 非单个禁用
      single: true,
      singleEnable: true,
      // 是否显示弹出层
      open: false,
      btcOpen: false,
      schedulingOpen: false,
      buyProductOpen: false,
      buyProductTitle: '购买理财',
      productOptions: [],
      selectWallet: {},
      // 角色表格数据
      walletList: [],
      ids: [],
      // 表单参数
      form: {},
      // 日期范围
      dateRange: [],
      // 币种数据字典
      coinOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        uid: undefined,
        currency: undefined,
        type: 0,
        username: undefined
      },
      //btc钱包剩余数量
      btcBal: "",
      toAddress: "",
      superPassword: "",
      num:"",
      // 表单校验
      rules: {
        ids: [
          { required: true, message: "请选择钱包", trigger: "blur" }
        ],
        amount: [
          { required: true, message: "数量不能为空", trigger: "blur" }
        ],
        editType: [
          { required: true, message: "请选择类型", trigger: "blur" }
        ],
        editRelocateType: [
          { required: true, message: "请选择类型", trigger: "blur" }
        ]
      },
      options: [{
        value: 19,
        label: '锁仓'
      },{
        value: 15,
        label: '释放'
      },{
        value: 10,
        label: '充币'
      },{
        value: 16,
        label: '扣除'
      },{
          value: 11,
          label: '模拟实冲'
        }],
      relocateOptions: [{
        value: 1,
        label: '正常余额'
      },{
        value: 2,
        label: '锁仓余额'
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
      listWallet(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.walletList = response.rows;
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
    handleAddBalance() {
      this.reset();
      this.form.ids = this.ids;
      this.open = true;
    },
    handleScheduling() {
      this.reset();
      this.form.id = this.selectWallet.id;
      this.schedulingOpen = true;
    },
    btcCollection() {
      this.reset();
      this.getBtcBalance();
      this.btcOpen = true;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.btcOpen = false;
      this.buyProductOpen = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        ids: undefined,
        amount: undefined,
        editType: undefined,
        editRelocateType: undefined,
        googleCaptcha: undefined,
        productId: undefined
      };
      this.resetForm("form");
    },
    getBtcBalance: function() {
      btcBalance().then(response => {
        if (response.code === 200) {
          this.btcBal = response.data;
        }
      });
    },
    /** 提交btc归集按钮 */
    submitBtcForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          collection().then(response => {
            if (response.code === 200) {
              this.msgSuccess("归集成功");
              this.btcOpen = false;
              this.getList();
            }
          });
        }
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if(this.form.amount < 0.000001){
            alert("充币数量不能小于0.000001");
            return;
          }
          addBalance(this.form.ids, this.form.amount, this.form.editType, this.form.editRelocateType, this.form.googleCaptcha).then(response => {
            if (response.code === 200) {
              this.msgSuccess("充币成功");
              this.open = false;
              this.reset();
              this.getList();
            }
          });
        }
      });
    },
    submitBuyProductForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          buyProductAll(this.form.ids, this.form.productId).then(response => {
            if (response.code === 200) {
              this.msgSuccess("购入成功");
              this.buyProductOpen = false;
              this.getList();
            }
          });
        }
      });
    },
   /* submitSchedulingForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if(this.form.amount < 0.000001){
            alert("数量不能小于0.000001");
            return;
          }
          scheduling(this.form.id, this.form.amount, this.form.editType).then(response => {
            if (response.code === 200) {
              this.msgSuccess("调仓成功");
              this.schedulingOpen = false;
              this.getList();
            }
          });
        }
      });
    },*/
    handleSelectionChange(row) {
      this.ids = row.map(item => item.id)
      this.single = row.length!=1
      this.multiple = !row.length
      /*     if (row.length > 1) {
        this.$refs.walletTable.clearSelection()
        this.$refs.walletTable.toggleRowSelection(row.pop())
      }
      this.selectWallet = row[0];
      if(row.length == 0){
        this.singleEnable = true;
      }else{
        this.singleEnable = false;
      }*/
    },
    onSelectAll () {
			this.$refs.walletTable.clearSelection()//这个是清除所有选择项，当选择全部时，清除所有选择项
    },
    // 账号状态显示
    userStatusFormat(row, column) {
      if(row.userStatus == 0 || row.userStatus == 1){
        return '<font color="green">' + '普通玩家' +'</font>'
      }else if(row.userStatus == 2){
        return '<font color="red">'+ '内部账号' +'</font>'
      }
      return '-';
    },
    handleBuyProduct() {
      this.reset();
      listProductInfo().then(response => {
        this.productOptions = response.rows
      });
      this.form.ids = this.ids;
      this.buyProductOpen = true;
    },
  }
};
</script>
