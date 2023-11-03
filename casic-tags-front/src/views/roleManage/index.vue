<template>
  <div class="mask">
    <div class="app-container">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <div class="edit-parent">
          <div class="edit-left">
            <el-form-item>
              <el-button size="small" type="primary" @click="addRole">新增</el-button>
              <el-button size="small" type="primary" @click="onDelete">删除</el-button>
              <el-button size="small" type="primary" @click="queryRoleVisible = true">查询</el-button>
            </el-form-item>
          </div>
          <!-- <div class="edit-right">
            <el-form-item label="系统选择">
              <el-select v-model="sysType" placeholder="请选择" @change="getRolesList">
                <el-option
                  v-for="item in sysTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </div> -->
        </div>
      </el-form>

      <div class="table">
        <el-table height="calc(100vh - 350px)" :data="tableData" style="width: 100%;" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <!-- <el-table-column type="index" label="序号" width="60" align="center" /> -->
          <el-table-column prop="cname" label="角色组名" align="center" />
          <el-table-column prop="nuserCount" label="用户数" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.nuserCount }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="cdetail" label="备注" align="center" />
          <!-- <el-table-column prop="ccorp" label="系统名称" align="center" /> -->

          <el-table-column prop="action" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="updateRole(scope.row)">修改</el-button>
              <el-button type="text" size="small" @click="onReview(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          :current-page="currentPage"
          :page-sizes="[5, 10, 20]"
          :page-size="pageSize"
          layout=" total,prev, pager, next"
          style="margin:20px auto;float:right"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <editRoleDialog
      :visible="roleVisible"
      :data="current"
      :title="title"
      @cancel="roleVisible = false"
      @ok="formData => handleSubmit(formData)"
    />
    <viewRoleDialog
      :visible="viewRoleDialogVisible"
      :data="current"
      :title="title"
      @cancel="viewRoleDialogVisible = false"
      @ok="viewRoleDialogVisible = false"
    />
    <searchRoleDialog
      :visible="queryRoleVisible"
      @cancel="queryRoleVisible = false"
      @ok="formData => onSearch(formData)"
    />
  </div>
</template>

<script>
import { getRolesList, getRoleInfo, addRoleInfo, editRoleInfo, deleteRoles, getRolesByName } from '@/api/roleManage'
import editRoleDialog from './components/editRoleDialog'
import viewRoleDialog from './components/viewRoleDialog'
import searchRoleDialog from './components/searchRoleDialog'

export default {
  name: 'RoleManage',
  components: {
    editRoleDialog,
    viewRoleDialog,
    searchRoleDialog
  },
  data() {
    return {
      formInline: {},
      current: {},
      roleVisible: false,
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 1,
      isEdit: false,

      sysTypeOptions: [{
        value: '0',
        label: '全部'
      }, {
        value: '1',
        label: '法制邮局'
      }, {
        value: '2',
        label: '通讯底板'
      }],
      sysType: '1',
      // 弹窗信息
      title: '查看角色组',

      // 查看角色组 弹窗
      viewRoleDialogVisible: false,

      // 过滤弹窗
      queryRoleVisible: false,
      // 选择行
      multipleSelection: []
    }
  },
  created() {},
  mounted() {
    this.getRolesList()
  },
  methods: {
    // 查看角色列表数据
    async getRolesList() {
      const data = {
        sysType: this.sysType,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      getRolesList(data).then(res => {
        this.tableData = res.result.list
        this.total = res.result.total
      })
    },
    // 修改
    updateRole(row) {
      this.title = '修改角色组'
      this.roleVisible = true
      this.current = row
      this.isEdit = true
    },
    async onSearch(params) {
      const res = await getRolesByName(params)
      if (res?.result) {
        this.queryRoleVisible = false
        this.tableData = res.result
        this.total = res.result.length
      }
    },
    // 选择所有的行
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 删除
    onDelete(row) {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请先选择要删除的角色！')
        return
      }
      const roleIds = this.multipleSelection.map(item => item.cid)
      const params = { roleIds }
      this.$confirm('删除角色将角色下的用户信息同时删除，确定删除?', '确认提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRoles(params).then(res => {
          if (res.result) {
            this.$message.success('删除成功！')
            this.getRolesList()
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    },
    // 查看角色组
    async onReview(row) {
      this.title = '查看角色组'
      const res = await getRoleInfo(row.cid)
      this.current = res.result
      this.viewRoleDialogVisible = true
    },
    // 新增角色
    addRole() {
      this.title = '新增角色组'
      this.roleVisible = true
      this.current = {}
      this.isEdit = false
    },
    // 分页
    handleSizeChange(val) {
      this.pageSize = val
      this.getRolesList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getRolesList()
    },
    handleSubmit: async function(formData) {
      if (!this.isEdit) {
        const params = {
          cid: '',
          'nusercount': 0,
          'ccreateUser': 'root',
          'cupdateUser': 'root',
          'dtCreateTime': '',
          'dtUpdateTime': '',
          ...formData
        }
        const res = await addRoleInfo(params)
        if (res?.code === 200 || res.result) {
          this.$message.success('新增成功')
          this.getRolesList()
          this.roleVisible = false
        } else {
          this.$message.error(res?.msg ?? '新增失败')
        }
      } else {
        const updateData = {
          'cupdateUser': 'root',
          'dtCreateTime': '',
          'dtUpdateTime': '',
          ...formData
        }
        const res = await editRoleInfo(this.current.cid, updateData)
        if (res?.code === 200 || res.result) {
          this.$message.success('修改成功')
          this.getRolesList()
          this.roleVisible = false
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.mask {
  width: 100%;
  margin: 0;
  padding: 0;
  height: calc(100vh - 110px);
  background-color: #f4f8fb;
  padding-top: 1px;
}
.app-container {
  width: 98%;
  margin: 20px auto 0 auto;
  height: calc(100vh - 150px);
  background-color: #fff;
  box-shadow: 0px 3px 6px rgba(21, 21, 21, 0.2);
  opacity: 1;
  .edit-parent {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    .edit-right {
      padding-left: 50px;
    }
  }
}
.app-container p {
  margin: 20px 0;
  height: 40px;
}
.table {
  margin-top: 20px;
}
</style>
