<template>
  <div class="mask">
    <div class="app-container">
      <div class="container">
        <el-card shadow="never" style="height:calc(100vh - 200px);overflow: auto;width: 280px">
          <div style="color: #999">
            <tree-select
              v-model="obj"
              value-format="object"
              :options="trees"
              :max-height="10000"
              :default-expand-level="1"
              always-open
              placeholder="请输入块数据名称..."
              no-results-text="没有匹配的搜索结果"
              @select="handleSelect"
            />
          </div>
        </el-card>
        <div class="table">
          <div class="label-search">
            <div class="search-btn">
              <el-button type="primary" size="small" @click="addRole">新建</el-button>
            </div>
            <span class="search-label">属性名称：</span>
            <el-input v-model.trim="atomName" class="search-width230 margin-right15" size="small" />
            <el-button type="primary" size="small" @click="getTableList(1)">查询</el-button>
          </div>
          <el-table v-loading="loading" :data="tableData" height="calc(100vh - 340px)" style="width: 100%">
            <el-table-column label="序号" width="80px">
              <template slot-scope="scope">
                <div>
                  {{ scope.$index+(currentPage - 1) * pageSize + 1 }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="rootBlockAttrCode" label="属性ID" align="center" />
            <el-table-column prop="rootBlockAttrName" label="属性名称" align="center" show-overflow-tooltip />
            <el-table-column prop="action" label="操作" align="center">
              <template slot-scope="scope">
                <!-- <el-button type="text" size="small" @click="updateRole(scope.row)">编辑</el-button> -->
                <el-button type="text" size="small" @click="onDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- <div class="footer"> -->
          <el-pagination
            background
            :current-page="currentPage"
            :page-sizes="[5, 10, 20]"
            :page-size="pageSize"
            layout="total, prev, pager, next"
            :total="total"
            style="margin: 20px auto; float: right"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
        <!-- </div> -->
      </div>
    </div>
    <role-tag-modal
      :visible="roleVisible"
      :list="trees"
      :data="current"
      @cancel="roleVisible = false"
      @ok="formData => handleSubmit(formData)"
    />
  </div>
</template>

<script>
import { gets, posts, dels, getgall, puts } from '@/api/block'
import RoleTagModal from './components/RoleTagModal'
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import moment from 'moment'

export default {
  name: 'Datasource',
  components: {
    RoleTagModal,
    TreeSelect
  },
  data() {
    return {
      obj: null,
      arr: [],
      moment,
      loading: false,
      atomName: '',
      subQuery: false,
      current: {},
      roleVisible: false,
      tableData: [],
      trees: [{ id: '', label: '' }],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      isEdit: false
    }
  },
  created() {},
  mounted() {
    // this.getTableList()
    this.queryTree()
  },
  methods: {
    queryTree() {
      getgall().then(res => {
        if (res.code === 200 || res.status === '0') {
          const list = res.data || []
          this.trees = list.map(item => {
            item.label = item.rootBlockName
            return item
          })
          this.obj = list[0]
          this.getTableList()
        }
      })
    },
    // 查看列表数据
    getTableList(num, params = {}) {
      if (num === 1) this.currentPage = 1
      const data = {
        blockAttrName: this.atomName,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        rootId: this.obj && this.obj.rootBlockCode,
        ...params
      }
      this.loading = true
      gets(data).then(res => {
        if (res.code === 200 || res.status === '0') {
          this.tableData = res.data.list
          this.total = res.data.total
        }
      }).finally(() => {
        this.loading = false
      })
    },
    // 修改
    updateRole(row = {}) {
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
        dels(row.id).then(res => {
          if (res.code === 200 || res.status === '0') {
            this.$message.success('删除成功！')
            this.getTableList()
            // this.queryTree()
          }
        })
      })
    },
    // 新增角色
    addRole() {
      if (!this.obj || !this.obj.id) return this.$message.warning('请选择块根数据！')
      this.current = { rootBlockCode: this.obj.rootBlockCode, rootBlockName: this.obj.rootBlockName }
      this.roleVisible = true
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
        const res = await posts({ ...formData })
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
        const res = await puts(updateData)
        if (res?.code === 200 || res.status === '0') {
          this.$message.success('修改成功')
          this.getTableList()
          this.roleVisible = false
        }
      }
    },
    onSwitchChange(value) {
      this.currentPage = 1
      this.getTableList(1)
    },
    handleSelect(node) {
      this.getTableList(1, { rootId: node.rootBlockCode })
    }
  }
}
</script>
<style lang="scss" scoped>
.mask {
  width: 100%;
  margin: 0;
  padding: 1px 0 0;
  height: calc(100vh - 110px);
  background-color: #f4f8fb;
}
.app-container {
  width: 98%;
  margin: 20px auto 0 auto;
  height: calc(100vh - 150px);
  background-color: #fff;
  box-shadow: 0 3px 6px rgba(21, 21, 21, 0.2);
  opacity: 1;
}
.container {
  display: flex;
  .rulesContainer {
    width: 200px;
  }
  .table {
    width: calc(100% - 312px);
    margin-left: 12px;
  }
  .divider {
    margin: 12px 0;
  }
  .strategyTitle {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 8px;
    line-height: 20px;
  }
}
</style>
