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
              :default-expand-level="2"
              always-open
              placeholder="请输入分类名称..."
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
            <span class="search-label">块名称：</span>
            <el-input v-model.trim="atomName" class="search-width230 margin-right15" size="small" />
            <span class="search-label">任务状态：</span>
            <!-- <el-input v-model="taskStatus" class="search-width230 margin-right15" size="small" clearable /> -->
            <el-select v-model="taskStatus" size="small" clearable>
              <el-option v-for="item in labels" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
            <el-table-column prop="blockCode" label="块ID" align="center" />
            <el-table-column prop="blockName" label="块名称" align="center" show-overflow-tooltip />
            <el-table-column prop="subBlockNum" label="子块数量" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.subBlockNum || 0 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="particleNum" label="标签数量" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.particleNum || 0 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="peopleNum" label="人员数量" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.peopleNum || 0 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="taskStatus" label="统计任务状态" align="center">
              <template slot-scope="scope">
                {{ getLabel(scope.row.taskStatus) }}
              </template>
            </el-table-column>
            <el-table-column prop="action" label="操作" align="center">
              <template slot-scope="scope">
                <el-button :disabled="scope.row.taskStatus === 1" type="text" size="small" @click="jishuan(scope.row)">{{ scope.row.taskStatus ? '重新计算' : '开始计算' }}</el-button>
                <el-button :disabled="scope.row.taskStatus === 1" type="text" size="small" @click="updateRole(scope.row)">编辑</el-button>
                <el-button :disabled="scope.row.taskStatus === 1" type="text" size="small" @click="onDelete(scope.row)">删除</el-button>
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
import { getl, postl, dell, getgall, putl, jsnum, ulstatus } from '@/api/block'
import data from '@/config/data'
import RoleTagModal from './components/RoleTagModal'
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import moment from 'moment'
import { getLabel } from '@/utils/index'

export default {
  name: 'Datasource',
  components: {
    RoleTagModal,
    TreeSelect
  },
  data() {
    return {
      taskStatus: '',
      obj: null,
      labels: data.taskStatus || [],
      moment,
      loading: false,
      atomName: '',
      current: {},
      roleVisible: false,
      tableData: [],
      trees: [{ id: '1', label: '' }],
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
    jishuan(record = {}) {
      const id = record.blockCode
      ulstatus(id).then(res => {
        if (res?.code === 200 || res?.status === '0') this.getTableList(this.currentPage)
      })
      jsnum(id).then(res => {
        if (res?.code === 200 || res?.status === '0') this.getTableList(this.currentPage)
      })
    },
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
    getTableList(num, params) {
      if (num === 1) this.currentPage = 1
      const data = {
        parentBlockCode: this.obj && this.obj.rootBlockCode,
        blockName: this.atomName,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        taskStatus: this.taskStatus,
        blockLevel: 1,
        ...params
      }
      this.loading = true
      getl(data).then(res => {
        if (res.code === 200 || res?.status === '0') {
          this.tableData = res.data.list
          this.total = res.data.total
        }
      }).finally(() => {
        this.loading = false
      })
    },
    getLabel(id) {
      return getLabel(data.taskStatus, id)
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
        dell(row.atomId).then(res => {
          if (res.code === 200 || res?.status === '0') {
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
      this.current = { parentBlockCode: this.obj.rootBlockCode, parentBlockName: this.obj.rootBlockName }
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
      const arr = []
      if (formData.arr) {
        formData.arr.map(item => {
          arr.push(item.id)
          return item
        })
      }
      const associateParticleIds = arr.join(',')
      if (!this.isEdit) {
        const res = await postl({ ...formData, associateParticleIds, blockLevel: 1, rootBlockCode: formData.parentBlockCode })
        if (res?.code === 200 || res?.status === '0') {
          this.$message.success('新增成功')
          this.getTableList()
          this.roleVisible = false
        }
      } else {
        const updateData = {
          ...formData,
          blockCode: this.current.blockCode,
          rootBlockCode: formData.parentBlockCode,
          blockLevel: 1,
          associateParticleIds
        }
        const res = await putl(updateData)
        if (res?.code === 200 || res?.status === '0') {
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
      this.getTableList(1, { parentBlockCode: node.rootBlockCode })
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
