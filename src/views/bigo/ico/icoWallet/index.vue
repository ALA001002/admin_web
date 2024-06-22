<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="用户ID" prop="uid">
        <el-input
          v-model="queryParams.uid"
          placeholder="请输入用户ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="币种" prop="currency">
        <el-input
          v-model="queryParams.currency"
          placeholder="请输入币种"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['ico:icoWallet:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['ico:icoWallet:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['ico:icoWallet:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['ico:icoWallet:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="icoWalletList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="用户ID" align="center" prop="uid" />
      <el-table-column label="币种" align="center" prop="currency" />
      <el-table-column label="可用余额" align="center" prop="balance" />
      <el-table-column label="锁仓金额" align="center" prop="frozen" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
<!--          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['ico:icoWallet:edit']"
          >修改</el-button>-->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleLockout(scope.row)"
            v-hasPermi="['ico:icoWallet:updateLockout']"
          >锁仓</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleRelease(scope.row)"
            v-hasPermi="['ico:icoWallet:updateRelease']"
          >释放</el-button>
<!--          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ico:icoWallet:remove']"
          >删除</el-button>-->
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

    <!-- 添加或修改ico钱包对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户ID" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="币种" prop="currency">
          <el-input v-model="form.currency" placeholder="请输入币种" />
        </el-form-item>
        <el-form-item label="可用余额" prop="balance">
          <el-input v-model="form.balance" placeholder="请输入可用余额" />
        </el-form-item>
        <el-form-item label="冻结金额" prop="frozen">
          <el-input v-model="form.frozen" placeholder="请输入冻结金额" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="lockoutTitle" :visible.sync="lockoutOpen" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户ID" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入用户ID" disabled/>
        </el-form-item>
        <el-form-item label="币种" prop="currency">
          <el-input v-model="form.currency" placeholder="请输入币种" disabled/>
        </el-form-item>
        <el-form-item label="可用余额" prop="balance">
          <el-input v-model="form.balance" placeholder="请输入可用余额" disabled/>
        </el-form-item>
        <el-form-item label="锁仓金额" prop="frozen">
          <el-input v-model="form.frozen" placeholder="请输入冻结金额" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitLockoutForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="releaseTitle" :visible.sync="releaseOpen" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户ID" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入用户ID" disabled/>
        </el-form-item>
        <el-form-item label="币种" prop="currency">
          <el-input v-model="form.currency" placeholder="请输入币种" disabled/>
        </el-form-item>
        <el-form-item label="锁仓金额" prop="frozen">
          <el-input v-model="form.frozen" placeholder="请输入冻结金额" disabled/>
        </el-form-item>
        <el-form-item label="释放余额" prop="balance">
          <el-input v-model="form.balance" placeholder="请输入释放余额" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitReleaseForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listIcoWallet, getIcoWallet, delIcoWallet, addIcoWallet, updateIcoWallet, exportIcoWallet, updateLockout,updateRelease } from "@/api/bigo/icoWallet";

export default {
  name: "IcoWallet",
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
      // ico钱包表格数据
      icoWalletList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      lockoutOpen: false,
      lockoutTitle: "",
      releaseOpen: false,
      releaseTitle: "",
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        uid: undefined,
        currency: undefined,
        balance: undefined,
        frozen: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        uid: [
          { required: true, message: "用户UID不能为空", trigger: "blur" }
        ],
        currency: [
          { required: true, message: "币种不能为空", trigger: "blur" }
        ],
        balance: [
          { required: true, message: "可用余额不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询ico钱包列表 */
    getList() {
      this.loading = true;
      listIcoWallet(this.queryParams).then(response => {
        this.icoWalletList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.lockoutOpen = false;
      this.releaseOpen = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        uid: undefined,
        currency: undefined,
        balance: undefined,
        frozen: undefined,
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
      this.title = "添加ico钱包";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getIcoWallet(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改ico钱包";
      });
    },
    handleLockout(row) {
      this.reset();
      const id = row.id || this.ids
      getIcoWallet(id).then(response => {
        this.form = response.data;
        this.form.frozen = 0;
        this.lockoutOpen = true;
        this.lockoutTitle = "锁仓";
      });
    },
    handleRelease(row) {
      this.reset();
      const id = row.id || this.ids
      getIcoWallet(id).then(response => {
        this.form = response.data;
        this.form.balance = 0;
        this.releaseOpen = true;
        this.releaseTitle = "释放";
      });
    },

    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateIcoWallet(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addIcoWallet(this.form).then(response => {
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

    submitLockoutForm: function (){
      updateLockout(this.form).then(response => {
        if (response.code === 200) {
          this.msgSuccess("锁仓成功");
          this.lockoutOpen = false;
          this.getList();
        }
      })
    },
    submitReleaseForm: function (){
      updateRelease(this.form).then(response => {
        if (response.code === 200) {
          this.msgSuccess("释放成功");
          this.releaseOpen = false;
          this.getList();
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除ico钱包编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delIcoWallet(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有ico钱包数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportIcoWallet(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
