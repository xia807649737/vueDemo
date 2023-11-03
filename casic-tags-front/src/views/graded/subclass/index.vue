<template>
  <div class="mask">
    <div class="app-container">
      <div class="label-search">
        <div class="search-btn">
          <el-button type="primary" size="small" @click="addRole">新增子类</el-button>
        </div>
        <span class="search-label">子类名称：</span>
        <el-input v-model="typeName" class="search-width230 margin-right15" size="small" />
        <el-button type="primary" size="small" @click="getTableList">查询</el-button>
      </div>
      <div class="table">
        <el-table height="calc(100vh - 350px)" :data="tableData" style="width: 100%;">
          <el-table-column type="index" label="序号" width="60" align="center" />
          <el-table-column prop="typeName" label="子类名称" align="center" />
          <el-table-column prop="categoryName" label="类别" align="center" />
          <el-table-column prop="peopleNum" label="人员数量" align="center">
            <template slot-scope="scope">
              {{ scope.row.peopleNum || 0 }}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="注册时间" align="center" />
          <el-table-column prop="action" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="updateRole(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="onDelete(scope.row)">删除</el-button>
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
import { getzl, putzl, postzl, delzl } from '@/api/genre'
import RoleTagModal from './components/RoleTagModal'

export default {
  name: 'Role',
  components: {
    RoleTagModal
  },
  data() {
    return {
      current: {},
      roleVisible: false,
      typeName: '',
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
    // 查看列表数据
    getTableList() {
      const data = {
        typeName: this.typeName,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
      getzl(data).then(res => {
        if (res.code === 200) {
          this.tableData = res.body.list
          this.total = res.body.total
        }
      })
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
        delzl(row.typeId).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功！')
            this.getTableList()
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
      const ids = []
      const list = formData.particleDTOList || []
      list.map(item => {
        const it = { ...item }
        ids.push(it.id + '')
        return it
      })
      if (!this.isEdit) {
        const res = await postzl({ ...formData, associateParticleIds: ids.join(',') })
        if (res?.code === 200) {
          this.$message.success('新增成功')
          this.getTableList()
          this.roleVisible = false
        }
      } else {
        const updateData = {
          ...formData,
          typeId: this.current.typeId,
          associateParticleIds: ids.join(',')
        }
        const res = await putzl(updateData)
        if (res?.code === 200) {
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
