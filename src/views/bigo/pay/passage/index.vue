<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="通道名称" prop="passageName">
        <el-input
          v-model="queryParams.passageName"
          placeholder="请输入通道名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="接口类型代码" prop="ifTypeCode">
        <el-input
          v-model="queryParams.ifTypeCode"
          placeholder="请输入接口类型代码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
<!--      <el-form-item label="通道状态,0-关闭,1-开启" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择通道状态,0-关闭,1-开启" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>-->
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
          v-hasPermi="['pay:passage:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['pay:passage:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['pay:passage:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['pay:passage:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="passageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="通道名称" align="center" prop="passageName" />
      <el-table-column label="接口类型代码" align="center" prop="ifTypeCode" />
      <el-table-column label="通道状态" align="center" prop="status" />
      <el-table-column label="单笔最小金额" align="center" prop="minEveryAmount" />
      <el-table-column label="单笔最大金额" align="center" prop="maxEveryAmount" />
<!--      <el-table-column label="账户配置参数,json字符串" align="center" prop="param" />-->
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['pay:passage:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdateParam(scope.row)"
            v-hasPermi="['pay:passage:edit']"
          >参数配置</el-button>
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-delete"-->
<!--            @click="handleDelete(scope.row)"-->
<!--            v-hasPermi="['pay:passage:remove']"-->
<!--          >删除</el-button>-->
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

    <!-- 添加或修改支付通道对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="通道名称" prop="passageName">
          <el-input v-model="form.passageName" placeholder="请输入通道名称" />
        </el-form-item>
        <el-form-item label="接口类型代码" prop="ifTypeCode">
          <el-select v-model="form.ifTypeCode" placeholder="请输入接口类型代码" >
            <el-option
              v-for="item in ifTypeCodeOptios"
              :key="item.ifTypeCode"
              :label="item.ifTypeName"
              :value="item.ifTypeCode"
              :disabled="item.status == 0"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="item.value" :key="item.value" v-for="(item,index) in status">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="单笔最小金额" prop="minEveryAmount">
          <el-input v-model="form.minEveryAmount" placeholder="请输入单笔最小金额" />
        </el-form-item>
        <el-form-item label="单笔最大金额" prop="maxEveryAmount">
          <el-input v-model="form.maxEveryAmount" placeholder="请输入单笔最大金额" />
        </el-form-item>

<!--        <el-form-item label="账户配置参数,json字符串" prop="param">-->
<!--          <el-input v-model="form.param" type="textarea" placeholder="请输入内容" />-->
<!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="paramTitle" :visible.sync="paramOpen" width="800px" append-to-body>
      <form-create v-model="paramForm" :rule="paramList" @submit="submitParamForm"></form-create>
<!--      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>-->
    </el-dialog>
  </div>
</template>

<script>
import { listPassage, getPassage, delPassage, addPassage, updatePassage, exportPassage,listInterface, addPassageParam} from "@/api/bigo/passage";
import formCreate from "@form-create/element-ui";

export default {
  name: "Passage",
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
      // 支付通道表格数据
      passageList: [],
      // 弹出层标题
      title: "",
      paramTitle: "",
      // 是否显示弹出层
      open: false,
      paramOpen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        passageName: undefined,
        ifTypeCode: undefined,
        status: undefined,
        maxEveryAmount: undefined,
        minEveryAmount: undefined,
        param: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      status: [
        { label: "开启", value: 1 },
        { label: "关闭", value: 0 }
      ],
      ifTypeCodeOptios:[],
      paramForm:{},
      paramList:[],
    };
  },
  created() {
    this.getList();
  },
  components:{
    formCreate:formCreate.$form()
  },
  methods: {
    /** 查询支付通道列表 */
    getList() {
      this.loading = true;
      listPassage(this.queryParams).then(response => {
        this.passageList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        passageName: undefined,
        ifTypeCode: undefined,
        status: "0",
        maxEveryAmount: undefined,
        minEveryAmount: undefined,
        param: undefined,
        createTime: undefined,
        updateTime: undefined
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
      listInterface().then(response => {
        this.ifTypeCodeOptios = response.rows;
        this.open = true;
        this.title = "添加支付通道";
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPassage(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改支付通道";
      });
    },
    handleUpdateParam(row) {
      this.reset();
      const id = row.id || this.ids
      getPassage(id).then(response => {
        this.paramList = response.data.paramList;
        this.form.id = id;
        this.paramOpen = true;
        this.paramTitle = "通道参数配置";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updatePassage(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addPassage(this.form).then(response => {
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
    submitParamForm: function() {
      const id = this.form.id;
      this.paramForm.form.id = id;
      addPassageParam(this.paramForm.form).then(response => {
        if (response.code === 200) {
          this.msgSuccess("配置成功");
          this.paramOpen = false;
          this.getList();
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除支付通道编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPassage(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有支付通道数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportPassage(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
