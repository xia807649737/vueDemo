<template>
  <div class="container">
    <el-form :model="pharmacyQuery" ref="queryForm" size="small" :inline="true">
      <el-form-item label="药房名称" prop="actualNleame" label-width="70px">
        <el-input v-model="pharmacyQuery.actualNleame" @clear="clearable" placeholder="请输入药房名称" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="pharmacyQuery.address" placeholder="请输入地址" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="统一信用代码" prop="creditCode">
        <el-input v-model="pharmacyQuery.creditCode" placeholder="请输入统一信用代码" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="国家医保编号" prop="medicareCode">
        <el-input v-model="pharmacyQuery.medicareCode" placeholder="请输入国家医保编号" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['drugstore:drugstore:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['/drugstore:drugstore:export']">导出</el-button>
      </el-col>
    </el-row>
    <div style="margin-top: 20px;">
      <el-row :gutter="24">
        <el-col :span="3">
          <div class="pharmacyList">
            <div class="tree">
              <el-tree :data="pharmacyListData" ref="menuTree" node-key="id" :props="defaultProps"
                :expand-on-click-node="false" @node-click="handleNodeClick"></el-tree>
            </div>
          </div>
        </el-col>
        <el-col :span="21">
          <div class="grid-content bg-purple">
            <el-table style="font-size: 14px" :data="pharmacyList" class="stockDataTable">
              <el-table-column align="center" label="序号" type="index" width="50px">
              </el-table-column>
              <el-table-column label="药房名称" width="200px" align="center">
                <template v-slot="{ row }">
                  <span style="color:#45a6ff">{{ row.simpleName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="地址" prop="address" width="530px" align="center"></el-table-column>
              <el-table-column label="统一社会信用代码" prop="creditCode" width="200px" align="center"></el-table-column>
              <el-table-column label="国家医保门店编码" prop="medicareCode" width="200px" align="center"></el-table-column>
              <el-table-column label="门店电话" prop="pharmacyNum" width="200px" align="center"></el-table-column>
              <el-table-column label="负责人" prop="contact" width="100px" align="center"></el-table-column>
              <el-table-column label="负责人电话" prop="contactNum" width="150px" align="center"></el-table-column>
              <el-table-column label="数据状态" align="center" fixed="right">
                <template slot-scope="scope">
                  <!-- 0 未录入 ，1是已录入 -->
                  <span :class="scope.row.updateStatus == 0 ? 'wuxiao' : 'youxiao'">{{ scope.row.updateStatus == 0 ?
                    '无效库存' : '有效库存' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" fixed="right">
                <!-- <template slot-scope="scope">
          <span @click="IsbeOnline(scope.row.id, scope.row.status)"
            :class="scope.row.status == 1 ? 'shangxian' : 'xiaxian'">{{ scope.row.status == 1 ? '下架' : '上架' }}</span>
        </template> -->
                <template v-slot="{ row }">
                  <el-button size="mini" type="text" icon="el-icon-edit" @click="editUpdate(row)"
                    v-hasPermi="['/drugstore:drugstore:edit']">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="pharmacyQuery.pageNum" :page-sizes="[10, 20, 30, 40, 50]"
      layout="total, prev, pager, next,sizes, jumper" :total="total">
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
            <el-form-item label="门店电话" prop="pharmacyNum">
              <el-input v-model="form.pharmacyNum" placeholder="请输入门店电话" />
            </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="地址" prop="address">
              <el-input v-model="form.address" placeholder="请输入地址" />
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
import { getPharmacyList, updateStatus, listDept, drugstore, modifyPharmacy, deptTreeSelect } from "@/api/home";

export default {
  data() {
    return {
      // 左侧树形结构
      defaultProps: {
        label: 'label',
        children: 'children'
      },
      pharmacyListData: [], //药房数据列表
      deptIdNum: 100,//左侧树形
      simpleName: undefined,
      isEdit: false,
      title: '',  //修改或添加标题
      size: '50%',
      // 是否显示弹出层
      open: false,
      // 新增修改弹窗遮罩层
      wrapperClosable: false,
      // 所管部门列表
      deptId: [],
      // 新增、修改字段
      form: {
        type: 1
      },
      // 查询字段
      pharmacyQuery: {
        actualNleame: '',//药房名称
        creditCode: '',//信用代码
        medicareCode: '',//医保编号
        address: '',//地址
        pageNum: 1,//第几页
        pageSize: 10,//显示多少条
        deptId: 0 //根据
      },
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 非多个禁用
      multiple: true,
      pharmacyList: [],//药房列表数据
      total: 0,//总条数
      selectedList: [],//多选选中数组
      single: true,//非多个仅用
      // 查询参数
      queryParams: {
        deptName: undefined,
        status: undefined
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: "药房名称不能为空", trigger: "blur" }
        ],
        simpleName: [
          { required: true, message: "药房简称不能为空", trigger: "blur" }
        ],
        address: [
          { required: true, message: "药房地址不能为空", trigger: "blur" }
        ],
        pharmacyNum: [
          { required: true, message: "门店电话不能为空", trigger: "blur" }
        ],
        contact: [
          { required: true, message: "负责人姓名不能为空", trigger: "blur" }
        ],
        contactNum: [
          { required: true, message: "负责人电话不能为空", trigger: "blur" }
        ],
        creditCode: [
          { required: true, message: "统一社会信用代码不能为空", trigger: "blur" }
        ],
        medicareCode: [
          { required: true, message: "国家医保门店编码不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "请选择机构或者药房", trigger: "blur" }
        ],
        deptId: [
          { required: true, message: "请选择所属部门", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    // 药房列表
    this.getPharmacyList()
    // 左侧树形结构列表
    this.deptTreeSelectS()
  },
  methods: {
    // 文本框查询，清空文本框事件
    clearable() {
      this.getPharmacyList()
    },
    // 表单重置
    reset() {
      this.form = {
        name: '',
        address: '',
        simpleName: '',
        pharmacyNum: '',
        contact: '',
        contactNum: '',
        creditCode: '',
        medicareCode: '',
        type: ''
      },
        this.resetForm("form");
    },
    // 搜素框重置
    searchBox() {
      this.pharmacyQuery = {
        actualNleame: '',//药房名称
        creditCode: '',//
        medicareCode: '',//
        address: '',//
      }
    },
    getPharmacyList() {
      getPharmacyList(this.pharmacyQuery.pageNum, this.pharmacyQuery.pageSize, this.pharmacyQuery.actualNleame, this.pharmacyQuery.creditCode, this.pharmacyQuery.medicareCode, this.pharmacyQuery.address, this.pharmacyQuery.deptId).then((res) => {
        if (res.code == 200) {
          this.pharmacyList = res.rows
          this.total = res.total
          console.log("药房列表===>", res)
        } else {
          this.$message({ message: res.msg });
        }
      })
    },
    // 每页显示条数
    handleSizeChange(v) {
      this.pharmacyQuery.pageSize = v;
      this.getPharmacyList()
    },
    // 分页
    handleCurrentChange(v) {
      this.pharmacyQuery.pageNum = v
      this.getPharmacyList()
    },
    // 清除模糊查询的值
    clearSearchChange() {

    },
    //上下线更新
    IsbeOnline(id, status) {
      // console.log(id, status);
      let statusA = status == 0 ? 1 : 0;
      updateStatus(id, statusA).then((res) => {
        if (res.code == 200) {
          this.$message.success(res.msg);
          this.getPharmacyList()
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    // 新增药房
    handleAdd() {
      this.title = '新增药房'
      this.isEdit = true
      this.open = true
      this.getList()
    },
    // 编辑药房
    editUpdate(row) {
      this.title = '编辑药房'
      this.isEdit = false
      this.form = row
      this.open = true
      this.getList()
    },
    // 导出按钮操作
    handleExport() {
      this.download('/system/info//export', {
        ...this.pharmacyQuery
      }, `pharmacy_${new Date().getTime()}.xlsx`)
    },
    // 搜索按钮
    handleQuery() {
      this.getPharmacyList()
    },
    // 重置按钮
    resetQuery() {
      this.resetForm("queryForm");
      this.getPharmacyList()
    },
    // 表单确定按钮
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.isEdit) {
            drugstore(this.form).then(res => {
              // console.log(res);
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getPharmacyList()
              this.reset()
            })
          } else {
            modifyPharmacy(this.form).then(res => {
              // console.log(res);
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getPharmacyList()
              this.reset()
            })
          }
        }
      })
    },
    // 表单取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 新增修改弹窗右上角x事件
    handleClose(dona) {
      this.open = false
      this.reset()
    },
    /** 查询部门列表 */
    getList() {
      listDept(this.queryParams).then(response => {
        // console.log(response.data);
        this.deptId = response.data
        // console.log(this.deptId);
      });
    },
    // 获取左侧树形结构列表
    deptTreeSelectS() {
      deptTreeSelect(this.deptId).then(res => {
        // console.log(res);
        this.pharmacyListData = res.data
      })
    },
    // 树形节点，点击事件
    handleNodeClick(data) {
      // console.log(data);
      this.pharmacyQuery.deptId = data.id
      this.pharmacyQuery.pageNum = 1
      this.getPharmacyList()
    },
  }
};
</script>
<style lang="scss" scoped>
.container {
  margin: 20px;

  element.style {
    padding-left: 43px;
    padding-right: 12px;
  }

  .grid-content {
    padding-left: 30px;
  }

  .pharmacyList {
    border: 1px solid #dcdfe6;
    font-size: 14px;
    width: 12vw;
    color: #333;

    .tree {
      padding: 20px 15px;
      height: 450px;
      display: block;
      overflow-y: scroll;
    }

    .searchContent {
      padding: 10px 15px;
    }
  }

  .el-button--mini {
    padding: 7px 9px;
    font-size: 12px;
    border-radius: 3px;
  }

  .stockDataTable {
    .beoneline {
      display: block;
      width: 12px;
      height: 12px;
      margin: auto;
      border-radius: 50%;
    }

    .beOnline {
      background: #E02020;
      box-shadow: 0px 3px 6px rgba(224, 32, 32, 0.33);
    }

    .beOffLine {
      background: #0084C9;
      box-shadow: 0px 3px 6px rgba(0, 132, 201, 0.24);
    }

    .shangxian,
    .xiaxian {
      cursor: pointer;
    }

    .wuxiao {
      color: #f80000;
    }

    .youxiao {
      color: #00ff00;
    }
  }
}

::v-deep .el-pagination {
  text-align: right;
  margin-top: 15px;
}

::v-deep .el-table .cell {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  line-height: 23px;
  padding-left: 10px;
  padding-right: 9px;
}
</style>
