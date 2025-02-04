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
      <el-form-item label="等级" prop="level">
        <el-select
          v-model="queryParams.level"
          placeholder="用户等级"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in levelOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="邀请人" prop="parentName">
        <el-input
          v-model="queryParams.parentName"
          placeholder="请输入邀请人登录名"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="用户状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="用户状态"
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
          type="danger"
          icon="el-icon-warning-outline"
          size="mini"
          :disabled="singleBanner"
          @click="handleBanner"
          v-hasPermi="['bigo:user:banner']"
        >禁用</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="singleEnable"
          @click="handleEnable"
          v-hasPermi="['bigo:user:enable']"
        >解禁</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-edit"
          size="mini"
          :disabled="insideEnable"
          @click="handleInside"
          v-hasPermi="['bigo:user:inside']"
        >设为内部账号</el-button>
      </el-col>
    </el-row>

    <el-table ref="userTable" v-loading="loading" :data="bigoUserList" stripe style="width: 100%"
    @selection-change="handleSelectionChange"
    @select-all="onSelectAll">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="用户ID" prop="uid" width="120"/>
      <el-table-column label="登录账号" prop="username"  min-width="180"/>
      <el-table-column label="账号状态" prop="status" width="120" >
        <template slot-scope="scope">
          <span v-html="statusFormat(scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column label="昵称" prop="nickName" min-width="180"/>
      <el-table-column label="邀请码" prop="uid" width="120" />
      <el-table-column label="邀请人" prop="parentName" :formatter="parentFormat" min-width="180"/>
      <!--<el-table-column label="等级" prop="levelName" width="100" />
      <el-table-column label="所在地区" prop="areaName" width="120" />-->
      <el-table-column label="认证状态" prop="authStatus" width="120" >
        <template slot-scope="scope">
          <span v-html="authStatusFormat(scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center" prop="sex">
        <template slot-scope="scope">
          <span v-html="sexFormat(scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" align="center" prop="registerTime" min-width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.registerTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column  label="操作" align="center" class-name="small-padding fixed-width" min-width="150" fixed="right">
        <template slot-scope="scope" >
          <el-button
            v-if="scope.row.status == 0"
            size="mini"
            type="text"
            :disabled="scope.row.status == 1"
            icon="el-icon-warning-outline"
            @click="handleBanner(scope.row)"
          >禁用</el-button>
          <el-button
            v-if="scope.row.status == 1"
            size="mini"
            type="text"
            :disabled="scope.row.status == 0"
            icon="el-icon-edit"
            @click="handleEnable(scope.row)"
          >解禁</el-button>
          <el-button
            type="text"
            icon="el-icon-edit"
            size="mini"
            v-if="scope.row.parentUid == null"
            @click="handleSetParent(scope.row)"
            v-hasPermi="['bigo:user:setParent']"
          >设置邀请人</el-button>
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

    <!-- 设置邀请人对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="420px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户ID" prop="uid">
          <el-input v-model="form.uid" disabled />
        </el-form-item>
        <el-form-item label="用户账号" prop="username">
          <el-input v-model="form.username" disabled />
        </el-form-item>
        <el-form-item label="邀请人ID" prop="parentUid">
          <el-input v-model="form.parentUid" placeholder="请填写邀请人ID"/>
        </el-form-item>
      </el-form>
      <el-link icon="el-icon-warn" type="danger" disabled>注意：邀请人的注册时间必须早于该用户的注册时间</el-link>
      <div slot="footer" >
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { childrenList, changeUserStatus,setParentUid } from "@/api/bigo/bigoUser";

