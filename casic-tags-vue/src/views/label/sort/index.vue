<template>
  <div class="mask">
    <div class="app-container">
      <div class="container">
        <!-- <el-card shadow="never" style="height:calc(100vh - 200px);overflow: auto;width: 280px"> -->
        <div class="tree-content">
          <tree-select
            v-model="categoryId"
            :options="trees"
            :max-height="100000"
            always-open
            :default-expand-level="2"
            placeholder="请输入分类名称..."
            no-results-text="没有匹配的搜索结果"
            @select="handleSelect"
          >
            <label slot="option-label" slot-scope="{ node }">
              <!-- {{ node.isBranch ? 'Branch' : 'Leaf' }}: {{ node.label }} -->
              <span :title="node.label">
                {{ node.label.length > 10? (node.label.substring(0, 12-node.level) + (node.label.length === (12-node.level)?'':'...')) : node.label }}
              </span>
            </label>
          </tree-select>
        </div>
        <!-- </el-card> -->
        <div class="table">
          <div class="label-search">
            <div class="search-btn">
              <el-button type="primary" size="small" @click="addRole">新增分类</el-button>
              <!-- <el-button size="small" style="color:#177DDD;" @click="importCategory">
                <img src="../../../assets/icon_button/download.png" width="12px;" height="12px;" alt="">
                导入分类
              </el-button> -->
            </div>
            <span class="search-label">分类名称：</span>
            <el-input v-model="categoryName" class="search-width230 margin-right15" placeholder="请输入分类名称" size="small" />
            <el-button type="primary" size="small" @click="getTableList(1)">查询</el-button>
            <div style="float:right">
              <el-switch v-model="subQuery" inactive-text="是否包含下级" @change="onSwitchChange" />
            </div>
          </div>
          <el-table v-loading="loading" :data="tableData" height="calc(100vh - 340px)" style="width: 100%">
            <el-table-column prop="categoryId" label="分类编码" align="center" />
            <el-table-column prop="categoryName" label="分类名称" align="center" show-overflow-tooltip />
            <el-table-column prop="categoryLevel" label="层级" align="center" />
            <el-table-column prop="categorySubNum" label="子类数量" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.categorySubNum || 0 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="categoryAtomNum" label="颗粒数量" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.categoryAtomNum || 0 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="peopleNum" label="人员数量" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.peopleNum || 0 }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="createTime" label="创建时间" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.createTime && moment(scope.row.createTime).format('YYYY/MM/DD HH:mm:ss') }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="最后修改时间" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.updateTime && moment(scope.row.updateTime).format('YYYY/MM/DD HH:mm:ss') }}</span>
              </template>
            </el-table-column> -->
            <el-table-column prop="createTime" label="创建时间" align="center" width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.createTime && moment(scope.row.createTime).format('YYYY-MM-DD') }}</span>
                <br>
                <span>{{ scope.row.createTime && moment(scope.row.createTime).format('HH:mm:ss') }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="更新时间" width="100" show-overflow-tooltip align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.updateTime && moment(scope.row.updateTime).format('YYYY-MM-DD') }}</span>
                <br>
                <span>{{ scope.row.updateTime && moment(scope.row.updateTime).format('HH:mm:ss') }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="action" label="操作" width="180" align="center">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="updateRole(scope.row)">编辑</el-button>
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
      :data="current"
      :list="trees"
      @cancel="roleVisible = false"
      @ok="formData => handleSubmit(formData)"
    />
  </div>
</template>

<script>
import { getfl, postfl, delfl, gettree } from '@/api/label'
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
      cron: '0 0 12 * * ?',
      moment,
      loading: false,
      subQuery: false,
      categoryName: '',
      categoryId: null,
      current: {},
      roleVisible: false,
      typeName: '',
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
    this.getTableList()
    this.queryTree()
  },
  methods: {
    queryTree() {
      gettree().then(res => {
        if (res.code === 200) {
          const list = res.body || []
          this.trees = JSON.parse(JSON.stringify(list).replace(/"categoryId"/g, '"id"').replace(/"categoryName"/g, '"label"').replace(/"subCategoryList"/g, '"children"').replace(/"children":null,|"children":\[\],/g, ''))
        }
      })
    },
    // 查看列表数据
    getTableList(num) {
      if (num === 1) this.currentPage = 1
      const data = {
        subQuery: this.subQuery,
        categoryName: this.categoryName,
        categoryId: this.categoryId,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      this.loading = true
      getfl(data).then(res => {
        if (res.code === 200) {
          this.tableData = res.body.list || []
          this.total = res.body.total
        }
      }).finally(() => {
        this.loading = false
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
        delfl(row.categoryId).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功！')
            this.getTableList()
            this.queryTree()
          }
        })
      })
    },
    // 新增角色
    addRole() {
      this.roleVisible = true
      this.current = { parentCategoryId: 1, categoryLevel: 1 }
      this.isEdit = false
    },
    // // 导入分类
    // importCategory() {
    //   this.importVisible = true
    //   this.current = {}
    //   this.isEdit = false
    // },
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
        const res = await postfl({ ...formData })
        if (res?.code === 200) {
          this.$message.success('新增成功')
          this.getTableList()
          this.queryTree()
          this.roleVisible = false
        }
      } else {
        const updateData = {
          ...formData,
          categoryId: this.current.categoryId
        }
        const res = await postfl(updateData)
        if (res?.code === 200) {
          this.$message.success('修改成功')
          this.getTableList()
          this.queryTree()
          this.roleVisible = false
        }
      }
    },
    onSwitchChange(value) {
      this.currentPage = 1
      this.getTableList(1)
    },
    handleSelect(node) {
      this.categoryId = node.id
      this.getTableList(1)
    }
  }
}
</script>
<style lang="scss" scoped>
.vue-treeselect div, .vue-treeselect span {
  font-size: 14px;
}
::v-deep .vue-treeselect__option--selected {
  color: #177DDD;
}
.mask {
  width: 100%;
  margin: 0;
  padding: 1px 0 0;
  height: calc(100vh - 110px);
  background-color: #f4f8fb;
}
.app-container {
  width: 98%;
  margin: 10px auto 0 auto;
  height: calc(100vh - 130px);
  background-color: #fff;
  box-shadow: 0 3px 6px rgba(21, 21, 21, 0.2);
  opacity: 1;
}
.container {
  display: flex;
  .tree-content {
    color: #666666;
    width: 230px;
    height:calc(100vh - 180px);
    overflow: auto;
    .vue-treeselect__indent-level-1 {
      color: #333333;
    }
  }
  .rulesContainer {
    width: 200px;
  }
  .table {
    width: calc(100% - 230px);
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
::v-deep .el-table {
  .el-table__header{
    th {
      height: 44px;
      background: rgba(241, 243, 244, 0.39);
      opacity: 1;
      .cell {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #333333;
        opacity: 1;
      }
    }
  }
  td {
    padding: 0px;
  }
}
</style>
