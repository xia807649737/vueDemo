<template>
  <div class="mask">
    <div class="app-container">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <div class="edit-parent">
          <div class="edit-left">
            <el-form-item>
              <!-- <el-button type="primary" @click="addAuth">新增</el-button> -->
              <!-- <el-button type="primary" @click="onExport">导出</el-button> -->
              <el-button size="small" type="primary" @click="queryLogVisible = true">查询</el-button>
            </el-form-item>
          </div>
          <!-- <div class="edit-right">
            <el-form-item label="系统选择">
              <el-select v-model="sysType" placeholder="请选择" @change="getLogsList">
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
          <el-table-column prop="coperator" label="用户名" align="center" />
          <el-table-column prop="ipAddr" label="IP地址" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.ipAddr }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="coperation" label="操作类型" align="center" />
          <el-table-column prop="centityType" label="操作描述" align="center" />

          <el-table-column prop="ddate" label="日期" align="center">
            <template slot-scope="scope">
              {{ scope.row.ddate }}
              <!-- <el-button type="text" size="small" @click="onReview(scope.row)">查看</el-button> -->
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
    <editAuthDialog
      :visible="authVisible"
      :current="current"
      :title="title"
      :sys-type="sysType"
      @cancel="authVisible = false"
      @ok="formData => handleSubmit(formData)"
    />
    <viewAuthDialog
      :visible="viewAuthDialogVisible"
      :data="current"
      :title="title"
      @cancel="viewAuthDialogVisible = false"
      @ok="viewAuthDialogVisible = false"
    />
    <searchAuthDialog
      :visible="queryLogVisible"
      @cancel="queryLogVisible = false"
      @ok="formData => onSearch(formData)"
    />
  </div>
</template>

<script>
import { getAuthInfo, addAuthInfo, editRolePermissions, deleteAuths } from '@/api/authManage'
import { getLogsList, getLogsByName } from '@/api/logManage'
import editAuthDialog from './components/editAuthDialog'
import viewAuthDialog from './components/viewAuthDialog'
import searchAuthDialog from './components/searchAuthDialog'

export default {
  name: 'LogManage',
  components: {
    editAuthDialog,
    viewAuthDialog,
    searchAuthDialog
  },
  data() {
    return {
      formInline: {},
      current: {},
      authVisible: false,
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
      viewAuthDialogVisible: false,

      // 过滤弹窗
      queryLogVisible: false,
      // 选择行
      multipleSelection: []
    }
  },
  created() {},
  mounted() {
    this.getLogsList()
  },
  methods: {
    // 查看角色列表数据
    async getLogsList() {
      const data = {
        sysType: this.sysType,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
      getLogsList(data).then(res => {
        this.tableData = res.result.list
        this.total = res.result.total
      })
    },
    // 修改
    updateAuth(row) {
      this.title = '修改角色组'
      this.authVisible = true
      this.current = row
      this.isEdit = true
    },
    dateToString(date) {
      const arr = []
      arr.push(date.getFullYear())
      arr.push(date.getMonth() + 1)
      arr.push(date.getDate())
      if (arr[1] < 10) {
        arr[1] = '0' + arr[1]
      }
      if (arr[2] < 10) {
        arr[2] = '0' + arr[2]
      }
      return arr.join('-')
    },
    async onSearch(params) {
      params.beginTime = this.dateToString(params.date[0])
      params.endTime = this.dateToString(params.date[1])
      params.date = undefined
      const res = await getLogsByName(params)
      if (res.result) {
        this.queryLogVisible = false
        this.tableData = res.result
        this.total = res.result.length
      }
    },
    // 选择所有的行
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 删除
    onExport(row) {
      if (this.multipleSelection.length === 0) {
        this.$message.info('请先选择要删除角色组！')
        return
      }
      const roleIds = this.multipleSelection.map(item => item.cid)
      const params = { roleIds }
      this.$confirm('是否确认删除所选角色组的所有权限?', '确认提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAuths(params).then(res => {
          if (res.result) {
            this.$message.success('删除成功！')
            this.getLogsList()
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    },
    // 查看角色组
    async onReview(row) {
      this.title = '查看角色组'
      const res = await getAuthInfo(row.cid)
      this.current = res.result
      this.viewAuthDialogVisible = true
    },
    // 新增角色
    addAuth() {
      this.title = '新增角色组'
      this.authVisible = true
      this.current = {}
      this.isEdit = false
    },
    // 分页
    handleSizeChange(val) {
      this.pageSize = val
      this.getLogsList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getLogsList()
    },
    handleSubmit: async function(data) {
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
        const res = await addAuthInfo(params)
        if (res?.code === 200 || res.result) {
          this.$message.success('新增成功')
          this.getLogsList()
          this.authVisible = false
        } else {
          this.$message.error(res?.msg ?? '新增失败')
        }
      } else {
        const res = await editRolePermissions(this.current.cid, data)
        if (res?.code === 200 || res.result) {
          this.$message.success('修改成功')
          this.getLogsList()
          this.authVisible = false
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
