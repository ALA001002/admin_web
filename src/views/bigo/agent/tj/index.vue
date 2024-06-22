<template>
  <div class="app-container">
    <!--<el-row :gutter="20">
    <el-col :span="4" :xs="24">
      <div class="head-container">
        <el-input
          v-model="userName"
          placeholder="请输入用户名"
          clearable
          size="small"
          prefix-icon="el-icon-search"
          style="margin-bottom: 20px"
        />
      </div>
    </el-col>
    </el-row>-->
    <el-form :inline="true">
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
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >搜索</el-button>
      </el-form-item>
    </el-form>
    <!--是否默认展开所有节点-->
    <!--default-expand-all-->
<!--   <el-table
      v-loading="loading"
      :data="deptList"
      row-key="uid"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >

      <el-table-column prop="username" label="账号名称" :formatter="uidFormatter" width="350"></el-table-column>
      <el-table-column prop="usdt" label="USDT" width="250">
        <template slot-scope="scope">
          <router-link :to="{ path: '/agent/rechargeRecord/', query: { coin: 'USDT', uid: scope.row.uid }}" class="link-type">
            <span>{{ scope.row.usdt }}</span>
          </router-link>

        </template>

      </el-table-column>
      <el-table-column prop="eth" label="ETH" width="250">
        <template slot-scope="scope">
          <router-link :to="{ path: '/agent/rechargeRecord/', query: { coin: 'ETH', uid: scope.row.uid }}" class="link-type">
            <span>{{ scope.row.eth }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="btc" label="BTC" width="250">
        <template slot-scope="scope">
          <router-link :to="{ path: '/agent/rechargeRecord/', query: { coin: 'BTC', uid: scope.row.uid }}" class="link-type">
            <span>{{ scope.row.btc }}</span>
          </router-link>
        </template>
      </el-table-column>

    </el-table>-->







    <!-- 添加或修改部门对话框 -->
    <el-table
      ref="table"
      :data="deptList"
      row-key="uid"
      default-expand-all
      lazy
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="uid" label="用户ID" />
      <el-table-column prop="username" label="账号" width="250"/>
      <el-table-column prop="totalRecharge" label="累计充值" />
      <el-table-column prop="totalWithdraw" label="累计提现" />
      <el-table-column prop="userBalance" label="用户余额" />
    </el-table>
  </div>


</template>

<script>
import { statistics, getDept, delDept, addDept, updateDept, listDeptExcludeChild } from "@/api/bigo/agent";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Dept",
  components: { Treeselect },
  data() {
    return {
      maps: new Map(),
      // 币种数据字典
      coinOptions: [],
      // dataListTwo: [
      //   { id: 1, name: 42, address: 3, hasChildren: true },
      //   { id: 2, name: 12, address: 3, hasChildren: true },
      //   { id: 3, name: 2, address: 3, hasChildren: true }
      // ],
      // 遮罩层
      loading: true,
      // 表格树数据
      deptList: [],
      // 部门树选项
      deptOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      userName: undefined,
      // 查询参数
      queryParams: {
        deptName: undefined,
        status: undefined,
        // uid: undefined,
        parentUid: undefined,
        currency: 'USDT',
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: "上级部门不能为空", trigger: "blur" }
        ],
        deptName: [
          { required: true, message: "部门名称不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "菜单顺序不能为空", trigger: "blur" }
        ],
        email: [
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],

      }
    };
  },
  watch: {
    // 根据名称筛选部门树
    userName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("bigo_coin_type").then(response => {
      this.coinOptions = response.data;
    });
  },
  methods: {
    /** 查询部门列表 */
    getList() {
      this.loading = true;
      statistics(this.queryParams).then(response => {
        this.deptList = response.data;
        this.loading = false;
      });
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.uid,
        label: node.username,
        children: node.children
      };
    },
    uidFormatter(row){
      return row.username + '(' + row.uid + ')';
    },
    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        deptId: undefined,
        parentId: undefined,
        deptName: undefined,
        orderNum: undefined,
        leader: undefined,
        phone: undefined,
        email: undefined,
        status: "0"
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    load(tree, treeNode, resolve, order) { // order 判断升序降序
      this.maps.set(tree.uid, { tree, treeNode, resolve }) // 储存数据
      // 通过接口获取的list数据
      console.log("id==="+tree.uid)
      this.queryParams.parentUid = tree.uid
      statistics(this.queryParams).then(response => {
        const list = response.data;
        resolve(list)
      });

    },


  }




};
</script>
