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
      <el-form-item label="购买币种" prop="buyCurrency">
        <el-input
          v-model="queryParams.buyCurrency"
          placeholder="请输入购买币种"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>



      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="释放时间" prop="releaseTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.releaseTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择释放时间">
        </el-date-picker>
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
          v-hasPermi="['ico:IcobuyRecord:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['ico:IcobuyRecord:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['ico:IcobuyRecord:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['ico:IcobuyRecord:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="IcobuyRecordList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="释放时间" align="center" prop="id" />
      <el-table-column label="用户ID" align="center" prop="uid" />
      <el-table-column label="购买币种" align="center" prop="buyCurrency" />
      <el-table-column label="基础币种" align="center" prop="quoteCurrency" />
      <el-table-column label="购买数量" align="center" prop="buyNumber" />
      <el-table-column label="购买金额" align="center" prop="buyAmount" />
      <el-table-column label="购买单价" align="center" prop="buyPrice" />
      <el-table-column label="中签概率" align="center" prop="probability" />
      <el-table-column label="申购成功数量" align="center" prop="successNumber" />
      <el-table-column label="状态" align="center" prop="status" >
        <template slot-scope="scope">
          <span v-html="statusFormat(scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column label="释放时间" align="center" prop="releaseTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.releaseTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['ico:IcobuyRecord:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ico:IcobuyRecord:remove']"
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

    <!-- 添加或修改现货预售购买记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户ID" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="购买币种" prop="buyCurrency">
          <el-input v-model="form.buyCurrency" placeholder="请输入购买币种" />
        </el-form-item>
        <el-form-item label="基础币种" prop="quoteCurrency">
          <el-input v-model="form.quoteCurrency" placeholder="请输入基础币种" />
        </el-form-item>
        <el-form-item label="购买数量" prop="buyNumber">
          <el-input v-model="form.buyNumber" placeholder="请输入购买数量" />
        </el-form-item>
        <el-form-item label="购买金额" prop="buyAmount">
          <el-input v-model="form.buyAmount" placeholder="请输入购买金额" />
        </el-form-item>
        <el-form-item label="购买单价" prop="buyPrice">
          <el-input v-model="form.buyPrice" placeholder="请输入购买单价" />
        </el-form-item>
        <el-form-item label="中签概率" prop="probability">
          <el-input v-model="form.probability" placeholder="请输入中签概率" />
        </el-form-item>
        <el-form-item label="申购成功数量" prop="successNumber">
          <el-input v-model="form.successNumber" placeholder="请输入申购成功数量" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="释放时间" prop="releaseTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.releaseTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择释放时间">
          </el-date-picker>
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
import { listIcobuyRecord, getIcobuyRecord, delIcobuyRecord, addIcobuyRecord, updateIcobuyRecord, exportIcobuyRecord } from "@/api/bigo/IcoBuyRecord";

export default {
  name: "IcobuyRecord",
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
      // 现货预售购买记录表格数据
      IcobuyRecordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        uid: undefined,
        buyCurrency: undefined,
        quoteCurrency: undefined,
        buyNumber: undefined,
        buyAmount: undefined,
        buyPrice: undefined,
        probability: undefined,
        successNumber: undefined,
        status: undefined,
        releaseTime: undefined,
      },
      statusOptions: [
        {dictLabel: '申购中', dictValue: 0},
        {dictLabel: '已释放', dictValue: 1},
      ],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询现货预售购买记录列表 */
    getList() {
      this.loading = true;
      listIcobuyRecord(this.queryParams).then(response => {
        this.IcobuyRecordList = response.rows;
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
        uid: undefined,
        buyCurrency: undefined,
        quoteCurrency: undefined,
        buyNumber: undefined,
        buyAmount: undefined,
        buyPrice: undefined,
        probability: undefined,
        successNumber: undefined,
        status: "0",
        releaseTime: undefined,
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
      this.title = "添加现货预售购买记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getIcobuyRecord(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改现货预售购买记录";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateIcobuyRecord(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addIcobuyRecord(this.form).then(response => {
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
      this.$confirm('是否确认删除现货预售购买记录编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delIcobuyRecord(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有现货预售购买记录数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportIcobuyRecord(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    statusFormat(row, column) {
      // return this.selectDictLabel(this.statusOptions, row.status);
      if(row.status === 0) {
        return '<font color="green">' + '申购中' +'</font>'
      }else if(row.status === 1) {
        return '<font color="red">'+ '已释放' +'</font>'
      }
    },
  }
};
</script>
