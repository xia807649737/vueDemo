<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="分类" prop="category">
        <el-input v-model="queryParams.category" placeholder="请输入分类" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="药品名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入药品名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="通用名" prop="commonName">
        <el-input v-model="queryParams.commonName" placeholder="请输入通用名" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="生产企业" prop="produceCompany">
        <el-input v-model="queryParams.produceCompany" placeholder="请输入生产企业" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="剂型" prop="dosage">
        <el-input v-model="queryParams.dosage" placeholder="请输入剂型" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="批准文号" prop="approvalNo">
        <el-input v-model="queryParams.approvalNo" placeholder="请输入批准文号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="是否处方" prop="isPrescription">
        <el-select v-model="queryParams.isPrescription" placeholder="请选择是否处方药" clearable>
          <!-- <el-option v-for="dict in dict.type.y_or_n" :key="dict.value" :label="dict.label" :value="dict.value" /> -->
          <el-option  :label="'是'" :value="1" />
          <el-option  :label="'否'" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="医保编码" prop="medicalCode">
        <el-input v-model="queryParams.medicalCode" placeholder="请输入国家医保编码" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['standard:standard:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['standard:standard:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['standard:standard:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['/standard/export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="standardList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="主键id" align="center" prop="id" /> -->
      <!-- <el-table-column label="系统编号" align="center" prop="code" /> -->
      <el-table-column label="药品名称" align="center"  width="200px" >
        <template v-slot="{row}">
          <span style="color:#45a6ff">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分类" align="center" prop="category" />
      <!-- <el-table-column label="通用名" align="center" prop="commonName" /> -->
      <el-table-column label="注册商标" align="center" prop="registTrademark" />
      <el-table-column label="规格" align="center" prop="specification" width="200px"/>
      <el-table-column label="生产企业" align="center" prop="produceCompany"  width="240px"/>
      <el-table-column label="剂型" align="center" prop="dosage" width="150px"/>
      <el-table-column label="计量单位" align="center" prop="dosageUnit" width="200px"/>
      <el-table-column label="包装单位" align="center" prop="packageUnit" />
      <el-table-column label="批准文号" align="center" prop="approvalNo"  width="200px"/>
      <el-table-column label="是否处方" align="center" prop="isPrescription" >
        <template slot-scope="scope">
          <!-- <dict-tag :options="dict.type.y_or_n" :value="scope.row.isPrescription" /> -->
          <el-tag  v-if="scope.row.isPrescription == 1">{{ scope.row.isPrescription == '1' ? '是' : '否'
          }}</el-tag>
          <el-tag type="danger" v-else>{{ scope.row.isPrescription == '2' ? '否' : '是' }}</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column label="国家医保编码" align="center" prop="medicalCode" /> -->
      <!-- <el-table-column label="最小包装数量" align="center" prop="minPackageNum" /> -->
      <el-table-column label="操作" align="center" width="120" fixed="right" >
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['standard:standard:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['standard:standard:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" /> -->
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="queryParams.pageNum" :page-sizes="[10, 20, 30, 40, 50]"
      layout="->,total, prev, pager, next,sizes, jumper" :total="total">
    </el-pagination>
    <!-- 添加或修改药房对话框 -->
    <el-drawer :before-close="handleClose" :wrapperClosable="wrapperClosable" :title="title" :visible.sync="open"
      append-to-body :size="size">
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-row style="padding-right:20px;">
          <el-col :span="12">
            <el-form-item label="药房名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入药房名称" />
            </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="药房简称" prop="simpleName">
              <el-input v-model="form.simpleName" placeholder="请输入药房简称" />
            </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="地址" prop="address">
              <el-input v-model="form.address" placeholder="请输入地址" />
            </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="门店电话" prop="pharmacyNum">
              <el-input v-model="form.pharmacyNum" placeholder="请输入门店电话" />
            </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="营业时间" prop="businessHours">
              <el-input v-model="form.businessHours" placeholder="营业时间格式为00:00-00:00" />
            </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="信息联系人" prop="infoContact">
              <el-input v-model="form.infoContact" placeholder="请输入信息联系人" />
            </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="信息联系人电话" prop="infoContactNum">
              <el-input v-model="form.infoContactNum" placeholder="请输入信息联系人电话" />
            </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="contact">
              <el-input v-model="form.contact" placeholder="请输入负责人" />
            </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="负责人电话" prop="contactNum">
              <el-input v-model="form.contactNum" placeholder="请输入负责人电话" />
            </el-form-item></el-col>
            <el-col :span="12">
            <el-form-item label="经度" prop="longitude">
              <el-input v-model="form.longitude" placeholder="请输入经度" />
            </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="纬度" prop="latitude">
              <el-input v-model="form.latitude" placeholder="请输入纬度" />
            </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="统一社会信用代码" prop="creditCode">
              <el-input v-model="form.creditCode" placeholder="请输入统一社会信用代码" />
            </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="国家医保门店编码" prop="medicareCode">
              <el-input v-model="form.medicareCode" placeholder="请输入国家医保门店编码" />
            </el-form-item></el-col>

          <el-col :span="12">
            <el-form-item label="请选择机构或药房" prop="type">
              <el-radio-group v-model="form.type">
                <el-radio :label="1">药房</el-radio>
                <el-radio :label="2">机构</el-radio>
              </el-radio-group>
            </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="请选择分管机构" prop="deptId">
              <el-select v-model="form.deptId" placeholder="请选择">
                <el-option v-for="item in deptId" :key="item.deptId" :label="item.deptName" :value="item.deptId">
                </el-option>
              </el-select>
            </el-form-item></el-col>
            <el-col :span="24">
              <el-form-item style="text-align: center; margin-top: 30px; margin-left: 240px;">
                <el-button v-if="this.isEdit" style="margin-right: 30px;" type="primary" @click="submitForm">确定</el-button>
                <el-button v-else style="margin-right: 30px;" type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
              </el-form-item>
            </el-col>
        </el-row>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import { listStandard, getStandard, delStandard, addStandard, updateStandard } from "@/api/standard/standard";
import { getToken } from "@/utils/auth";

export default {
  name: "Standard",
  dicts: ['y_or_n', 'common_status'],
  data() {
    return {
      size: '50%',
      apiUrl: process.env.VUE_APP_BASE_URl + '/prod-api/common/upload',//图片上传
      beasUrl: process.env.VUE_APP_BASE_URl,
      imageUrl: '',
      // 新增修改弹窗遮罩层
      wrapperClosable: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      prodApi: '/prod-api',
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 药品标准表格数据
      standardList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        category: undefined,
        name: undefined,
        commonName: undefined,
        produceCompany: undefined,
        dosage: undefined,
        approvalNo: undefined,
        isPrescription: undefined,
        medicalCode: undefined,
      },
      headers: {
        Authorization: "Bearer " + getToken()
      },
      // 表单参数
      form: {
        isPrescription: '1'
      },
      // 表单校验
      rules: {
        category: [
          { required: true, message: "分类不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "药品名称不能为空", trigger: "blur" }
        ],
        commonName: [
          { required: true, message: "通用名不能为空", trigger: "blur" }
        ],
        registTrademark: [
          { required: true, message: "注册商标不能为空", trigger: "blur" }
        ],
        produceCompany: [
          { required: true, message: "生产企业不能为空", trigger: "blur" }
        ],
        specification: [
          { required: true, message: "规格不能为空", trigger: "blur" }
        ],
        dosage: [
          { required: true, message: "剂型不能为空", trigger: "blur" }
        ],
        dosageUnit: [
          { required: true, message: "计量单位不能为空", trigger: "blur" }
        ],
        approvalNo: [
          { required: true, message: "批准文号不能为空", trigger: "blur" }
        ],
        isPrescription: [
          { required: true, message: "是否处方药不能为空", trigger: "change" }
        ],
        url: [
          { required: true, message: "图片路径不能为空", trigger: "blur" }
        ],
        urlSuolue: [
          { required: true, message: "缩略图不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    // 药品列表
    this.getList();
  },
  methods: {
    // 新增修改弹窗右上角x事件
    handleClose(dona) {
      this.reset();
      this.open = false;
      this.imageUrl = ''
    },
    // 头像上传
    handleAvatarSuccess(response) {
      this.imageUrl = response.url
      this.form.urlSuolue = response.urlSuolue
      this.form.url = response.url
    },
    // 判断头像上传的格式
    beforeAvatarUpload(file) {
      // 文件大小限制为800k;
      const isJPG = file.type === 'image/jpg' ||
        file.type === 'image/jpeg' ||
        file.type === 'image/png'
      const isLt2MB = file.size / 1024 < 2048;
      if (!isJPG) {
        this.$message.error('上传药品图片只能是 JPG/JPEG/PNG 格式!');
      }
      if (!isLt2MB) {
        this.$message.error('上传药品图片大小不能超过 2MB!');
      }
      // 文件尺寸限制为800px*500px;
      const isSize = new Promise(function (resolve, reject) {
        const width = 800;
        const height = 500;
        const _URL = window.URL || (window).webkitURL;
        const image = new Image();
        image.onload = function () {
          const valid = image.width <= width && image.height <= height;
          valid ? resolve() : reject();
        };
        image.src = _URL.createObjectURL(file);
      }).then(
        () => {
          return file;
        },
        () => {
          this.$message.error("药品图片宽度不得超过800,高度不得超过500");
          return Promise.reject()
        }
      );
      return isJPG && isLt2MB && isSize;
    },
    /** 查询药品标准列表 */
    getList() {
      this.loading = true;
      listStandard(this.queryParams).then(response => {
        this.standardList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 新增页取消按钮
    cancel() {
      this.open = false;
      this.reset();
      this.imageUrl = ''
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        code: null,
        category: null,
        name: null,
        commonName: null,
        englishName: null,
        phoneticCode: null,
        registTrademark: null,
        produceCompany: null,
        specification: null,
        dosage: null,
        dosageUnit: null,
        packageUnit: null,
        approvalNo: null,
        barCode: null,
        isPrescription: null,
        medicalCode: null,
        minPackageNum: null,
        minPackageUnit: null,
        url: null,
        urlSuolue: null,
        createTime: null,
        createBy: null,
        updateBy: null,
        updateTime: null,
        reserve1: null,
        reserve2: null,
        status: null,
        remark: null,
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
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.edit = true
      this.reset();
      this.open = true;
      this.title = "添加药品标准";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      // console.log(row);
      this.edit = false
      this.reset();
      const id = row.id || this.ids
      getStandard(id).then(response => {
        this.form = response.data;
        this.open = true;
        // console.log(response);
        this.imageUrl = row.url
        this.form.url = row.url
        this.form.urlSuolue = row.urlSuolue
        this.title = "修改药品标准";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            // 编辑提交
            updateStandard(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
              this.imageUrl = ''
            });
          } else {
            // 新增提交
            addStandard(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除药品标准编号为"' + ids + '"的数据项？').then(function () {
        return delStandard(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('/standard/export', {
        ...this.queryParams
      }, `standard_${new Date().getTime()}.xlsx`)
    },
    // 分页
    handleSizeChange(v){
      this.queryParams.pageSize=v
      this.getList();
    },
    // 分页
    handleCurrentChange(v){
      this.queryParams.pageNum=v
      this.getList();
    }
  }
};

</script>
<style scoped>
.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  height: 100px;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 25px;
  color: #8c939d;
  line-height: 50px;
  text-align: center;
  margin-left: 140%;
  margin-top: 90%;
}

.avatar {
  width: 100%;
  height: 50px;
  display: block;
}

::v-deep .el-input__inner {
  height: 34px;
}
</style>
