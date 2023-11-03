<template>
  <div class="mask">
    <el-card class="app-container" :body-style="{ display: 'flex', padding: 0, width: '100%' }">
      <el-card shadow="never" :body-style="{ width: '300px', overflow: 'auto', height: 'calc(100vh - 200px)' }">
        <el-tree
          v-loading="loading"
          @node-click="handleNodeClick"
          :data="unitDatas"
          node-key="unitId"
          :props="defaultProps"
          :render-content="renderContent"
        />
      </el-card>
      <div style="width: calc(100% - 312px);margin-left: 12px">
        <el-form ref="formDept" :inline="true" :model="formDept" class="demo-form-inline">
          <div class="edit-parent">
            <div class="edit-left">
              <el-form-item>
                <el-button size="small" type="primary" @click="addDept">新建</el-button> 
                <el-button size="small" type="primary" @click="onDelete">删除</el-button>
                <el-button size="small" type="primary" @click="queryDeptVisible = true">查询</el-button>
              </el-form-item>
            </div>
          </div>
        </el-form>
        <div class="table">
          <el-table :data="tableData" height="calc(100vh - 300px)" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="deptName" label="部门名称" align="center" />
            <el-table-column prop="deptDetail" label="备注" align="center" />
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click.native.prevent="updateDept(scope.row)">修改</el-button>
                <el-button type="text" size="small" @click.native.prevent="onReview(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            :current-page="pageNum"
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
    </el-card>
    <editUnitDialog
      :visible="deptVisible"
      :data="current"
      :title="title"
      @cancel="deptVisible = false"
      @ok="formData => handleSubmit(formData)"
    />
    <viewUnitDialog
      :visible="viewDeptDialogVisible"
      :data="current"
      :title="title"
      @cancel="viewDeptDialogVisible = false"
      @ok="viewDeptDialogVisible = false"
    />
    <searchUnitDialog
      :visible="queryDeptVisible"
      @cancel="queryDeptVisible = false"
      @ok="formData => onSearch(formData)"
    />
  </div>
</template>
<script>
import { getUnitsTree, getUnitDepts, addDeptInfo, editDeptInfo, queryDepts, deleteDepts } from '@/api/deptManage'
import editUnitDialog from './components/editUnitDialog'
import viewUnitDialog from './components/viewUnitDialog'
import searchUnitDialog from './components/searchUnitDialog'

export default {
  name: 'DeptManage',
  components: {
    editUnitDialog,
    viewUnitDialog,
    searchUnitDialog
  },
  data() {
    return {
      loading: false,
      formDept: {},
      unitId: '',
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      unitDatas: [],
      defaultProps: {
        children: 'children',
        label: 'unitName',
        isLeaf: data => data.children?.length === 0
      },

      current: {},
      // 选择行
      multipleSelection: [],
      deptVisible: false,
      queryDeptVisible: false,
      viewDeptDialogVisible: false,
      // 弹窗标题
      title: '新建部门',
    }
  },
  created() {
    this.getUnitsTree()
  },
  methods: {
    async getUnitsTree(){
      this.loading = true
      const res = await getUnitsTree()
      this.unitDatas = res.result
      this.loading = false
    },
    addDept(){
      this.title = '新增部门'
      this.deptVisible = true
      this.current = {}
      this.isEdit = false
    },
    onDelete(){
      if(this.multipleSelection.length === 0){
        this.$message.error("请先选择要删除的单位！")
        return;
      };
      const deptIds = this.multipleSelection.map(item => item.deptId)
      const params = {deptIds}
      this.$confirm('是否确认删除?', '确认提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDepts(params).then(res => {
          if (res.result) {
            this.$message.success('删除成功！')
            this.getDeptmentList()
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    },
    // 选择所有的行
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    updateDept(row) {
      this.title = '修改部门'
      this.deptVisible = true
      this.current = row
      this.isEdit = true
    },
    onReview(row) {
      this.title = '查看部门'
      this.current = row
      this.viewDeptDialogVisible = true
    },
    async onSearch(params){
      const res = await queryDepts(this.unitId, params)
      if(res.result){
        this.queryDeptVisible = false
        this.tableData = res.result
        this.total = res.result.length
      }
    },
    // 分页
    handleSizeChange(val) {
      this.pageSize = val
      this.getDeptmentList()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getDeptmentList()
    },
    handleNodeClick(data) {
      this.unitId = data.unitId
      this.pageNum = 1
      this.getDeptmentList()
    },
    renderContent(h, { node, data, store }) {
      return (
        <span class='custom-tree-node'>
          <span>{node.label}</span>
          <span style='margin-left: 8px'>
            <el-button
              size='mini'
              type='text'
              on-click={e => {
                e.stopPropagation()
                this.handleNodeClick(data)
              }}
            >
            </el-button>
          </span>
        </span>
      )
    },
    // 查询用户
    getDeptmentList() {
      const params = {
        unitid: this.unitId,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      getUnitDepts(params).then(res => {
        if (res.code === 200 || res.result) {
          this.tableData = res.result.list
          this.total = res.result.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleSubmit: async function(formData) {
      const data = {
        unitId: this.unitId,
        ...formData
      }
      if (!this.isEdit) {
        const res = await addDeptInfo(data)
        if (res?.code === 200 || res.result) {
          this.$message.success('新增成功')
          this.getDeptmentList()
          this.deptVisible = false
        } else {
          this.$message.error(res?.msg ?? '新增失败')
        }
      } else {
        const res = await editDeptInfo(this.current.deptId, formData)
        if (res?.code === 200 || res.result) {
          this.$message.success('修改成功')
          this.getDeptmentList()
          this.deptVisible = false
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
  padding: 1px 0 0;
  height: calc(100vh - 110px);
  background-color: #f4f8fb;
  display: flex;
}
.el-tree {
  display: inline-block;
  min-width: 100%;
}

.el-tree > .el-tree-node {
  display: inline-block;
  min-width: 100%;
}

.el-tree-node__content {
  overflow: auto;
}

.app-container {
  width: 98%;
  margin: 20px;
  height: calc(100vh - 150px);
  background-color: #fff;
  box-shadow: 0 3px 6px rgba(21, 21, 21, 0.2);
  opacity: 1;
  display: flex;
}

.app-container p {
  margin: 20px 0;
  height: 40px;
}
</style>
