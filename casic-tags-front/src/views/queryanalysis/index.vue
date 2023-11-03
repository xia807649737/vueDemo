<template>
  <div class="mask">
    <div class="app-container">
      <p> <span>操作记录查询</span></p>
      <el-form :inline="true" label-width="80px" :model="form">
        <el-form-item label="按日期">
          <el-date-picker
            v-model="form.daterange"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.keyword" placeholder="请输入关键词搜索" style="width:200px">
            <el-button slot="append" icon="el-icon-search" @click="onSearchKey" />
          </el-input>
        </el-form-item>
        <el-form-item style="float:right">
          <!-- <span><el-button round type="primary" @click="onSearch">搜索</el-button></span> -->
        </el-form-item>
      </el-form>

      <div class="table">
        <el-table :data="tableData" border style="width: 100%;height: calc(100vh - 400px);overflow-y:auto">
          <el-table-column type="index" index="1" label="序号" width="100" align="center" />
          <el-table-column prop="phoneNumber" label="系统名称" align="center" />
          <el-table-column prop="name" label="用户名称" align="center" />
          <el-table-column prop="agency" label="所属单位" align="center" />
          <el-table-column prop="phoneNumber" label="触达用户" align="center" />
          <el-table-column prop="name" label="信息名称" align="center" />
          <el-table-column prop="agency" label="触达渠道" align="center" />
          <el-table-column prop="agency" label="发送时间" align="center" />
          <el-table-column prop="action" label="状态" width="150" align="center">
            <template slot-scope="scope">
              <!-- <a>{{}}</a> -->
              <el-button size="small" type="text" @click="onStop(scope.row)">停用</el-button>
              <el-button size="small" type="text" @click="onDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="agency" label="固证编号" width="220" align="center" />
        </el-table>
        <el-pagination
          background
          :current-page="currentPage"
          :page-sizes="[5, 10, 20]"
          :page-size="pageSize"
          style="margin:20px auto;float:right"
          layout=" total,prev, pager, next"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

    </div>
  </div>

</template>

<script>
// import { getList } from '@/api/table'

export default {
  name: 'Administrator',
  data() {
    return {
      adminName: '',
      adminVisible: false,
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 1,
      radio: '',
      form: {
        daterange: '',
        keyword: ''
      },
      value: ''
    }
  },
  created() {
  },
  methods: {
    // 分页
    handleSizeChange(val) {
      this.pageSize = val
      this.getTableList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getTableList()
    }
  }
}
</script>
<style lang="scss" scoped>
.mask{
width:100%;
margin: 0;
padding: 0;
height: calc(100vh - 110px);
background-color: #F4F8FB;
padding-top:1px
}
.app-container{
  width:98%;
margin: 20px 0 20px 20px;
height: calc(100vh - 150px);
background-color: #fff;
box-shadow: 0px 3px 6px rgba(21, 21, 21, 0.2);
opacity: 1;
}
.app-container p{
  margin: 20px 0;
  height: 40px;
}
.table{
  margin-top:20px;
}

</style>
