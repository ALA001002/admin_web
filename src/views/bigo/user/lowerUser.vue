<template>
  <div class="app-container">
<!--    <el-form :model="queryParams" ref="queryForm" :inline="true">-->
<!--      <el-form-item label="用户ID" prop="uid">-->
<!--        <el-input-->
<!--          v-model="queryParams.uid"-->
<!--          placeholder="请输入用户ID"-->
<!--          clearable-->
<!--          size="small"-->
<!--          style="width: 240px"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="代理ID" prop="agentId">-->
<!--        <el-input-->
<!--          v-model="queryParams.agentId"-->
<!--          placeholder="请输入代理ID"-->
<!--          clearable-->
<!--          size="small"-->
<!--          style="width: 240px"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="登录名" prop="username">-->
<!--        <el-input-->
<!--          v-model="queryParams.username"-->
<!--          placeholder="请输入用户登录名"-->
<!--          clearable-->
<!--          size="small"-->
<!--          style="width: 240px"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="邀请人" prop="parentName">-->
<!--        <el-input-->
<!--          v-model="queryParams.parentName"-->
<!--          placeholder="请输入邀请人登录名"-->
<!--          clearable-->
<!--          size="small"-->
<!--          style="width: 240px"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="用户状态" prop="status">-->
<!--        <el-select-->
<!--          v-model="queryParams.status"-->
<!--          placeholder="用户状态"-->
<!--          clearable-->
<!--          size="small"-->
<!--          style="width: 240px"-->
<!--        >-->
<!--          <el-option-->
<!--            v-for="dict in statusOptions"-->
<!--            :key="dict.dictValue"-->
<!--            :label="dict.dictLabel"-->
<!--            :value="dict.dictValue"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="注册时间">-->
<!--        <el-date-picker-->
<!--          v-model="dateRange"-->
<!--          size="small"-->
<!--          style="width: 240px"-->
<!--          value-format="yyyy-MM-dd"-->
<!--          type="daterange"-->
<!--          range-separator="-"-->
<!--          start-placeholder="开始日期"-->
<!--          end-placeholder="结束日期"-->
<!--        ></el-date-picker>-->
<!--      </el-form-item>-->
<!--      <el-form-item>-->
<!--        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>-->
<!--        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>-->
<!--      </el-form-item>-->
<!--    </el-form>-->

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-warning-outline"
          size="mini"
          :disabled="multiple"
          @click="handleBatchDisable"
          v-hasPermi="['bigo:user:batchEdit']"
        >批量禁用</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="multiple"
          @click="handleBatchEnable"
          v-hasPermi="['bigo:user:batchEdit']"
        >批量解禁</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-edit"
          size="mini"
          :disabled="multiple"
          @click="handleBatchInside"
          v-hasPermi="['bigo:user:batchEdit']"
        >批量设置内部账号</el-button>
      </el-col>
    </el-row>

    <!--    <el-table ref="userTable" v-loading="loading" :data="bigoUserList" stripe style="width: 100%"
        @selection-change="handleSelectionChange"
        @select-all="onSelectAll">-->
      <el-table v-loading="loading" :data="bigoUserList" @selection-change="handleSelectionChange">

<!--        <el-table-column type="selection" width="55" align="center" />-->
        <el-table-column label="用户ID(邀请码)" prop="uid" width="120">
          <template slot-scope="scope">
              <span>{{ scope.row.uid }}</span>
<!--            <router-link :to="{ path: '/houtai/lowerUser/', query: { uid: scope.row.uid }}" class="link-type">-->
<!--            </router-link>-->
          </template>
        </el-table-column>
        <el-table-column label="登录账号" prop="username"  min-width="180">
          <template slot-scope="scope">
              <span>{{ scope.row.username }}</span>
