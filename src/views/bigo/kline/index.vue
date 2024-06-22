<template>
  <div class="app-container">
<!--    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
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
    </el-form>-->

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['bigo:kline:save']"
        >新增</el-button>
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

    <el-table v-loading="loading" :data="klineConfigList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="时间粒度" align="center" prop="period" />
      <el-table-column label="交易对" align="center" prop="symbol" :formatter="symbolFormat" />
      <el-table-column label="引线比例" align="center" prop="leadWire" />
      <el-table-column label="跌幅" align="center" prop="decline" />
      <el-table-column label="日涨幅" align="center" prop="updateRate" width="180" />
      <el-table-column label="下引线长度" align="center" prop="lowDeg" />
      <el-table-column label="bar长度" align="center" prop="barRate" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-warning-outline"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
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
              v-for="sy in symbols"
              :key="sy.key"
              :label="sy.key"
              :value="sy.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="时间粒度" prop="period">
          <el-select
            v-model="form.period"
            placeholder="请选择时间粒度"
            clearable
            size="small"
            style="width: 240px"
          >
            <el-option
              v-for="cd in candlestickOptions"
              :key="cd.key"
              :label="cd.key"
              :value="cd.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="引线比例" prop="leadWire">
          <el-input v-model="form.leadWire" placeholder="请输入引线比例" />
        </el-form-item>
        <el-form-item label="跌幅" prop="decline">
          <el-input v-model="form.decline" placeholder="请输入跌幅" />
        </el-form-item>
        <el-form-item label="日涨幅" prop="randomRate">
          <el-input v-model="form.updateRate" placeholder="请输入日涨幅" />
        </el-form-item>
        <el-form-item label="下引线长度" prop="lowDeg">
          <el-input v-model="form.lowDeg" placeholder="请输入下引线长度" />
        </el-form-item>
        <el-form-item label="bar长度" prop="barRate">
          <el-input v-model="form.barRate" placeholder="请输入bar长度" />
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
import { listKlineConfig,getKlineConfig,saveKlineConfig,editKlineConfig } from "@/api/bigo/slipConfig";

export default {
  name: "KlineConfig",
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
      // 滑点配置表格数据
      klineConfigList: [],
      symbolOptions: [],
      openFlagOptions:[
        {key: "开启", value: 1},
        {key: "关闭", value: 0}
      ],
      delFlagOptions:[
        {key: "已删除", value: 1},
        {key: "未删除", value: 0}
      ],
      symbols:[
        {key: "DIEM/USDT", value: "creusdt"},
      ],
      candlestickOptions:[
        {key: "1分钟", value: "1min"},
        {key: "5分钟", value: "5min"},
        {key: "30分钟", value: "30min"},
        {key: "60分钟", value: "60min"},
        {key: "4小时", value: "4hour"},
        {key: "1天", value: "1day"},
        {key: "1周", value: "1week"},
        {key: "1个月", value: "1mon"},
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
      listKlineConfig(this.queryParams).then(response => {
        this.klineConfigList = response.rows;
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
        period: undefined,
        symbol: undefined,
        leadWire: undefined,
        decline: undefined,
        updateRate: undefined,
        lowDeg: undefined,
        barRate: undefined,
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
      const symbol = row.symbol
      getKlineConfig(symbol).then(response => {
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
            editKlineConfig(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            saveKlineConfig(this.form).then(response => {
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
      this.$confirm('是否关闭id为"' + id + '"的记录?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return updateStatus(id, 0);
      }).then(() => {
        this.getList();
        this.msgSuccess("关闭成功");
      }).catch(function() {});
    },
  }
};
</script>
