<template>
  <div class="mask">
    <div class="app-container">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <div class="edit-parent">
          <div class="edit-left">
            <el-form-item>
              <el-button size="small" type="primary" @click="addUser">新增</el-button>
              <el-button size="small" type="primary" @click="onDelete">删除</el-button>
              <el-button size="small" type="primary" @click="queryUserVisible = true">查询</el-button>
            </el-form-item>
          </div>
          <!-- <div class="edit-right">
            <el-form-item label="系统选择">
              <el-select v-model="sysType" placeholder="请选择" @change="getUsersList">
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
          <el-table-column prop="cname" label="姓名" align="center" />
          <el-table-column prop="cusername" label="用户名" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.cusername }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="cdept" label="部门" align="center" />
          <el-table-column prop="ccorp" label="单位" align="center" />
          <!-- <el-table-column prop="ccorp" label="系统名称" align="center" /> -->
          <!-- <el-table-column prop="ctype" label="用户类型" align="center" /> -->
          <el-table-column prop="ctype" label="用户类型" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.ctype === 'ADMIN'?'系统管理员':'普通用户' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="crole" label="角色组" align="center" />
          <el-table-column prop="cdetail" label="备注" align="center" />
          <el-table-column prop="action" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="updateUser(scope.row)">修改</el-button>
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
    <editUserDialog
      :visible="userVisible"
      :data="current"
      :title="title"
      @cancel="userVisible = false"
      @ok="formData => handleSubmit(formData)"
    />
    <viewUserDialog
      :visible="viewUserDialogVisible"
      :data="current"
      :title="title"
      @cancel="viewUserDialogVisible = false"
      @ok="viewUserDialogVisible = false"
    />
    <searchUserDialog
      :visible="queryUserVisible"
      @cancel="queryUserVisible = false"
      @ok="formData => onSearch(formData)"
    />
  </div>
</template>

<script>
import { getUsersList, getUserInfo, addUserInfo, editUserInfo, deleteUsers, getUsersByName } from '@/api/userManage'
import editUserDialog from './components/editUserDialog'
import viewUserDialog from './components/viewUserDialog'
import searchUserDialog from './components/searchUserDialog'

export default {
  name: 'UserManage',
  components: {
    editUserDialog,
    viewUserDialog,
    searchUserDialog
  },
  data() {
    return {
      formInline: {},
      current: {},
      userVisible: false,
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 1,
      isEdit: false,
      regionLevelList: ['市', '区', '街道', '社区', '网格', '小区', '楼栋', '户'],

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
      sysType: '0',
      // 弹窗信息
      title: '查看用户',

      // 查看用户 弹窗
      viewUserDialogVisible: false,
      // 选择行
      multipleSelection: [],
      // 查询弹窗
      queryUserVisible: false

    }
  },
  created() {},
  mounted() {
    this.getUsersList()
  },
  methods: {
    // 查看列表数据
    async getUsersList() {
      const data = {
        sysType: this.sysType,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
      getUsersList(data).then(res => {
        this.tableData = res.result.list
        this.total = res.result.total
      })
    },
    // 修改
    updateUser(row) {
      this.title = '修改用户'
      this.userVisible = true
      this.current = row
      this.isEdit = true
    },
    async onSearch(params) {
      const res = await getUsersByName(params)
      if (res.result) {
        this.queryUserVisible = false
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
        this.$message.error('请先选择要删除的用户！')
        return
      }
      const userIds = this.multipleSelection.map(item => item.cid)
      const params = { userIds }
      this.$confirm('是否确认删除?', '确认提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUsers(params).then(res => {
          if (res.result) {
            this.$message.success('删除成功！')
            this.getUsersList()
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    },
    // 查看用户
    async onReview(row) {
      this.title = '查看用户'
      const res = await getUserInfo(row.cid)
      this.current = res.result
      this.viewUserDialogVisible = true
    },
    // 新增角色
    addUser() {
      this.title = '新增用户'
      this.userVisible = true
      this.current = {}
      this.isEdit = false
    },
    // 分页
    handleSizeChange(val) {
      this.pageSize = val
      this.getUsersList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getUsersList()
    },
    handleSubmit: async function(formData) {
      formData.bdefaultPassword = !formData.cpassword
      formData.ccreateUser = 'root'
      formData.cupdateUser = 'root'
      formData.dtcreateTime = ''
      formData.dtupdateTime = ''
      formData.cid = ''
      if (!this.isEdit) {
        const res = await addUserInfo(formData)
        if (res?.code === 200 || res.result) {
          this.$message.success('新增成功')
          this.getUsersList()
          this.userVisible = false
        } else {
          this.$message.error(res?.msg ?? '新增失败')
        }
      } else {
        const res = await editUserInfo(this.current.cid, formData)
        if (res?.code === 200 || res.result) {
          this.$message.success('修改成功')
          this.getUsersList()
          this.userVisible = false
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
