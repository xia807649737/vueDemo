<template>
  <div class="container">
    <div style="display: flex; position: relative">
      <el-input placeholder="请输入药品关键词" :clearable="true" @clear="clearSearchChange" style="width: 17vw"
        v-model="listDrugstockQuery.actualName" @input="searchChange" />
      <el-button size="mini" type="primary" style="margin-left: 10px">查询</el-button>
    </div>
    <div style="margin-top: 20px; width: 100%;">
      <el-row :gutter="24">
        <el-col :span="5">
          <div class="pharmacyList">
            <div class="searchContent">
              <el-input placeholder="请输入药房名称" clearable v-model="simpleName"
                suffix-icon="el-icon-search" />
            </div>
            <div class="tree">
              <el-tree :data="pharmacyList"  ref="menuTree" node-key="id" :props="defaultProps"
              :expand-on-click-node="false" @node-click="handleNodeClick" :filter-node-method="filterNode"></el-tree>
            </div>
          </div>
        </el-col>
        <el-col :span="19">
          <div class="grid-content bg-purple">
            <el-table :data="stockData" class="stockDataTable" >
              <el-table-column align="center" label="序号" type="index" width="50px">
              </el-table-column>
              <el-table-column label="药品通用名称" width="160px" align="center">
                <template v-slot="{row}">
                  <span style="color:#45a6ff">{{ row.actualName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="药品名称" prop="name" width="160px" align="center"></el-table-column>
              <el-table-column label="实际规格" prop="actualSpec" width="130px" align="center"></el-table-column>
              <el-table-column label="生成企业" prop="produceCompany" width="350px" align="center"></el-table-column>
              <el-table-column label="库存数量" prop="stockTotal" align="center" ></el-table-column>
              <el-table-column label="最小包装单位" prop="minPackgeUnit" width="100px" align="center"></el-table-column>
            </el-table>
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
              :current-page="listDrugstockQuery.pageNum" :page-sizes="[10, 20, 30, 40, 50]"
              layout="total, prev, pager, next,sizes, jumper" :total="total">
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { getStoreNameByComp, listDrugstock, getAreaCount, findRegionStores } from "@/api/home";

export default {
  data() {
    return {
      simpleName: '',//药房名称
      pharmacyList: [],//药房列表数据
      pharmacyIndex: -1,//选中药房的索引
      stockData: [],//药品列表
      total: 0,//药品总条数
      listDrugstockQuery: {//列表查询
        pharmacyId: '',//药房ID
        actualName: '',//药品名称
        pageNum: 1,//第几页
        pageSize: 10//显示多少条
      },
      isClick: false,//是否点击过药房
      defaultProps: {
        label: 'simpleName',
        children: 'drugStores'
      }
    };
  },
  watch:{
    // 根据名称筛选部门树
     simpleName(val) {
      // console.log(val);
      this.$refs.menuTree.filter(val);
    }
  },
  mounted() {
    this.getAreaCount()//药品总库存
    // this.getStoreNameByComp()//获取药房列表
    this.findRegionStoresS()  //获取药房所属区域列表
  },
  methods: {
    //获取药房列表
    // getStoreNameByComp() {
    //   getStoreNameByComp(this.actualNleame).then((res) => {
    //     // console.log('药房列表', res)
    //     if (res.code == 200) {
    //       // this.pharmacyList = res.data
    //     } else {
    //       this.$message.error(res.msg);
    //     }
    //   })
    // },
    // 清除搜索药房条件
    cleaPpharmacyChange() {
      this.actualNleame = ''
      this.findRegionStoresS()
    },
    //获取药品总库存列表
    getAreaCount() {
      getAreaCount(this.listDrugstockQuery.pageNum, this.listDrugstockQuery.pageSize).then((res) => {
        if (res.code == 200) {
          // console.log('获取药品总库存列表',res)
          this.stockData = res.rows
          this.total = res.total
        } else {
          this.$message({ message: res.msg });
        }
      })
    },
    //获取药品列表
    listDrugstock() {
      listDrugstock(this.listDrugstockQuery.pharmacyId, this.listDrugstockQuery.actualName, this.listDrugstockQuery.pageNum, this.listDrugstockQuery.pageSize).then((res) => {
        if (res.code == 200) {
          // console.log('获取药品列表', res)
          this.stockData = res.rows
          this.total = res.total
          //  console.log("药房列表===>", res)
        } else {
          this.$message({ message: res.msg });
        }
      })
    },
    // 每页显示条数
    handleSizeChange(v) {
      this.listDrugstockQuery.pageSize = v;
      // 判断是否点击过药房列表，根据判断来点击分页器请求不同接口
      if (!this.isClick) {
        this.getAreaCount()
      } else {
        this.listDrugstock()
      }
    },
    // 分页
    handleCurrentChange(v) {
      this.listDrugstockQuery.pageNum = v
      // 判断是否点击过药房列表，根据判断来点击分页器请求不同接口
      if (!this.isClick) {
        this.getAreaCount()
      } else {
        this.listDrugstock()
      }
    },
    // 清除模糊查询的值
    clearSearchChange() {
      this.listDrugstockQuery.actualName = ''
      this.listDrugstock()
    },
    //搜索框change事件
    searchChange(value) {
      this.listDrugstockQuery.actualName = value.replace(/[ ]/g, "")
      this.listDrugstock()
    },

  // 库存列表左侧药房数据树形结构修改字段名
    findRegionStoresS() {
      findRegionStores().then(res => {
        res.data ? res.data.map(item => item.simpleName = item?.region) : null
        // console.log(res.data);
        this.pharmacyList = res.data
      })
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.simpleName.indexOf(value) !== -1;
    },
    // 节点事件
    handleNodeClick(data) {
      // 点击药房列表改变状态，根据判断是否点击过树形结构药房，来请求不同的接口
      this.isClick = true
      if (!data.drugStores) {
        this.listDrugstockQuery.pharmacyId=data.id
        this.listDrugstock()//药品总库存
        this.listDrugstockQuery.pageNum = 1
      }
    },
  }
};
</script>
<style lang="scss" scoped>
.container {
  margin: 20px;

  .pharmacyList {
    border: 1px solid #dcdfe6;
    font-size: 14px;
    width: 17vw;
    color: #333;

    .stockDataTable{
      margin-right: 10px;
    }

    .tree {
      padding: 10px 15px;
      height: 350px;
      display: block;
      overflow-y: scroll;

    }

    .searchContent {
      padding: 10px 15px;

      //图标的颜色
      ::v-deep .el-icon-search:before {
        color: #1890ff !important;
      }

      .stock-icon {
        width: 25px;
        height: 25px;
        position: absolute;
        top: 17px;
        left: 250px;
      }
    }

    ul {
      height: calc(100vh - 276px);
      overflow-y: scroll;
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        padding: 5px 15px;
        cursor: pointer;
        width: 100%;
        box-sizing: border-box;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      li.active {
        color: #0E70D4;
        font-weight: bold;
      }

      li:hover {
        color: #247AE4;
      }

      .nullDataLi:hover {
        color: #888;
      }

      .nullDataLi {
        text-align: center;
        font-size: 12px;
        color: #888;
        margin-top: 50px;
        cursor: context-menu;

        span {
          color: #333;
          padding: 0 3px;
        }
      }

    }
  }


}

::v-deep .el-pagination {
  text-align: right;
  margin-top: 15px;
}
</style>
