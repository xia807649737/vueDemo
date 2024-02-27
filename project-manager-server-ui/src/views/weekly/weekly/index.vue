<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="项目编号" prop="projId">
        <el-input
          v-model="queryParams.projId"
          placeholder="请输入项目编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="项目名称" prop="projName">
        <el-input
          v-model="queryParams.projName"
          placeholder="请输入项目名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="责任单位id" prop="deptId">
        <el-input
          v-model="queryParams.deptId"
          placeholder="请输入责任单位id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="责任单位" prop="deptName">
        <el-input
          v-model="queryParams.deptName"
          placeholder="请输入责任单位"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="建设单位" prop="company">
        <el-input
          v-model="queryParams.company"
          placeholder="请输入建设单位"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="项目类型1-产投,2-政投" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择项目类型1-产投,2-政投" clearable>
          <el-option
            v-for="dict in dict.type.proj_base_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
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
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['weekly:weekly:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['weekly:weekly:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['weekly:weekly:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['weekly:weekly:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="weeklyList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="项目编号" align="center" prop="projId" />
      <el-table-column label="项目名称" align="center" prop="projName" />
      <el-table-column label="责任单位" align="center" prop="deptName" />
      <el-table-column label="建设单位" align="center" prop="company" />
      <el-table-column label="周报内容" align="center" prop="content" />
      <el-table-column label="项目类型1-产投,2-政投" align="center" prop="type">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.proj_base_type" :value="scope.row.type"/>
        </template>
      </el-table-column>
      <el-table-column label="填报人" align="center" prop="createBy" />
      <el-table-column label="填报时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['weekly:weekly:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['weekly:weekly:remove']"
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

    <!-- 添加或修改项目周报对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="项目编号" prop="projId">
          <el-input v-model="form.projId" placeholder="请输入项目编号" />
        </el-form-item>
        <el-form-item label="项目名称" prop="projName">
          <el-input v-model="form.projName" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="责任单位id" prop="deptId">
          <el-input v-model="form.deptId" placeholder="请输入责任单位id" />
        </el-form-item>
        <el-form-item label="责任单位" prop="deptName">
          <el-input v-model="form.deptName" placeholder="请输入责任单位" />
        </el-form-item>
        <el-form-item label="建设单位" prop="company">
          <el-input v-model="form.company" placeholder="请输入建设单位" />
        </el-form-item>
        <el-form-item label="周报内容" prop="content">
          <el-input v-model="form.content" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="项目类型1-产投,2-政投" prop="type">
          <el-select v-model="form.type" placeholder="请选择项目类型1-产投,2-政投">
            <el-option
              v-for="dict in dict.type.proj_base_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
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
import { listWeekly, getWeekly, delWeekly, addWeekly, updateWeekly } from "@/api/weekly/weekly";

export default {
  name: "Weekly",
  dicts: ['proj_base_type'],
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
      // 项目周报表格数据
      weeklyList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projId: null,
        projName: null,
        deptId: null,
        deptName: null,
        company: null,
        content: null,
        type: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        projId: [
          { required: true, message: "项目编号不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "项目类型1-产投,2-政投不能为空", trigger: "change" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询项目周报列表 */
    getList() {
      this.loading = true;
      listWeekly(this.queryParams).then(response => {
        this.weeklyList = response.rows;
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
        projId: null,
        projName: null,
        deptId: null,
        deptName: null,
        company: null,
        content: null,
        type: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
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
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加项目周报";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getWeekly(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改项目周报";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateWeekly(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWeekly(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除项目周报编号为"' + ids + '"的数据项？').then(function() {
        return delWeekly(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('weekly/weekly/export', {
        ...this.queryParams
      }, `weekly_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
