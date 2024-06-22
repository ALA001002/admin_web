pa<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="接口类型" prop="ifTypeCode">
        <el-input
          v-model="queryParams.ifTypeCode"
          placeholder="请输入接口类型代码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型名称" prop="ifTypeName">
        <el-input
          v-model="queryParams.ifTypeName"
          placeholder="请输入类型名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="状态,0-关闭,1-开启" prop="status">-->
<!--        <el-select v-model="queryParams.status" placeholder="请选择状态,0-关闭,1-开启" clearable size="small">-->
<!--          <el-option label="请选择字典生成" value="" />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="datetimerange"
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
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['pay:interface:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['pay:interface:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['pay:interface:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['pay:interface:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="interfaceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="接口类型代码" align="center" prop="ifTypeCode" />
      <el-table-column label="接口类型名称" align="center" prop="ifTypeName" />
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat">
      <template slot-scope="scope">
        <span v-html="statusFormat(scope.row)"></span>
      </template>
      </el-table-column>
<!--      <el-table-column label="接口配置定义描述,json字符串" align="center" prop="param" />-->
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['pay:interface:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdateParam(scope.row)"
            v-hasPermi="['pay:interface:edit']"
          >编辑配置</el-button>
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

    <!-- 添加或修改支付接口类型对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px"  append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="类型代码" prop="ifTypeName">
          <el-input v-model="form.ifTypeCode" placeholder="请输入接口类型代码" />
        </el-form-item>
        <el-form-item label="类型名称" prop="ifTypeName">
          <el-input v-model="form.ifTypeName" placeholder="请输入接口类型名称" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="item.value" :key="item.value" v-for="(item,index) in status">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
<!--        <el-form-item label="接口配置" prop="param">-->
<!--          <el-input v-model="form.param" type="textarea" :rows="7" placeholder="接口配置定义描述,json字符串" />-->
<!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="paramTitle" :visible.sync="paramOpen" width="700px"  append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="类型代码" prop="ifTypeName">
          <el-input v-model="form.ifTypeCode" disabled placeholder="请输入接口类型代码" />
        </el-form-item>
        <el-form-item label="接口配置" prop="param">
          <el-input v-model="form.param" type="textarea" :rows="7" placeholder="接口配置定义描述,json字符串" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitParamForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listInterface, getInterface, delInterface, addInterface, updateInterface, exportInterface, updateInterfaceParam} from "@/api/bigo/interface";

export default {
  name: "Interface",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      dateRange: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 支付接口类型表格数据
      interfaceList: [],
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
        ifTypeCode: undefined,
        ifTypeName: undefined,
        status: undefined,
        param: undefined,
        createTime: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        ifTypeName: [
          { required: true, message: "接口类型名称不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态", trigger: "blur" }
        ],
        param: [
          { required: true, message: "接口配置定义描述,json字符串不能为空", trigger: "blur" }
        ]
      },
      status: [
        { label: "开启", value: 1 },
        { label: "关闭", value: 0 }
      ]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询支付接口类型列表 */
    getList() {
      this.loading = true;
      listInterface(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.interfaceList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.paramOpen = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        ifTypeCode: undefined,
        ifTypeName: undefined,
        status: "0",
        param: undefined,
        remark: undefined,
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
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.ifTypeCode)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加支付接口类型";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const ifTypeCode = row.ifTypeCode || this.ids
      getInterface(ifTypeCode).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改支付接口类型";
      });
    },
    handleUpdateParam(row) {
      this.reset();
      const ifTypeCode = row.ifTypeCode || this.ids
      getInterface(ifTypeCode).then(response => {
        this.form = response.data;
        this.paramOpen = true;
        this.title = "修改支付接口类型";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateInterface(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            console.log(11111)
            addInterface(this.form).then(response => {
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
            updateInterfaceParam(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改配置成功");
                this.paramOpen = false;
                this.getList();
              }
            });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ifTypeCodes = row.ifTypeCode || this.ids;
      this.$confirm('是否确认删除支付接口类型编号为"' + ifTypeCodes + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delInterface(ifTypeCodes);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有支付接口类型数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportInterface(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    statusFormat(row, column) {
      if(row.status == 0){
        return '<font color="red">' + '关闭' +'</font>'
      }else{
        return '<font color="green">'+ '开启' +'</font>'
      }
    },
  }
};
</script>
