<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="用户ID" prop="uid">
        <el-input
          v-model="queryParams.uid"
          placeholder="请输入用户ID"
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
      </el-form-item>
      <el-form-item label="认证状态" prop="authStatus">
        <el-select
          v-model="queryParams.authStatus"
          placeholder="认证状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in authStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
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
          type="danger"
          icon="el-icon-warning-outline"
          size="mini"
          v-hasPermi="['bigo:user:batchCheckAuthStatus']"
          @click="handleBatchRejecEnable"
        >批量驳回</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          v-hasPermi="['bigo:user:batchCheckAuthStatus']"
          @click="handleBatchPassEnable"
        >批量通过</el-button>
      </el-col>
    </el-row>

    <el-table ref="userTable" v-loading="loading" :data="bigoUserList" stripe style="width: 100%"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="用户ID" prop="uid" width="120"/>
      <el-table-column label="登录账号" prop="username" min-width="180" />
      <el-table-column label="真实姓名" prop="realName"  />
      <el-table-column label="身份证" prop="idNum" min-width="220" />
      <el-table-column label="护照" prop="passport" min-width="220" />
      <el-table-column label="认证图片" prop="imgList" min-width="520">
        <template slot-scope="scope">
              <el-popover placement="right" title="" trigger="hover" :key='index' v-for="(url,index) in scope.row.imgList">
                <div style="display: flex;flex-direction: column;align-items: center;justify-content: center">
                  <span><img @click="()=>{
                    rotates[url] = rotates[url] ? rotates[url] + 90 : 90
                    rotates = {...rotates}
                  }" src="../../../assets/image/rotate.png" alt="" style="width:50px;height: 50px;"/></span>
                  <img :src="url"  :style="{height: '500px',width: '500px',transform:`rotate(${rotates[url]||0}deg)`}"/>
                </div>
                <img slot="reference" :src="url" :alt="url" style="height: 50px;width: 150px;pedding:5px">
              </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="提交時間" align="center" prop="updateTime" width="180"/>
      <el-table-column label="认证状态" prop="authStatus" width="120" >
        <template slot-scope="scope">
          <span v-html="authStatusFormat(scope.row)"></span>
        </template>
      </el-table-column>
<!--      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="120">
        <template slot-scope="scope" v-if="scope.row.authStatus == 1">
          <el-button
            size="mini"
            type="text"
            :disabled="scope.row.authStatus != 1"
            icon="el-icon-warning-outline"
            @click="handleBanner(scope.row)"
            v-hasPermi="['bigo:user:checkAuthStatus']"
          >驳回</el-button>
          <el-button
            size="mini"
            type="text"
            :disabled="scope.row.authStatus != 1"
            icon="el-icon-edit"
            @click="handleEnable(scope.row)"
            v-hasPermi="['bigo:user:checkAuthStatus']"
          >通过</el-button>
        </template>
      </el-table-column>-->
    </el-table>

    <el-dialog title="批量驳回" :visible.sync="batchRejectOpen" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="ID" >
          <el-input v-model="form.ids" disabled/>
        </el-form-item>
        <el-form-item label="驳回原因" >
          <el-input type="textarea" v-model="form.authRationale"/>
        </el-form-item>
      </el-form>
      <div slot="footer" >
        <el-button type="primary" @click="submitBatchRejectForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="批量通过" :visible.sync="batchPassOpen" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="ID" >
          <el-input v-model="form.ids" disabled/>
        </el-form-item>
      </el-form>
      <div slot="footer" >
        <el-button type="primary" @click="submitBatchPassForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

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
import { authListBigoUser, checkAuthStatus,batchCheckAuthStatus } from "@/api/bigo/bigoUser";

