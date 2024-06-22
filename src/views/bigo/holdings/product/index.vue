<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="产品名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入产品名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>



      <el-form-item label="产品类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择类型" clearable size="small">

          <el-option
            v-for="dict in typeOptions"
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
          v-hasPermi="['holdings:product:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['holdings:product:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['holdings:product:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['holdings:product:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="productList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="产品名称" align="center" prop="name" />

      <el-table-column label="产品类型" align="center" prop="type"  >
        <template slot-scope="scope">
          <span v-html="typeFormat(scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column label="购买人数" align="center" prop="buyNumber" />
      <el-table-column label="创建时间" align="center" prop="createTime" min-width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['holdings:product:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['holdings:product:remove']"
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

    <!-- 添加或修改智能持仓产品对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入产品名称" />
        </el-form-item>
        <el-form-item label="产品类型">
          <el-select v-model="form.type" placeholder="请选择产品类型">
            <el-option
              v-for="dict in typeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-for="(item, index) in form.symbolJsonArry" :key="index" :label="'币种比例' + (index + 1)">
          <el-col :span="8">
          <el-form-item label="币种" :prop="'symbolJsonArry.'+index+'.symbol'"  label-width="50px">
            <el-select v-model="item.symbol" placeholder="请选择产品类型">
              <el-option
                v-for="dict in coinTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          </el-col>
          <el-col :span="8">
          <el-form-item label="比例(%)" :prop="'symbolJsonArry.'+index+'.ratio'"  label-width="80px">
            <el-input v-model.trim="item.ratio" style="width: 100px" />
          </el-form-item>
          </el-col>
          <el-col :span="5">
          <el-form-item>
            <el-button @click.prevent="removeSymbolSetting(item)">删除</el-button>
          </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label=" ">
          <el-button icon="el-icon-circle-plus-outline" @click="addSymbolSetting()">新增币种设置</el-button>
        </el-form-item>

        <el-form-item v-for="(item, index) in form.timeJsonArry" :key="index" :label="'持仓时间' + (index + 1)">
          <el-col :span="9">
            <el-form-item label="持仓(分钟)" :prop="'timeJsonArry.'+index+'.minute'"  label-width="100px">
              <el-select v-model="item.minute" placeholder="持仓时间">
                <el-option
                  v-for="dict in minuteOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收益(%)" :prop="'timeJsonArry.'+index+'.gain'"  label-width="80px">
              <el-input v-model.trim="item.gain" style="width: 100px" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-button @click.prevent="removeTimeSetting(item)">删除</el-button>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label=" ">
          <el-button icon="el-icon-circle-plus-outline" @click="addTimeSetting()">新增持仓时间</el-button>
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
import { listProduct, getProduct, delProduct, addProduct, updateProduct, exportProduct } from "@/api/bigo/holdingsProduct";

export default {
  name: "Product",
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
      // 智能持仓产品表格数据
      productList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        buyNumber: undefined,
        symbolJson: undefined,
        timeJson: undefined,
        type: undefined,
      },
      // 表单参数
      form: {

      },
      // 表单校验
      rules: {
      },
      typeOptions: [
        {dictLabel: '常规', dictValue: 1},
        {dictLabel: '信号', dictValue: 2},
      ],
      minuteOptions: [],
      coinTypeOptions:[]
    };
  },
  created() {
    this.getList();
    this.getDicts("bigo_coin_type").then(response => {
      this.coinTypeOptions = response.data;
    });
    this.getDicts("holdings_minute").then(response => {
      this.minuteOptions = response.data;
    });
  },
  methods: {
    /** 查询智能持仓产品列表 */
    getList() {
      this.loading = true;
      listProduct(this.queryParams).then(response => {
        this.productList = response.rows;
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
        name: undefined,
        buyNumber: undefined,
        symbolJsonArry: [],
        timeJsonArry: [],
        type: undefined,
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
      this.open = true;
      this.title = "添加智能持仓产品";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getProduct(id).then(response => {
        // this.form = response.data;
        this.form.id = response.data.id;
        this.form.name= response.data.name;
        this.form.timeJson= response.data.timeJson;
        this.form.type= response.data.type;
        if(response.data.symbolJson != null) {
          this.form.symbolJsonArry = JSON.parse(response.data.symbolJson);
        }
        if(response.data.timeJson != null) {
          this.form.timeJsonArry = JSON.parse(response.data.timeJson);
        }
        this.open = true;
        this.title = "修改智能持仓产品";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        const symbolJsonString = JSON.stringify(this.form.symbolJsonArry);
        this.form.symbolJson = symbolJsonString;

        const timeJsonString = JSON.stringify(this.form.timeJsonArry);
        this.form.timeJson = timeJsonString;

        if (valid) {
          if (this.form.id != undefined) {
            updateProduct(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addProduct(this.form).then(response => {
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
      this.$confirm('是否确认删除智能持仓产品编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delProduct(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有智能持仓产品数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportProduct(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    removeSymbolSetting(item) {
      var index = this.form.symbolJsonArry.indexOf(item)
      if (index !== -1) {
        this.form.symbolJsonArry.splice(index, 1)
      }
    },
    addSymbolSetting() {
      this.form.symbolJsonArry.push({
        'symbol': '',
        'ratio': '',
      })
    },

    removeTimeSetting(item) {
      var index = this.form.timeJsonArry.indexOf(item)
      if (index !== -1) {
        this.form.timeJsonArry.splice(index, 1)
      }
    },
    addTimeSetting() {
      this.form.timeJsonArry.push({
        'minute': '',
        'gain': '',
      })
      console.log(this.form)
    },
    typeFormat(row, column) {
      if(row.type == 2) {
        var typeName = this.selectDictLabel(this.typeOptions, row.type);
        return '<font color="red">'+ typeName +'</font>'
      }else{
        return this.selectDictLabel(this.typeOptions, row.type);
      }
    },
  }
};
</script>
