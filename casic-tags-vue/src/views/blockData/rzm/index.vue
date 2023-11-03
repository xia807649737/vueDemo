<template>
  <div class="mask">
    <div class="app-container">
      <div class="label-search">
        <div class="search-btn">
          <el-button type="primary" size="small" @click="addRole">新建</el-button>
        </div>
        <span class="search-label">块名称：</span>
        <el-input v-model.trim="categoryName" class="search-width230 margin-right15" size="small" clearable />
        <span class="search-label">任务状态：</span>
        <!-- <el-input v-model="taskStatus" class="search-width230 margin-right15" size="small" clearable /> -->
        <el-select v-model="taskStatus" size="small" clearable>
          <el-option v-for="item in labels" :key="item.id" :label="item.label" :value="item.id" />
        </el-select>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <el-button type="primary" size="small" @click="getTableList">查询</el-button>
      </div>
      <div class="table">
        <el-table height="calc(100vh - 350px)" :data="tableData" style="width: 100%;">
          <el-table-column label="序号" width="80px">
            <template slot-scope="scope">
              <div>
                {{ scope.$index+(currentPage - 1) * pageSize + 1 }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="rootBlockCode" label="块ID" align="center" />
          <el-table-column prop="rootBlockName" label="块名称" align="center" show-overflow-tooltip />
          <el-table-column prop="subBlockNum" label="子块数量" align="center">
            <template slot-scope="scope">
              {{ scope.row.subBlockNum || 0 }}
            </template>
          </el-table-column>
          <el-table-column prop="particleNum" label="标签数量" align="center">
            <template slot-scope="scope">
              {{ scope.row.particleNum || 0 }}
            </template>
          </el-table-column>
          <el-table-column prop="peopleNum" label="人员数量" align="center">
            <template slot-scope="scope">
              {{ scope.row.peopleNum || 0 }}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="统计任务状态" align="center">
            <template slot-scope="scope">
              {{ getLabel(scope.row.taskStatus) }}
            </template>
          </el-table-column>
          <el-table-column prop="action" label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button :disabled="scope.row.taskStatus === 1" type="text" size="small" @click="jishuan(scope.row)">{{ scope.row.taskStatus ? '重新计算' : '开始计算' }}</el-button>
              <!-- <el-button type="text" size="small" @click="updateRole(scope.row)">编辑</el-button> -->
              <el-button :disabled="scope.row.taskStatus === 1" type="text" size="small" @click="onDelete(scope.row)">删除</el-button>
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
    <role-tag-modal
      :visible="roleVisible"
      :data="current"
      @cancel="roleVisible = false"
      @ok="formData => handleSubmit(formData)"
    />
  </div>
</template>

<script>
import { getg, postg, putg, delg, urnum, urstatus } from '@/api/block'
import RoleTagModal from './components/RoleTagModal'
import { getLabel } from '@/utils/index'
import data from '@/config/data'

export default {
  name: 'Role',
  components: {
    RoleTagModal
  },
  data() {
    return {
      labels: data.taskStatus || [],
      current: {},
      taskStatus: '',
      categoryName: '',
      roleVisible: false,
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      isEdit: false
    }
  },
  created() {},
  mounted() {
    this.getTableList()
  },
  methods: {
    jishuan(record = {}) {
      const id = record.rootBlockCode
      urstatus(id).then(res => {
        if (res?.code === 200 || res?.status === '0') this.getTableList(this.currentPage)
      })
      urnum(id).then(res => {
        if (res?.code === 200 || res?.status === '0') this.getTableList(this.currentPage)
      })
    },
    // 查看列表数据
    getTableList() {
      const data = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        rootBlockName: this.categoryName,
        taskStatus: this.taskStatus
      }
      getg(data).then(res => {
        if (res.code === 200 || res.status === '0') {
          this.tableData = res.data.list
          this.total = res.data.total
        }
      })
    },
    getLabel(id) {
      return getLabel(data.taskStatus, id)
    },
    // 修改
    updateRole(row) {
      this.roleVisible = true
      this.current = { ...row }
      this.isEdit = true
    },
    // 删除
    onDelete(row) {
      this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delg(row.id).then(res => {
          if (res.code === 200 || res.status === '0') {
            this.$message.success('删除成功！')
            this.getTableList()
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    },
    // 新增角色
    addRole() {
      this.roleVisible = true
      this.current = {}
      this.isEdit = false
    },
    // 分页
    handleSizeChange(val) {
      this.pageSize = val
      this.getTableList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getTableList()
    },
    handleSubmit: async function(formData) {
      if (!this.isEdit) {
        const res = await postg(formData)
        if (res?.code === 200 || res.status === '0') {
          this.$message.success('新增成功')
          this.getTableList()
          this.roleVisible = false
        }
      } else {
        const updateData = {
          ...formData,
          id: this.current.id
        }
        const res = await putg(updateData)
        if (res?.code === 200 || res.status === '0') {
          this.$message.success('修改成功')
          this.getTableList()
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
}
.app-container p {
  margin: 20px 0;
  height: 40px;
}
.table {
  margin-top: 20px;
}
</style>
