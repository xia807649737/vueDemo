<template>
  <div class="mask">
    <div class="app-container">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <div class="edit-parent">
          <div class="edit-left">
            <el-form-item>
              <el-button size="small" type="primary" @click="addUnit('up')">新建主单位</el-button>
              <el-button size="small" type="primary" @click="addUnit('down')">新增下级</el-button>
              <el-button size="small" type="primary" @click="onDelete">删除</el-button>
              <el-button size="small" type="primary" @click="queryUnitVisible = true">查询</el-button>
            </el-form-item>
          </div>
        </div>
      </el-form>

      <div class="table">
        <el-table height="calc(100vh - 350px)" :data="tableData" row-key="unitId" style="width: 100%;" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <!-- <el-table-column type="index" label="序号" width="60" align="center" /> -->
          <el-table-column prop="unitName" label="名称">
            <template slot-scope="scope">
              <span>{{ scope.row.unitName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="unitDetail" label="备注" />
          <el-table-column prop="action" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="updateUnit(scope.row)">修改</el-button>
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
    <editUnitDialog
      :visible="unitVisible"
      :data="current"
      :title="title"
      @cancel="unitVisible = false"
      @ok="formData => handleSubmit(formData)"
    />
    <viewUnitDialog
      :visible="viewUnitDialogVisible"
      :data="current"
      :title="title"
      @cancel="viewUnitDialogVisible = false"
      @ok="viewUnitDialogVisible = false"
    />
    <searchUnitDialog
      :visible="queryUnitVisible"
      @cancel="queryUnitVisible = false"
      @ok="formData => onSearch(formData)"
    />
  </div>
</template>

<script>
import { getAllUnits, getUnitInfo, addUnitInfo, editUnitInfo, deleteUnits, queryUnits } from '@/api/unitManage'
import editUnitDialog from './components/editUnitDialog'
import viewUnitDialog from './components/viewUnitDialog'
import searchUnitDialog from './components/searchUnitDialog'

export default {
  name: 'UnitManage',
  components: {
    editUnitDialog,
    viewUnitDialog,
    searchUnitDialog
  },
  data() {
    return {
      formInline: {},
      current: {},
      unitVisible: false,
      tableData: [],
      currentPage: 1,
      pageSize: 100,
      total: 1,
      isEdit: false,

      // 弹窗信息
      title: '查看用户',

      // 查看用户 弹窗
      viewUnitDialogVisible: false,
      // 选择行
      multipleSelection: [],
      // 查询弹窗
      queryUnitVisible: false

    }
  },
  created() {},
  mounted() {
    this.getUnitsList()
  },
  methods: {
    // 查看列表数据
    async getUnitsList() {
      const data = {
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
      getAllUnits(data).then(res => {
        this.tableData = res.result.list
        this.total = res.result.total
      })
    },
    // 修改
    updateUnit(row) {
      this.title = '修改单位'
      this.unitVisible = true
      this.current = row
      this.isEdit = true
    },
    async onSearch(params) {
      const res = await queryUnits(params)
      if (res.result) {
        this.queryUnitVisible = false
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
        this.$message.error('请先选择要删除的单位！')
        return
      }
      const unitIds = this.multipleSelection.map(item => item.unitId)
      const params = { unitIds }
      this.$confirm('是否确认删除?', '确认提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUnits(params).then(res => {
          if (res.result) {
            this.$message.success('删除成功！')
            this.getUnitsList()
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    },
    // 查看用户
    async onReview(row) {
      this.title = '查看单位'
      // const res = await getUnitInfo(row.cid)
      this.current = row
      this.viewUnitDialogVisible = true
    },
    // 新增角色
    addUnit(isRoot) {
      if (isRoot === 'up') {
        this.title = '新增主单位'
      } else {
        this.title = '新增下级单位'
      }
      this.unitVisible = true
      this.current = {}
      this.isEdit = false
    },
    // 分页
    handleSizeChange(val) {
      this.pageSize = val
      this.getUnitsList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getUnitsList()
    },
    handleSubmit: async function(formData) {
      formData.parentUnitId = formData.parentUnitId || '0'
      if (!this.isEdit) {
        const res = await addUnitInfo(formData)
        if (res?.code === 200 || res.result) {
          this.$message.success('新增成功')
          this.getUnitsList()
          this.unitVisible = false
        } else {
          this.$message.error(res?.msg ?? '新增失败')
        }
      } else {
        const data = {
          unitName: formData.unitName,
          unitDetail: formData.unitDetail
        }
        const res = await editUnitInfo(this.current.unitId, data)
        if (res?.code === 200 || res.result) {
          this.$message.success('修改成功')
          this.getUnitsList()
          this.unitVisible = false
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