export default {
  name: "bigoUser",
  data() {
    return {
      radio:"",
      singleBanner: true,
      singleEnable: true,
      insideEnable: true,
      selectUser: {},
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      title: '设置邀请人',
      // 角色表格数据
      bigoUserList: [],
      // 弹出层标题
      title: "",
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [
        {dictLabel: '正常', dictValue: 0},
        {dictLabel: '禁用', dictValue: 1},
        {dictLabel: '内部账号', dictValue: 2}
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
        parentName: undefined,
        status: undefined,
        level: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        uid: [
          { required: true, message: "请选择用户", trigger: "blur" }
        ],
        parentUid: [
          { required: true, message: "邀请人ID不能为空", trigger: "blur" }
        ]
      },
      // 是否显示弹出层
      open: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询资产变更列表 */
    getList() {
      this.loading = true;
      childrenList(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.bigoUserList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    onSelectAll () {
			this.$refs.userTable.clearSelection()//这个是清除所有选择项，当选择全部时，清除所有选择项
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
    // 邀请人格式化
    parentFormat(row, column) {
      if(row.parentUid == null){
        return '无';
      }else{
        return row.parentName + '(' + row.parentUid + ')';
      }

    },
    // 账号状态显示
    statusFormat(row, column) {
      if(row.status == 0){
        return '<font color="green">' + '正常' +'</font>'
      }else if(row.status == 1){
        return '<font color="red">'+ '禁用' +'</font>'
      }else if(row.status == 2){
        return '<font color="red">'+ '内部账号' +'</font>'
      }
      return '-';
    },
    // 认证状态显示
    authStatusFormat(row, column) {
      if(row.authStatus == 0){
        return '未认证'
      }else if(row.status == 1){
        return '<font color="blue">'+ '审核中' +'</font>'
      }else if(row.status == 2){
        return '<font color="green">'+ '已认证' +'</font>'
      }else if(row.status == 3){
        return '<font color="red">'+ '认证失败' +'</font>'
      }
      return '-';
    },
    // 认证状态显示
    sexFormat(row, column) {
      if(row.sex == 1){
        return '男';
      }else if(row.sex == 2){
        return '女';
      }
      return '未设置';
    },
    handleSelectionChange(row) {
      if (row.length > 1) {
        this.$refs.userTable.clearSelection()
        this.$refs.userTable.toggleRowSelection(row.pop())
      }
      this.selectUser = row[0];
      if(row.length == 0){
        this.singleBanner = true;
        this.singleEnable = true;
        this.insideEnable = true;
      }else{
        if(this.selectUser.status == 0){
          this.singleBanner = false;
          this.singleEnable = true;
          this.insideEnable = false;
        }else if(this.selectUser.status == 1){
          this.singleBanner = true;
          this.singleEnable = false;
          this.insideEnable = false;
        }else {
          this.singleBanner = true;
          this.singleEnable = true;
          this.insideEnable = true;
        }
      }
    },
    /** 禁用按钮操作 */
    handleBanner(row) {
      const uid = row.uid || this.selectUser.uid;
      this.$confirm('是否禁用UID为"' + uid + '"的用户?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeUserStatus(uid, 1);
        }).then(() => {
          this.getList();
          this.msgSuccess("禁用成功");
        }).catch(function() {});
    },
    /** 解禁按钮操作 */
    handleEnable(row) {
      const uid = row.uid || this.selectUser.uid;
      this.$confirm('是否解禁UID为"' + uid + '"的用户?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeUserStatus(uid, 0);
        }).then(() => {
          this.getList();
          this.msgSuccess("解禁成功");
        }).catch(function() {});
    },
    /** 内部账号按钮操作 */
    handleInside(row) {
      const uid = row.uid || this.selectUser.uid;
      this.$confirm('是否将UID为"' + uid + '"的用户设为内部账号，设为内部账号后将无法取消！?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeUserStatus(uid, 2);
        }).then(() => {
          this.getList();
          this.msgSuccess("解禁成功");
        }).catch(function() {});
    },
    handleSetParent(row) {
      this.reset();
      this.form.uid = row.uid,
      this.form.username = row.username,
      this.open = true;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        uid: undefined,
        username: undefined
      };
      this.resetForm("form");
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          setParentUid(this.form.uid, this.form.parentUid).then(response => {
            if (response.code === 200) {
              this.msgSuccess("设置成功");
              this.open = false;
              this.getList();
            }
          });
        }
      });
    },
  }
};
</script>