export default {
  name: "bigoUser",
  data() {
    return {
      radio:"",
      rotates:{},
      singleBanner: true,
      singleEnable: true,
      batchRejectOpen: false,
      batchPassOpen: false,
      selectUser: {},
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 角色表格数据
      bigoUserList: [],
      // 弹出层标题
      title: "",
      // 日期范围
      dateRange: [],
      // 状态数据字典
      authStatusOptions: [
        {dictLabel: '待审核', dictValue: 1},
        {dictLabel: '认证成功', dictValue: 2},
        {dictLabel: '认证失败', dictValue: 3}
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        uid: undefined,
        username: undefined,
        authStatus: 1,
        authFlag: 1
      },
      // 表单参数
      form: {}
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询资产变更列表 */
    getList() {
      this.loading = true;
      authListBigoUser(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.bigoUserList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    cancel() {
      this.batchRejectOpen = false;
      this.batchPassOpen = false;
      this.reset();
    },
    reset() {
      this.form = {
        id: undefined,
        ids: undefined,
        authRationale: undefined,
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
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    tableRowClassName({row, rowIndex}) {
      if (row.authStatus == 3) {
        return 'warning-row';
      } else if (row.authStatus == 2) {
        return 'success-row';
      }
      return '';
    },
    onSelectAll () {
			this.$refs.userTable.clearSelection()//这个是清除所有选择项，当选择全部时，清除所有选择项
		},
    // 认证状态显示
    authStatusFormat(row, column) {
      if(row.authStatus == 2){
        return '<font color="green">' + '已认证' +'</font>'
      }else if(row.authStatus == 3){
        return '<font color="red">'+ '认证失败' +'</font>'
      }else if(row.authStatus == 1){
        return '待审核'
      }
      return '未认证';
    },

    handleSelectionChange(row) {
      this.ids = row.map(item => item.uid)
      this.single = row.length!=1
      this.multiple = !row.length
      /*if (row.length > 1) {
        this.$refs.userTable.clearSelection()
        this.$refs.userTable.toggleRowSelection(row.pop())
      }
      this.selectUser = row[0];
      if(row.length == 0){
        this.singleBanner = true;
        this.singleEnable = true;
      }else{
        if(this.selectUser.authStatus == 1){
          this.singleBanner = false;
          this.singleEnable = false;
        }else{
          this.singleBanner = true;
          this.singleEnable = true;
        }
      }*/
    },
    /** 禁用按钮操作 */
    handleBanner(row) {
      /*const uid = row.uid || this.selectUser.uid;
      this.$confirm('是否驳回UID为"' + uid + '"用户的身份认证?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return checkAuthStatus(uid, 3);
        }).then(() => {
          this.getList();
          this.msgSuccess("驳回成功");
        }).catch(function() {});*/
      this.ids = row.uid
      this.reset();
      this.form.ids = this.ids;
      this.batchRejectOpen = true;
    },
    /** 解禁按钮操作 */
    handleEnable(row) {
 /*     const uid = row.uid || this.selectUser.uid;
      this.$confirm('是否通过UID为"' + uid + '"用户的身份认证?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return checkAuthStatus(uid, 2);
        }).then(() => {
          this.getList();
          this.msgSuccess("通过成功");
        }).catch(function() {});*/
      this.ids = row.uid
      this.reset();
      this.form.ids = this.ids;
      this.batchPassOpen = true;
    },
    handleBatchRejecEnable(row) {
      this.reset();
      this.form.ids = this.ids;
      this.batchRejectOpen = true;
    },
    handleBatchPassEnable(row) {
      this.reset();
      this.form.ids = this.ids;
      this.batchPassOpen = true;
    },
    submitBatchRejectForm: function() {
      batchCheckAuthStatus(this.form.ids, 3,this.form.authRationale).then(response => {
        if (response.code === 200) {
          this.msgSuccess("批量驳回成功");
          this.batchRejectOpen = false;
          this.reset();
          this.getList();
        }
      });
    },
    submitBatchPassForm: function() {
      batchCheckAuthStatus(this.form.ids, 2,this.form.authRationale).then(response => {
        if (response.code === 200) {
          this.msgSuccess("批量通过成功");
          this.batchPassOpen = false;
          this.reset();
          this.getList();
        }
      });
    },
  }
};
</script>
