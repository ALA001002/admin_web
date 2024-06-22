<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="用户ID" prop="uids">
        <el-input
          v-model="queryParams.uids"
          placeholder="请输入用户ID"
          clearable
          size="small"
          style="width: 720px"
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
      </el-form-item>
      <el-form-item label="昵称" prop="nickName">
        <el-input
          v-model="queryParams.nickName"
          placeholder="请输入用户昵称"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="币种" prop="coin">
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
      </el-form-item>
      <el-form-item label="状态" prop="checkStatus">
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
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-warning-outline"
          size="mini"
          @click="handleBatchBanner"
          v-hasPermi="['bigo:withdraw:check']"
        >驳回</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          @click="handleBatchEnable"
          v-hasPermi="['bigo:withdraw:check']"
        >通过</el-button>
      </el-col>
    </el-row>

    <el-table ref="withdraw" v-loading="loading" :data="bigoUserList" style="width: 100%"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="记录ID" prop="id" width="80"/>
      <el-table-column label="用户ID" prop="uid" width="80"/>
      <el-table-column label="登录账号" prop="username" width="180"/>
<!--      <el-table-column label="用户昵称" prop="nickName" width="120"/>-->
      <el-table-column label="币种" prop="coin" width="80" />
      <el-table-column label="金额" prop="money" width="120" />
      <el-table-column label="充值类型" align="center" prop="checkStatus" min-width="100">
        <template slot-scope="scope">
          <span v-html="rechargeFormat(scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column label="付款地址" prop="from" width="200" />
      <el-table-column label="充值地址" prop="toAddress" width="200" />
      <el-table-column label="充值凭证" prop="photo" min-width="350">
        <template slot-scope="scope">
            <viewer :images="scope.row.photo">
              <img  :src="scope.row.photo" :key="scope.row.photo" width="50">
            </viewer>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark"  min-width="100"/>
      <el-table-column label="审核状态" align="center" prop="checkStatus" min-width="100">
        <template slot-scope="scope">
          <span v-html="checkStatusFormat(scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" align="center" prop="createTime" min-width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="来源IP" prop="ipAddress"  min-width="120"/>
      <el-table-column label="来源地址" prop="position"  min-width="180"/>
      <el-table-column label="审核时间" align="center" prop="verifyTime" min-width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.verifyTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核人" prop="operatorName"  min-width="100"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="120" fixed="right">
        <template slot-scope="scope" v-if="scope.row.checkStatus == 0">
          <el-button
            size="mini"
            type="text"
            :disabled="scope.row.checkStatus != 0"
            icon="el-icon-warning-outline"
            @click="handleRechargeBanner(scope.row)"
            v-hasPermi="['bigo:withdraw:check']"
          >驳回</el-button>
          <el-button
            size="mini"
            type="text"
            :disabled="scope.row.checkStatus != 0"
            icon="el-icon-edit"
            @click="handleRechargeEnable(scope.row)"
            v-hasPermi="['bigo:withdraw:check']"
          >通过</el-button>
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
    <el-dialog :title="rejectTitle" :visible.sync="rejectOpen" width="500px" append-to-body :close-on-click-modal="false">
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
        <el-form-item label="驳回原因" prop="error">
          <el-input v-model="form.error" placeholder="请输入驳回原因" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" >
        <el-button type="primary" @click="submitRejectForm">确 定</el-button>
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
import { listRecharge, checkRecharge, batchCheckRecharge} from "@/api/bigo/withdraw";
import Vue from 'vue';
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

