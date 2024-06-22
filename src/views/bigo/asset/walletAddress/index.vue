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
      <el-form-item label="地址" prop="address">
        <el-input
          v-model="queryParams.address"
          placeholder="请输入地址"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="币种" prop="coin">
        <el-input
          v-model="queryParams.coin"
          placeholder="请输入币种"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="余额>" prop="balance">
        <el-input
          v-model="queryParams.balance"
          placeholder="请输入余额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--<el-form-item label="余额" prop="balance">
        <el-input
          v-model="queryParams.balance"
          placeholder="请输入余额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <!--<el-form-item label="状态 0|待处理 1|处理中 2|成功 3|失败" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态 0|待处理 1|处理中 2|成功 3|失败" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>-->
     <!-- <el-form-item label="交易哈希" prop="hash">
        <el-input
          v-model="queryParams.hash"
          placeholder="请输入交易哈希"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
     <!-- <el-form-item label="检查时间" prop="checkTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.checkTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择检查时间">
        </el-date-picker>
      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!--<el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['wallet:walletAddress:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['wallet:walletAddress:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['wallet:walletAddress:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['wallet:walletAddress:export']"
        >导出</el-button>
      </el-col>
    </el-row>-->


    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleManualScoring"
          v-hasPermi="['wallet:walletAddress:manualScoring']"
        >人工充值</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['wallet:walletAddress:export']"
        >导出</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="walletAddressList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" width="100"/>
      <el-table-column label="用户id" align="center" prop="uid" />
      <el-table-column label="地址" align="center" prop="address" />
      <el-table-column label="币种" align="center" prop="coin" />
      <el-table-column label="余额" align="center" prop="balance" />
      <!--<el-table-column label="状态 0|待处理 1|处理中 2|成功 3|失败" align="center" prop="status" />
      <el-table-column label="交易哈希" align="center" prop="hash" />
      <el-table-column label="错误" align="center" prop="error" />
      <el-table-column label="检查时间" align="center" prop="checkTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.checkTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            :disabled="scope.row.balance <= 0 || scope.row.coin == 'BTC'"
            icon="el-icon-edit"
            @click="handleCollection(scope.row)"
            v-hasPermi="['wallet:walletAddress:edit']"
          >手动归集</el-button>
          <!--<el-button-->
            <!--size="mini"-->
            <!--type="text"-->
            <!--icon="el-icon-delete"-->
            <!--@click="handleDelete(scope.row)"-->
            <!--v-hasPermi="['wallet:walletAddress:remove']"-->
          <!--&gt;删除</el-button>-->
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

    <!-- 添加或修改钱包地址对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-input v-model="form.id" type="hidden" />
        <el-form-item label="用户id" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入用户id" disabled="true"/>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" disabled="true"/>
        </el-form-item>
        <el-form-item label="币种" prop="coin">
          <el-input v-model="form.coin" placeholder="请输入币种" disabled="true"/>
        </el-form-item>
        <el-form-item label="余额" prop="balance">
          <el-input v-model="form.balance" disabled="true"/>
        </el-form-item>
        <el-form-item label="ETH余额" prop="balance">
          <el-input v-model="form.ethBalance"  disabled="true"/>
        </el-form-item>
        <el-form-item label="GasPrice" prop="balance">
          <el-input v-model="form.suggestGasPrice" placeholder=""/>
        </el-form-item>
        <el-form-item label="eth手续费" prop="balance">
          <el-input v-model="form.fee" placeholder="" disabled="true"/>
        </el-form-item>
        <el-form-item label="折合U" prop="balance">
          <el-input v-model="form.uFee" placeholder="" disabled="true"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitCollectionForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="manualScoringTitle" :visible.sync="manualScoringOpen" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-input v-model="form.id" type="hidden" />
        <el-form-item label="用户id" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入用户id" disabled="true"/>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" disabled="true"/>
        </el-form-item>
        <el-form-item label="币种" prop="coin">
          <el-input v-model="form.coin" placeholder="请输入币种" disabled="true"/>
        </el-form-item>
        <el-form-item label="來源地址" prop="fromAddress">
          <el-input v-model="form.fromAddress" placeholder="請輸入來源地址"/>
        </el-form-item>
        <el-form-item label="Hash" prop="hash">
          <el-input v-model="form.hash" placeholder=""/>
        </el-form-item>
        <el-form-item label="区块高度" prop="blockNum">
          <el-input v-model="form.blockNum"  placeholder=""/>
        </el-form-item>
        <el-form-item label="充值数量" prop="rechargeNum">
          <el-input v-model="form.rechargeNum" placeholder=""/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitManualScoringForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listWalletAddress, getWalletAddress, getGasPrice, collection, exportWalletAddress, manualScoring} from "@/api/bigo/walletAddress";

export default {
  name: "WalletAddress",
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
      // 钱包地址表格数据
      walletAddressList: [],
      // 弹出层标题
      title: "",
      manualScoringTitle: "人工充值",
      // 是否显示弹出层
      open: false,
      manualScoringOpen: false,
      // 币种字典
      coinOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        uid: undefined,
        address: undefined,
        coin: undefined,
        balance: undefined,
        status: undefined,
        hash: undefined,
        error: undefined,
        checkTime: undefined
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
    this.getDicts("bigo_coin_type").then(response => {
      this.coinOptions = response.data;
    });
  },
  methods: {
    /** 查询钱包地址列表 */
    getList() {
      this.loading = true;
      listWalletAddress(this.queryParams).then(response => {
        this.walletAddressList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 币种字典翻译
    coinFormat(row, column) {
      return this.selectDictLabel(this.coinOptions, row.coin);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.manualScoringOpen = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        uid: undefined,
        address: undefined,
        coin: undefined,
        balance: undefined,
        suggestGasPrice: undefined,
        fee: undefined,
        uFee: undefined,
        ethBalance: undefined,
        blockNum: undefined,
        hash: undefined,
        rechargeNum: undefined,
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
    handleCollection (row) {
      this.reset();
      this.getGasPrice(row);
      this.open = true;
      this.title = "手动归集";
    },
    /** 获取手续费 */
    getGasPrice: function(row) {
      const id = row.id || this.ids
      const uid = row.uid
      getGasPrice(id, uid).then(response => {
        if (response.code === 200) {
          this.form.id = id,
          this.form.uid = row.uid,
          this.form.address = row.address,
          this.form.coin = row.coin,
          this.form.balance = row.balance,
          this.form.suggestGasPrice = response.data.suggest_gas_price;
          this.form.fee = response.data.fee;
          this.form.uFee = response.data.uFee;
          this.form.ethBalance = response.data.ethBalance;
        }
      });
    },
    submitCollectionForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const id = this.form.id;
          const gasPrice = this.form.suggestGasPrice;
          collection(id, gasPrice).then(response => {
            if (response.code === 200) {
              this.msgSuccess("归集中,请上EtherScan查询归集结果！");
              this.open = false;
              this.getList();
            }
          });
        }
      });
    },
    /** 提交按钮 */
/*    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateWalletAddress(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addWalletAddress(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }
            });
          }
        }
      });
    },*/
    /** 删除按钮操作 */
/*    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除钱包地址编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delWalletAddress(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },*/

    handleManualScoring(row) {
      this.reset();

      const id = row.id || this.ids
      getWalletAddress(id).then(response => {
        if (response.code === 200) {
            this.form.id = response.data.id,
            this.form.uid = response.data.uid,
            this.form.address = response.data.address,
            this.form.coin = response.data.coin
        }
      });
      this.manualScoringOpen = true;
    },
    submitManualScoringForm : function() {
      const id = this.form.id;
      const hash = this.form.hash;
      const blockNum = this.form.blockNum;
      const rechargeNum = this.form.rechargeNum;
      const fromAddress = this.form.fromAddress;
      manualScoring(id, fromAddress, hash, blockNum, rechargeNum).then(response => {
        if (response.code === 200) {
          this.msgSuccess("人工充值上分成功");
          this.manualScoringOpen = false;
          this.getList();
        }
      });
    },

    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有钱包地址数据?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportWalletAddress(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
