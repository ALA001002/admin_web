<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="活动币种" prop="icoCurrency">
        <el-input
          v-model="queryParams.icoCurrency"
          placeholder="请输入活动币种"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option label="进行中" value="0" />
          <el-option label="已结束" value="1" />
        </el-select>
      </el-form-item>




      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.startTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="overTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.overTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择结束时间">
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
          v-hasPermi="['ico:icoProduct:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['ico:icoProduct:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['ico:icoProduct:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['ico:icoProduct:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="icoProductList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="活动币种" align="center" prop="icoCurrency" />
      <el-table-column label="状态" align="center" prop="status" >
        <template slot-scope="scope">
          <span v-html="statusFormat(scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column label="活动总量" align="center" prop="totalNum" />
      <el-table-column label="购买价格" align="center" prop="buyPrice" />
      <el-table-column label="购买币种" align="center" prop="buyCurrency" />
      <el-table-column label="个人购买次数" align="center" prop="buyTimes" />
      <el-table-column label="个人购买数量" align="center" prop="buyNum" />
      <el-table-column label="已购买数量" align="center" prop="boughtNum" />
      <el-table-column label="开始时间" align="center" prop="startTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="overTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.overTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['ico:icoProduct:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ico:icoProduct:remove']"
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

    <!-- 添加或修改ico产品对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="活动币种" prop="icoCurrency">
          <el-select
            v-model="form.icoCurrency"
            placeholder="请选择活动币种"
            clearable
            size="small"
            style="width: 240px"
          >
            <el-option
              v-for="dict in currencyOptions"
              :key="dict.enumName"
              :label="dict.enumName"
              :value="dict.enumName"
            />
          </el-select>
        </el-form-item>

<!--        <el-form-item label="状态：0-进行中，1-已结束">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>-->
        <el-form-item label="活动总量" prop="totalNum">
          <el-input v-model="form.totalNum" placeholder="请输入活动总量" />
        </el-form-item>
        <el-form-item label="购买价格" prop="buyPrice">
          <el-input v-model="form.buyPrice" placeholder="请输入购买价格" />
        </el-form-item>
        <el-form-item label="个人购买次数" prop="buyTimes">
          <el-input v-model="form.buyTimes" placeholder="请输入个人购买次数" />
        </el-form-item>
        <el-form-item label="个人购买数量" prop="buyNum">
          <el-input v-model="form.buyNum" placeholder="请输入个人购买数量" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.startTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="overTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.overTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            list-type="picture-card"
            :action="uploadImgUrl"
            :on-success="uploadImg"
            :before-upload="uploadImgBefore"
            :headers="headers"
            :on-remove="removeImg"
            :file-list="fileList"
            :limit="5"
          >
            <i slot="default" class="el-icon-plus"></i>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过1000kb，最大上传数量为5张</div>
          </el-upload>
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
import { listIcoProduct, getIcoProduct, delIcoProduct, addIcoProduct, updateIcoProduct, exportIcoProduct, getCurrencyList } from "@/api/bigo/icoProduct";
import { getToken } from '@/utils/auth'

export default {
  name: "IcoProduct",
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
      // ico产品表格数据
      icoProductList: [],
      currencyOptions : [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        icoCurrency: undefined,
        status: undefined,
        totalNum: undefined,
        buyPrice: undefined,
        buyCurrency: undefined,
        buyTimes: undefined,
        buyNum: undefined,
        boughtNum: undefined,
        startTime: undefined,
        overTime: undefined,
      },
      // 表单参数
      form: {},
      uploadImgUrl: process.env.VUE_APP_BASE_API + "/common/upload", // 上传的图片服务器地址
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      fileList:[],
      // 表单校验
      rules: {
        status: [
          { required: true, message: "状态：0-进行中，1-已结束不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询ico产品列表 */
    getList() {
      this.loading = true;
      listIcoProduct(this.queryParams).then(response => {
        this.icoProductList = response.rows;
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
        icoCurrency: undefined,
        status: "0",
        totalNum: undefined,
        buyPrice: undefined,
        buyCurrency: undefined,
        buyTimes: undefined,
        buyNum: undefined,
        boughtNum: undefined,
        startTime: undefined,
        overTime: undefined,
        createTime: undefined,
        logoImg: undefined
      };
      this.resetForm("form");
      this.fileList = [];
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
      getCurrencyList().then(response => {
        this.currencyOptions = response.rows
      });

      this.open = true;
      this.title = "添加ico产品";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getIcoProduct(id).then(response => {
        this.form = response.data;
        var img = {
          url: response.data.logoImg
        }
        this.fileList.push(img);
        this.open = true;
        this.title = "修改ico产品";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if(this.fileList.length > 0){
            this.form.logoImg = this.fileList[0].url;
          }
          if (this.form.id != undefined) {
            updateIcoProduct(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addIcoProduct(this.form).then(response => {
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
      this.$confirm('是否确认删除ico产品编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delIcoProduct(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有ico产品数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportIcoProduct(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    statusFormat(row, column) {
      if(row.status == 0){
        return '<font color="green">' + '进行中' +'</font>'
      }else if(row.status == 1){
        return '<font color="red">'+ '已结束' +'</font>'
      }
      return '-';
    },

    // 图片上传前
    uploadImgBefore(file) {
      let fileType = file.type;
      if(fileType === 'image/jpeg' || fileType === 'image/png'){
        return true;
      }else {
        this.$message.error('请插入图片类型文件(jpg/jpeg/png)');
        return false;
      }
    },
    //上传图片
    uploadImg(res, file) {
      // res为图片服务器返回的数据
      // 如果上传成功
      if (res.code == 200) {
        var img = {
          url: res.url
        }
        this.fileList.push(img);
      } else {
        this.$message.error("图片插入失败");
      }
    },
    removeImg(file, fileList){
      var index = this.fileList.findIndex(item => {
        if ( item.uid == file.uid) {
          return true;
        }
      });
      this.fileList.splice(index,1)
    }
  }
};
</script>