Vue.use(Viewer);
Viewer.setDefaults({
  Options: { "inline": true, "button": true, "navbar": true, "title": true, "toolbar": true, "tooltip": true, "movable": true, "zoomable": true, "rotatable": true, "scalable": true, "transition": true, "fullscreen": true, "keyboard": true, "url": "data-source" }
});
export default {
  name: "withdraw",
  data() {
    return {
      radio:"",
      singleBanner: true,
      singleEnable: true,
      selectWithdraw: {},
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 币种数据字典
      coinOptions: [],
      // 角色表格数据
      bigoUserList: [],
      // 弹出层标题
      title: "",
      // 日期范围
      dateRange: [],

      rejectOpen: false,
      batchRejectOpen: false,
      rejectTitle: "驳回",
      batchRejectTitle: "批量驳回",
      // 状态数据字典
      statusOptions: [
        {dictLabel: '待审核', dictValue: 0},
        {dictLabel: '已通过', dictValue: 1},
        {dictLabel: '已驳回', dictValue: 2}
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
        checkStatus: 0,
        nickName: undefined
      },
      // 表单校验
      rules: {
      },
      form: {}
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
      listRecharge(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.bigoUserList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 取消按钮
    cancel() {
      this.rejectOpen = false;
      this.batchRejectOpen = false;
      this.reset();
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
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        ids: undefined,
        uid: undefined,
        money: undefined,
        coin: undefined,
        error: undefined
      };
      this.resetForm("form");
    },
    rechargeFormat(row, column) {
      if(row.type == 4){
        return '线上充值';
      }else if(row.type == 5){
        return '线下充值';
      }else if(row.type == 6){
        return '人工存入';
      }
      return '未知状态';
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
    tableRowClassName({row, rowIndex}) {
      if (row.checkStatus == 2) {
        return 'warning-row';
      } else if (row.checkStatus == 1) {
        return 'success-row';
      }
      return '';
    },
    onSelectAll () {
			this.$refs.withdraw.clearSelection()//这个是清除所有选择项，当选择全部时，清除所有选择项
		},
    handleSelectionChange(row) {
      this.ids = row.map(item => item.id)
      this.single = row.length!=1
      this.multiple = !row.length
 /*     if (row.length > 1) {
        this.$refs.withdraw.clearSelection()
        this.$refs.withdraw.toggleRowSelection(row.pop())
      }
      this.selectWithdraw = row[0];
      if(row.length == 0){
        this.singleBanner = true;
        this.singleEnable = true;
      }else{
        if(this.selectWithdraw.checkStatus == 0){
          this.singleBanner = false;
          this.singleEnable = false;
        }else{
          this.singleBanner = true;
          this.singleEnable = true;
        }
      }*/
    },
    /** 驳回按钮操作 */
    handleRechargeBanner(row) {
      this.reset();
      this.form.id = row.id || this.selectWithdraw.id;
      this.form.uid = row.uid;
      this.form.coin = row.coin;
      this.form.money = row.money;
      this.form.toAddress = row.toAddress;
      this.rejectOpen = true;
     /* const id = row.id || this.selectWithdraw.id;
      this.$confirm('是否驳回记录ID为"' + id + '"的充币审核?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return checkRecharge(id, 2);
        }).then(() => {
          this.getList();
          this.msgSuccess("充币审核驳回成功");
        }).catch(function() {});*/
    },
    //提交驳回记录
    submitRejectForm: function() {
      checkRecharge(this.form.id, 2, this.form.error).then(response => {
        if (response.code === 200) {
          this.msgSuccess("驳回成功");
          this.rejectOpen = false;
          this.reset();
          this.getList();
        }
      });
    },
    /** 通过按钮操作 */
    handleRechargeEnable(row) {
      const id = row.id || this.selectWithdraw.id;
      this.$confirm('是否通过记录ID为"' + id + '"的充币审核?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return checkRecharge(id, 1);
        }).then(() => {
          this.getList();
          this.msgSuccess("充币审核通过成功");
        }).catch(function() {});
    },
    /** 批量驳回按钮操作 */
    handleBatchBanner(row) {
      this.reset();
      this.form.ids = this.ids;
      this.batchRejectOpen = true;
     /* const ids = row.id || this.ids;
      this.$confirm('是否批量驳回记录ID为"' + ids + '"的提币申请?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return batchCheckRecharge(ids, 2);
      }).then(() => {
        this.getList();
        this.msgSuccess("提币申请驳回成功");
      }).catch(function() {});*/
    },
    submitBatchRejectForm: function() {
      batchCheckRecharge(this.form.ids, 2, this.form.error).then(response => {
        if (response.code === 200) {
          this.msgSuccess("批量驳回成功");
          this.batchRejectOpen = false;
          this.reset();
          this.getList();
        }
      });
    },
    /** 通过按钮操作 */
    handleBatchEnable(row) {
      const id = row.id || this.ids;
      this.$confirm('是否批量通过记录ID为"' + id + '"的提币申请?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return batchCheckRecharge(id, 1);
      }).then(() => {
        this.getList();
        this.msgSuccess("批量提币申请通过成功");
      }).catch(function() {});
    }
  }
};
</script>
