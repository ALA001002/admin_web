<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="交易对" prop="symbol">
        <el-select
          v-model="queryParams.symbol"
          placeholder="滑点交易对"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in symbolOptions"
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
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['marketsituation:slipConfig:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['marketsituation:slipConfig:edit']"
        >修改</el-button>
      </el-col>
<!--      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['marketsituation:slipConfig:remove']"
        >删除</el-button>
      </el-col>-->
<!--      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['marketsituation:slipConfig:export']"
        >导出</el-button>
      </el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="slipConfigList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="开始时间" align="center" prop="startTimeDate" />
      <el-table-column label="结束时间" align="center" prop="endTimeDate" />
      <el-table-column label="状态" align="center" prop="openFlag" >
        <template slot-scope="scope">
          <span v-html="openFlagFormatter(scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column label="增量" align="center" prop="addValueStr" />
      <el-table-column label="交易对" align="center" prop="symbol" :formatter="symbolFormat" />
      <el-table-column label="图形" align="center" prop="type" >
        <template slot-scope="scope">
          <span>{{chartTypes.map(item=>item.label)[scope.row.type||0]}}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="删除状态" align="center" prop="delFlag"  :formatter="delFlagFormatter" />-->
      <el-table-column label="创建时间" align="center" prop="createTime" width="180" />
      <el-table-column label="持续时间" align="center" prop="intervalTime" />
<!--      <el-table-column label="交易数量" align="center" prop="addAmount" />-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">

          <el-button
            size="mini"
            type="text"
            v-hasPermi="['marketsituation:slipConfig:remove']"
            icon="el-icon-delete"
            @click="handleClose(scope.row)"
          >删除</el-button>
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

    <!-- 添加或修改滑点配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="交易对" prop="symbol">
          <el-select
            v-model="form.symbol"
            placeholder="请选择要滑点的交易对"
            clearable
            size="small"
            style="width: 240px"
          >
            <el-option
              v-for="dict in symbolOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="增量" prop="addValue">
          <el-input v-model="form.addValue" placeholder="请输入增量" />
        </el-form-item>
        <el-form-item label="开始时间" prop="overdueTime">
          <el-date-picker clearable size="small" style="width: 200px"
                          v-model="form.startTimeDate"
                          type="datetime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          format="yyyy-MM-dd HH:mm:ss"
                          placeholder="选择开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="持续时间(分钟)" prop="intervalTime">
          <el-input v-model="form.intervalTime" placeholder="请输入花费时间" />
        </el-form-item>
        <el-form-item label="图形" prop="type">
          <el-select
            v-model="form.type"
            placeholder="请选择图形类型"
            clearable
            size="small"
            style="width: 240px"
          >
            <el-option
              v-for="dict in chartTypes"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否开启" prop="openFlag">
          <el-select
            v-model="form.openFlagInter"
            placeholder="是否开启"
            clearable
            size="small"
            style="width: 240px"
          >
            <el-option v-for="flags in openFlagOptions"
                       :key="flags.key"
                       :label="flags.key"
                       :value="flags.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listSlipConfig, getSlipConfig, delSlipConfig, addSlipConfig, updateSlipConfig, updateStatus } from "@/api/bigo/slipConfig";

export default {
  name: "SlipConfig",
  data() {
    return {
      chartTypes:[{
        label: '递增',
        value: 0
      },{
        label: '震荡',
        value: 1
      }],
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
      // 滑点配置表格数据
      slipConfigList: [],
      symbolOptions: [],
      openFlagOptions:[
        {key: "开启", value: 1},
        {key: "关闭", value: 0}
      ],
      delFlagOptions:[
        {key: "已删除", value: 1},
        {key: "未删除", value: 0}
      ],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        startTime: undefined,
        endTime: undefined,
        openFlag: undefined,
        addValue: undefined,
        symbol: undefined,
        intervalTime: undefined,
        addAmount: undefined,
        openFlagInter: undefined
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
    this.getDicts("bigo_symbol_type").then(response => {
      this.symbolOptions = response.data;
    });
  },
  methods: {
    /** 查询滑点配置列表 */
    getList() {
      this.loading = true;
      listSlipConfig(this.queryParams).then(response => {
        this.slipConfigList = response.rows;
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
        startTime: undefined,
        endTime: undefined,
        openFlag: undefined,
        addValue: undefined,
        symbol: undefined,
        delFlag: undefined,
        createTime: undefined,
        updateTime: undefined,
        intervalTime: undefined,
        addAmount: undefined,
        startTimeDate: undefined,
        openFlagInter:undefined,
        delFlagInter: undefined
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
      this.title = "添加滑点配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getSlipConfig(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改滑点配置";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateSlipConfig(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addSlipConfig(this.form).then(response => {
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
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除滑点配置编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delSlipConfig(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有滑点配置数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportSlipConfig(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },// 邀请人格式化
    openFlagFormatter(row, column) {
      if(row.openFlagInter == 1){
        return '<font color="green">' + '开启' +'</font>'
      }else{
        return '<font color="red">'+ '关闭' +'</font>'
      }
    },
    delFlagFormatter(row, column) {
      if(row.delFlagInter == 1){
        return '已删除';
      }else{
        return '未删除';
      }
    },
    symbolFormat(row, column) {
      return this.selectDictLabel(this.symbolOptions, row.symbol);
    },

    handleOpen(row) {
      const id = row.id;
      this.$confirm('是否开启id为"' + id + '"的记录?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return updateStatus(id, 1);
      }).then(() => {
        this.getList();
        this.msgSuccess("开启成功");
      }).catch(function() {});
    },
    handleClose(row) {
      const id = row.id;
      this.$confirm('是否删除id为"' + id + '"的记录?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return delSlipConfig(id);
      }).then(() => {
        this.getList();
        this.msgSuccess("关闭成功");
      }).catch(function() {});
    },
  }
};
</script>
