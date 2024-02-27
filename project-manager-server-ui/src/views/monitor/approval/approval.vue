<template>
  <div class="app-container">
    <!-- <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form> -->

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-check" size="mini" :disabled="multiple"
          @click="approval">审批</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple"
          @click="handleDelete">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="drugstockList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="药房" align="center" prop="pharmacyName" />
      <el-table-column label="店内药品名称" align="center" prop="name" />
      <el-table-column label="实际注册名称" align="center" prop="actualName" />
      <el-table-column label="生产企业" align="center" prop="produceCompany" />
      <el-table-column label="产地" align="center" prop="producePlace" />
      <!--      <el-table-column label="批准文号" align="center" prop="approvalNo" />-->
      <el-table-column label="库存总量" align="center" prop="stockTotal" />
      <el-table-column label="是否处方药" align="center" prop="isPrescription" />
      <el-table-column label="剂型" align="center" prop="actualDosage" />
      <el-table-column label="规格" align="center" prop="actualSpec" />
      <!--      <el-table-column label="最小包装数量" align="center" prop="minPackageNum" />-->
      <!--      <el-table-column label="最小制剂单位" align="center" prop="minUnit" />-->
      <!--      <el-table-column label="最小包装单位" align="center" prop="minPackageUnit" />-->
      <!--      <el-table-column label="单价" align="center" prop="price" />-->
      <!--      <el-table-column label="预留字段1" align="center" prop="reserve1" />-->
      <!--      <el-table-column label="预留字段2" align="center" prop="reserve2" />-->
      <el-table-column label="导入时间" align="center" prop="createTime" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-check" @click="approval(scope.row)">审批</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['drugstock:drugstock:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
  </div>
</template>

<script>
import { listDrugstock, getDrugstock, delDrugstock, approval, addDrugstock, updateDrugstock } from "@/api/approval/approval";

export default {
  name: "Drugstock",
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
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 库存信息表格数据
      drugstockList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        status: 0
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        pharmacyId: [
          { required: true, message: "所属药店id不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询库存信息列表 */
    getList() {
      this.loading = true;
      listDrugstock(this.queryParams).then(response => {
        this.drugstockList = response.rows;
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
        id: null,
        pharmacyId: null,
        code: null,
        drugCode: null,
        name: null,
        actualName: null,
        produceCompany: null,
        producePlace: null,
        batch: null,
        approvalNo: null,
        produceDate: null,
        validityDate: null,
        stockTotal: null,
        barCode: null,
        isPrescription: null,
        isMedicare: null,
        status: null,
        actualDosage: null,
        actualSpec: null,
        minPackageNum: null,
        minUnit: null,
        minPackageUnit: null,
        price: null,
        createTime: null,
        createBy: null,
        updateBy: null,
        updateTime: null,
        reserve1: null,
        reserve2: null
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
      this.reset();
      this.open = true;
      this.title = "添加库存信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getDrugstock(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改库存信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateDrugstock(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDrugstock(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除库存信息编号为"' + ids + '"的数据项？').then(function () {
        return delDrugstock(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },

    approval(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认审批通过库存信息编号为"' + ids + '"的数据项？').then(function () {
        return approval(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("审批成功");
      }).catch(() => { });
    },

    /** 导出按钮操作 */
    handleExport() {
      this.download('drugstock/drugstock/export', {
        ...this.queryParams
      }, `drugstock_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
