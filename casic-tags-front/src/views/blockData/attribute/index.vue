<template>
  <div class="mask">
    <div class="app-container">
      <div class="container">
        <el-card shadow="never" style="height:calc(100vh - 200px);overflow: auto;width: 280px">
          <div style="color: #999">
            <tree-select
              v-model="categoryId"
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
            <span class="search-label">属性名称：</span>
            <el-input v-model="atomName" class="search-width230 margin-right15" size="small" />
            <el-button type="primary" size="small" @click="getTableList(1)">查询</el-button>
          </div>
          <el-table v-loading="loading" :data="tableData" height="calc(100vh - 340px)" style="width: 100%">
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column prop="atomId" label="属性ID" align="center" />
            <el-table-column prop="atomName" label="属性名称" align="center" show-overflow-tooltip />
            <el-table-column prop="action" label="操作" align="center">
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
      :list="trees"
      :data="current"
      @cancel="roleVisible = false"
      @ok="formData => handleSubmit(formData)"
    />
  </div>
</template>

<script>
import { getkl, postkl, delkl, gettree } from '@/api/label'
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
      arr: [],
      moment,
      loading: false,
      atomName: '',
      subQuery: false,
      categoryId: null,
      current: {},
      roleVisible: false,
      tableData: [],
      trees: [{ id: '1', label: '' }],
      currentPage: 0,
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
        categoryId: this.categoryId || '',
        atomName: this.atomName,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      this.loading = true
      getkl(data).then(res => {
        if (res.code === 200) {
          this.tableData = res.body.list
          this.total = res.body.total
        }
      }).finally(() => {
        this.loading = false
      })
    },
    // 修改
    updateRole(row = {}) {
      this.roleVisible = true
      let ext2 = null
      if (row.ext2) ext2 = row.ext2.split(',')
      const checkList = []
      if (row.atomKeyPerson) checkList.push('0')
      if (row.atomLegal) checkList.push('1')
      this.current = { ...row, ext2, checkList }
      this.isEdit = true
    },
    // 删除
    onDelete(row) {
      this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delkl(row.atomId).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功！')
            this.getTableList()
            // this.queryTree()
          }
        })
      })
    },
    // 新增角色
    addRole() {
      this.roleVisible = true
      this.current = { checkList: [] }
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
      const checkList = formData.checkList || []
      let atomKeyPerson = 0
      let atomLegal = 0
      if (checkList.indexOf('0') > -1) atomKeyPerson = 1
      if (checkList.indexOf('1') > -1) atomLegal = 1
      let ext2 = ''
      if (formData.ext2) ext2 = formData.ext2.join(',')
      if (!this.isEdit) {
        const res = await postkl({ ...formData, ext2, atomKeyPerson, atomLegal })
        if (res?.code === 200) {
          this.$message.success('新增成功')
          this.getTableList()
          // this.queryTree()
          this.roleVisible = false
        }
      } else {
        const updateData = {
          ...formData,
          typeId: this.current.typeId,
          ext2,
          atomKeyPerson,
          atomLegal
        }
        const res = await postkl(updateData)
        if (res?.code === 200) {
          this.$message.success('修改成功')
          this.getTableList()
          // this.queryTree()
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
    },
    getName(str = '') {
      const result = []
      if (str) {
        const list = str.split(',')
        const key1 = list[0]
        const key2 = list[1]
        const key3 = list[2]
        const key4 = list[3]
        if (key1) {
          const l1 = this.arr.filter(it1 => it1.value === key1)
          const obj1 = l1[0] || {}
          if (obj1.label) {
            result.push(obj1.label)
          }
          if (obj1.children && key2) {
            const l2 = obj1.children.filter(it2 => it2.value === key2)
            const obj2 = l2[0] || {}
            if (obj2.label) {
              result.push(obj2.label)
            }
            if (obj2.children && key3) {
              const l3 = obj2.children.filter(it3 => it3.value === key3)
              const obj3 = l3[0] || {}
              if (obj3.label) {
                result.push(obj3.label)
              }
              if (obj3.children && key4) {
                const l4 = obj3.children.filter(it4 => it4.value === key4)
                const obj4 = l4[0] || {}
                if (obj4.label) {
                  result.push(obj4.label)
                }
              }
            }
          }
        }
      }
      return result.join('/')
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
