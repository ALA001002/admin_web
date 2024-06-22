<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="公告标题" prop="noticeTitle">
        <el-input
          v-model="queryParams.noticeTitle"
          placeholder="请输入公告标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作人员" prop="createBy">
        <el-input
          v-model="queryParams.createBy"
          placeholder="请输入操作人员"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型" prop="noticeType">
        <el-select v-model="queryParams.noticeType" placeholder="公告类型" clearable size="small">
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="语言" prop="lang">
        <el-select v-model="queryParams.lang" placeholder="公告语言" clearable size="small">
          <el-option
            v-for="dict in langOptions"
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
          v-hasPermi="['system:notice:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:notice:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:notice:remove']"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="noticeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="noticeId" width="100" />
      <el-table-column label="公告标题" align="center" prop="noticeTitle" :show-overflow-tooltip="true" />
      <el-table-column label="公告类型" align="center" prop="noticeType" :formatter="typeFormat" width="100" />
      <el-table-column label="关键词" align="center" prop="keyWord" min-width="100" />
      <el-table-column label="语种" align="center" prop="lang" :formatter="langFormat" width="100" />
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" width="100" />
      <el-table-column label="创建者" align="center" prop="createBy" width="100" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="100">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:notice:edit']"
          >修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:notice:remove']"
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

    <!-- 添加或修改公告对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="780px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="公告标题" prop="noticeTitle">
              <el-input v-model="form.noticeTitle" placeholder="请输入公告标题" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公告类型" prop="noticeType">
              <el-select v-model="form.noticeType" placeholder="请选择" :disabled="typeDisable">
                <el-option
                  v-for="dict in typeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="语言" prop="lang">
              <el-select v-model="form.lang">
                <el-option
                  v-for="dict in langOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="文章类型" prop="keyWord" v-if="form.noticeType == '2'">
              <el-select v-model="form.keyWord">
                <el-option
                  v-for="dict in keyWordOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="form.noticeType == 5" :span="12">
            <el-form-item label="关键词">
              <el-input v-model="form.keyWord" placeholder="请输入关键词" />
            </el-form-item>
          </el-col>
          <el-col  v-if="form.noticeType == 10" :span="24">
            <el-form-item label="APP平台" prop="keyWord">
              <el-select v-model="form.keyWord"  placeholder="请选择APP平台">
                <el-option
                  v-for="dict in appOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="form.noticeType ==10" :span="12">
            <el-form-item label="版本号">
              <el-input v-model="form.source" placeholder="请输入版本号" />
            </el-form-item>
          </el-col>
          <el-col v-if="form.noticeType == 8 || form.noticeType == 9" :span="12">
            <el-form-item label="来源">
              <el-input v-model="form.source" placeholder="请输入文章来源" />
            </el-form-item>
          </el-col>
          <el-col v-if="form.noticeType == 3 || form.noticeType == 4" :span="24">
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
          </el-col>
          <el-col v-if="form.noticeType == 8 " :span="24">
            <el-form-item label="封面图片">
              <el-upload
                  list-type="picture-card"
                  :action="uploadImgUrl"
                  :on-success="uploadImg"
                  :before-upload="uploadImgBefore"
                  :headers="headers"
                  :on-remove="removeImg"
                  :file-list="fileList"
                  :limit="1"
                  >
                <i slot="default" class="el-icon-plus"></i>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过8MB，最大上传数量为1张</div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col v-if="form.noticeType != 3 && form.noticeType != 4 " :span="24">
            <el-form-item label="内容">
              <Editor v-model="form.noticeContent" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="padding-top:20px">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listNotice, getNotice, delNotice, addNotice, updateNotice, exportNotice } from "@/api/system/notice";
import Editor from '@/components/Editor';
import { getToken } from '@/utils/auth'

export default {
  name: "Notice",
  components: {
    Editor
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 公告类型禁用
      typeDisable: false,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 公告表格数据
      noticeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 类型数据字典
      statusOptions: [],
      // 语种数据字典
      langOptions: [],
      // 文章类型数据字典
      keyWordOptions: [],
      // app类型数据字典
      appOptions: [
        {dictLabel: "安卓端", dictValue: "android"},
        {dictLabel: "苹果端", dictValue: "ios"}
      ],
      // 状态数据字典
      typeOptions: [],
      uploadImgUrl: process.env.VUE_APP_BASE_API + "/common/upload", // 上传的图片服务器地址
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      fileList:[],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        noticeTitle: undefined,
        createBy: undefined,
        status: undefined,
        lang: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        noticeTitle: [
          { required: true, message: "公告标题不能为空", trigger: "blur" }
        ],
        noticeType: [
          { required: true, message: "公告类型不能为空", trigger: "blur" }
        ],
        lang: [
          { required: true, message: "公告语言不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_notice_status").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("sys_notice_type").then(response => {
      this.typeOptions = response.data;
    });
    this.getDicts("language_type").then(response => {
      this.langOptions = response.data;
    });
    this.getDicts("article_type").then(response => {
      this.keyWordOptions = response.data;
    });
  },
  methods: {
    /** 查询公告列表 */
    getList() {
      this.loading = true;
      listNotice(this.queryParams).then(response => {
        this.noticeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 公告状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 公告状态字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.noticeType);
    },
    // 语种字典翻译
    langFormat(row, column) {
      return this.selectDictLabel(this.langOptions, row.lang);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        noticeId: undefined,
        noticeTitle: undefined,
        noticeType: undefined,
        lang: undefined,
        noticeContent: undefined,
        coverImage: undefined,
        source: undefined,
        status: "0"
      };
      this.fileList = [];
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
      this.ids = selection.map(item => item.noticeId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.typeDisable = false;
      this.reset();
      this.open = true;
      this.title = "添加公告";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.typeDisable = true;
      this.reset();
      const noticeId = row.noticeId || this.ids
      getNotice(noticeId).then(response => {
        this.form = response.data;
        if(response.data.noticeType == 3){
          this.fileList = JSON.parse(response.data.noticeContent);
        }
        if(response.data.noticeType == 8){
          var img = {
            url: response.data.coverImage
          }
          this.fileList.push(img);
        }
        this.open = true;
        this.title = "修改公告";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if(this.form.noticeType == 3 || this.form.noticeType == 4){
            this.form.noticeContent = JSON.stringify(this.fileList);
          }else if(this.form.noticeType == 8){
            if(this.fileList.length > 0){
              this.form.coverImage = this.fileList[0].url;
            }
          }
          if(this.form.noticeType != 5 && this.form.noticeType != 10){
            this.form.keyWord = null;
          }
          if (this.form.noticeId != undefined) {
            updateNotice(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addNotice(this.form).then(response => {
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
      const noticeIds = row.noticeId || this.ids
      this.$confirm('是否确认删除公告编号为"' + noticeIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delNotice(noticeIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
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