<!--            <router-link :to="{ path: '/houtai/userSpot/', query: { uid: scope.row.uid }}" class="link-type">-->
<!--            </router-link>-->
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="username"  min-width="100">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-warning-outline"
              v-hasPermi="['bigo:user:editRemark']"
              @click="handleRemark(scope.row)"
            >查看备注</el-button>
          </template>
        </el-table-column>
        <el-table-column label="用户余额" prop="balances" width="150" align="center">
          <template slot-scope="scope">
            <ul style="list-style: none;padding: 0">
              <li v-if="index==0 || scope.row.collapse" v-for="(item,index) in ['USDT','BTC','ETH']">{{item}}：{{ scope.row.balances[item] || 0  }}<i :class="`${scope.row.collapse?'el-icon-arrow-up':'el-icon-arrow-down'}`" v-if="index==0" @click="()=>expand(scope.$index)"></i></li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column label="累计充值" prop="balances" width="150" align="center">
          <template slot-scope="scope">
            <ul style="list-style: none;padding: 0">
              <li v-if="index==0 || scope.row.rcollapse" v-for="(item,index) in ['USDT','BTC','ETH']">{{item}}：{{ scope.row.recharge[item] || 0 }}<i :class="`${scope.row.rcollapse?'el-icon-arrow-up':'el-icon-arrow-down'}`" v-if="index==0" @click="()=>expand(scope.$index,1)"></i></li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column label="累计提现" prop="balances" width="150" align="center">
          <template slot-scope="scope">
            <ul style="list-style: none;padding: 0">
              <li v-if="index==0 || scope.row.wcollapse" v-for="(item,index) in ['USDT','BTC','ETH']">{{item}}：{{ scope.row.withdraw[item] || 0  }}<i :class="`${scope.row.tcollapse?'el-icon-arrow-up':'el-icon-arrow-down'}`" v-if="index==0" @click="()=>expand(scope.$index,2)"></i></li>
            </ul>
          </template>
        </el-table-column>

        <!--      <el-table-column label="下注状态" prop="timeContractStatus" width="120" >-->
        <!--        <template slot-scope="scope">-->
        <!--          <span v-html="timeContractStatusFormat(scope.row)"></span>-->
        <!--        </template>-->
        <!--      </el-table-column>-->
        <!--      <el-table-column label="昵称" prop="nickName" min-width="180"/>-->
        <!--      <el-table-column label="邀请码" prop="uid" width="120" />-->
        <el-table-column label="邀请人" prop="parentName" :formatter="parentFormat" min-width="180"/>
        <!--      <el-table-column label="所在地区" prop="areaName" width="120" />-->
        <el-table-column label="账号状态" prop="status" width="120" >
          <template slot-scope="scope">
            <span v-html="statusFormat(scope.row)"></span>
          </template>
        </el-table-column>
        <el-table-column label="提现状态" prop="withdrawStatus" width="120" >
          <template slot-scope="scope">
            <span v-html="withdrawStatusFormat(scope.row)"></span>
          </template>
        </el-table-column>
        <el-table-column label="最后登录IP" align="center" prop="lastLoginIp" min-width="180"/>
        <el-table-column label="登录归属地址" align="center" prop="lastLoginArea" min-width="180"/>
        <el-table-column label="注册IP" align="center" prop="registerIp" min-width="180">
          <template slot-scope="scope">
            <span v-html="registerIpFormat(scope.row)"></span>
          </template>
        </el-table-column>
        <el-table-column label="注册归属地址" align="center" prop="registerArea" min-width="180"/>
        <el-table-column label="注册IP" align="center" prop="registerIp" min-width="180">
          <template slot-scope="scope">
            <span v-html="registerIpFormat(scope.row)"></span>
          </template>
        </el-table-column>
        <el-table-column label="注册时间" align="center" prop="registerTime" min-width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.registerTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="whatsapp" prop="whatsapp" width="120" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <el-dialog :title="editRemarkTitle" :visible.sync="editRemarkOpen" width="420px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="用户ID" prop="uid">
          <el-input v-model="form.uid" disabled />
        </el-form-item>
        <el-form-item label="用户账号" prop="username">
          <el-input v-model="form.username" disabled />
        </el-form-item>
        <el-form-item label="用户备注" prop="remark">
          <el-input v-model="form.remark"  type="textarea"/>
        </el-form-item>
      </el-form>
      <!--      <el-link icon="el-icon-warn" type="danger" disabled>注意：邀请人的注册时间必须早于该用户的注册时间</el-link>-->
      <div slot="footer" >
        <el-button type="primary" @click="submitEditRemarkForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { lowerList, editUser, batchEditUserStatus} from "@/api/bigo/bigoUser";

