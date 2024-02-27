<template>
  <div class="app-container statusBbox">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-row style="padding-right:20px;">
        <el-col :span="5">
          <el-form-item label="项目名称" prop="projectName">
            <el-input v-model="queryParams.projectName" placeholder="请输入项目名称" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="部门名称" prop="deptName">
            <treeselect v-model="queryParams.deptId" :props='optionProps' :options="deptTree" :normalizer="normalizer"
              placeholder="请输入部门名称" @input="valueChange" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
        <el-form-item label="是否开工" prop="isStart">
          <el-select v-model="queryParams.isStart" placeholder="请选择" clearable>
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="计划类别" prop="planType">
          <el-select v-model="queryParams.planType" clearable placeholder="请选择计划类别" style="width: 100%;" >
            <el-option v-for="dict in dict.type.plan_type" :key="dict.value" :label="dict.label"
              :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
        <el-col :span="5">
          <el-form-item label="项目状态" prop="projectStatus">
            <el-select v-model="queryParams.projectStatus" placeholder="请选择项目状态" clearable>
              <el-option v-for="dict in dict.type.proj_status" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="是否统计入库" prop="isIn">
            <el-select v-model="queryParams.isIn" placeholder="请选择" clearable>
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="是否有问题" prop="isTrouble">
            <el-select v-model="queryParams.isTrouble" placeholder="请选择" clearable>
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-col>
      </el-row>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" :disabled="ishandleNum == '0'"
          v-hasPermi="['company:company:add']">新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['company:company:edit']">修改</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['company:company:remove']">删除</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          :disabled="ishandleNum == '0'" v-hasPermi="['company:company:export']">导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" icon="el-icon-upload" size="mini" plain @click="handleUpload"
          :disabled="ishandleNum == '0'" v-hasPermi="['company:company:import']">导入</el-button>
      </el-col>
      <el-col :span="1.5" v-hasPermi="['system:config:edit']">
        <div style="display:flex; align-items: center; height: 28px;">
          <el-switch v-model="openWeekly" active-text="打开周报填报" inactive-text="关闭周报填报" @change="openWeeklyChange">
          </el-switch>
        </div>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" row-height="10" :data="companyList" stripe @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="项目编号" align="left" prop="pid" fixed />
      <el-table-column label="项目状态" align="left" prop="projectStatus" width="100px">
        <template slot-scope="scope">
          <span class="statusStyle" :class="`status${scope.row.projectStatus}`">
            <dict-tag :options="dict.type.proj_status" :value="scope.row.projectStatus" />
          </span>
        </template>
      </el-table-column>
      <el-table-column label="项目名称" align="left" prop="projectName" width="180px" :show-overflow-tooltip="true" />
      <el-table-column label="建设内容及其规模" align="left" prop="content" width="150px" :show-overflow-tooltip="true" />
      <el-table-column label="总投资（万元）" align="center" prop="totalAmount" />
      <el-table-column label="项目法人单位" align="left" prop="legalCompany" width="250px" />
      <!-- <el-table-column label="推进责任单位id" align="center" prop="deptId" /> -->
      <el-table-column label="推进责任单位名称" align="left" prop="deptName" width="150px" />
      <el-table-column label="用地面积" align="right" prop="areaCount" />
      <el-table-column label="计划类别" align="center" prop="planType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.plan_type" :value="scope.row.planType" />
        </template>
      </el-table-column>
      <el-table-column label="是否开工" align="center" prop="isStart">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.yes_no" :value="scope.row.isStart" />
        </template>
      </el-table-column>
      <el-table-column label="是否统计入库" align="center" prop="isIn" width="100">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.yes_no" :value="scope.row.isIn" />
        </template>
      </el-table-column>
      <el-table-column label="计划开工时间" align="center" prop="planStartDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.planStartDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目类别" align="center" prop="ptype">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.proj_type" :value="scope.row.ptype" />
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" prop="createdBy" />
      <el-table-column label="创建时间" align="center" prop="createdTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="500px" fixed="right">
        <template slot-scope="scope">
          <!--          <el-button size="mini" type="primary" :disabled="ishandleNum == '0'" plain icon="el-icon-view"  v-hasPermi="['system:info:showDetail']"-->
          <!--                     @click="logInformation(scope.row)">留痕记录</el-button>-->
          <el-button :disabled="ishandleNum == '0'" size="small" plain type="primary" icon="el-icon-edit"
            v-hasPermi="['system:config:edit']" @click="writeButlerReview(scope.row)">管家研判</el-button>
          <el-button :disabled="ishandleNum == '0' || !weeklyAuthority" plain size="small" type="primary"
            icon="el-icon-plus" v-hasPermi="['weekly:weekly:add']" @click="writeReport(scope.row, true)">周报</el-button>
          <el-button size="small" type="warning" plain icon="el-icon-edit" :disabled="ishandleNum == '0'"
            v-hasPermi="['company:company:edit']" @click="handleUpdate(scope.row)"><span>更新</span></el-button>
          <el-button size="small" type="primary" plain icon="el-icon-view" :disabled="ishandleNum == '0'"
            v-hasPermi="['company:company:query']" @click="handleUpdate(scope.row, true)"><span>详情</span></el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改产业项目对话框 -->
    <el-drawer :title="title" :visible.sync="open" append-to-body size="50%">
      <el-collapse v-model="activeNames" style="margin: 20px 15px;">
        <el-form ref="form" :model="form" label-width="140px" :disabled="disabled" :rules="rules">
          <el-collapse-item name="1">
            <div class="collapse-title" slot="title">
            <span>项目基本信息</span>
            <div>
              <span class="update-time" v-if="form.updatedTime">更新时间：{{form.updatedTime}}</span>
            </div>
          </div>
            <el-row style="padding-right:20px;">
              <el-col :span="12">
                <el-form-item label="项目编号" prop="pid">
                  <el-input v-model="form.pid" placeholder="请输入项目编号" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="项目名称" prop="projectName">
                  <el-tooltip class="item" effect="dark" :content="form.projectName" placement="top-start"
                    v-if="disabled && form.projectName">
                    <el-input v-model="form.projectName" placeholder="请输入项目名称" />
                  </el-tooltip>
                  <el-input v-model="form.projectName" placeholder="请输入项目名称" v-else :disabled="!isGJ && isEdit" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="建设内容及其规模" prop="content">
                  <el-tooltip class="item" effect="dark" :content="form.content" placement="top-start"
                    v-if="disabled && form.content">
                    <el-input v-model="form.content" type="textarea" placeholder="请输入内容" />
                  </el-tooltip>
                  <el-input v-else v-model="form.content" type="textarea" placeholder="请输入内容"
                    :disabled="!isGJ && isEdit" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="总投资" prop="totalAmount">
                  <el-input v-model="form.totalAmount" placeholder="请输入总投资" :disabled="!isGJ && isEdit" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="项目法人单位" prop="legalCompany">
                  <el-tooltip class="item" effect="dark" :content="form.legalCompany" placement="top-start"
                    v-if="disabled && form.legalCompany">
                    <el-input v-model="form.legalCompany" placeholder="请输入项目法人单位" />
                  </el-tooltip>
                  <el-input v-else v-model="form.legalCompany" placeholder="请输入项目法人单位" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否供地" prop="isLandSupply">
                  <el-select v-model="isLandSupply" style="width:100%;">
                    <el-option label="是" :value="1"></el-option>
                    <el-option label="否" :value="0"></el-option>
                    <el-option label="非用地项目" :value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="项目地址" prop="address" v-if="isLandSupply != 0">
                  <el-tooltip class="item" effect="dark" :content="form.address" placement="top-start"
                    v-if="disabled && form.address">
                    <el-input v-model="form.address" placeholder="请输入项目地址" />
                  </el-tooltip>
                  <el-input v-else v-model="form.address" placeholder="请输入项目地址" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="经度" prop="longitude" v-if="isLandSupply != 0">
                  <el-input v-model="form.longitude"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="纬度" prop="latitude" v-if="isLandSupply != 0">
                  <el-input v-model="form.latitude"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="用地面积" prop="areaCount" v-if="isLandSupply == 1">
                  <el-input v-model="form.areaCount" placeholder="请输入用地面积" style="width: 100%;" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="供地时间" prop="landSupplyTime" v-if="isLandSupply == 1">
                  <el-date-picker clearable v-model="form.landSupplyTime" type="date" value-format="yyyy-MM-dd"
                    placeholder="请选择供地时间" style="width: 100%;">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="计划类别" prop="planType">
                  <el-select v-model="form.planType" placeholder="请选择计划类别" style="width: 100%;"
                    :disabled="!isGJ && isEdit">
                    <el-option v-for="dict in dict.type.plan_type" :key="dict.value" :label="dict.label"
                      :value="parseInt(dict.value)"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否开工" prop="isStart">
                  <el-select v-model="form.isStart" placeholder="请选择是否开工" style="width: 100%;" @change="isStartChange">
                    <el-option v-for="dict in dict.type.yes_no" :key="dict.value" :label="dict.label"
                      :value="parseInt(dict.value)"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否统计入库" prop="isIn">
                  <el-select v-model="form.isIn" placeholder="请选择是否统计入库" style="width: 100%;">
                    <el-option v-for="dict in dict.type.yes_no" :key="dict.value" :label="dict.label"
                      :value="parseInt(dict.value)"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="计划开工时间" prop="planStartDate">
                  <el-date-picker clearable v-model="form.planStartDate" type="date" value-format="yyyy-MM-dd"
                    placeholder="请选择计划开工时间" :disabled="!isGJ && isEdit" style="width: 100%;">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="实际开工时间" prop="actualStartDate">
                  <el-date-picker clearable v-model="form.actualStartDate" type="date" value-format="yyyy-MM-dd"
                    placeholder="请选择实际开工时间" style="width: 100%;">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="项目类别" prop="ptype">
                  <el-select v-model="form.ptype" placeholder="请选择项目类别" style="width: 100%;" :disabled="!isGJ && isEdit">
                    <el-option v-for="dict in dict.type.proj_type" :key="dict.value" :label="dict.label"
                      :value="parseInt(dict.value)"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="项目状态" prop="projectStatus">
                  <el-select v-model="form.projectStatus" placeholder="请选择项目状态" clearable style="width: 100%;">
                    <el-option v-for="dict in dict.type.proj_status" :key="dict.value" :label="dict.label"
                      :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="推进责任单位" prop="deptId">
                  <el-cascader ref="cascaderItem" v-model="form.deptId" placeholder="请选择推进责任单位"
                    @change="depChange($event, true)" :options="deptTree" :props="propsSingle" collapse-tags clearable
                    style="width: 100%;">
                  </el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="进度图" prop="picPath"
                  :rules="[{ required: form.isStart == 1, message: '请选择', trigger: 'change' }]">
                  <!-- <ImageUpload v-if="!disabled" :headers="token" :fileList="form.picPath" v-model="form.picPath"
                    :action="action">
                  </ImageUpload> -->
                  <ImageUpload :headers="token" :fileList="form.picPath" v-model="form.picPath" v-if="!disabled"
                    :action="action" :beforeRemove="beforeRemove"></ImageUpload>
                  <div v-else>
                    <el-image v-for="(item, index) in form.picPath" :key="index" style="width: 100px; height: 100px"
                      :src="item" :preview-src-list="form.picPath">
                    </el-image>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-form>
        <el-form ref="form2" :model="form.listProcess" :rules="rules" label-width="140px" :disabled="disabled">
          <el-collapse-item name="2">
            <div class="collapse-title" slot="title">
            <span>重要环节完成情况</span>
            <div>
              <span class="update-time" v-if="form.listProcess.updatedTime">更新时间：{{form.listProcess.updatedTime}}</span>
            </div>
          </div>
            <!-- <template slot="title">
              <span class="collapse-title" slot="title">重要环节完成情况</span>
            </template> -->
            <el-row style="padding-right:20px;">
              <el-col :span="12">
                <el-form-item label="农转批复" prop="nzpf">
                  <el-select v-model="form.listProcess.nzpf" placeholder="请选择农转批复" clearable>
                    <el-option v-for="dict in dict.type.yes_or_no" :key="dict.value" :label="dict.label"
                      :value="parseInt(dict.value)" />
                  </el-select>

                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="挂牌公告" prop="gpgg">
                  <el-select v-model="form.listProcess.gpgg" placeholder="请选择挂牌公告" clearable>
                    <el-option v-for="dict in dict.type.yes_or_no" :key="dict.value" :label="dict.label"
                      :value="parseInt(dict.value)" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="土地证" prop="tdz">
                  <el-select v-model="form.listProcess.tdz" placeholder="请选择土地证" clearable>
                    <el-option v-for="dict in dict.type.yes_or_no" :key="dict.value" :label="dict.label"
                      :value="parseInt(dict.value)" />
                  </el-select>
                </el-form-item>
              </el-col>
              <!--              <el-col :span="12">
                <el-form-item label="项目立项审核备案" prop="xmlx">
                  <el-select v-model="form.listProcess.xmlx" placeholder="请选择项目立项审核备案" clearable>
                    <el-option v-for="dict in dict.type.yes_or_no" :key="dict.value" :label="dict.label"
                      :value="parseInt(dict.value)" />
                  </el-select>
                </el-form-item>
              </el-col>-->
              <el-col :span="12">
                <el-form-item label="总平方案审核" prop="zpfa">
                  <el-select v-model="form.listProcess.zpfa" placeholder="请选择总平方案审核" clearable>
                    <el-option v-for="dict in dict.type.yes_or_no" :key="dict.value" :label="dict.label"
                      :value="parseInt(dict.value)" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="工程规划许可" prop="gcgh">
                  <el-select v-model="form.listProcess.gcgh" placeholder="请选择工程规划许可" clearable>
                    <el-option v-for="dict in dict.type.yes_or_no" :key="dict.value" :label="dict.label"
                      :value="parseInt(dict.value)" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="施工图审核" prop="sgt">
                  <el-select v-model="form.listProcess.sgt" placeholder="请选择施工图审核" clearable>
                    <el-option v-for="dict in dict.type.yes_or_no" :key="dict.value" :label="dict.label"
                      :value="parseInt(dict.value)" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="签订施工合同" prop="sght">
                  <el-select v-model="form.listProcess.sght" placeholder="请选择签订施工合同" clearable>
                    <el-option v-for="dict in dict.type.yes_or_no" :key="dict.value" :label="dict.label"
                      :value="parseInt(dict.value)" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="施工许可证" prop="sgxk">
                  <el-select v-model="form.listProcess.sgxk" placeholder="请选择施工许可证" clearable>
                    <el-option v-for="dict in dict.type.yes_or_no" :key="dict.value" :label="dict.label"
                      :value="parseInt(dict.value)" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-form>
        <el-collapse-item name="3" v-if="isEdit">
          <div class="collapse-title" slot="title">
            <span>产业项目问题</span>
            <div>
              <span class="update-time" v-if="form.listProcess.updatedTime">更新时间：{{form.listProcess.updatedTime}}</span>
            </div>
          </div>
          <!-- <template slot="title">
            <span class="collapse-title" slot="title">产业项目问题</span>
          </template> -->
          <div style="padding: 20px;">
            <!-- <el-button :disabled="disabled" style="float: right; margin-bottom: 10px;" type="primary" plain
              icon="el-icon-plus" size="mini" @click="proceduresAdd">新增问题</el-button> -->
            <el-table :data="troubleList">
              <el-table-column label="编号" align="center" prop="id" />
              <el-table-column label="项目存在问题" align="center" prop="tContent" />
              <el-table-column label="问题涉及部门" align="center" prop="deptNames" />
              <!-- <el-table-column label="操作" align="center" width="170" fixed="right">
                <template slot-scope="scope">
                  <el-button size="mini" :disabled="disabled" type="text" icon="el-icon-edit"
                    @click="TroubleListUpdate(scope.row)">修改</el-button>
                  <el-button size="mini" :disabled="disabled" type="text" icon="el-icon-delete"
                    @click="TroubleListDelete(scope.row)">删除</el-button>
                </template>
              </el-table-column> -->
            </el-table>
            <pagination v-show="troubleTotal > troubleQueryParams.pageSize" :total="troubleTotal"
              :page.sync="troubleQueryParams.pageNum" :limit.sync="troubleQueryParams.pageSize"
              @pagination="getTroubleList" />
          </div>
        </el-collapse-item>
        <!-- <el-collapse-item name="4" v-if="isEdit">
          <template slot="title">
            <span class="collapse-title" slot="title">历史周报</span>
          </template>
          <el-table v-loading="loading" :data="projWeeklyList">
            <el-table-column label="项目编号" align="center" prop="projId" />
            <el-table-column label="项目名称" align="center" prop="projName" />
            <el-table-column label="项目类型" align="center" prop="type">
              <template slot-scope="scope">
                <dict-tag :options="dict.type.proj_base_type" :value="scope.row.type" />
              </template>
            </el-table-column>
            <el-table-column label="填报人" align="center" prop="createBy" />
            <el-table-column label="填报时间" align="center" prop="createTime" width="180">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150" fixed="right">
              <template slot-scope="scope">
                <el-button :disabled="disabled" size="mini" type="text" icon="el-icon-edit"
                  @click="writeReport(scope.row)">修改</el-button>
                <el-button size="mini" type="text" icon="el-icon-delete" @click="viewReport(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination background @current-change="handleCurrentChangeWeekly" :current-page="weekly.pageNum"
            layout="->,total, prev, pager, next" :total="weeklytotal">
          </el-pagination>
        </el-collapse-item> -->
      </el-collapse>
      <el-col :span="24" style="text-align: right; padding-right: 20px; margin: 20px 0;" v-if="!disabled">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </el-col>
    </el-drawer>

    <!-- 添加或修改产业项目问题对话框 -->
    <el-dialog :title="TroubleTitle" :visible.sync="TroubleOpen" width="700px" append-to-body>
      <el-form ref="troubleForm" :model="troubleForm" :rules="TroubleRules" label-width="120px">
        <el-form-item label="项目存在问题" prop="tContent">
          <el-input v-model="troubleForm.tContent" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="问题涉及部门" prop="deptIds">
          <el-cascader ref="cascaderItem" v-model="deptVal" placeholder="请选择问题涉及部门" @change="depChange($event, true)"
            :options="deptTree" :props="props" collapse-tags clearable style="width: 400px;">
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitTroubleForm">确 定</el-button>
        <el-button @click="cancelTrouble">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 导出选择表头弹框 -->
    <el-dialog title="导出表头设置" :visible.sync="headerOpen" width="700px" append-to-body>
      <tree-transfer :title="transferTitle" pid="fid" :from_data='fromData' :to_data='toData'
        :defaultProps="{ label: 'label' }" :mode='mode' height='540px' filter openAll>
      </tree-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="exportFun">导 出</el-button>
        <el-button @click="cancelHeader">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 导入上传 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload ref="upload" :limit="1" accept=".xlsx, .xls" :headers="upload.headers" :action="upload.url"
        :disabled="upload.isUploading" :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess"
        :auto-upload="false" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          <span>仅允许导入xls、xlsx格式文件。</span>
          <div style="display: flex; justify-content: end;">
            <el-button style="font-size: 10px;" @click="downloadTemplate">下载文件模版</el-button>
          </div>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 填报周报 -->
    <el-dialog :title="report.title" :visible.sync="report.open" width="780px" append-to-body>
      <p style="font-size: 25px;">{{ report.projectNameReportTitle }}</p>
      <el-form label-width="140px" :model="reportProblem" ref="reportForm"> <!--:rules="rules"-->
        <el-row style="padding-right:20px;">
          <p>
            <strong>重要环节完成情况</strong>
          </p>
          <el-col :span="12">
            <el-form-item label="农转批复" prop="nzpf">
              <el-select v-model="reportProblem.nzpf" placeholder="请选择农转批复" clearable>
                <el-option v-for="dict in dict.type.yes_or_no" :key="dict.value" :label="dict.label"
                  :value="parseInt(dict.value)" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="挂牌公告" prop="gpgg">
              <el-select v-model="reportProblem.gpgg" placeholder="请选择挂牌公告" clearable>
                <el-option v-for="dict in dict.type.yes_or_no" :key="dict.value" :label="dict.label"
                  :value="parseInt(dict.value)" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="土地证" prop="tdz">
              <el-select v-model="reportProblem.tdz" placeholder="请选择土地证" clearable>
                <el-option v-for="dict in dict.type.yes_or_no" :key="dict.value" :label="dict.label"
                  :value="parseInt(dict.value)" />
              </el-select>
            </el-form-item>
          </el-col>
          <!--          <el-col :span="12">
            <el-form-item label="项目立项审核备案" prop="xmlx">
              <el-select v-model="weeklyDetail.xmlx" placeholder="请选择项目立项审核备案" clearable>
                <el-option v-for="dict in dict.type.yes_or_no" :key="dict.value" :label="dict.label"
                  :value="parseInt(dict.value)" />
              </el-select>
            </el-form-item>
          </el-col>-->
          <el-col :span="12">
            <el-form-item label="总平方案审核" prop="zpfa">
              <el-select v-model="reportProblem.zpfa" placeholder="请选择总平方案审核" clearable>
                <el-option v-for="dict in dict.type.yes_or_no" :key="dict.value" :label="dict.label"
                  :value="parseInt(dict.value)" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工程规划许可" prop="gcgh">
              <el-select v-model="reportProblem.gcgh" placeholder="请选择工程规划许可" clearable>
                <el-option v-for="dict in dict.type.yes_or_no" :key="dict.value" :label="dict.label"
                  :value="parseInt(dict.value)" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="施工图审核" prop="sgt">
              <el-select v-model="reportProblem.sgt" placeholder="请选择施工图审核" clearable>
                <el-option v-for="dict in dict.type.yes_or_no" :key="dict.value" :label="dict.label"
                  :value="parseInt(dict.value)" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="签订施工合同" prop="sght">
              <el-select v-model="reportProblem.sght" placeholder="请选择签订施工合同" clearable>
                <el-option v-for="dict in dict.type.yes_or_no" :key="dict.value" :label="dict.label"
                  :value="parseInt(dict.value)" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="施工许可证" prop="sgxk">
              <el-select v-model="reportProblem.sgxk" placeholder="请选择施工许可证" clearable>
                <el-option v-for="dict in dict.type.yes_or_no" :key="dict.value" :label="dict.label"
                  :value="parseInt(dict.value)" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="项目当前形象进度" prop="detail">
              <el-input placeholder="请输入项目当前形象进度" v-model="reportProblem.detail" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <p>
            <strong>产业项目问题</strong>
          </p>
          <el-col :span="24">
            <el-form-item label="项目推进是否存在问题" prop="isTrouble" label-width="170px" class="required">
              <el-radio-group v-model="isTrouble">
                <el-radio :disabled="disabled" :label="1">是</el-radio>
                <el-radio :disabled="disabled" :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="isTrouble == 1">
            <el-form-item label="问题类型" prop="troubleType">
              <!-- <el-select v-model="weeklyDetail.troubleType" placeholder="请选择问题类型" clearable>
                <el-option v-for="dict in dict.type.trouble_type" :key="dict.value" :label="dict.label"
                  :value="parseInt(dict.value)" />
              </el-select> -->
              <el-cascader ref="cascaderTrouble" v-model="troubleTypeValue" :options="troubleType" @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="isTrouble == 1">
            <el-form-item label="问题涉及部门" prop="deptIds">
              <el-cascader ref="cascaderItem" v-model="weeklyDetail.deptIds" placeholder="请选择问题涉及部门"
                @change="depChange($event, true)" :options="deptTree" :props="props" collapse-tags clearable
                style="width: 400px;">
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="isTrouble == 1">
            <el-form-item label="问题描述" prop="tContent">
              <el-input placeholder="请输入内容" v-model="weeklyDetail.tContent" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="!disabled && !isViewReport">
        <el-button type="primary" @click="addWeekly()">确 定</el-button>
        <el-button @click="cancelWriteReport()">取 消</el-button>
      </div>
    </el-dialog>


    <!-- 管家研判 -->
    <el-dialog :title="butlerReview.title" :visible.sync="butlerReview.open" width="780px" append-to-body>
      <el-form label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="延期开工" label-width="105px">
              <el-radio-group v-model="butlerReviewDetails.isDelayStart">
                <el-radio :disabled="disabled" :label="1">是</el-radio>
                <el-radio :disabled="disabled" :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="延期完工" label-width="105px">
              <el-radio-group v-model="butlerReviewDetails.isDelayOver">
                <el-radio :disabled="disabled" :label="1">是</el-radio>
                <el-radio :disabled="disabled" :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="集中开工" label-width="105px">
              <el-radio-group v-model="butlerReviewDetails.isConcentrateStart">
                <el-radio :disabled="disabled" :label="1">是</el-radio>
                <el-radio :disabled="disabled" :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="进度异常" label-width="105px">
              <el-radio-group v-model="butlerReviewDetails.isSlow">
                <el-radio :disabled="disabled" :label="1">是</el-radio>
                <el-radio :disabled="disabled" :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="!disabled">
        <el-button type="primary" @click="addButlerReview()">确 定</el-button>
        <el-button @click="cancelButlerReview()">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 项目留痕对话框 -->
    <el-drawer :dialogLog="dialogLog" :title="title" :visible.sync="logOpen" append-to-body size="50%">
      <!--        <p style=" margin-left: 20px; font-size: 18px; color: #0e191a;">{{ `项目名称：${this.projectNameTitle}` }}</p>-->
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1">
          <span class="collapse-title" slot="title">项目基本信息留痕</span>
          <el-table :data="projComBaseInfoData" style="width: 100%">
            <el-table-column prop="pid" label="项目编号" align="center" />
            <el-table-column prop="projectName" label="项目名称" align="center" />

            <el-table-column prop="content" label="建设内容及其规模" align="left" width="200" :show-overflow-tooltip="true" />
            <el-table-column prop="address" label="项目地址" align="center" />
            <el-table-column prop="totalAmount" label="总投资" align="center" />
            <el-table-column prop="legalCompany" label="项目法人单位" align="center" />
            <el-table-column prop="areaCount" label="用地面积" align="center" />
            <el-table-column prop="planName" label="计划类别" align="center" />
            <el-table-column prop="isStart" label="是否开工" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.isDeclareUp == "0" ? "否" : "是" }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="isIn" label="是否统计入库" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.isDeclareUp == "0" ? "否" : "是" }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="planStartDate" label="计划开工时间" align="center" />
            <el-table-column prop="actualStartDate" label="实际开工时间" align="center" />
            <el-table-column prop="pName" label="项目类别" align="center" />
            <el-table-column prop="projectStatus" label="项目状态" align="center" />
            <el-table-column prop="deptName" label="推进责任单位" align="center" />



            <el-table-column prop="updatedTime" label="操作时间" width="100" align="center" fixed>
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.updatedTime, '{y}-{m}-{d}') }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="logType" label="操作类型" align="center" fixed>
              <template slot-scope="scope">
                <span>{{ scope.row.logType == "insert" ? "新增" : scope.row.logType == "update" ? "修改" : "" }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
        <el-collapse-item name="2">
          <span class="collapse-title" slot="title">重要环节完成情况留痕</span>
          <el-table :data="projComProcessData" style="width: 100%">
            <el-table-column prop="" label="农转批复" align="center" width="150" />
            <el-table-column prop="" label="挂牌公告" align="center" width="150" />
            <el-table-column prop="" label="土地证" align="center" width="150" />
            <el-table-column prop="" label="项目立项审核备案" align="center" width="150" />
            <el-table-column prop="" label="总平方案审核" align="center" width="150" />
            <el-table-column prop="" label="工程规划许可" align="center" width="150" />
            <el-table-column prop="" label="施工图审核" align="center" width="150" />
            <el-table-column prop="" label="签订施工合同" align="center" width="150" />
            <el-table-column prop="" label="施工许可证" align="center" width="150" />
            <el-table-column prop="updatedTime" label="操作时间" width="100" align="center" fixed>
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.updatedTime, '{y}-{m}-{d}') }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="logType" label="操作类型" align="center" fixed>
              <template slot-scope="scope">
                <span>{{ scope.row.logType == "insert" ? "新增" : scope.row.logType == "update" ? "修改" : "" }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </el-drawer>

  </div>
</template>

<script>
import { listCompany, getCompany, delCompany, addCompany, updateCompany, allcolumnscomExport, importTemplate, ishandle, weeklyct, queryLogByPid, files } from "@/api/company/company";
import { listTrouble, getTrouble, delTrouble, addTrouble, updateTrouble, deptTree } from "@/api/company/trouble";
import { updateProcess } from "@/api/company/process";
import axios from "axios";
import treeTransfer from 'el-tree-transfer'
import { getToken } from '@/utils/auth'
import { getWeeklyList, addWeekly, editWeekly, openWeekly, proceduresListWeekly } from '@/api/manage'
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "Company",
  dicts: ['plan_type', 'proj_type', 'yes_or_no', 'proj_type', 'proj_status', 'trouble_type', 'yes_no'],
  components: { treeTransfer, Treeselect }, // 注册
  data() {
    return {
      optionProps: {
        value: 'deptId',
        label: 'deptName',
        children: 'children',
        multiple: true
      },
      //判断按钮是否显示
      ishandleNum: '',
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      items: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      weeklytotal: 0,
      deptOptionsManage: [],// 查询部门树选项
      // 总条数
      troubleTotal: 0,
      // 产业项目表格数据
      companyList: [],
      // 弹出层标题
      title: "",
      TroubleTitle: "",
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层
      TroubleOpen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        pid: null,
        projectName: null,
        legalCompany: null,
        deptId: null,
        deptName: null,
        planType: null,
        isStart: null,
        isIn: null,
        ptype: null,
        projectStatus: null,
        isTrouble: ''
      },
      weekly: {
        pageNum: 1,
        pageSize: 4,
        pId: ''
      },
      // 查询参数
      troubleQueryParams: {
        pageNum: 1,
        pageSize: 4,
        pid: null,
        tContent: null,
        deptIds: null,
        deptNames: null,
        updatedBy: null,
        updatedTime: null
      },
      // 表单参数
      form: {
        listProcess: {},
      },
      // 表单参数
      troubleForm: {},
      troubleList: [],
      // 表单校验
      rules: {
        // pid: [
        //   { required: true, message: "请输入项目编号", trigger: "blur" }
        // ],
        // projectName: [
        //   { required: true, message: "请输入项目名称", trigger: "blur" }
        // ],
        // content: [
        //   { required: true, message: "请输入内容", trigger: "blur" }
        // ],
        // totalAmount: [
        //   { required: true, message: "请输入总投资", trigger: "blur" }
        // ],
        legalCompany: [
          { required: true, message: "请输入项目法人单位", trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输入项目地址", trigger: "blur" }
        ],
        longitude: [
          { required: true, message: "请输入经度", trigger: "blur" }
        ],
        latitude: [
          { required: true, message: "请输入纬度", trigger: "blur" }
        ],
        areaCount: [
          { required: true, message: "请输入用地面积", trigger: "blur" }
        ],
        landSupplyTime: [
          { required: true, message: "请选择供地时间", trigger: "change" }
        ],
        // planType: [
        //   { required: true, message: "请选择计划类别", trigger: "blur" }
        // ],
        // isStart: [
        //   { required: true, message: "请选择是否开工", trigger: "blur" }
        // ],
        isIn: [
          { required: true, message: "请选择是否统计入库", trigger: "blur" }
        ],
        // planStartDate: [
        //   { required: true, message: "请选择计划开工时间", trigger: "blur" }
        // ],
        actualStartDate: [
          { required: false, message: "请选择实际开工时间", trigger: "change" }
        ],
        // ptype: [
        //   { required: true, message: "请选择项目类别", trigger: "blur" }
        // ],
        // deptId: [
        //   { required: true, message: "请选择推进责任单位", trigger: "blur" }
        // ],
        nzpf: [
          { required: true, message: "请选择农转批复", trigger: "blur" }
        ],
        gpgg: [
          { required: true, message: "请选择挂牌公告", trigger: "blur" }
        ],
        tdz: [
          { required: true, message: "请选择土地证", trigger: "blur" }
        ],
        zpfa: [
          { required: true, message: "请选择总平方案审核", trigger: "blur" }
        ],
        gcgh: [
          { required: true, message: "请选择工程规划许可", trigger: "blur" }
        ],
        sgt: [
          { required: true, message: "请选择施工图审核", trigger: "blur" }
        ],
        sght: [
          { required: true, message: "请选择签订施工合同", trigger: "blur" }
        ],
        sgxk: [
          { required: true, message: "请选择施工许可证", trigger: "blur" }
        ]
      },
      TroubleRules: {
        tContent: [
          { required: true, message: "请输入内容", trigger: "blur" }
        ],
        deptIds: [
          { required: true, message: "请选择问题涉及部门", trigger: "blur" }
        ]
      },
      // 默认展开
      activeNames: [],
      // 编辑状态
      isEdit: false,
      deptTree: [],
      props: { multiple: true, value: 'id', emitPath: false },
      propsSingle: { multiple: false, value: 'id', emitPath: false },
      deptVal: [],
      headerOpen: false,
      transferTitle: ["待选", "已选"],
      mode: "transfer",
      fromData: [],
      toData: [],
      disabled: false,
      // 导入相关
      upload: {
        // 是否显示弹出层（库存导入）
        open: false,
        // 弹出层标题（库存导入）
        title: "项目信息导入",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/company/importData"
      },
      token: '',
      // 周报相关
      report: {
        title: '',
        open: false,
      },
      // 周报内部问题
      // 周报内部表单
      reportProblem: {
        pId: null
      },
      isTrouble: 0,
      weeklyDetail: {
        pId: null
      },
      isViewReport: false,
      openWeekly: true,
      // 管家研判相关
      butlerReview: {
        title: '',
        open: false,
      },
      butlerReviewDetails: {},
      // 留痕记录弹窗遮罩层
      logOpen: false,
      dialogLog: false,
      projComBaseInfoData: [],
      projComProcessData: [],
      projComTroubleData: [],
      action: process.env.VUE_APP_BASE_API + "/common/upload?projType=1", // 上传的图片服务器地址
      troubleTypeValue: [],
      troubleType: [{
        value: 'qianqi',
        label: '前期手续问题',
        children: [
          {
            value: '1',
            label: '签约问题',
          },
          {
            value: '2',
            label: '供地问题',
          },
          {
            value: '3',
            label: '总方案审查问题',
          },
          {
            value: '4',
            label: '工地规划许可办理问题',
          },
          {
            value: '5',
            label: '施工许可办理问题',
          },
          {
            value: '6',
            label: '环评等其他手续办理问题',
          },
        ]
      },
      {
        value: 'yaosu',
        label: '要素保障问题',
        children: [
          {
            value: '7',
            label: '管道迁改问题',
          },
          {
            value: '8',
            label: '征地拆迁问题',
          },
          {
            value: '9',
            label: '施工管道问题',
          },
          {
            value: '10',
            label: '苗木移栽问题',
          },
          {
            value: '11',
            label: '场地平整等其他问题',
          }
        ]
      },
      {
        value: 'qiye',
        label: '企业自身问题',
        children: [
          {
            value: '12',
            label: '资金问题',
          },
          {
            value: '13',
            label: '企业决策问题',
          }
        ]
      }],
      isGJ: false,
      weeklyAuthority: true,
      isLandSupply: 0
    };
  },
  created() {
    this.getList();
    this.getDeptTree();
    this.ishandle();
    this.getWeeklyAuthority();
    this.token = getToken();
    console.log('dict', this.dict)
    this.useInfo = JSON.parse(sessionStorage.getItem('useInfo'));
    this.isGJ = false;
    this.useInfo.roles.forEach(item => {
      if (item == 'GJ' || item == 'admin' || item == 'Admin') {
        this.isGJ = true;
      }
    })

  },
  methods: {
    handleChange(value) {
      this.weeklyDetail.troubleId = parseInt(value[1])
      this.weeklyDetail.troubleName = this.$refs['cascaderTrouble'].getCheckedNodes()[0].pathLabels[1]
    },
    cancelWriteReport() {
      this.reportProblem = {}
      this.weeklyDetail = {}
      this.report.open = false;
    },
    // 判断按钮是否可用接口
    ishandle() {
      ishandle().then(res => {
        this.ishandleNum = res.msg
      })
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        value: node.id,
        label: node.label,
        children: node.children
      };
    },
    /** 查询产业项目列表 */
    getList(isSearch) {
      this.loading = true;
      if (isSearch && this.queryParams.deptId) {
        this.queryParams.deptName = this.getObjByTree(this.deptTree, this.queryParams.deptId).label;
      }
      listCompany(this.queryParams).then(response => {
        this.companyList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 分页
    handleSizeChangeWeekly(v) {
      // console.log(v);
      this.weekly.pageSize = v
      this.getWeeklyList();
    },
    // 分页
    handleCurrentChangeWeekly(v) {
      // console.log(v);
      this.weekly.pageNum = v
      this.getWeeklyList();
    },
    // 获取周报list
    getWeeklyList() {
      //this.loading = true;
      getWeeklyList(this.weekly).then(response => {
        //this.loading = false;
        this.projWeeklyList = response.rows;
        this.weeklytotal = response.total;
        this.$forceUpdate();
      });
    },
    // 获取机构列表
    getDeptTree() {
      deptTree().then(response => {
        this.deptTree = response.data;
        // 去除第一级
        this.deptTree = this.deptTree[0].children;
        console.log(this.deptTree);
      });
    },
    // 获取当前选中的机构
    depChange(vals, isMultiple) {
      if (isMultiple) {
        let names = [];
        vals.forEach(element => {
          names.push(this.getObjByTree(this.deptTree, element).label)
        });
        this.troubleForm.deptIds = vals.join();
        this.troubleForm.deptNames = names.join();
        this.reportProblem.deptId = vals.join();
        this.reportProblem.deptName = names.join();
        this.weeklyDetail.deptIds = vals.join();
        this.weeklyDetail.deptNames = names.join();
      } else {
        this.form.deptName = this.getObjByTree(this.deptTree, vals).label
      }
    },
    // 查询树形结构
    getObjByTree(data, id) {
      let result = null
      if (!data) return // return; 中断执行
      for (let i in data) {
        if (result !== null) break
        let item = data[i];
        if (item.id === id) {
          result = item;
          break;
        } else if (!!item?.children?.length) {
          result = this.getObjByTree(item.children, id);
        }
      }
      return result;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 取消按钮
    cancelTrouble() {
      this.TroubleOpen = false;
      this.resetTrouble();
    },
    // 表单重置
    reset() {
      this.isEdit = false;
      this.form = {
        id: null,
        pid: null,
        projectName: null,
        content: null,
        totalAmount: null,
        legalCompany: null,
        deptId: null,
        deptName: null,
        address: null,
        areaCount: null,
        longitude: null,
        latitude: null,
        landSupplyTime: null,
        planType: null,
        isStart: null,
        isIn: null,
        planStartDate: null,
        actualStartDate: null,
        ptype: null,
        createBy: null,
        createdTime: null,
        updatedBy: null,
        updatedTime: null,
        listProcess: {},
      };
      this.troubleList = [];
      this.resetForm("form");
    },
    // 表单重置
    resetTrouble() {
      this.troubleForm = {
        id: null,
        pid: null,
        tContent: null,
        deptIds: null,
        deptNames: null,
        updatedBy: null,
        updatedTime: null
      };
      this.resetForm("troubleForm");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList(true);
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.items = selection;
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.disabled = false;
      this.reset();
      this.form.deptId = JSON.parse(sessionStorage.getItem('useInfo')).user.deptId || ''
      this.open = true;
      this.title = "添加产业项目";
    },
    proceduresAdd() {
      this.resetTrouble();
      this.TroubleOpen = true;
      this.title = "添加产业项目问题";
    },
    /** 修改按钮操作 */
    handleUpdate(row, onlyCheck) {
      console.log(row);
      this.disabled = onlyCheck || false;
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      this.troubleQueryParams.pId = row.pid || row.pId || this.items[0].pid;
      this.weekly.pId = this.troubleQueryParams.pId;
      const APIs = [getCompany(id), listTrouble(this.troubleQueryParams), getWeeklyList(this.weekly)]; // 放多个要请求的promise接口
      axios.all(APIs).then( // 执行并发
        axios.spread((data1, data2, data3) => {
          this.form = data1.data;
          if (this.form.isStart == 1) {
            this.rules.actualStartDate[0].required = true
          } else {
            this.rules.actualStartDate[0].required = false
          }
          if (this.form.areaCount != '') {
            this.isLandSupply = 1
          } else if (this.form.address == '') {
            this.isLandSupply = 0
          } else {
            this.isLandSupply = 2
          }
          this.form.listProcess = this.form.listProcess || {};
          console.log(this.form.picPath)
          this.form.picPath.forEach((element, index) => {
            this.form.picPath[index] = `${process.env.VUE_APP_BASE_URl}${process.env.VUE_APP_BASE_API}${element}`
          });
          console.log(this.form.picPath)
          this.troubleList = data2.rows;
          this.troubleTotal = data2.total;
          this.projWeeklyList = data3.rows;
          this.weeklytotal = data3.total;
          this.isEdit = true;
          this.open = true;
          this.title = "修改产业项目";
          this.loading = false;
        })
      );
    },
    /** 产业项目问题列表修改按钮操作 */
    TroubleListUpdate(row) {
      this.resetTrouble();
      const id = row.id || this.ids;
      this.deptVal = row && row.deptIds ? row.deptIds.split(',') : '';
      getTrouble(id).then(response => {
        this.troubleForm = response.data;
        this.TroubleOpen = true;
        this.title = "修改产业项目问题";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.$refs["form2"].validate(valid2 => {
            if (valid2) {
              try {
                // console.log('this.form.picPath', this.form.picPath)
                if (this.form.picPath != "undefined" && this.form.picPath != null && this.form.picPath != "" && typeof (this.form.picPath) == 'string') {
                  this.form.picPath = this.form.picPath.split(",");
                }
                if (this.isLandSupply == 0) {
                  this.form.address = '';
                  this.form.longitude = '';
                  this.form.latitude = '';
                  this.form.areaCount = '';
                  this.form.landSupplyTime = '';
                } else if (this.isLandSupply == 2) {
                  this.form.areaCount = '';
                  this.form.landSupplyTime = '';
                }
                if (this.form.id != null) {
                  updateCompany(this.form).then(response => {
                    this.$modal.msgSuccess("修改成功");
                    this.open = false;
                    this.getList();
                    this.reset();
                  });
                } else {
                  addCompany(this.form).then(response => {
                    this.$modal.msgSuccess("新增成功");
                    this.open = false;
                    this.getList();
                    this.reset();
                  });
                }
              } catch (e) {

              }
            }
          })
        }
      });
    },
    /** 产业项目问题提交按钮 */
    submitTroubleForm() {
      this.$refs["troubleForm"].validate(valid => {
        if (valid) {
          this.troubleForm.pId = this.form.pid;
          if (this.troubleForm.id != null) {
            updateTrouble(this.troubleForm).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.TroubleOpen = false;
              this.getTroubleList();
            });
          } else {
            addTrouble(this.troubleForm).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.TroubleOpen = false;
              this.getTroubleList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除产业项目编号为"' + ids + '"的数据项？').then(function () {
        return delCompany(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 产业项目问题删除按钮操作 */
    TroubleListDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除产业项目问题编号为"' + ids + '"的数据项？').then(function () {
        return delTrouble(ids);
      }).then(() => {
        this.getTroubleList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.loading = true;
      allcolumnscomExport().then(res => {
        console.log(res);
        this.loading = false;
        this.fromData = res.data;
        this.fromData.forEach((element, index) => {
          this.fromData[index].fid = 0
        });
        this.toData = [];
        this.headerOpen = true
      })
    },
    /** 查询产业项目问题列表 */
    getTroubleList(v) {
      this.troubleQueryParams.pageNum = v || this.troubleQueryParams.pageNum;
      this.loading = true;
      this.troubleQueryParams.pId = this.form.pid;
      listTrouble(this.troubleQueryParams).then(response => {
        console.log(response);
        this.troubleList = response.rows;
        this.troubleTotal = response.total;
        this.loading = false;
      });
    },
    // 监听穿梭框组件添加
    // add(fromData, toData, obj) {
    //   console.log("fromData:", fromData);
    //   console.log("toData:", toData);
    //   console.log("obj:", obj);
    // },
    // // 监听穿梭框组件移除
    // remove(fromData, toData, obj) {
    //   console.log("fromData:", fromData);
    //   console.log("toData:", toData);
    //   console.log("obj:", obj);
    // },
    /** 导出多选框 */
    exportFun() {
      this.download('/company/export', {
        columns: JSON.stringify(this.toData)
      }, `manage${new Date().getTime()}.xlsx`)
    },
    /** 取消导出设置 */
    cancelHeader() {
      this.headerOpen = false
    },
    // 导出按钮操作
    downloadTemplate() {
      importTemplate().then(res => {
        this.download('/company/importTemplate', {
          res
        }, `产业投资${new Date().getTime()}.xlsx`)
      })
    },
    // 导入
    handleUpload() {
      this.upload.open = true
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      console.log(event, file, fileList);
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      console.log(response, file, fileList);
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
      // this.getHistory(getHistory);
      this.getList();
    },
    // 导入文件确定按钮
    submitFileForm() {
      this.$refs.upload.submit();
    },
    // 填报周报
    // writeReport(row, isAdd) {
    //   this.isViewReport = false;
    //   this.disabled = false;
    //   console.log(row);
    //   if (isAdd) {
    //     this.weeklyDetails = {
    //       projId: row.pid || row.pId,
    //       projName: row.projectName,
    //       type: 1,
    //       content: null
    //     }
    //     this.report.title = '新增周报'
    //   } else {
    //     this.deptVal = this.weeklyDetails.deptId ? this.weeklyDetails.deptId.split(',') : this.weeklyDetails.deptId;
    //     this.weeklyDetails = {
    //       id: row.id,
    //       projId: row.projId,
    //       projName: row.projectName,
    //       type: 1,
    //       content: row.content,
    //     }
    //     this.report.title = '修改周报'
    //   }
    //   this.report.open = true;
    // },
    // 查看周报
    // viewReport(row) {
    //   this.isViewReport = true;
    //   this.deptVal = this.weeklyDetails.deptId ? this.weeklyDetails.deptId.split(',') : this.weeklyDetails.deptId;
    //   this.weeklyDetails = {
    //     projId: row.projId,
    //     projName: row.projectName,
    //     projName: row.company,
    //     type: row.type,
    //     content: row.content,
    //   };
    //   this.report.open = true;
    // },
    // // 取消填报周报
    // cancelWriteReport() {
    //   this.weeklyDetails = {
    //     content: null
    //   }
    //   this.report.open = false;
    // },
    // 周报按钮
    writeReport(row) {
      this.reportProblem = {}
      this.weeklyDetail = {}
      this.report.open = true;
      this.report.title = '周报填报'
      this.report.projectNameReportTitle = row.projectName
      this.reportProblem.pId = row.pId
      this.weeklyDetail.pId = row.pId
      getCompany(row.id).then(res => {

        this.reportProblem = res.data.listProcess
        this.reportProblem.detail = res.data.detail
      })
    },
    // 新增周报信息
    addWeekly() {
      this.$refs["reportForm"].validate(valid => {
        if (valid) {
          console.log(this.reportProblem);
          console.log(this.weeklyDetail);
          const APIs = [updateProcess(this.reportProblem), addTrouble(this.weeklyDetail)]; // 放多个要请求的promise接口 ,
          axios.all(APIs).then( // 执行并发
            axios.spread((data1, data2) => {
              this.$message({
                message: '周报修改成功',
                type: 'success'
              });
              this.report.open = false
              // this.reset()
            })
          );
        }
      })
    },
    // 填报管家研判
    writeButlerReview(row, isAdd) {
      this.disabled = false;
      this.butlerReviewDetails = row;
      this.butlerReview.title = '管家研判'
      this.butlerReview.open = true;
    },
    //取消管家研判填写
    cancelButlerReview() {
      this.butlerReview.open = false;
    },
    // 添加管家研判
    async addButlerReview() {
      // 修改管家研判成功
      await updateCompany(this.butlerReviewDetails).then(response => {
        this.$message({
          message: '填写管家研判成功',
          type: 'success'
        });
        this.butlerReview.open = false;
      });
    },
    // 周报开关
    async openWeeklyChange(val) {
      const params = {
        configId: 101,
        configValue: val ? '1' : '0',
        configKey: 'sys.index.forbidC',
        configName: '产投',
      }
      await openWeekly(params).then(response => {
        this.weeklyAuthority = !this.weeklyAuthority;
        this.$message({
          message: '修改成功',
          type: 'success'
        });
      });
    },

    // // 填报管家研判
    // writeButlerReview(row, isAdd) {
    //   this.disabled = false;
    //   this.butlerReview.open = true;
    // },
    // 留痕记录按钮
    logInformation(row) {
      // this.projectNameTitle = row.projectName;
      this.logOpen = true;
      this.queryParams.pId = row.pId;
      queryLogByPid(this.queryParams.pId).then(res => {
        console.log(res);
        this.projComBaseInfoData = res.data.projComBaseInfo;
        this.projComProcessData = res.data.projComProcess;
        this.projComTroubleData = res.data.projComTrouble;
      })
      this.title = "留痕记录";
      // this.isDefine = false
      // this.visibleSubmit = 'none'
    },
    // 清除部门名称
    valueChange(val) {
      console.log(val)
      if (!val) {
        this.queryParams.deptId = null;
        this.queryParams.deptName = null;
      }
    },
    // 删除图片回调
    beforeRemove(file, fileList) {
      console.log(file, fileList)
      let confirm = this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        files(file.name.split('dev-api')[1]).then(response => {
          if (response.code === 200) {
            reject(true);
            this.$message({
              type: 'success',
              message: '删除成功'
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
        reject(false);
      });
      return confirm
    },
    // 周报按钮是否禁用
    getWeeklyAuthority() {
      weeklyct().then(res => {
        console.log(res.msg)
        this.weeklyAuthority = res.msg == '1';
        this.openWeekly = this.weeklyAuthority;
      })
    },
    isStartChange(val) {
      if (val === 1) {
        this.rules.actualStartDate[0].required = true
      } else {
        this.rules.actualStartDate[0].required = false
      }
    }
  }
};
</script>
<style scoped>
::v-deep .el-dialog__header {
  padding: 20px;
  padding-bottom: 10px;
  background-color: #e5e5e5;
}

::v-deep .el-dialog__body {
  padding: 0 30px 20px;
  color: #606266;
  font-size: 14px;
  word-break: break-all;
}

::v-deep .el-collapse-item__header {
  font-size: 16px;
  margin-left: 20px;
}

[class^=el-icon-],
[class*=" el-icon-"] {
  font-family: "element-icons" !important;
  speak: none;
  font-style: normal;
  margin-right: 10px;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  color: #46a6ff;
  line-height: 1;
  font-size: 30px;
  vertical-align: baseline;
  display: inline-block;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.el-table__row hover-row {
  max-width: 20%
}

::v-deep .el-drawer__body {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  overflow: auto;
  margin-top: 10px;
}

::v-deep .el-dialog {
  position: relative;
  margin: 0 auto 50px;
  background: #FFFFFF;
  border-radius: 2px;
  -webkit-box-shadow: 0 1px 3px rgb(0 0 0 / 30%);
  box-shadow: 0 1px 3px rgb(0 0 0 / 30%);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 31%;
}

::v-deep .el-progress-bar {
  padding-right: 50px;
  display: inline-block;
  vertical-align: middle;
  width: 100%;
  margin-right: -55px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin-top: 14px;
}

::v-deep .el-drawer__header {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  color: #72767b;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  background-color: #e5e5e5;
  padding: 20px;
  padding-bottom: 21px;
  margin-bottom: 0;
}

::v-deep .label {
  font-weight: 100;
}



::v-deep .el-collapse-item__content {
  padding-bottom: 0px;
  font-size: 13px;
  color: #303133;
  line-height: 1.7692307692;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  height: 100px;
}

::v-deep .el-form-item__label {
  text-align: right;
  vertical-align: middle;
  float: left;
  font-size: 14px;
  color: #606266;
  font-weight: 400;
  line-height: 40px;
  padding: 0 12px 0 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 25px;
  color: #8c939d;
  line-height: 50px;
  text-align: center;
  margin-left: 140%;
  margin-top: 90%;
}

.avatar {
  width: 100%;
  height: 50px;
  display: block;
}

::v-deep .el-input__inner {
  height: 34px;
}

/* .checkItem {
  background-color: #dbdbdb;
  padding: 15px;
  margin: 10px 0;
} */

::v-deep .collapse-title {
  flex: 1 0 90%;
  order: 1;

}

::v-deep .el-form-item--small .el-form-item__content {
  line-height: 15px;
  /* display: inline-block; */
  display: flex;
}

::v-deep .el-collapse-item__header {
  flex: 1 0 auto;
  order: -1;
}

::v-deep .el-form-item.required .el-form-item__label::before {
  content: "*";
  color: #ff4949;
  margin-right: 4px;
}
.update-time{
  margin-right: 20px;
  font-size: 14px;
}
::v-deep .collapse-title {
  flex: 1 0 90%;
  order: 1;
  display: flex;
  justify-content: space-between;
}
</style>
