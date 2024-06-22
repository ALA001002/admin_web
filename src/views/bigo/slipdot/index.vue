<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="滑点ID" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入滑点ID"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
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
          type="success"
          icon="el-icon-edit"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['bigo:slipdot:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="singleEnable"
          @click="handleDel"
          v-hasPermi="['bigo:slipdot:del']"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table ref="slipdotTable" v-loading="loading" :data="slipdotList" stripe
      @selection-change="handleSelectionChange" 
      @select-all="onSelectAll">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="滑点ID" prop="id" width="80" />
      <el-table-column label="交易对" prop="symbol"  :formatter="symbolFormat" width="120"/>
      <el-table-column label="滑点" prop="adjustPrice"  />
      <el-table-column label="状态" prop="status" width="80" :formatter="statusFormat"/>
      <el-table-column label="开始时间" align="center" prop="startDotTime" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startDotTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="stopDotTime" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.stopDotTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" prop="creatorName"  />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="120" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status == 0"
            size="mini"
            type="text"
            :disabled="scope.row.status != 0"
            icon="el-icon-warning-outline"
            @click="handleStart(scope.row)"
            v-hasPermi="['bigo:slipdot:start']"
          >开始</el-button>
          <el-button
            v-if="scope.row.status == 1"
            size="mini"
            type="text"
            :disabled="scope.row.status != 1"
            icon="el-icon-warning-outline"
            @click="handleStop(scope.row)"
            v-hasPermi="['bigo:slipdot:stop']"
          >停止</el-button>
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
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
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
        <el-form-item label="滑点" prop="adjustPrice" >
          <el-input v-model="form.adjustPrice" placeholder="请输入滑点" type="number" width="240"/>
        </el-form-item>
      </el-form>
      <div slot="footer" >
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listSlipDot,addSlipDot,delSlipDot,startSlipDot,stopSlipDot } from "@/api/bigo/slipDot";

export default {
  name: "slipdot",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      title: '新增滑点',
      singleEnable: true,
      // 是否显示弹出层
      open: false,
      selectSlipDot: {},
      // 交易对数据字典
      symbolOptions: [],
      // 角色表格数据
      slipdotList: [],
      // 表单参数
      form: {},
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [
        {dictLabel: '就绪', dictValue: 0},
        {dictLabel: '正在运行', dictValue: 1},
        {dictLabel: '已结束', dictValue: 2}
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: undefined,
        symbol: undefined,
        deleted: 0
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        symbol: [
          { required: true, message: "请选择交易对", trigger: "blur" }
        ],
        adjustPrice: [
          { required: true, message: "滑点数量不能为空", trigger: "blur" }
        ]
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
    /** 查询资产变更列表 */
    getList() {
      this.loading = true;
      listSlipDot(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.slipdotList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 交易对翻译
    symbolFormat(row, column) {
      return this.selectDictLabel(this.symbolOptions, row.symbol);
    },
    // 状态翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
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
    handleAdd() {
      this.reset();
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
        symbol: undefined,
        adjustPrice: undefined
      };
      this.resetForm("form");
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          addSlipDot(this.form.symbol, this.form.adjustPrice).then(response => {
            if (response.code === 200) {
              this.msgSuccess("新增滑点成功");
              this.open = false;
              this.getList();
            }
          });
        }
      });
    },
    handleSelectionChange(row) {
      if (row.length > 1) {
        this.$refs.slipdotTable.clearSelection()
        this.$refs.slipdotTable.toggleRowSelection(row.pop())
      } 
      this.selectSlipDot = row[0];
      if(row.length == 0){
        this.singleEnable = true;
      }else if(this.selectSlipDot.status == 0){
        this.singleEnable = false;
      }else{
        this.singleEnable = true;
      }
    },
    onSelectAll () {
			this.$refs.slipdotTable.clearSelection()//这个是清除所有选择项，当选择全部时，清除所有选择项
    },
    /** 删除操作 */
    handleDel() {
      const id = this.selectSlipDot.id;
      this.$confirm('是否删除ID为"' + id + '"的滑点?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delSlipDot(id);
        }).then(() => {
          this.getList();
          this.msgSuccess("滑点删除成功");
        }).catch(function() {});
    },
    /** 开始滑点操作 */
    handleStart(row) {
      const id = row.id;
      this.$confirm('是否开始ID为"' + id + '"的滑点?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return startSlipDot(id);
        }).then(() => {
          this.getList();
          this.msgSuccess("滑点开始成功");
        }).catch(function() {});
    },
    /** 停止滑点操作 */
    handleStop(row) {
      const id = row.id;
      this.$confirm('是否停止ID为"' + id + '"的滑点?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return stopSlipDot(id);
        }).then(() => {
          this.getList();
          this.msgSuccess("滑点停止成功");
        }).catch(function() {});
    },
  }
};
</script>