export default {
  name: "bigoUser",
  data() {
    return {
      radio:"",
      singleBanner: true,
      singleEnable: true,
      insideEnable: true,
      selectUser: {},
      uids:[],
      // 非多个禁用
      multiple: true,
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
      statusOptions: [
        {dictLabel: '正常', dictValue: 0},
        {dictLabel: '禁用', dictValue: 1},
        {dictLabel: '内部账号', dictValue: 2}
      ],
      withdrawStatusOptions: [
        {dictLabel: '禁用', dictValue: 0},
        {dictLabel: '开启', dictValue: 1},
      ],
      timeContractStatusOptions: [
        {dictLabel: '禁用', dictValue: 0},
        {dictLabel: '开启', dictValue: 1},
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
      open: false,
      editUserOpen: false,
      editUserStatusOpen: false,
      editParentOpen: false,
      editParentTitle:'修改邀请人',
      editRemarkOpen: false,
      editRemarkTitle: '修改备注'
    };
  },
  created() {
    const uid = this.$route.query && this.$route.query.uid;
    this.queryParams.uid = uid;
    this.getList();
  },
  methods: {
    /** 查询资产变更列表 */
    getList() {
      this.loading = true;
      lowerList(this.addDateRange(this.queryParams, this.dateRange)).then(
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
    expand(index,type){
      if(type==1){
        this.bigoUserList[index].rcollapse = !this.bigoUserList[index].rcollapse
      }else if(type==2){
        this.bigoUserList[index].wcollapse = !this.bigoUserList[index].wcollapse
      }else {
        this.bigoUserList[index].collapse = !this.bigoUserList[index].collapse
      }
      this.bigoUserList = [...this.bigoUserList]
    },
    // 邀请人格式化
    parentFormat(row, column) {
      if(row.parentUid == null){
        return '无';
      }else{
        return row.parentName + '(' + row.parentUid + ')';
      }

    },
    handleRemark(row) {
      this.reset();
      this.form.uid = row.uid;
      this.form.username = row.username;
      this.form.remark = row.remark;
      this.editRemarkOpen = true;
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
    withdrawStatusFormat(row, column) {
      if(row.withdrawStatus == 0){
        return '<font color="red">' + '禁用' +'</font>'
      }else if(row.withdrawStatus == 1){
        return '<font color="green">'+ '开启' +'</font>'
      }
      return '-';
    },
    timeContractStatusFormat(row, column) {
      if(row.timeContractStatus == 0){
        return '<font color="red">' + '禁用' +'</font>'
      }else if(row.timeContractStatus == 1){
        return '<font color="green">'+ '开启' +'</font>'
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
    handleSelectionChange(selection) {
      this.uids = selection.map(item => item.uid)
      this.multiple = !selection.length
      /*if (row.length > 1) {
        this.$refs.userTable.clearSelection()
        this.$refs.userTable.toggleRowSelection(row.pop())
      }
      this.selectUser = row[0];*/
      // if(row.length == 0){
      //   this.singleBanner = true;
      //   this.singleEnable = true;
      //   this.insideEnable = true;
      // }else{
      //   if(this.selectUser.status == 0){
      //     this.singleBanner = false;
      //     this.singleEnable = true;
      //     this.insideEnable = false;
      //   }else if(this.selectUser.status == 1){
      //     this.singleBanner = true;
      //     this.singleEnable = false;
      //     this.insideEnable = false;
      //   }else {
      //     this.singleBanner = true;
      //     this.singleEnable = true;
      //     this.insideEnable = true;
      //   }
      // }
    },
    /** 禁用按钮操作 */
    handleBatchDisable(row) {
      const uids = this.uids;
      this.$confirm('是否批量禁用户编号为"' + uids + '"的用户?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return batchEditUserStatus(uids, 1);
        }).then(() => {
          this.getList();
          this.msgSuccess("禁用成功");
        }).catch(function() {});
    },
    /** 批量解禁按钮操作 */
    handleBatchEnable(row) {
      const uids = this.uids;
      this.$confirm('是否批量解禁用户编号为"' + uids + '"的用户?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return batchEditUserStatus(uids, 0);
      }).then(() => {
        this.getList();
        this.msgSuccess("解禁成功");
      }).catch(function() {});
    },
    /** 内部账号按钮操作 */
    handleBatchInside(row) {
      const uids = this.uids;
      this.$confirm('是否批量设置用户编号为"' + uids + '"的用户为内部账号?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return batchEditUserStatus(uids, 2);
      }).then(() => {
        this.getList();
        this.msgSuccess("批量设置成功");
      }).catch(function() {});
    },

    handleSetParent(row) {
      this.reset();
      this.form.uid = row.uid,
      this.form.username = row.username,
      this.open = true;
    },
    handleEditParent(row) {
      this.reset();
      this.form.uid = row.uid,
        this.form.username = row.username,
        this.form.parentUid = row.parentUid,
        this.form.parentName = row.parentName,
        this.editParentOpen = true;
    },
    handleEditUser(row) {
      this.reset()
      getBigoUser(row.uid).then(response => {
        this.form = response.data
      })
      this.editUserOpen = true
    },
    handleEditUserStatus(row) {
      this.reset()
      getBigoUser(row.uid).then(response => {
        this.form = response.data
      })
      this.editUserStatusOpen = true
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.editUserOpen = false
      this.editUserStatusOpen = false
      this.editParentOpen = false
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        uid: undefined,
        username: undefined,
        phone:undefined,
        email:undefined,
        nickName:undefined,
        password:undefined,
        payPassword:undefined,
        withdrawStatus: undefined,
        timeContractStatus: undefined,
      };
      this.resetForm("form");
    },
    registerIpFormat(row) {
      var ip = row.registerIp
      return ip.split(',')[0]
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
    submitEditParentForm: function() {
      this.$refs["form"].validate(valid => {
        editParent(this.form.uid, this.form.newParentUid).then(response => {
            if (response.code === 200) {
              this.msgSuccess("设置成功");
              this.editParentOpen = false;
              this.getList();
            }
          });
      });
    },
    submitEditUserForm: function(){
      this.$refs["form"].validate(valid => {
        if (valid) {
          editUser(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess("修改用户信息成功");
              this.editUserOpen = false;
              this.editUserStatusOpen = false;
              this.getList();
            }
          });
        }
      });
    },
    submitEditUserStatusForm: function(){
      this.$refs["form"].validate(valid => {
        if (valid) {
          editUserStatus(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess("修改用户信息成功");
              this.editUserOpen = false;
              this.editUserStatusOpen = false;
              this.getList();
            }
          });
        }
      });
    },
    submitEditRemarkForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          editUser(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess("修改用户信息成功");
              this.editRemarkOpen = false;
              this.getList();
            }
          });
        }
      });
    },
  }
};
</script>
