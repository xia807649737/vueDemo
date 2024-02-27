<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" class="searchContainer"
      label-width="90px">
      <el-form-item label="版本名称" prop="versionName">
        <el-input v-model="queryParams.versionName" placeholder="请输入版本名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="版本号" prop="versionNo">
        <el-input v-model="queryParams.versionCode" placeholder="请输入版本号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item label="是否强制更新" prop="forceUpdate" label-width="100px">
        <el-select v-model="queryParams.forceUpdate" placeholder="请选择" clearable style="width: 215px">
          <el-option v-for="dict in dict.type.yes_or_no" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary"  icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['service:version:add']" class="btnOriginal btnAdd">新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning"  icon="el-icon-upload2" size="mini" @click="handleExport"
          v-hasPermi="['service:version:export']" class="btnOriginal btnDefault">导出
        </el-button>
      </el-col>
      <el-popover placement="right" width="800" trigger="click">
        <el-descriptions>
          <el-descriptions-item label="yh-grid-ui版本">{{ webAppVersion }}</el-descriptions-item>
          <el-descriptions-item label="构建者">{{ buildAuthor }}</el-descriptions-item>
          <el-descriptions-item label="构建环境">{{ buildEnv }}</el-descriptions-item>
          <el-descriptions-item label="构建版本commit id">{{ buildRevision }}</el-descriptions-item>
          <el-descriptions-item label="构建时间">{{ buildTimestampFormatted }}</el-descriptions-item>
        </el-descriptions>
        <el-button slot="reference" size="mini" circle icon="el-icon-warning-outline" />
      </el-popover>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList">
      </right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="versionList" border @selection-change="handleSelectionChange"
      :row-style="{ height: 60 + 'px' }" :cell-style="{ padding: '0' }" height="500" stripe>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="版本名称" align="center" prop="versionName" />
      <el-table-column label="版本号" align="center" prop="versionCode" />
      <el-table-column label="更新说明" align="center" prop="content" show-overflow-tooltip />
      <el-table-column label="应用包名" align="center" prop="packageName" />
      <el-table-column label="下载路径" align="center" prop="downloadUrl" />
      <el-table-column label="大小" align="center" prop="size" />
      <el-table-column label="是否强制更新" align="center" prop="forceUpdate">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.jm_yes_no" :value="scope.row.forceUpdate" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="操作" align="center" fixed="right" width="300">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['service:version:edit']">修改
          </el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['service:version:remove']">删除
          </el-button>
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="openversion(scope.row)"
            v-hasPermi="['service:version:edit']">增量计算
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改版本管理 对话框 -->
    <el-drawer :title="title" :visible.sync="open" direction="rtl" custom-class="demo-drawer" size="960px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="drawerForm">
        <el-col :span="12">
          <el-form-item label="版本名称" prop="versionName">
            <el-input v-model="form.versionName" placeholder="请输入版本名称" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="版本号" prop="versionCode">
            <el-input v-model="form.versionCode" placeholder="请输入版本号" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="应用包名" prop="packageName">
            <el-input v-model="form.packageName" placeholder="请输入应用包名" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="大小" prop="size">
            <el-input v-model="form.size" placeholder="请输入大小" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="更新说明" >
            <editor v-model="form.content"  :min-height="192" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="是否强制更新" prop="forceUpdate" label-width="110px">
            <template>
              <el-radio v-model="form.forceUpdate" :label="1">是</el-radio>
              <el-radio v-model="form.forceUpdate" :label="0">否</el-radio>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <!--          <el-form-item label="下载路径">-->

          <!--              <el-upload-->
          <!--                class="upload-demo"-->
          <!--                :action="uploadUrl"-->
          <!--                :on-preview="handlePreview"-->
          <!--                :on-remove="handleRemove"-->
          <!--                :before-remove="beforeRemove"-->
          <!--                :on-success="upload_success"-->
          <!--                :on-error="upload_error"-->
          <!--                multiple-->
          <!--                :limit="1"-->
          <!--                :on-exceed="handleExceed"-->
          <!--                :headers="headers"-->
          <!--                :file-list="fileList"-->
          <!--              >-->
          <!--                <el-button size="small" type="primary">点击上传</el-button>-->
          <!--                <div slot="tip" class="el-upload__tip">只能上传apk文件</div>-->
          <!--              </el-upload>-->
          <!--          </el-form-item>-->
          <el-form-item label="上传文件" v-if="(title = '添加版本管理')">
            <uploader  :options="options" class="uploader-example" :file-status-text="options.statusText" ref="uploader"
              @file-complete="fileComplete" @complete="complete">
              <uploader-unsupport></uploader-unsupport>
              <uploader-drop>
                <uploader-btn>select files</uploader-btn>
              </uploader-drop>
              <uploader-list></uploader-list>
            </uploader>
          </el-form-item>
        </el-col>
      </el-form>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div> -->
      <div class="drawer-footerContent">
        <el-button style="margin-left: 400px;" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-drawer>
    <el-dialog :title="title" :visible.sync="opens" width="700px" append-to-body>
      <div class="titlehistory">目标版本</div>
      <el-table :data="list" border>
        <el-table-column label="版本名称" align="center">
          <template>{{ versionNodetail }}</template>
        </el-table-column>
        <el-table-column label="版本号" align="center">
          <template>{{ versioncodedetail }}</template>
        </el-table-column>
      </el-table>
      <div class="titleshistory">历史版本</div>
      <el-table :data="lists" border @selection-change="handleSelectionChanges">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="版本名称" align="center" prop="versionNo">

        </el-table-column>
        <el-table-column label="版本号" align="center" prop="versionCode">

        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormupdate">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listVersion,
  getVersion,
  delVersion,
  addVersion,
  updateVersion,
  updatingVersion
} from "@/api/version/index";
import { getToken } from "@/utils/auth";
import { delInfoAndFile, mergeFile } from "@/api/system/file";
import moment from 'moment';
import store from '@/store'
export default {
  name: "Version",
  dicts: ["yes_or_no"],
  data() {
    return {
      uploadUrl: process.env.VUE_APP_BASE_API + "/system/info/add",
      options: {
        target: process.env.VUE_APP_BASE_API + "/version/chunk",
        testChunks: false,
        simultaneousUploads: 1,
        chunkSize: 10 * 1024 * 1024,
        singleFile: true,
        statusText: {
          success: "上传成功",
          error: "出错了",
          uploading: "上传中",
          paused: "暂停中",
          waiting: "等待中",
        },
      },
      attrs: {
        accept: "*/*",
      },
      fileList: [],
      //请求头中添加限制上传的文件格式
      headers: { Authorization: "Bearer " + getToken(), fileType: "apk" },
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示查询条件
      showSearch: true,
      // 总条数
      total: 0,
      // 版本管理 表格数据
      versionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      opens: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        versionName: null,
        versionNo: null,
        content: null,
        packageName: null,
        downloadUrl: null,
        size: null,
        forceUpdate: null,
        flag: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        versionName: [
          {
            required: true,
            message: "请先上传文件获取应用信息",
            trigger: "blur",
          },
        ],
        versionNo: [
          {
            required: true,
            message: "请先上传文件获取应用信息",
            trigger: "blur",
          },
        ],
        content: [
          { required: true, message: "更新说明不能为空", trigger: "blur" },
        ],
        forceUpdate: [
          { required: true, message: "请选择是否强制更新", trigger: "blur" },
        ],
      },
      versionNodetail: "",
      versioncodedetail: "",
      list: [],
      lists: [],
      updateids: [],
      taskhandle: {
        targetVersionId: null,
        beforeVersionIdList: []

      },
      webAppVersion: store.getters.appVersion,
      buildAuthor: null,
      buildRevision: null,
      buildTimestamp: null,
      buildEnv: null
    };
  },

  created() {
    this.getList();
    // 获取构建信息
    this.buildAuthor = store.getters.buildAuthor
    this.buildRevision = store.getters.buildRevision
    this.buildTimestamp = store.getters.buildTimestamp
    this.buildEnv = store.getters.env
  },
  computed: {
    buildTimestampFormatted: function () {
      return moment(this.buildTimestamp).format('YYYY-MM-DD HH:mm:ss')
    }

  },
  mounted() {
    this.$nextTick(() => {
      window.uploader = this.$refs.uploader;
    });
  },
  methods: {
    handleSelectionChanges(selection) {
      this.updateids = selection.map((item) => item.id);
    },
    submitFormupdate() {
      this.taskhandle = {
        targetVersionId: this.taskhandle.targetVersionId,
        beforeVersionIdList: this.updateids
      }
      updatingVersion(this.taskhandle).then((response) => {
        this.$modal.msgSuccess("提交成功");
        this.opens = false;
        // this.getList();
      });
    },
    openversion(row) {
      this.opens = true;
      this.versionNodetail = row.versionNo;
      this.versioncodedetail = row.versionCode;
      this.taskhandle.targetVersionId = row.id
      listVersion().then((response) => {
        this.list = response.rows.slice(0, 1);
        console.log(response);
        //过滤名字和版本号
        let result = response.rows.filter(function (item,index) {
          return index != 0
        })
        this.lists = result;
      });
    },
    /** 查询版本管理列表 */
    getList() {
      this.loading = true;
      listVersion(this.queryParams).then((response) => {
        this.versionList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      if (this.form.fileId != undefined) {
        delInfoAndFile({
          filePath: this.form.downloadUrl,
          fileId: this.form.fileId,
        });
      }
      this.reset();
    },

    // 表单重置
    reset() {
      this.fileList = [];
      this.form = {
        id: null,
        versionName: null,
        versionNo: null,
        content: null,
        packageName: null,
        downloadUrl: null,
        size: null,
        forceUpdate: null,
        flag: null,
        createTime: null,
        updateTime: null,
      };
      this.resetForm("form");
    },
    /** 查询按钮操作 */
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
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加版本管理 ";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;

      getVersion(id).then((response) => {
        console.log(response.data);
        this.form = response.data;
        this.open = true;
        this.title = "修改版本管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateVersion(this.form).then((response) => {
              console.log(this.form);
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addVersion(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除版本管理 编号为"' + ids + '"的数据项？')
        .then(function () {
          return delVersion(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "/version/export",
        {
          ...this.queryParams,
        },
        `version_${new Date().getTime()}.xlsx`
      );
    },
    handleRemove(file, fileList) {
      //删除文件信息以及文件
      delInfoAndFile({
        filePath: this.form.downloadUrl,
        fileId: this.form.fileId,
      });
      this.form.fileId = undefined;
      // console.log(file, fileList);
    },
    handlePreview(file) { },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    upload_success(response, file, fileList) {
      console.log(response.code);
      if (response.code === 200) {
        this.form.downloadUrl = response.data.filePath;
        this.form.fileId = response.data.fileId;
        this.form.versionName = response.data.apkVersion;
        this.form.versionNo = response.data.apkVersion;
        this.form.size = response.data.apkSize;
        this.form.packageName = response.data.apkName;
      } else if (response.code === 500) {
        this.$message.warning(response.msg);
      }
    },
    upload_error(response) {
      this.$message.warning(response.msg);
    },
    complete() {
      // console.log('complete', arguments)
    },
    // 一个根文件（文件夹）成功上传完成。
    fileComplete() {
      // console.log('file complete', arguments)
      const file = arguments[0].file;
      let data = {
        fileName: file.name,
        identifier: arguments[0].uniqueIdentifier,
        totalSize: file.size,
        type: file.type,
      };
      mergeFile(data).then((response) => {
        console.log(response);
        if (response.code === 200) {
          this.form.downloadUrl = response.data.filePath;
          this.form.fileId = response.data.fileId;
          this.form.versionName = response.data.apkVersion;
          this.form.versionNo = response.data.apkVersion;
          this.form.versionCode = response.data.apkVersionCode;
          this.form.md5Checksum = response.data.md5Checksum;
          this.form.fileSizeByte = response.data.totalSize;
          this.form.size = response.data.apkSize;
          this.form.packageName = response.data.apkName;
        } else if (response.code === 500) {
          this.$message.warning(response.msg);
        }
      });
    },
  },
};
</script>
<style scoped lang="scss">
::v-deep .el-input--suffix {
  width: 200px;
}

::v-deep .uploader-example {
  width: 830px;
  padding: 15px;
  margin: 40px auto 0;
  font-size: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
}

::v-deep .uploader-example .uploader-btn {
  margin-right: 4px;
}

::v-deep .uploader-example .uploader-list {
  max-height: 440px;
  overflow: auto;
  overflow-x: hidden;
  overflow-y: auto;
}

::v-deep .titlehistory {
  text-align: center;
  margin-bottom: 10px;
  font-size: 20px;
}

::v-deep .titleshistory {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 20px;
}

::v-deep .el-table .hidden_box {
  display: none;
}
</style>
