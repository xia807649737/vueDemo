<template>
  <div class="app-container statusBbox">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="70px">
      <el-row style="padding-right:20px;" :gutter="20">
        <el-col :span="5">
          <el-form-item label="项目名称" prop="projectName">
            <el-input v-model="queryParams.projectName" placeholder="请输入项目名称" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="部门名称" prop="deptId">
            <treeselect v-model="queryParams.deptId" :props='optionProps' :options="deptOptionsManage"
              :normalizer="normalizer" placeholder="请输入部门名称" @input="valueChange" />
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
        <el-col :span="9">
          <el-form-item label="总投资（万）" prop="cost" label-width="140px">
            <el-col :span="11">
              <el-input v-model="queryParams.sCost"></el-input>
            </el-col>
            <el-col class="line" :span="2">~</el-col>
            <el-col :span="11">
              <el-input v-model="queryParams.eCost"></el-input>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="是否集中开工" prop="isConcentrateStart" label-width="100px">
            <el-select v-model="queryParams.isConcentrateStart" placeholder="请选择" clearable>
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
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
              <el-select v-model="queryParams.planType" placeholder="请选择计划类别">
                <el-option v-for="dict in dict.type.plan_type_zt" :key="dict.value" :label="dict.label"
                  :value="parseInt(dict.value)"></el-option>
              </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="计划开工时间" prop="startDate" label-width="100px">
            <el-col :span="11">
              <el-form-item prop="startSDate">
                <el-date-picker type="date" placeholder="选择日期" v-model="queryParams.startSDate" style="width: 100%;" value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item prop="endSDate">
                <el-date-picker type="date" placeholder="选择时间" v-model="queryParams.endSDate" style="width: 100%;" value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="计划完工时间" prop="endDate" label-width="100px">
            <el-col :span="11">
              <el-form-item prop="startEDate">
                <el-date-picker type="date" placeholder="选择日期" v-model="queryParams.startEDate" style="width: 100%;" value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item prop="endEDate">
                <el-date-picker type="date" placeholder="选择时间" v-model="queryParams.endEDate" style="width: 100%;" value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item>
            <!--          <el-input type="text" v-model="time" v-bind:value="time | formatTime"/>-->
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryManage">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button :disabled="ishandleNum == '0'" type="primary" plain icon="el-icon-plus" size="mini"
          v-hasPermi="['system:info:add']" @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button :disabled="ishandleNum == '0'" type="warning" plain icon="el-icon-download" size="mini"
          @click="handleExport" v-hasPermi="['system:info:export']">导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button :disabled="ishandleNum == '0'" type="warning" plain icon="el-icon-upload" size="mini"
          @click="handleUpload" v-hasPermi="['system:info:import']">导入</el-button>
      </el-col>
      <!-- <el-col :span="1.5" v-hasPermi="['system:config:edit']">
        <div style="display:flex; align-items: center; height: 28px;">
          <el-switch v-model="openWeekly" active-text="打开周报填报" inactive-text="关闭周报填报" @change="openWeeklyChange">
          </el-switch>
        </div>
      </el-col> -->
      <!-- <right-toolbar :showSear ch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
    </el-row>
    <el-table v-loading="loading" :data="projGovBaseInfo" stripe :row-style="{ height: '50px' }"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column type="index" width="50" label="序号"> -->
      <!-- </el-table-column> -->
      <el-table-column label="项目编号" align="left" prop="pid" fixed />
      <el-table-column label="项目状态" align="left" prop="projectStatus" width="120px">
        <template slot-scope="scope">
          <span class="statusStyle" :class="`status${scope.row.projectStatus}`">
            <dict-tag :options="dict.type.proj_status" :value="scope.row.projectStatus" />
          </span>
        </template>
      </el-table-column>
      <el-table-column label="项目名称" align="left" prop="projectName" width="230px" />
      <!-- <el-table-column label="部门" align="center" prop="deptId" /> -->
      <el-table-column label="部门名称" align="left" prop="deptName" width="150" />
      <!-- <el-table-column label="基建费用" align="center" prop="jjCost" />
      <el-table-column label="拆迁费用" align="center" prop="cqCost" width="150px" /> -->
      <el-table-column label="总投资（万元）" align="left" prop="cost" width="150px" />
      <el-table-column label="建设内容及其规模" align="left" prop="content" width="200px" :show-overflow-tooltip="true" />
      <el-table-column label="计划类别" align="left" prop="planType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.plan_type_zt" :value="scope.row.planType" />
        </template>
      </el-table-column>
      <el-table-column label="是否开工" align="center" prop="isStart">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.yes_no" :value="scope.row.isStart" />
        </template>
      </el-table-column>
      <el-table-column label="计划开工日期" align="center" prop="sDate" width="200px" />
      <el-table-column label="计划完工日期" align="center" prop="eDate" width="200px" />
      <el-table-column label="项目所在地址" align="left" prop="address" width="200px" />
      <el-table-column label="创建人" align="center" prop="createdBy" />
      <el-table-column label="创建时间" align="center" prop="createdTime" width="100px" />
      <!--      <el-table-column label="更新人" align="center" prop="updatedBy" />
      <el-table-column label="更新时间" align="center" prop="updatedTime" width="100px" />-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="500px" fixed="right">
        <template slot-scope="scope">
          <!--                    <el-button size="mini" type="primary" :disabled="ishandleNum == '0'" icon="el-icon-view"  v-hasPermi="['system:info:showDetail']"
                               @click="logInformation(scope.row)">留痕记录</el-button>-->
          <el-button :disabled="ishandleNum == '0'" size="small" plain type="primary" icon="el-icon-edit"
            v-hasPermi="['system:config:edit']" @click="writeButlerReview(scope.row)">管家研判</el-button>
          <!-- <el-button :disabled="ishandleNum == '0'" size="small" plain type="primary" icon="el-icon-plus"
            v-hasPermi="['weekly:weekly:add']"  @click="writeReport(scope.row, true)">周报</el-button> -->
          <!-- <el-button :disabled="ishandleNum == '0' || !weeklyAuthority" size="small" plain type="primary" icon="el-icon-plus"
            v-hasPermi="['weekly:weekly:add']" @click="writeReportDia(scope.row)">周报</el-button> -->
          <el-button :disabled="ishandleNum == '0'" size="small" plain type="warning" icon="el-icon-edit"
            v-hasPermi="['system:info:detailEdit']" @click="isEdit(scope.row)">周更新</el-button>
          <el-button size="small" type="primary" plain :disabled="ishandleNum == '0'" icon="el-icon-view"
            @click="detailedInformation(scope.row)">详情</el-button>
          <el-button :disabled="ishandleNum == '0'" size="small" plain type="warning" icon="el-icon-caret-bottom"
            v-hasPermi="['system:info:baseEdit']" @click="isEditOpen(scope.row)">基本信息修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="queryParams.pageNum" :page-sizes="[10, 20, 30, 40, 50]"
      layout="->,total, prev, pager, next,sizes, jumper" :total="total">
    </el-pagination>


    <!-- 项目留痕对话框 -->
    <el-drawer :dialogLog="dialogLog" :title="title" :visible.sync="logOpen" append-to-body :size="size">
      <p style=" margin-left: 20px; font-size: 18px; color: #0e191a;">{{ `项目名称：${this.projectNameTitle}` }}</p>
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1">
          <span class="collapse-title" slot="title">项目信息留痕123</span>
          <el-table :data="projGovBaseInfoData" style="width: 100%">
            <el-table-column prop="isSlow" label="项目编号" align="center" />
            <el-table-column prop="projectName" label="项目名称" align="center" />
            <el-table-column prop="address" label="项目所在地址" align="center" width="150" />
            <el-table-column prop="deptName" label="部门名称" align="center" />
            <el-table-column prop="jjCost" label="基建费用(万)" align="center" width="150" />
            <el-table-column prop="cqCost" label="拆迁费用(万)" align="center" width="150" />
            <el-table-column prop="sDate" label="计划开工日期" align="center" width="150">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.sDate, '{y}-{m}-{d}') }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="eDate" label="计划完工日期" align="center" width="150">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.eDate, '{y}-{m}-{d}') }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="content" label="建设内容及其规模" align="center" width="150" />
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
          <span class="collapse-title" slot="title">已完工项目留痕</span>
          <el-table :data="projGovCompletStatusData" style="width: 100%">
            <el-table-column prop="buildCompany" label="代建公司名称" align="center" width="150" />
            <el-table-column prop="undeliverReson" label="未交付原因" align="left" width="200" :show-overflow-tooltip="true" />
            <el-table-column prop="actualDate" label="项目实际完工时间" align="center" width="150">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.actualDate, '{y}-{m}-{d}') }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="isAcceptance" label="是否验收" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.isAcceptance == "0" ? "否" : "是" }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="isFinalCost" label="是否完成竣工决算" align="center" width="150">
              <template slot-scope="scope">
                <span>{{ scope.row.isFinalCost == "0" ? "否" : "是" }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="isDeliver" label="是否已交付" align="center" width="150">
              <template slot-scope="scope">
                <span>{{ scope.row.isDeliver == "0" ? "否" : "是" }}</span>
              </template>
            </el-table-column>
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
        <el-collapse-item name="3">
          <span class="collapse-title" slot="title">前期手续办理留痕</span>
          <el-table :data="projGovProceduresData" style="width: 100%">
            <el-table-column prop="designCompany" label="项目设计单位" align="center" width="150" />
            <el-table-column prop="constructCompany" label="项目施工单位" align="center" width="150" />
            <el-table-column prop="wTarget" label="周目标" align="center" />
            <el-table-column prop="mTarget" label="月目标" align="center" />
            <el-table-column prop="qTarget" label="季目标" align="center" />
            <el-table-column prop="bidDates" label="开标时间" align="center" width="100">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.bidDates, '{y}-{m}-{d}') }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="licenceDate" label="许可证办理时间" align="center" width="150">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.bidDates, '{y}-{m}-{d}') }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="isBid" label="是否开标" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.isBid == "0" ? "否" : "是" }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="isLicence" label="是否办理施工许可证" align="center" width="150">
              <template slot-scope="scope">
                <span>{{ scope.row.isLicence == "0" ? "否" : "是" }}</span>
              </template>
            </el-table-column>
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
        <el-collapse-item name="4">
          <span class="collapse-title" slot="title">项目资金来源及拨付留痕</span>
          <el-table :data="projGovCapitalData" style="width: 100%">
            <el-table-column prop="isIn" label="项目是否入库" align="center" width="120">
              <template slot-scope="scope">
                <span>{{ scope.row.isIn == "0" ? "否" : "是" }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="isDeclareUp" label="是否申请上级资金" align="center" width="130">
              <template slot-scope="scope">
                <span>{{ scope.row.isDeclareUp == "0" ? "否" : "是" }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="uninReson" label="未入库原因" align="left" width="200" :show-overflow-tooltip="true" />
            <el-table-column prop="declareAmount" label="已申报投资(万)" align="center" width="120" />
            <el-table-column prop="upAmount" label="申请金额(万)" align="center" width="120" />
            <el-table-column prop="upPay" label="上级资金拨付金额(万)" align="center" width="150" />
            <el-table-column prop="areaPay" label="区级财政资金拨付金额(万)" align="center" width="180" />
            <el-table-column prop="upName" label="上级资金类型" align="center" width="120" />
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
        <el-collapse-item name="5">
          <span class="collapse-title" slot="title">在建项目进度留痕</span>
          <el-table :data="projGovProcessData" style="width: 100%">
            <el-table-column prop="percentFinish" label="完成全部工程量百分比" width="150" align="center" />
            <el-table-column prop="percentAll" label="工程量和工期百分比" width="150" align="center" />
            <el-table-column prop="actualProcess" label="实际进度" align="center" />
            <el-table-column prop="delayReson" label="项目进展缓慢原因" width="200" align="left" :show-overflow-tooltip="true" />
            <el-table-column prop="delayReson" label="管家研判" align="center" />
            <el-table-column prop="wTarget" label="周目标" align="center" />
            <el-table-column prop="mTarget" label="月目标" align="center" />
            <el-table-column prop="qTarget" label="季目标" align="center" />
            <el-table-column prop="actualStartDate" label="实际开工时间" width="120" align="center">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.actualStartDate, '{y}-{m}-{d}') }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="delayName" label="项目滞后等级" width="120" align="center" />
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
    <!-- 添加或修改项目信息对话框 -->
    <el-drawer :wrapperClosable="wrapperClosable" :title="title" :visible.sync="open" append-to-body :size="size" @close="closeHandle">
      <p style=" margin-left: 20px; font-size: 18px; color: #0e191a;">{{ `项目名称：${this.projectNameTitle}` }}</p>
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item name="1">
          <div class="collapse-title" slot="title">
            <span>前期手续办理情况</span>
            <div>
              <span class="update-time" v-if="form.ProjGovProcedures.updatedTime">更新时间：{{form.ProjGovProcedures.updatedTime}}</span>
              <el-button :style="{ display: visibleSubmit }" v-if="this.isDefine" :disabled="disabled" type="primary" size="mini" @click.stop="isAddManageProjGovProcedures">保存</el-button>
              <el-button :style="{ display: visibleSubmit }" v-else :disabled="disabled" type="primary" size="mini" @click.stop="isEditManageProjGovProcedures">保存</el-button>
            </div>
          </div>
          <!-- <span class="collapse-title" slot="title">前期手续办理情况</span> -->
          <el-form :model="form.ProjGovProcedures" label-width="120px" ref="formP" :rules="prophaseRules">
            <el-row style="padding-right:20px;">
              <p>
                <strong>选址意见书及用地预审办理情况</strong>
              </p>
              <el-col :span="12">
                <el-form-item label="是否办理" prop="siteauditIsdeal">
                  <el-select v-model="form.ProjGovProcedures.siteauditIsdeal" placeholder="请选择是否办理" clearable :disabled="disabled" style="width: 100%;">
                    <el-option v-for="dict in dict.type.yes_or_no" :key="dict.value" :label="dict.label"
                      :value="parseInt(dict.value)" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item v-if="form.ProjGovProcedures.siteauditIsdeal=='0'" label="协调单位" prop="siteauditCompanyIds">
                  <el-cascader ref="cascaderItem" v-model="form.ProjGovProcedures.siteauditCompanyIds" placeholder="请选择问题涉及部门"
                    @change="depChangeSiteaudit($event, true)" :options="deptTree" :props="props" collapse-tags clearable :disabled="disabled" style="width: 100%;">
                  </el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item v-if="form.ProjGovProcedures.siteauditIsdeal=='0'" label="未办理原因" prop="siteauditReasons">
                  <el-input v-model="form.ProjGovProcedures.siteauditReasons" :disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <p>
                  <strong>项目可行性研究报告批复办理情况</strong>
                </p>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否办理" prop="feasibilityIsdeal">
                  <el-select v-model="form.ProjGovProcedures.feasibilityIsdeal" placeholder="请选择施工许可证" clearable :disabled="disabled" style="width: 100%;">
                    <el-option v-for="dict in dict.type.yes_or_no" :key="dict.value" :label="dict.label"
                      :value="parseInt(dict.value)" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item v-if="form.ProjGovProcedures.feasibilityIsdeal=='0'" label="协调单位" prop="feasibilityCompanyIds">
                  <el-cascader ref="cascaderItem" v-model="form.ProjGovProcedures.feasibilityCompanyIds" placeholder="请选择问题涉及部门"
                    @change="depChangeFeasibility($event, true)" :options="deptTree" :props="props" collapse-tags clearable :disabled="disabled" style="width: 100%;">
                  </el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item v-if="form.ProjGovProcedures.feasibilityIsdeal=='0'" label="未办理原因" prop="feasibilityReasons">
                  <el-input v-model="form.ProjGovProcedures.feasibilityReasons" :disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <p>
                  <strong>建设用地规划许可证办理情况</strong>
                </p>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否办理" prop="sitepermitIsdeal">
                  <el-select v-model="form.ProjGovProcedures.sitepermitIsdeal" placeholder="请选择施工许可证" clearable :disabled="disabled" style="width: 100%;">
                    <el-option v-for="dict in dict.type.yes_or_no" :key="dict.value" :label="dict.label"
                      :value="parseInt(dict.value)" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item v-if="form.ProjGovProcedures.sitepermitIsdeal=='0'" label="协调单位" prop="sitepermitCompanyIds">
                  <el-cascader ref="cascaderItem" v-model="form.ProjGovProcedures.sitepermitCompanyIds" placeholder="请选择问题涉及部门"
                    @change="depChangeSitepermit($event, true)" :options="deptTree" :props="props" collapse-tags clearable :disabled="disabled" style="width: 100%;">
                  </el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item v-if="form.ProjGovProcedures.sitepermitIsdeal=='0'" label="未办理原因" prop="sitepermitReasons">
                  <el-input v-model="form.ProjGovProcedures.sitepermitReasons" :disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <p>
                  <strong>项目初步设计办理情况</strong>
                </p>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否办理" prop="predesignIsdeal">
                  <el-select v-model="form.ProjGovProcedures.predesignIsdeal" placeholder="请选择施工许可证" clearable :disabled="disabled" style="width: 100%;">
                    <el-option v-for="dict in dict.type.yes_or_no" :key="dict.value" :label="dict.label"
                      :value="parseInt(dict.value)" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item v-if="form.ProjGovProcedures.predesignIsdeal=='0'" label="协调单位" prop="predesignCompanyIds">
                  <el-cascader ref="cascaderItem" v-model="form.ProjGovProcedures.predesignCompanyIds" placeholder="请选择问题涉及部门"
                    @change="depChangePredesign($event, true)" :options="deptTree" :props="props" collapse-tags clearable :disabled="disabled" style="width: 100%;">
                  </el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item v-if="form.ProjGovProcedures.predesignIsdeal=='0'" label="未办理原因" prop="predesignReasons">
                  <el-input v-model="form.ProjGovProcedures.predesignReasons" :disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <p>
                  <strong>建设工程规划许可证办理情况</strong>
                </p>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否办理" prop="propermitIsdeal">
                  <el-select v-model="form.ProjGovProcedures.propermitIsdeal" placeholder="请选择施工许可证" clearable :disabled="disabled" style="width: 100%;">
                    <el-option v-for="dict in dict.type.yes_or_no" :key="dict.value" :label="dict.label"
                      :value="parseInt(dict.value)" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item v-if="form.ProjGovProcedures.propermitIsdeal=='0'" label="协调单位" prop="propermitCompanyIds">
                  <el-cascader ref="cascaderItem" v-model="form.ProjGovProcedures.propermitCompanyIds" placeholder="请选择问题涉及部门"
                    @change="depChangePropermit($event, true)" :options="deptTree" :props="props" collapse-tags clearable :disabled="disabled" style="width: 100%;">
                  </el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item v-if="form.ProjGovProcedures.propermitIsdeal=='0'" label="未办理原因" prop="propermitReasons">
                  <el-input v-model="form.ProjGovProcedures.propermitReasons" :disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="项目地址" prop="address">
                  <el-tooltip class="item" effect="dark" :content="form.ProjGovProcedures.address" placement="top-start"
                    v-if="disabled && form.ProjGovProcedures.address">
                    <el-input v-model="form.ProjGovProcedures.address" placeholder="请输入项目地址" :disabled="disabled" />
                  </el-tooltip>
                  <el-input v-else v-model="form.ProjGovProcedures.address" placeholder="请输入项目地址" :disabled="disabled" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="经度" prop="longitude" >
                  <el-input v-model="form.ProjGovProcedures.longitude" placeholder="请输入经度" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="纬度" prop="latitude" >
                  <el-input v-model="form.ProjGovProcedures.latitude" placeholder="请输入纬度" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否开标" prop="isBid">
                  <el-radio-group v-model="form.ProjGovProcedures.isBid" @input="isBid">

                    <el-radio :disabled="disabled" :label="1">是</el-radio>
                    <el-radio :disabled="disabled" :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item></el-col>
              <el-col :span="12">
                <el-form-item label="开标时间" prop="bidDates">
                  <el-date-picker clearable :disabled="disabled" v-model="form.ProjGovProcedures.bidDates" type="date"
                    value-format="yyyy-MM-dd" placeholder="请选择开标时间" style="width: 100%;">
                  </el-date-picker>
                </el-form-item></el-col>
              <el-col :span="24">
                <el-form-item label="项目设计单位" prop="designCompany">
                  <el-tooltip class="item" effect="dark" :content="form.ProjGovProcedures.designCompany"
                    placement="top-start" v-if="disabled && form.ProjGovProcedures.designCompany">
                    <el-input v-model="form.ProjGovProcedures.designCompany" placeholder="请输入项目设计单位"
                      :disabled="disabled" />
                  </el-tooltip>
                  <el-input v-else v-model="form.ProjGovProcedures.designCompany" placeholder="请输入项目设计单位"
                    :disabled="disabled" />
                </el-form-item></el-col>
              <el-col :span="24">
                <el-form-item label="项目施工单位" prop="constructCompany">
                  <el-tooltip class="item" effect="dark" :content="form.ProjGovProcedures.constructCompany"
                    placement="top-start" v-if="disabled && form.ProjGovProcedures.constructCompany">
                    <el-input v-model="form.ProjGovProcedures.constructCompany" placeholder="请输入项目施工单位"
                      :disabled="disabled" />
                  </el-tooltip>
                  <el-input v-else v-model="form.ProjGovProcedures.constructCompany" placeholder="请输入项目施工单位"
                    :disabled="disabled" />
                </el-form-item></el-col>
              <el-col :span="12">
                <el-form-item label="是否办理施工许可证" prop="isLicence" label-width="150px">
                  <el-radio-group v-model="form.ProjGovProcedures.isLicence" @input="isLicence">
                    <el-radio :disabled="disabled" :label="1">是</el-radio>
                    <el-radio :disabled="disabled" :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item></el-col>
              <el-col :span="12">
                <el-form-item label="施工许可证办理时间" prop="licenceDate" label-width="150px">
                  <el-date-picker :disabled="disabled" clearable v-model="form.ProjGovProcedures.licenceDate" type="date"
                    value-format="yyyy-MM-dd" placeholder="请选择许可证办理时间" style="width: 100%;">
                  </el-date-picker>
                </el-form-item></el-col>
              <el-col :span="24">
                <el-form-item label="前期手续存在问题" prop="" label-width="150px">
                  <el-radio-group v-model="isExist">
                    <el-radio :disabled="disabled" :label="1">是</el-radio>
                    <el-radio :disabled="disabled" :label="0">否</el-radio>
                  </el-radio-group>
                  <el-button :disabled="disabled" style="float: right; margin-bottom: 10px;" type="primary" plain
                    icon="el-icon-plus" size="mini" @click="proceduresAdd">新增问题</el-button>
                  <el-table :data="proceduresList" border>
                    <el-table-column label="手续类型" align="center" prop="procedureName" />
                    <el-table-column label="协调单位" align="center" prop="deptNames" />
                    <el-table-column label="问题原因" align="center" prop="unhandleReson" />
                    <el-table-column label="操作" align="center" width="170" fixed="right">
                      <template slot-scope="scope">
                        <el-button size="mini" :disabled="disabled" type="text" icon="el-icon-edit"
                          @click="proceduresEdit(scope.row)">修改</el-button>
                        <el-button size="mini" :disabled="disabled" type="text" icon="el-icon-delete"
                          @click="proceduresDelete(scope.row)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div class="el-form-item__error" v-if="this.isExist == 1 && this.proceduresList.length == 0">请新增问题</div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

        </el-collapse-item>
        <el-collapse-item name="2">
          <div class="collapse-title" slot="title">
            <span>现场推进情况</span>
            <div>
              <span class="update-time" v-if="form.ProjGovProcess.updatedTime">更新时间：{{form.ProjGovProcess.updatedTime}}</span>
              <el-button :style="{ display: visibleSubmit }" v-if="this.isDefine" :disabled="disabled" type="primary" size="mini" @click.stop="isAddManageProjGovProcess">保存</el-button>
              <el-button :style="{ display: visibleSubmit }" v-else :disabled="disabled" type="primary" size="mini" @click.stop="isEditManageProjGovProcess">保存</el-button>
            </div>
          </div>
          <!-- <span class="collapse-title" slot="title">现场推进情况</span> -->
          <el-form :model="form.ProjGovProcess" ref="formA" v-show="showSearch" label-width="150px" :rules="advanceRules">
            <el-row style="padding-right:20px;">
              <el-col :span="12">
                <el-form-item label="项目实际开工时间" prop="actualStartDate">
                  <el-date-picker :disabled="disabled" clearable v-model="form.ProjGovProcess.actualStartDate" type="date"
                    value-format="yyyy-MM-dd" placeholder="请选择实际开工时间" @change="actualStartDate" style="width: 100%;">
                  </el-date-picker>
                </el-form-item></el-col>
              <el-col :span="12">
                <el-form-item label="代建单位" prop="buildCompany">
                  <el-tooltip class="item" effect="dark" :content="form.ProjGovProcess.buildCompany" placement="top-start"
                    v-if="disabled && form.ProjGovProcess.buildCompany">
                    <el-input v-model="form.ProjGovProcess.buildCompany" placeholder="请输入代建单位" :disabled="disabled" style="width: 100%;" />
                  </el-tooltip>
                  <el-input v-else v-model="form.ProjGovProcess.buildCompany" placeholder="请输入代建单位"
                    :disabled="disabled" style="width: 100%;" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="目前进展情况" prop="actualProcess">
                  <el-tooltip class="item" effect="dark" :content="form.ProjGovProcess.actualProcess"
                    placement="top-start" v-if="disabled && form.ProjGovProcess.actualProcess">
                    <el-input type="textarea" v-model="form.ProjGovProcess.actualProcess" placeholder="请输入项目进度情况"
                      :disabled="disabled" />
                  </el-tooltip>
                  <el-input v-else type="textarea" v-model="form.ProjGovProcess.actualProcess" placeholder="请输入项目进度情况"
                    :disabled="disabled" />
                </el-form-item></el-col>
              <el-col :span="12">
                <el-form-item label="完成全部工程量百分比" prop="percentFinish" label-width="170px">
                  <el-progress
                    :percentage="form.ProjGovProcess.percentFinish == null ? 0 : form.ProjGovProcess.percentFinish" style="width: 100%;"></el-progress>
                  <el-button-group>
                    <el-button size="mini" icon="el-icon-minus" @click="decrease"></el-button>
                    <el-button size="mini" icon="el-icon-plus" @click="increase"></el-button>
                  </el-button-group>
                </el-form-item></el-col>
              <el-col :span="12">
                <el-form-item label="序时进度工程量百分比" prop="percentAll" label-width="170px">
                  <el-progress
                    :percentage="form.ProjGovProcess.percentAll == null ? 0 : form.ProjGovProcess.percentAll" style="width: 100%;"></el-progress>
                  <!--                  <el-button-group>
                    <el-button :disabled="disabled" size="mini" icon="el-icon-minus" @click="percentAllBtn"></el-button>
                    <el-button :disabled="disabled" size="mini" icon="el-icon-plus" @click="increaseRightBtn"></el-button>
                  </el-button-group>-->
                </el-form-item></el-col>
              <el-col :span="24">
                <el-form-item label="月目标" prop="mTarget">
                  <el-tooltip class="item" effect="dark" :content="form.ProjGovProcess.mTarget" placement="top-start"
                    v-if="disabled && form.ProjGovProcess.mTarget">
                    <el-input type="textarea" v-model="form.ProjGovProcess.mTarget" placeholder="请输入月目标"
                      :disabled="disabled" />
                  </el-tooltip>
                  <el-input v-else type="textarea" v-model="form.ProjGovProcess.mTarget" placeholder="请输入月目标"
                    :disabled="disabled" />
                </el-form-item></el-col>
              <el-col :span="24">
                <el-form-item label="季目标" prop="qTarget">
                  <el-tooltip class="item" effect="dark" :content="form.ProjGovProcess.qTarget" placement="top-start"
                    v-if="disabled && form.ProjGovProcess.qTarget">
                    <el-input type="textarea" v-model="form.ProjGovProcess.qTarget" placeholder="请输入季目标"
                      :disabled="disabled" />
                  </el-tooltip>
                  <el-input v-else type="textarea" v-model="form.ProjGovProcess.qTarget" placeholder="请输入季目标"
                    :disabled="disabled" />
                </el-form-item></el-col>
              <el-col :span="24">
                <el-form-item label="半年目标" prop="wTarget">
                  <el-tooltip class="item" effect="dark" :content="form.ProjGovProcess.wTarget" placement="top-start"
                    v-if="disabled && form.ProjGovProcess.wTarget">
                    <el-input type="textarea" v-model="form.ProjGovProcess.wTarget" placeholder="请输入半年目标"
                      :disabled="disabled" />
                  </el-tooltip>
                  <el-input v-else type="textarea" v-model="form.ProjGovProcess.wTarget" placeholder="请输入半年目标"
                    :disabled="disabled" />
                </el-form-item></el-col>
              <el-col :span="24">
                <el-form-item label="是否进展缓慢" prop="isSlow">
                  <el-radio-group v-model="form.ProjGovProcess.isSlow">
                    <el-radio :disabled="disabled" :label="1">是</el-radio>
                    <el-radio :disabled="disabled" :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item></el-col>
              <el-col :span="24">
                <el-form-item label="项目进展缓慢原因" prop="delayReson">
                  <el-tooltip class="item" effect="dark" :content="form.ProjGovProcess.delayReson" placement="top-start"
                    v-if="disabled && form.ProjGovProcess.delayReson">
                    <el-input type="textarea" v-model="form.ProjGovProcess.delayReson" placeholder="请输入项目进展缓慢原因"
                      :disabled="disabled" />
                  </el-tooltip>
                  <el-input v-else type="textarea" v-model="form.ProjGovProcess.delayReson" placeholder="请输入项目进展缓慢原因"
                    :disabled="disabled" />
                </el-form-item></el-col>
              <el-col :span="12">
                <el-form-item label="项目预计完工时间" prop="ecompleteTime">
                  <el-date-picker :disabled="disabled" clearable v-model="form.ProjGovProcess.ecompleteTime" type="date"
                    value-format="yyyy-MM-dd" placeholder="请选择项目预计完工时间" style="width: 100%;">
                  </el-date-picker>
                </el-form-item></el-col>
              <el-col :span="24">
                <el-form-item label="现场进度图" prop="picPath">
                  <ImageUpload :headers="token" :fileList="form.ProjGovProcess.picPath"
                    v-model="form.ProjGovProcess.picPath" v-if="!disabled" :action="action" :beforeRemove="beforeRemove">
                  </ImageUpload>
                  <div v-else>
                    <el-image v-for="(item, index) in form.ProjGovProcess.picPath" :key="index"
                      style="width: 100px; height: 100px" :src="item" :preview-src-list="form.ProjGovProcess.picPath">
                    </el-image>
                  </div>
                </el-form-item></el-col>
              <!--              <el-col :span="24">
                <el-form-item label="项目滞后等级" prop="delayName">
                  <el-radio-group v-model="form.ProjGovProcess.delayName">
                    <el-radio :disabled="disabled" :label="'严重滞后'">严重滞后</el-radio>
                    <el-radio :disabled="disabled" :label="'中度滞后'">中度滞后</el-radio>
                    <el-radio :disabled="disabled" :label="'轻度滞后'">轻度滞后</el-radio>
                  </el-radio-group>
                </el-form-item></el-col>-->
            </el-row>
            <el-form-item label="项目现场存在的问题" prop="">
              <div style="margin-right: 20px;">
              <el-radio-group v-model="isExistProcess">
                <el-radio :disabled="disabled" :label="1">是</el-radio>
                <el-radio :disabled="disabled" :label="0">否</el-radio>
              </el-radio-group>
                <el-button :disabled="disabled" style="float: right; margin-bottom: 10px;" type="primary" plain
                  icon="el-icon-plus" size="mini" @click="processAdd">新增问题</el-button>
                <el-table :data="processList" border>
                  <el-table-column label="问题类型" align="center" prop="troubleName" />
                  <el-table-column label="协调单位" align="center" prop="deptNames" />
                  <el-table-column label="问题原因" align="center" prop="content" />
                  <el-table-column label="操作" align="center" width="170" fixed="right">
                    <template slot-scope="scope">
                      <el-button :disabled="disabled" size="mini" type="text" icon="el-icon-edit"
                        @click="processEdit(scope.row)">修改</el-button>
                      <el-button :disabled="disabled" size="mini" type="text" icon="el-icon-delete"
                        @click="processDelete(scope.row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="el-form-item__error" v-if="this.isExistProcess == 1 && this.processList.length == 0">请新增问题</div>
              </div>
            </el-form-item>
          </el-form>
        </el-collapse-item>
        <el-collapse-item name="3">
          <div class="collapse-title" slot="title">
            <span>项目完工情况</span>
            <div>
              <span class="update-time" v-if="form.ProjGovCompletStatus.updatedTime">更新时间：{{form.ProjGovCompletStatus.updatedTime}}</span>
              <el-button :style="{ display: visibleSubmit }" v-if="this.isDefine" :disabled="disabled" type="primary" size="mini" @click.stop="isAddManageProjGovCompletStatus">保存</el-button>
              <el-button :style="{ display: visibleSubmit }" v-else :disabled="disabled" type="primary" size="mini" @click.stop="isEditManageProjGovCompletStatus">保存</el-button>
            </div>
          </div>
          <!-- <span class="collapse-title" slot="title">项目完工情况</span> -->
          <!-- <template slot="title">
            <i class="header-icon el-icon-d-caret"></i> 已完工项目情况
          </template> -->
          <el-form :model="form.ProjGovCompletStatus" label-width="140px" ref="formC" :rules="completRules">
            <el-row style="padding-right:20px;">
              <!-- <el-col :span="24">
                <el-form-item label="代建公司名称" prop="buildCompany">
                  <el-tooltip class="item" effect="dark" :content="form.ProjGovCompletStatus.buildCompany"
                    placement="top-start" v-if="disabled && form.ProjGovCompletStatus.buildCompany">
                    <el-input v-model="form.ProjGovCompletStatus.buildCompany" placeholder="请输入代建公司名称"
                      :disabled="disabled" />
                  </el-tooltip>
                  <el-input v-else v-model="form.ProjGovCompletStatus.buildCompany" placeholder="请输入代建公司名称"
                    :disabled="disabled" />
                </el-form-item></el-col> -->
              <el-col :span="12">
                <el-form-item label="是否完工" prop="isOver">
                  <el-radio-group v-model="form.ProjGovCompletStatus.isOver" @input="isOver" style="width:100%;">
                    <el-radio :disabled="disabled" :label="1">是</el-radio>
                    <el-radio :disabled="disabled" :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item></el-col>
              <el-col :span="12">
                <el-form-item label="项目实际完工时间" prop="actualDate">
                  <el-date-picker clearable v-model="form.ProjGovCompletStatus.actualDate" type="date"
                    :disabled="disabled" value-format="yyyy-MM-dd" placeholder="请选择项目实际完工时间" @change="actualDateChange" style="width:100%;">
                  </el-date-picker>
                </el-form-item></el-col>
              <el-col :span="12">
                <el-form-item label="是否验收" prop="isAcceptance">
                  <el-radio-group v-model="form.ProjGovCompletStatus.isAcceptance"
                    :disabled="!form.ProjGovCompletStatus.actualDate" style="width:100%;">
                    <el-radio :disabled="disabled" :label="1">是</el-radio>
                    <el-radio :disabled="disabled" :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item></el-col>
              <el-col :span="12">
                <el-form-item label="是否完成竣工决算" prop="isFinalCost">
                  <el-radio-group v-model="form.ProjGovCompletStatus.isFinalCost"
                    :disabled="!form.ProjGovCompletStatus.actualDate" style="width:100%;">
                    <el-radio :disabled="disabled" :label="1">是</el-radio>
                    <el-radio :disabled="disabled" :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item></el-col>
              <el-col :span="12">
                <el-form-item label="是否交付使用" prop="isDeliver">
                  <el-radio-group v-model="form.ProjGovCompletStatus.isDeliver"
                    :disabled="!form.ProjGovCompletStatus.actualDate" @input="isDeliverChange" style="width:100%;">
                    <el-radio :disabled="disabled" :label="1">是</el-radio>
                    <el-radio :disabled="disabled" :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item></el-col>
              <el-col :span="24">
                <el-form-item label="项目未交付原因" prop="undeliverReson">
                  <el-tooltip class="item" effect="dark" :content="form.ProjGovCompletStatus.undeliverReson"
                    placement="top-start" v-if="disabled && form.ProjGovCompletStatus.undeliverReson">
                    <el-input v-model="form.ProjGovCompletStatus.undeliverReson" placeholder="请输入未交付原因"
                      :disabled="disabled || form.ProjGovCompletStatus.isDeliver == 1 || (!form.ProjGovCompletStatus.isDeliver && form.ProjGovCompletStatus.isDeliver != 0)" />
                  </el-tooltip>
                  <el-input v-else v-model="form.ProjGovCompletStatus.undeliverReson" placeholder="请输入未交付原因"
                    :disabled="disabled || form.ProjGovCompletStatus.isDeliver == 1 || (!form.ProjGovCompletStatus.isDeliver && form.ProjGovCompletStatus.isDeliver != 0)" />
                </el-form-item></el-col>
            </el-row>
          </el-form>
        </el-collapse-item>
        <el-collapse-item name="4">
          <div class="collapse-title" slot="title">
            <span>项目入库投资情况</span>
            <div>
              <span class="update-time" v-if="form.ProjGovCapital.updatedTime">更新时间：{{form.ProjGovCapital.updatedTime}}</span>
              <el-button :style="{ display: visibleSubmit }" v-if="this.isDefine" :disabled="disabled" type="primary" size="mini" @click.stop="isAddManageProjGovCapital">保存</el-button>
              <el-button :style="{ display: visibleSubmit }" v-else :disabled="disabled" type="primary" size="mini" @click.stop="isEditManageProjGovCapital">保存</el-button>
            </div>
          </div>
          <!-- <span class="collapse-title" slot="title">项目入库投资情况</span> -->
          <el-form :rules="rules" :model="form.ProjGovCapital" ref="formR" v-show="showSearch" label-width="140px">
            <el-row style="padding-right:20px;">
              <el-col :span="24">
                <el-form-item label="项目是否入库" prop="isIn">
                  <el-radio-group v-model="form.ProjGovCapital.isIn">
                    <el-radio :disabled="disabled" :label="1">是</el-radio>
                    <el-radio :disabled="disabled" :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item></el-col>

              <el-col :span="24">
                <el-form-item label="未入库原因" prop="uninReson">
                  <el-tooltip class="item" effect="dark" :content="form.ProjGovCapital.uninReson" placement="top-start"
                    v-if="disabled && form.ProjGovCapital.uninReson">
                    <el-input type="textarea" v-model="form.ProjGovCapital.uninReson" placeholder="请输入未入库原因" clearable
                      @keyup.enter.native="handleQuery" :disabled="disabled" />
                  </el-tooltip>
                  <el-input v-else type="textarea" v-model="form.ProjGovCapital.uninReson" placeholder="请输入未入库原因"
                    clearable @keyup.enter.native="handleQuery" :disabled="disabled" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="已申报投资(万)" prop="declareAmount">
                  <el-input v-model="form.ProjGovCapital.declareAmount" placeholder="请输入已申报投资" clearable
                    @keyup.enter.native="handleQuery" :disabled="disabled" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>
        <el-collapse-item name="5">
          <!-- <template slot="title">
            <i class="header-icon el-icon-d-caret"></i> 项目资金来源及拨付情况
          </template> -->
          <div class="collapse-title" slot="title">
            <span>资金来源及拨付情况</span>
            <div>
              <span class="update-time" v-if="form.ProjGovCapital.updatedTime">更新时间：{{form.ProjGovCapital.updatedTime}}</span>
              <el-button :style="{ display: visibleSubmit }" v-if="this.isDefine" :disabled="disabled" type="primary" size="mini" @click.stop="isAddManageProjGovCapital">保存</el-button>
              <el-button :style="{ display: visibleSubmit }" v-else :disabled="disabled" type="primary" size="mini" @click.stop="isEditManageProjGovCapital">保存</el-button>
            </div>
          </div>
          <!-- <span class="collapse-title" slot="title">资金来源及拨付情况</span> -->

          <el-form :rules="rules" :model="form.ProjGovCapital" ref="formS" v-show="showSearch" label-width="180px">
            <el-row style="padding-right:20px;">


              <el-col :span="12">
                <el-form-item label="申请金额(万)" prop="upAmount">
                  <el-input v-model="form.ProjGovCapital.upAmount" placeholder="请输入申请金额" clearable
                    @keyup.enter.native="handleQuery" :disabled="disabled" style="width:100%;" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否申请上级资金" prop="isDeclareUp">
                  <el-radio-group v-model="form.ProjGovCapital.isDeclareUp" @change="isDeclareUpChange" style="width:100%;">
                    <el-radio :disabled="disabled" :label="1">是</el-radio>
                    <el-radio :disabled="disabled" :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item></el-col>

              <el-col :span="12">
                <el-form-item label="上级资金类型" prop="upName">
                  <el-select v-model="form.ProjGovCapital.unhandleReson" placeholder="请选择资金类型"
                    :disabled="form.ProjGovCapital.isDeclareUp == '0'" style="width:100%;">
                    <el-option v-for="dict in dict.type.up_capital" :key="dict.value" :label="dict.label"
                      :value="dict.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="上级资金拨付金额(万)" prop="upPay">
                  <el-input v-model="form.ProjGovCapital.upPay" placeholder="请输入上级资金拨付金额" clearable
                    @keyup.enter.native="handleQuery" :disabled="disabled || form.ProjGovCapital.isDeclareUp == '0'" style="width:100%;" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="区级财政资金拨付金额(万)" prop="areaPay">
                  <el-input v-model="form.ProjGovCapital.areaPay" placeholder="请输入区级财政资金拨付金额" clearable
                    :disabled="disabled" @keyup.enter.native="handleQuery" style="width:100%;" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="平台公司融资(万)" prop="platformCompany">
                  <el-input v-model="form.ProjGovCapital.platformCompany" placeholder="请输入区级财政资金拨付金额" clearable
                    :disabled="disabled" @keyup.enter.native="handleQuery" style="width:100%;" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>
        <!-- <el-collapse-item name="6">
          <span class="collapse-title" slot="title">历史周报</span>
          <el-table v-loading="loading" :data="weeklyList">
            <el-table-column label="项目编号" align="center" prop="projId" />
            <el-table-column label="项目名称" align="center" prop="projName" />
            <el-table-column label="责任单位" align="center" prop="deptName" />
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
            <el-table-column label="进度是否正常" align="center" prop="isProcessNormal">
              <template slot-scope="scope">
                <span>{{ scope.row.isProcessNormal == "0" ? "否" : "是" }}</span>
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
          <el-pagination background @size-change="handleSizeChangeWeekly" @current-change="handleCurrentChangeWeekly"
            :current-page="weekly.pageNum" :page-sizes="[4, 8, 12, 16, 32]"
            layout="->,total, prev, pager, next,sizes, jumper" :total="weeklytotal">
          </el-pagination>
        </el-collapse-item> -->
      </el-collapse>
      <!-- <el-row>
        <el-col :span="24" style="margin-top: 30px; margin-bottom: 30px;">
          <el-button :style="{ display: visibleSubmit }" v-if="this.isDefine" :disabled="disabled"
            style="margin-left: 35vw;" type="primary" @click="isAddManage">新增</el-button>
          <el-button :style="{ display: visibleSubmit }" v-else :disabled="disabled" style="margin-left: 35vw;"
            type="primary" @click="isEditManage">修改</el-button>
          <el-button :style="{ display: visibleSubmit }" :disabled="disabled" @click="cancel">取 消</el-button>
        </el-col>
      </el-row> -->
    </el-drawer>
    <!-- 新增基本信息 -->
    <el-drawer :before-close="handleClose" :wrapperClosable="wrapperClosable" :title="title" :visible.sync="addOpen"
      append-to-body :size="size">
      <el-form :rules='rules' ref="form" :model="addForm" label-width="140px">
        <el-row style="padding-right:20px;">
          <el-col :span="12">
            <el-form-item label="项目编号" prop="pid">
              <el-input :disabled="!isAddAndEdit" v-model="addForm.pid" placeholder="请输入项目编号" />
            </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="项目名称" prop="projectName">
              <el-input v-model="addForm.projectName" placeholder="请输入项目名称" />
            </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="项目所在地址" prop="address">
              <el-input v-model="addForm.address" placeholder="请输入项目所在地址" />
            </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="部门名称" prop="deptName">
              <treeselect v-model="addForm.deptId" :options="deptOptions" :normalizer="normalizer"
                placeholder="选择上级部门" />
            </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="基建费用(万)" prop="jjCost">
              <el-input onKeypress="return(/^[0-9]*$/.test(String.fromCharCode(event.keyCode)))" v-model="addForm.jjCost"
                placeholder="请输入基建费用" />
            </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="拆迁费用(万)" prop="cqCost">
              <el-input v-model="addForm.cqCost" placeholder="请输入拆迁费用" />
            </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="项目状态" prop="projectStatus">
              <el-select v-model="addForm.projectStatus" placeholder="请选择项目状态" clearable>
                <el-option v-for="dict in dict.type.proj_status" :key="dict.value" :label="dict.label"
                  :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划类别" prop="projectStatus">
              <el-select v-model="addForm.planType" placeholder="请选择计划类别">
                <el-option v-for="dict in dict.type.plan_type_zt" :key="dict.value" :label="dict.label"
                  :value="parseInt(dict.value)"></el-option>
              </el-select>
            </el-form-item></el-col>
            <el-col :span="12">
            <el-form-item label="是否集中开工" prop="isConcentrateStart">
              <el-select v-model="addForm.isConcentrateStart" placeholder="请选择是否集中开工">
                <el-option v-for="dict in dict.type.yes_no" :key="dict.value" :label="dict.label"
                  :value="parseInt(dict.value)"></el-option>
              </el-select>
            </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="是否开工" prop="isStart">
              <el-select v-model="addForm.isStart" placeholder="请选择是否开工">
                <el-option v-for="dict in dict.type.yes_no" :key="dict.value" :label="dict.label"
                  :value="parseInt(dict.value)"></el-option>
              </el-select>
            </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="计划开工日期" prop="sDate">
              <el-date-picker clearable v-model="addForm.sDate" type="date" value-format="yyyy-MM-dd"
                placeholder="请选择计划开工日期">
              </el-date-picker>
            </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="计划完工日期" prop="eDate">
              <el-date-picker clearable v-model="addForm.eDate" type="date" value-format="yyyy-MM-dd"
                placeholder="请选择计划完工日期">
              </el-date-picker>
            </el-form-item></el-col>
          <el-col :span="24">
            <el-form-item label="建设内容及其规模" prop="content">
              <el-input :autosize="{ minRows: 8, maxRows: 15 }" type="textarea" v-model="addForm.content"
                placeholder="请输入建设内容及其规模" />
            </el-form-item></el-col>
          <el-col :span="24">
            <el-form-item>
              <el-button v-if="this.isAddAndEdit" style="margin-left: 23vw;" type="primary"
                @click="addManage">前往项目明细填报</el-button>
              <el-button v-else style="margin-left: 23vw;" type="primary" @click="editManage">修改</el-button>
              <el-button @click="cancelManage">取 消</el-button>
            </el-form-item></el-col>
        </el-row>
      </el-form>
    </el-drawer>
    <!-- 修改按钮手续办理内部弹窗 -->
    <el-dialog :title="interiorTitle" :visible.sync="dialogFormVisible">
      <el-form :model="proceduresEditList" label-width="80px" :rules="quesRules" ref="proceduresEditForm">
        <el-form-item label="协调单位" prop="deptIds">
          <el-cascader ref="cascaderItem" v-model="proceduresEditList.deptIds" placeholder="请选择问题涉及部门" @change="depChangeS"
            :options="deptTree" :props="propsS" collapse-tags clearable>
          </el-cascader>
        </el-form-item>
        <el-form-item label="问题原因" prop="procedureId">
          <el-select v-model="proceduresEditList.procedureId" placeholder="请选择问题原因" ref="refOption">
            <el-option v-for="dict in dict.type.procedure_id" :key="dict.value" :label="dict.label"
              :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题描述" prop="unhandleReson">
          <el-input type="textarea" v-model="proceduresEditList.unhandleReson" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleCancel">取 消</el-button>
        <el-button v-if="isFiniteTableList" type="primary" @click="proceduresTableAdd">确定</el-button>
        <el-button v-else type="primary" @click="proceduresTableEdit">确定</el-button>
      </div>
    </el-dialog>
    <!-- 修改按钮在建进度内部弹窗 -->
    <el-dialog :title="interiorTitle" :visible.sync="dialogFormVisibleList">
      <el-form :model="ProcessEditList" label-width="80px" :rules="quesRules" ref="ProcessEditForm">
        <el-form-item label="协调单位" prop="deptIds">
          <!-- <el-cascader v-model="ProcessEditList.deptIdArr" :options="deptNamesOptions" :props="optionProps"
            clearable></el-cascader> -->
          <el-cascader ref="cascaderItem" v-model="ProcessEditList.deptIds" placeholder="请选择问题涉及部门" @change="depChange"
            :options="deptTree" :props="props" collapse-tags clearable>
          </el-cascader>
        </el-form-item>
        <el-form-item label="问题原因" prop="troubleId">
          <el-select v-model="ProcessEditList.troubleId" placeholder="请选择问题原因" ref="refOptionS">
            <el-option v-for="dict in dict.type.trouble_id" :key="dict.value" :label="dict.label"
              :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题描述" prop="content">
          <el-input type="textarea" v-model="ProcessEditList.content" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleCancel">取 消</el-button>
        <el-button v-if="isFiniteTableLists" type="primary" @click="processListTableAdd">确定</el-button>
        <el-button v-else type="primary" @click="processListTableEdit">确定</el-button>
      </div>
    </el-dialog>
    <!-- 导出选择表头弹框 -->
    <el-dialog title="导出表头设置" :visible.sync="headerOpen" width="700px" append-to-body>
      <tree-transfer :title="transferTitle" pid="fid" :from_data='fromData' :to_data='toData'
        :defaultProps="{ label: 'label' }" @add-btn='add' @remove-btn='remove' :mode='mode' height='540px' filter openAll>
      </tree-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="exportFun">导 出</el-button><!-- v-hasPermi="['/system:info:export']" -->
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
    <!-- 填写周报 -->
    <el-dialog :title="report.title" :visible.sync="report.open" width="50%" :size="size">
      <p style="font-size: 25px; font-weight: bold; ">{{ report.projectNameReportTitle }}</p>
      <!-- <el-form :model="reportProblem" label-width="100px">
        <el-row>
          <p>
            <strong>建设工程规划许可证办理情况</strong>
          </p>
          <el-col :span="24">
            <el-form-item label="是否办理" prop="propermitIsdeal ">
              <el-select v-model="reportProblem.propermitIsdeal" placeholder="" clearable>
                <el-option v-for="dict in dict.type.yes_or_no" :key="dict.value" :label="dict.label"
                  :value="parseInt(dict.value)" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="reportProblem.propermitIsdeal=='0'" label="未办理原因" label-width="100px" prop="propermitReasons">
              <el-input v-model="reportProblem.propermitReasons"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="reportProblem.propermitIsdeal=='0'" label="协调单位" prop="propermitCompanyId">
              <el-cascader ref="cascaderItem" v-model="reportProblem.propermitCompanyId" placeholder="请选择问题涉及部门"
                @change="depChange($event, true)" :options="deptTree" :props="props" collapse-tags clearable
                style="width: 400px;">
              </el-cascader>
            </el-form-item>
          </el-col>
          <p>
            <strong>项目初步设计办理情况</strong>
          </p>
          <el-col :span="24">
            <el-form-item label="是否办理" prop="predesignIsdeal">
              <el-select v-model="reportProblem.predesignIsdeal" placeholder="请选择施工许可证" clearable>
                <el-option v-for="dict in dict.type.yes_or_no" :key="dict.value" :label="dict.label"
                  :value="parseInt(dict.value)" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="reportProblem.predesignIsdeal=='0'" label="未办理原因" label-width="100px" prop="predesignReasons">
              <el-input v-model="reportProblem.predesignReasons"></el-input>
            </el-form-item>
          </el-col>
          <p>
            <strong>建设用地规划许可证办理情况</strong>
          </p>
          <el-col :span="24">
            <el-form-item label="是否办理" prop="sitepermitIsdeal">
              <el-select v-model="reportProblem.sitepermitIsdeal" placeholder="请选择施工许可证" clearable>
                <el-option v-for="dict in dict.type.yes_or_no" :key="dict.value" :label="dict.label"
                  :value="parseInt(dict.value)" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="reportProblem.sitepermitIsdeal=='0'" label="未办理原因" label-width="100px" prop="sitepermitReasons">
              <el-input v-model="reportProblem.sitepermitReasons"></el-input>
            </el-form-item>
          </el-col>
          <p>
            <strong>项目可行性研究报告批复办理情况</strong>
          </p>
          <el-col :span="24">
            <el-form-item label="是否办理" prop="feasibilityIsdeal">
              <el-select v-model="reportProblem.feasibilityIsdeal" placeholder="请选择施工许可证" clearable>
                <el-option v-for="dict in dict.type.yes_or_no" :key="dict.value" :label="dict.label"
                  :value="parseInt(dict.value)" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="reportProblem.feasibilityIsdeal=='0'" label="未办理原因" label-width="100px" prop="feasibilityReasons">
              <el-input v-model="reportProblem.feasibilityReasons"></el-input>
            </el-form-item>
          </el-col>
          <p>
            <strong>选址意见书及用地预审办理情况</strong>
          </p>
          <el-col :span="24">
            <el-form-item label="是否办理" prop="siteauditIsdeal">
              <el-select v-model="reportProblem.siteauditIsdeal" placeholder="请选择施工许可证" clearable>
                <el-option v-for="dict in dict.type.yes_or_no" :key="dict.value" :label="dict.label"
                  :value="parseInt(dict.value)" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="reportProblem.siteauditIsdeal=='0'" label="未办理原因" label-width="100px" prop="siteauditReasons">
              <el-input v-model="reportProblem.siteauditReasons"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form> -->
      <el-form v-model="weeklyDetails" label-width="100px">
        <el-row>
          <p>
            <strong>前期手续问题</strong>
          </p>
          <el-col :span="24">
            <el-form-item label="前期手续类型" prop="procedureId">
              <el-select v-model="weeklyDetails.procedureId" placeholder="请选择手续类型" clearable>
                <el-option v-for="dict in dict.type.procedure_id" :key="dict.value" :label="dict.label"
                  :value="parseInt(dict.value)" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="未办理原因" label-width="100px" prop="unhandleReson">
              <el-input v-model="weeklyDetails.unhandleReson"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="协调单位" prop="deptIds">
              <el-cascader ref="cascaderItem" v-model="weeklyDetails.deptIds" placeholder="请选择问题涉及部门"
                @change="depChangeOne($event, true)" :options="deptTreeOne" :props="propsOne" collapse-tags clearable
                style="width: 400px;">
              </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form v-model="weeklyTrobleDetails" label-width="100px">
        <el-row>
          <p>
            <strong>现场要素问题</strong>
          </p>
          <el-col :span="24">
            <el-form-item label="问题类型" prop="troubleId">
              <el-select v-model="weeklyTrobleDetails.troubleId" placeholder="请选择问题类型" clearable>
                <el-option v-for="dict in dict.type.trouble_id" :key="dict.value" :label="dict.label"
                  :value="parseInt(dict.value)" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="问题描述" label-width="100px" prop="content">
              <el-input v-model="weeklyTrobleDetails.content"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="协调单位" prop="deptIds">
              <el-cascader ref="cascaderItem" v-model="weeklyTrobleDetails.deptIds" placeholder="请选择问题涉及部门"
                @change="depChangeThree($event, true)" :options="deptTree" :props="props" collapse-tags clearable
                style="width: 400px;">
              </el-cascader>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <el-form v-model="weeklyDetailsList" label-width="100px">
        <el-row>
          <p>
            <strong>项目单位问题</strong>
          </p>
          <el-col :span="24">
            <el-form-item label="问题描述" label-width="100px" prop="content">
              <el-input v-model="weeklyDetailsList.content"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24">
            <el-form-item label="项目单位自身问题" label-width="130px" prop="troubleName">
              <el-input v-model="weeklyDetailsList.troubleName"></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="24">
            <el-form-item label="协调单位" prop="deptIds">
              <el-cascader ref="cascaderItem" v-model="weeklyDetailsList.deptIds" placeholder="请选择问题涉及部门"
                @change="depChangeTwo($event, true)" :options="deptTreeTwo" :props="propsTwo" collapse-tags clearable
                style="width: 400px;">
              </el-cascader>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isEditReportCancel">取 消</el-button>
        <el-button type="primary" @click="isEditReport">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 管家研判 -->
    <el-dialog :title="butlerReview.title" :visible.sync="butlerReview.open" width="780px" append-to-body>
      <el-form label-width="108px" :inline="true">
          <el-col :span="24">
            <el-form-item label="延期开工" label-width="94px">
              <el-radio-group v-model="butlerReviewDetails.isDelayStart">
                <el-radio :disabled="disabled" :label="1">是</el-radio>
                <el-radio :disabled="disabled" :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="延期完工" label-width="94px">
              <el-radio-group v-model="butlerReviewDetails.isDelayOver">
                <el-radio :disabled="disabled" :label="1">是</el-radio>
                <el-radio :disabled="disabled" :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="集中开工" label-width="94px">
              <el-radio-group v-model="butlerReviewDetails.isConcentrateStart">
                <el-radio :disabled="disabled" :label="1">是</el-radio>
                <el-radio :disabled="disabled" :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        <el-col :span="24">
          <el-form-item label="进展异常" label-width="94px">
            <el-radio-group v-model="butlerReviewDetails.isSlow">
              <el-radio :disabled="disabled" :label="1">是</el-radio>
              <el-radio :disabled="disabled" :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <!-- <p>
            <strong>项目单位问题</strong>
          </p> -->
          <el-form :rules="weeklyDetailsListRules" ref='weeklyDetailsList' :model="weeklyDetailsList">
            <el-form-item label="项目单位问题">
              <el-radio-group v-model="isUnitIssues">
                <el-radio :disabled="disabled" :label="1">是</el-radio>
                <el-radio :disabled="disabled" :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-col :span="24">
              <el-form-item label="问题描述" prop="content" v-if="isUnitIssues==1">
                <el-input v-model="weeklyDetailsList.content" type="textarea" style="width:400px"></el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="24">
              <el-form-item label="责任单位" prop="deptIds">
                <el-cascader ref="cascaderItem" v-model="weeklyDetailsList.deptIds" placeholder="请选择问题涉及部门"
                  @change="depChangeTwo($event, true)" :options="deptTreeTwo" :props="propsTwo" collapse-tags clearable style="width:400px">
                </el-cascader>
              </el-form-item>
            </el-col> -->
          </el-form>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addButlerReview()">确 定</el-button>
        <el-button @click="cancelButlerReview()">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  system,
  addSystem,
  queryLogByPid,
  importData,
  ishandle,
  addProcessTable,
  importTemplate,
  deptTree,
  allcolumnsExport,
  editProcessTable,
  deleteProcessTable,
  addCapitalManage,
  editCapitalManage,
  deleteProcessListTable,
  addProcessListTable,
  editProcessListTable,
  capital,
  status,
  procedures,
  processListAdd,
  addCapital,
  addStatus,
  addProcedures,
  addProcessList,
  getWeeklyList,
  addWeekly,
  getWeeklyDetails,
  editWeekly,
  openWeekly,
  proceduresListWeekly, addProceduresTrouble, addProceduresTroubleList, addTrouble, files, weekly, weeklyzt, queryProcessTroubleByPid
} from '@/api/manage/index'
import { getToken } from "@/utils/auth";
import axios from "axios";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import treeTransfer from 'el-tree-transfer'
import moment from 'moment';
export default {
  name: "index",
  dicts: ['y_or_n', 'trouble_id', 'procedure_id', 'delay_id', 'up_capital', 'proj_status', 'yes_or_no', 'plan_type_zt','yes_no'],
  components: { Treeselect, treeTransfer },
  data() {
    // 校验财政资金输入内容
    var checkNum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入费用金额'));
      }
      setTimeout(() => {
        if (!Number(value)) {
          callback(new Error('请输入数字值'));
        } else {
          callback();
        }
      }, 500);
    };
    // 校验财政资金输入内容
    var checkNumS = (rule, value, callback) => {
      if (!Number(value)) {
        callback(new Error('请输入数字值'));
      } else {
        callback();
      }
    };
    return {
      time: '',
      optionProps: {
        value: 'deptId',
        label: 'deptName',
        children: 'children',
        multiple: true
      },
      activeNames: [],
      visibleSubmit: '',
      size: '50%',
      apiUrl: process.env.VUE_APP_BASE_API + '/common/upload',//图片上传
      beasUrl: process.env.VUE_APP_BASE_URl,
      imageUrl: '',
      // 新增修改弹窗遮罩层
      wrapperClosable: false,
      dialogVisibleExport: false, //导出文件弹窗
      // 留痕记录弹窗遮罩层
      dialogLog: false,
      projGovBaseInfoData: [],
      projGovCompletStatusData: [],
      projGovProceduresData: [],
      projGovCapitalData: [],
      projGovProcessData: [],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      prodApi: '/prod-api',
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      deptTree: [], //树形结构列表
      deptTreeOne: [], //树形结构列表
      deptTreeTwo: [], //树形结构列表
      props: { multiple: true, value: 'id', emitPath: false },
      propsOne: { multiple: true, value: 'id', emitPath: false },
      propsTwo: { multiple: true, value: 'id', emitPath: false },
      propsS: { multiple: true, value: 'id', emitPath: false },
      deptVal: [],
      deptValS: [],
      // 总条数
      total: 0,
      weeklytotal: 0,
      disabled: false,
      ishandleNum: 0,//判断按钮是否可用
      projGovBaseInfo: [],// 项目情况表格数据
      projectNameTitle: '',//修改按钮项目名称
      isAddAndEdit: false,  //修改新增辨别
      isProceduresEdit: false, //手续办理和在建项目表格修改标识
      isFiniteTableList: false, //手续表格新增修改确定按钮标识
      isFiniteTableLists: false, //在建表格新增修改确定按钮标识
      // 弹出层标题
      title: "",
      interiorTitle: '',
      addTitle: '',
      // 是否显示弹出层
      logOpen: false,
      open: false,
      addOpen: false,
      isDefine: false,
      isPid: 0,
      deptOptions: [],// 部门树选项
      deptOptionsManage: [],// 查询部门树选项
      dialogFormVisible: false,//手续办理情况修改弹窗
      dialogFormVisibleList: false,//在建进度情况修改弹窗
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        pId: '',
        projectName: '',
        deptName: '',
        projectStatus: null,
        sCost:'',
        eCost:'',
        isConcentrateStart:'',
        isStart:'',
        planType:'',
        startSDate:'',
        endSDate:'',
        startEDate:'',
        endEDate:''
      },
      weekly: {
        pageNum: 1,
        pageSize: 4,
        pId: ''
      },
      headers: {
        Authorization: "Bearer " + getToken()
      },
      // 项目详细信息表单参数
      form: {
        ProjGovCompletStatus: {},
        ProjGovProcedures: {
          isLicence:0
        },
        ProjGovCapital: {},
        ProjGovProcess: {
          fileList: [],
          percentFinish: 0,
          percentAll: 0,
          actualProcess: 0,
        }
      },
      // 项目留痕详细信息数据
      logForm: {
        ProjGovCompletStatus: {},
        ProjGovProcedures: {},
        ProjGovCapital: {},
        ProjGovProcess: {
          fileList: [],
          percentFinish: 0,
          percentAll: 0,
          actualProcess: 0,
        }
      },
      proceduresEditList: { pId: '' }, //手续办理情况修改弹窗数据
      ProcessEditList: {}, //在建进度情况修改弹窗数据
      proceduresList: [],// 前期手续办理情况表格
      processList: [],// 在建项目进度表格
      weeklyList: [],// 生命周期表格
      addForm: {},//新增
      // 表单校验
      rules: {
        pId: [
          { required: true, message: "请输入项目编号", trigger: "blur" }
        ],
        projectName: [
          { required: true, message: "请输入项目名称", trigger: "blur" }
        ],
        /*    address: [
             { required: true, message: "请输入项目所在地", trigger: "blur" }
           ], */
        /*  deptName: [
           { required: true, message: "请输入部门名称", trigger: "blur" }
         ], */
        // jjCost: [
        //   { validator: checkNum, trigger: 'blur' }
        // ],
        // cqCost: [
        //   { validator: checkNum, trigger: 'blur' }
        // ],
        sDate: [
          { required: true, message: "请输入开工日期", trigger: "blur" }
        ],
        eDate: [
          { required: true, message: "请输入完工日期", trigger: "blur" }
        ],
        content: [
          { required: true, message: "请输入建设规模", trigger: "blur" }
        ],
        // declareAmount: [
        //   { validator: checkNumS, trigger: 'blur' }
        // ],
        // upAmount: [
        //   { validator: checkNumS, trigger: 'blur' }
        // ],
        // upPay: [
        //   { validator: checkNumS, trigger: 'blur' }
        // ],
        // areaPay: [
        //   { validator: checkNumS, trigger: 'blur' }
        // ],
        isIn:[
          { required: true, message: "请选择", trigger: "change" }
        ]
      },
      token: "",
      dialogVisible: false,
      // 导出相关
      headerOpen: false,
      transferTitle: ["待选", "已选"],
      mode: "transfer",
      fromData: [],
      toData: [],
      columns: [],
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
        url: process.env.VUE_APP_BASE_API + "/system/info/importData"
      },
      // 周报相关
      report: {
        title: '',
        open: false,
        projectNameReportTitle: ''
      },
      // 周报内部表单
      // reportProblem: {
      //   pId: null
      // },
      weeklyDetails: {
        pId: null,
      },
      weeklyTrobleDetails: {
        pId: null,
        toubleType: 0
      },
      weeklyDetailsList: {
        toubleType: 1,
        troubleId: 6,
        content:'',
        deptIds:''
      },
      isViewReport: false,
      openWeekly: true,
      // 管家研判相关
      butlerReview: {
        title: '',
        open: false,
      },
      butlerReviewDetails: {},
      action: process.env.VUE_APP_BASE_API + "/common/upload?projType=2", // 上传的图片服务器地址
      prophaseRules:{
        siteauditIsdeal: [
          { required: true, message: "请选择", trigger: "change" }
        ],
        // siteauditCompanyIds: [
        //   { required: true, message: "请选择", trigger: "change" }
        // ],
        siteauditReasons: [
          { required: true, message: "请输入", trigger: "blur" }
        ],
        feasibilityIsdeal: [
          { required: true, message: "请选择", trigger: "change" }
        ],
        // feasibilityCompanyIds: [
        //   { required: true, message: "请选择", trigger: "change" }
        // ],
        feasibilityReasons: [
          { required: true, message: "请输入", trigger: "blur" }
        ],
        sitepermitIsdeal: [
          { required: true, message: "请选择", trigger: "change" }
        ],
        // sitepermitCompanyIds: [
        //   { required: true, message: "请选择", trigger: "change" }
        // ],
        sitepermitReasons: [
          { required: true, message: "请选择", trigger: "change" }
        ],
        predesignIsdeal: [
          { required: true, message: "请选择", trigger: "change" }
        ],
        // predesignCompanyIds: [
        //   { required: true, message: "请选择", trigger: "change" }
        // ],
        predesignReasons: [
          { required: true, message: "请选择", trigger: "change" }
        ],
        propermitIsdeal: [
          { required: true, message: "请选择", trigger: "change" }
        ],
        // propermitCompanyIds: [
        //   { required: true, message: "请选择", trigger: "change" }
        // ],
        propermitReasons: [
          { required: true, message: "请选择", trigger: "change" }
        ],
        address:[
          { required: true, message: "请输入项目地址", trigger: "blur" }
        ],
        isBid: [
          { required: true, message: "请选择", trigger: "change" }
        ],
        bidDates: [
          { required: false, message: "请选择", trigger: "change" }
        ],
        isLicence: [
          { required: true, message: "请选择", trigger: "change" }
        ],
        licenceDate: [
          { required: false, message: "请选择", trigger: "change" }
        ],
      },
      advanceRules:{
        actualStartDate:[
          { required: false, message: "请选择", trigger: "change" }
        ],
        buildCompany:[
          { required: false, message: "请输入", trigger: "blur" }
        ],
        actualProcess:[
          { required: false, message: "请输入", trigger: "blur" }
        ],
        percentFinish:[
          { required: false, message: "请选择", trigger: "change" }
        ],
        ecompleteTime:[
          { required: false, message: "请选择", trigger: "change" }
        ],
        picPath:[
          { required: false, message: "请选择", trigger: "change" }
        ],
      },
      completRules:{
        isOver:[
          { required: false, message: "请选择", trigger: "change" }
        ],
        actualDate:[
          { required: false, message: "请选择", trigger: "change" }
        ],
        isAcceptance:[
          { required: false, message: "请选择", trigger: "change" }
        ],
        isFinalCost:[
          { required: false, message: "请选择", trigger: "change" }
        ],
        isDeliver:[
          { required: false, message: "请选择", trigger: "change" }
        ],
        undeliverReson:[
          { required: false, message: "请输入", trigger: "blur" }
        ],
      },
      weeklyAuthority: true,
      isExist:'',
      isExistProcess:'',
      quesRules:{
        deptIds:[
          { required: true, message: "请选择", trigger: "change" }
        ],
        procedureId:[
          { required: true, message: "请选择", trigger: "change" }
        ],
        unhandleReson:[
          { required: true, message: "请输入", trigger: "blur" }
        ],
        // deptVal:[
        //   { required: true, message: "请选择", trigger: "change" }
        // ],
        troubleId:[
          { required: true, message: "请选择", trigger: "change" }
        ],
        content:[
          { required: true, message: "请输入", trigger: "blur" }
        ]
      },
      isUnitIssues:0,
      weeklyDetailsListRules:{
        content:[
          { required: true, message: "请输入", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    // 项目列表
    this.getList();
    this.getDeptTree()
    this.getDeptTreeList()
    this.ishandle();
    this.getWeeklyAuthority();
    let useInfo = JSON.parse(sessionStorage.getItem('useInfo'));
  },
  filters: {
    formatTime(value) {
      if (!value) return ''
      const formats = [
        'YYYY年',
        'YYYY年M月D日',
        'YYYY年MM月DD日',
        'YYYY-M-D',
        'YYYY-MM-DD',
        'YYYY.M.D',
        'YYYY.MM.DD',
      ];

      const date = moment(value, formats, true);

      if (date.isValid()) {
        // console.log(date.format('YYYY-MM-DD'))
        // console.log(date.format('YYYY-MM-DD'))
        // console.log(date.format('YYYY-MM-DD'))
        // console.log(date.format('YYYY-MM-DD'))
      } else {

      }

      if (value.length > 4) {
        value = value.slice(0, 4) + '-' + value.slice(4, 6) + '-' + value.slice(6, 8)
      }
      if (value.length > 10) {
        value = value.slice(0, 10) + ' ' + value.slice(10, 12) + ':' + value.slice(12, 14)
      }

      return value
    }
  },
  modules() {
    this.token = getToken();
  },
  methods: {
    // 判断按钮是否可用接口
    ishandle() {
      ishandle().then(res => {
        this.ishandleNum = res.msg
      })
    },
    // 查询项目列表
    handleQueryManage() {
      this.getList(true)
    },
    // 重置按钮
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQueryManage()
    },
    // 手续,在建取消按钮
    dialogFormVisibleCancel() {
      this.proceduresEditList = {}
      this.dialogFormVisible = false
      this.ProcessEditList = {}
      this.dialogFormVisibleList = false
    },
    // 获取机构列表
    getDeptTree() {
      deptTree().then(response => {
        this.deptTree = response.data;
        // 去除第一级
        this.deptTree = this.deptTree[0].children;
        this.deptTreeOne = this.deptTree[0].children;
        this.deptTreeTwo = this.deptTree[0].children;
      });
    },
    // 获取当前选中的机构
    depChange(vals) {
      let names = [];
      vals.forEach(element => {
        names.push(this.getObjByTree(this.deptTree, element).label)
      });
      this.ProcessEditList.deptIds = vals.join();
      this.ProcessEditList.deptNames = names.join();
    },
    // 获取当前选中的机构
    depChangeOne(vals) {
      let names = [];
      vals.forEach(element => {
        names.push(this.getObjByTree(this.deptTree, element).label)
      });
      this.weeklyDetails.deptIds = vals.join();
      this.weeklyDetails.deptNames = names.join();
    },
    // 获取当前选中的机构
    depChangeTwo(vals) {
      let names = [];
      vals.forEach(element => {
        names.push(this.getObjByTree(this.deptTree, element).label)
      });
      this.weeklyDetailsList.deptIds = vals.join();
      this.weeklyDetailsList.deptNames = names.join();
    },
    // 获取当前选中的机构
    depChangeThree(vals) {
      let names = [];
      vals.forEach(element => {
        names.push(this.getObjByTree(this.deptTree, element).label)
      });
      this.weeklyTrobleDetails.deptIds = vals.join();
      this.weeklyTrobleDetails.deptNames = names.join();
    },
    // 获取当前选中的机构
    depChangeS(vals) {
      let names = [];
      vals.forEach(element => {
        names.push(this.getObjByTree(this.deptTree, element).label)
      });
      this.proceduresEditList.deptIds = vals.join();
      this.proceduresEditList.deptNames = names.join();
    },
    depChangeSiteaudit(vals){
        let names = [];
        vals.forEach(element => {
          names.push(this.getObjByTree(this.deptTree, element).label)
        });
        this.form.ProjGovProcedures.siteauditCompanyIds = vals.join();
        this.form.ProjGovProcedures.siteauditCompany = vals.join();
    },
    depChangeFeasibility(vals){
        let names = [];
        vals.forEach(element => {
          names.push(this.getObjByTree(this.deptTree, element).label)
        });
        this.form.ProjGovProcedures.feasibilityCompanyIds = vals.join();
        this.form.ProjGovProcedures.feasibilityCompany = vals.join();
    },
    depChangeSitepermit(vals){
        let names = [];
        vals.forEach(element => {
          names.push(this.getObjByTree(this.deptTree, element).label)
        });
        this.form.ProjGovProcedures.sitepermitCompanyIds = vals.join();
        this.form.ProjGovProcedures.sitepermitCompany = vals.join();
    },
    depChangePredesign(vals){
        let names = [];
        vals.forEach(element => {
          names.push(this.getObjByTree(this.deptTree, element).label)
        });
        this.form.ProjGovProcedures.predesignCompanyIds = vals.join();
        this.form.ProjGovProcedures.predesignCompany = vals.join();
    },
    depChangePropermit(vals){
        let names = [];
        vals.forEach(element => {
          names.push(this.getObjByTree(this.deptTree, element).label)
        });
        this.form.ProjGovProcedures.propermitCompanyIds = vals.join();
        this.form.ProjGovProcedures.propermitCompany = vals.join();
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
    // 手续办理情况新增
    proceduresAdd() {
      this.dialogFormVisible = true
      this.interiorTitle = '新增'
      this.isProceduresEdit = true
      this.isFiniteTableList = true
      this.proceduresEditList = {}
      this.deptValS = []
      this.getDeptTree()
    },
    // 手续办理情况删除
    proceduresDelete(row) {
      this.proceduresEditList.pId = row.pId
      this.proceduresEditList.id = row.id
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProcessTable(this.proceduresEditList.pId, this.proceduresEditList.id).then(res => {
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        this.weekly.pId = this.proceduresEditList.pId;
        addSystem(this.weekly).then(res => {
          this.proceduresList = res.data.procedures.list;
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 手续办理情况修改
    proceduresEdit(row) {
      this.proceduresEditList = row
      this.dialogFormVisible = true
      this.interiorTitle = '修改'
      this.isProceduresEdit = true
      this.isFiniteTableList = false
      this.proceduresEditList.deptIds = row.deptIds ? [parseInt(row.deptIds)] : []
      this.getDeptTree()
    },
    // 手续办理确定按钮
    proceduresTableAdd() {
      this.$refs['proceduresEditForm'].validate((valid)=>{
        if(valid){
          this.proceduresEditList.pId = this.queryParams.pId
          if(Array.isArray(this.proceduresEditList.deptIds)){
            this.proceduresEditList.deptIds = this.proceduresEditList.deptIds.join();
          }
          this.proceduresEditList.procedureName = this.$refs.refOption.selected.label
          addProcessTable(this.proceduresEditList).then(res => {
            this.$message({
              message: '问题新增成功',
              type: 'success'
            });
            this.dialogFormVisible = false
            this.weekly.pId = this.proceduresEditList.pId
            addSystem(this.weekly).then(res => {
              this.proceduresList = res.data.procedures.list
            })
          })
        }
      })

    },
    // 手续办理修改按钮
    proceduresTableEdit() {
      this.$refs['proceduresEditForm'].validate((valid)=>{
        if(valid){
          if(Array.isArray(this.proceduresEditList.deptIds)){
            this.proceduresEditList.deptIds = this.proceduresEditList.deptIds.join();
          }
          this.proceduresEditList.procedureName = this.$refs.refOption.selected.label
          editProcessTable(this.proceduresEditList).then(res => {
            this.$message({
              message: '问题修改成功',
              type: 'success'
            });
            this.dialogFormVisible = false
          })
        }
      })

    },
    // 在建进度新增
    processAdd() {
      this.dialogFormVisibleList = true
      this.interiorTitle = '新增'
      this.isProceduresEdit = false
      this.isFiniteTableLists = true
      this.getDeptTree()
      this.ProcessEditList = {}
      this.deptVal = []
    },
    // 在建进度删除
    processDelete(row) {
      this.ProcessEditList.pId = row.pId
      this.ProcessEditList.id = row.id
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProcessListTable(this.ProcessEditList.id, this.ProcessEditList.pId).then(res => {
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        this.weekly.pId = this.ProcessEditList.pId
        addSystem(this.weekly).then(res => {
          this.processList = res.data.process.list
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 在建进度修改
    processEdit(row) {
      this.ProcessEditList = row
      this.dialogFormVisibleList = true
      this.interiorTitle = '修改'
      this.isFiniteTableLists = false
      this.ProcessEditList.deptIds = row.deptIds ? [parseInt(row.deptIds)] : []
      this.getDeptTree()
    },
    // 在建进度确定按钮
    processListTableAdd() {
      this.$refs['ProcessEditForm'].validate(valid=>{
        if(valid){
          this.ProcessEditList.pId = this.queryParams.pId
          if(Array.isArray(this.ProcessEditList.deptIds)){
            this.ProcessEditList.deptIds = this.ProcessEditList.deptIds.join();
          }
          this.ProcessEditList.troubleName = this.$refs.refOptionS.selected.label
          addProcessListTable(this.ProcessEditList).then(res => {
            console.log(this.ProcessEditList);
            this.$message({
              message: '问题新增成功',
              type: 'success'
            });
            this.dialogFormVisibleList = false
            this.weekly.pId = this.ProcessEditList.pId
            addSystem(this.weekly).then(res => {
              this.processList = res.data.process.list
            })
          })
        }
      })

    },
    // 在建进度修改按钮
    processListTableEdit() {
      this.$refs['ProcessEditForm'].validate(valid=>{
        if(valid){
          if(Array.isArray(this.ProcessEditList.deptIds)){
            this.ProcessEditList.deptIds = this.ProcessEditList.deptIds.join();
          }
          this.ProcessEditList.troubleName = this.$refs.refOptionS.selected.label
          editProcessListTable(this.ProcessEditList).then(res => {
            this.$message({
              message: '问题修改成功',
              type: 'success'
            });
            this.dialogFormVisibleList = false
          })
        }
      })
    },
    // 折叠面板事件
    handleChange(val) {
      // console.log(val);
    },
    // 新增修改弹窗右上角x事件
    handleClose(dona) {
      this.open = false;
      this.report.open = false;
      this.dialogVisibleExport = false
      this.addOpen = false;
      this.reset()
      this.addForm = {}
      this.resetForm("form");
    },
    /** 请求项目基本信息列表 */
    getList(isSearch) {
      this.loading = true;
      console.log(this.queryParams);
      if(isSearch){
        this.queryParams.pId = null
        if(this.queryParams.deptId){
          this.queryParams.deptName = this.getObjByTree(this.deptOptionsManage, this.queryParams.deptId).label;
        }
      }
      system(this.queryParams).then(response => {
        this.loading = false;
        this.projGovBaseInfo = response.rows
        this.total = response.total
      });
    },
    // 获取周报list
    getWeeklyList() {
      //this.loading = true;
      getWeeklyList(this.weekly).then(response => {
        //this.loading = false;
        this.weeklyList = response.rows
        this.weeklytotal = response.total
      });
    },
    // 获取部门数列表
    getDeptTreeList() {
      deptTree().then(response => {
        this.deptOptions = response.data[0].children
        this.deptOptionsManage = response.data[0].children
        // console.log(this.deptOptions);
        // this.deptOptionsManage=this.deptOptionsManage[0]
      });
    },
    /** 新增项目基本信息按钮操作 */
    handleAdd() {
      this.wrapperClosable = false;
      this.isAddAndEdit = true;
      this.addOpen = true;
      this.title = "添加项目信息";
      deptTree().then(response => {
        this.deptOptions = response.data[0].children
      });
    },
    // 修改项目基本信息按钮
    isEditOpen(row) {
      this.wrapperClosable = false;
      this.isAddAndEdit = false;
      this.addOpen = true;
      this.title = "修改项目信息";
      this.addForm = row
      // this.addForm.deptName = row.deptName
      console.log(row);
      // this.addForm.deptName = this.getObjByTree(this.deptOptionsManage, this.queryParams.deptId).label;
      // deptTree().then(response => {
      //   this.deptOptions = this.handleTree(response.data, "deptId");
      //   if (this.deptOptions.length == 0) {
      //       const noResultsOptions = { deptId: this.form.parentId, deptName: this.form.parentName, children: [] };
      //       this.deptOptions.push(noResultsOptions);
      //     }
      // });
    },
    // 修改项目详细信息按钮
    isEdit(row) {
      this.row = row
      this.wrapperClosable = false;
      // console.log(row);
      this.open = true;
      this.disabled = false
      this.projectNameTitle = row.projectName
      this.queryParams.pId = row.pid;
      this.weekly.pId = row.pid;
      addSystem(this.weekly).then(res => {
        this.form.ProjGovCompletStatus = res.data.completstatus
        if(this.form.ProjGovCompletStatus.isOver==1){
          this.completRules.actualDate[0].required = true
          this.completRules.isAcceptance[0].required = true
          this.completRules.isDeliver[0].required = true
          this.completRules.isFinalCost[0].required = true
        }else{
          this.completRules.actualDate[0].required = false
          this.completRules.isAcceptance[0].required = false
          this.completRules.isDeliver[0].required = false
          this.completRules.isFinalCost[0].required = false
          this.$refs['formC'].clearValidate()
        }
        this.form.ProjGovProcedures = res.data.procedures
        if(this.form.ProjGovProcedures.isBid==1){
          this.prophaseRules.bidDates[0].required = true
        }else{
          this.prophaseRules.bidDates[0].required = false
          this.$refs['formP'].clearValidate('bidDates')
        }
        if(this.form.ProjGovProcedures.isLicence==1){
          this.prophaseRules.licenceDate[0].required = true
        }else{
          this.prophaseRules.licenceDate[0].required = false
          this.$refs['formP'].clearValidate('licenceDate')
        }
        this.form.ProjGovCapital = res.data.capital
        this.form.ProjGovProcess = res.data.process
        if(this.form.ProjGovProcess.actualStartDate != null){
          this.advanceRules.buildCompany[0].required = true
          this.advanceRules.actualProcess[0].required = true
          this.advanceRules.percentFinish[0].required = true
          this.advanceRules.ecompleteTime[0].required = true
          this.advanceRules.picPath[0].required = true
        }else{
          this.advanceRules.buildCompany[0].required = false
          this.advanceRules.actualProcess[0].required = false
          this.advanceRules.percentFinish[0].required = false
          this.advanceRules.ecompleteTime[0].required = false
          this.advanceRules.picPath[0].required = false
          this.$refs['formA'].clearValidate()
        }
        this.proceduresList = res.data.procedures.list
        if(this.proceduresList.length>0){
          this.isExist = 1
        }else{
          this.isExist = 0
        }
        this.processList = res.data.process.list
        if(this.processList.length>0){
          this.isExistProcess = 1
        }else{
          this.isExistProcess = 0
        }
        // this.weeklyList = res.data.weeklydata.rows
        // this.weeklytotal = res.data.weeklydata.total
      })
      this.title = "修改项目信息";
      this.isDefine = false
      this.visibleSubmit = ''
    },
    // 修改详细信息表单确定按钮
    isEditManage() {
      const arrForm = ['formP','formA','formC','formR','formS']
      Promise.all(arrForm.map(item => this.checkForm(item))).then(() => {
          console.log('验证成功')
          if(this.isExist == 1 && this.proceduresList.length == 0){
            return
          }
          if(this.isExistProcess == 1 && this.processList.length == 0){
            return
          }
          if (this.form.ProjGovProcess.picPath!="undefined" && this.form.ProjGovProcess.picPath!=null && this.form.ProjGovProcess.picPath!="" && typeof(this.form.ProjGovProcess.picPath)=='string') {
            this.form.ProjGovProcess.picPath = this.form.ProjGovProcess.picPath.split(",");
          }else{
            this.form.ProjGovProcess.picPath = null
          }
          const APIs = [capital(this.form.ProjGovCapital), status(this.form.ProjGovCompletStatus), procedures(this.form.ProjGovProcedures), processListAdd(this.form.ProjGovProcess)]; // 放多个要请求的promise接口
          axios.all(APIs).then( // 执行并发
            axios.spread((data1, data2, data3, data4) => {
              this.$message({
                message: '项目信息修改成功',
                type: 'success'
              });
              this.open = false
              this.reset()
              this.queryParams.pId = null
              console.log(this.form);
            })
          );
      }).catch((e) => {
          console.log('失败', e)
          this.$message({
            message: '请将项目信息按照要求填写完整',
            type: 'error'
          });
      })
    },
    //修改项目详情-前期手续办理情况保存修改
    isEditManageProjGovProcedures() {
      const arrForm = ['formP']
      Promise.all(arrForm.map(item => this.checkForm(item))).then(()=>{
        if(this.isExist == 1 && this.proceduresList.length == 0){
          this.$message({
            message: '请将前期手续办理情况按照要求填写完整',
            type: 'error'
          });
          return
        }
        procedures(this.form.ProjGovProcedures).then(res=>{
            this.$message({
              message: '前期手续办理情况修改成功',
              type: 'success'
            });
            this.activeNames = ''
            this.isEdit(this.row)
        })
      }).catch((e)=>{
          this.$message({
            message: '请将前期手续办理情况按照要求填写完整',
            type: 'error'
          });
      })
    },
    //修改项目详情-前期手续办理情况保存新增
    isAddManageProjGovProcedures() {
      const arrForm = ['formP']
      Promise.all(arrForm.map(item => this.checkForm(item))).then(()=>{
        if(this.isExist == 1 && this.proceduresList.length == 0){
          this.$message({
            message: '请新增前期手续存在问题',
            type: 'error'
          });
          return
        }
        addProcedures(this.form.ProjGovProcedures).then(res=>{
            this.$message({
              message: '前期手续办理情况新增成功',
              type: 'success'
            });
            this.activeNames = ''
            this.isEdit(this.row)
        })
      }).catch((e)=>{
          this.$message({
            message: '请将前期手续办理情况按照要求填写完整',
            type: 'error'
          });
      })
    },
    //修改项目详情-现场推进情况保存修改
    isEditManageProjGovProcess() {
      const arrForm = ['formA']
      Promise.all(arrForm.map(item => this.checkForm(item))).then(()=>{
        if (this.form.ProjGovProcess.picPath!="undefined" && this.form.ProjGovProcess.picPath!=null && this.form.ProjGovProcess.picPath!="" && typeof(this.form.ProjGovProcess.picPath)=='string') {
          this.form.ProjGovProcess.picPath = this.form.ProjGovProcess.picPath.split(",");
        }else{
          this.form.ProjGovProcess.picPath = null
        }
        if(this.isExistProcess == 1 && this.processList.length == 0){
          this.$message({
            message: '请将现场推进情况按照要求填写完整',
            type: 'error'
          });
          return
        }
        processListAdd(this.form.ProjGovProcess).then(res=>{
          this.$message({
            message: '现场推进情况修改成功',
            type: 'success'
          });
          this.activeNames = ''
          this.isEdit(this.row)
        })
      }).catch((e)=>{
          this.$message({
            message: '请将现场推进情况按照要求填写完整',
            type: 'error'
          });
      })
    },
    //修改项目详情-现场推进情况保存新增
    isAddManageProjGovProcess() {
      const arrForm = ['formA']
      if (this.form.ProjGovProcess.picPath!="undefined" && this.form.ProjGovProcess.picPath!=null && this.form.ProjGovProcess.picPath!="" && typeof(this.form.ProjGovProcess.picPath)=='string') {
        this.form.ProjGovProcess.picPath = this.form.ProjGovProcess.picPath.split(",");
      }else{
        this.form.ProjGovProcess.picPath = null
      }
      if(this.isExistProcess == 1 && this.processList.length == 0){
        this.$message({
          message: '请将现场推进情况按照要求填写完整',
          type: 'error'
        });
        return
      }
      Promise.all(arrForm.map(item => this.checkForm(item))).then(()=>{
        addProcessList(this.form.ProjGovProcess).then(res=>{
            this.$message({
              message: '现场推进情况新增成功',
              type: 'success'
            });
            this.activeNames = ''
            this.isEdit(this.row)
        })
      }).catch((e)=>{
          this.$message({
            message: '请将现场推进情况按照要求填写完整',
            type: 'error'
          });
      })
    },
    //修改项目详情-项目完工情况保存修改
    isEditManageProjGovCompletStatus() {
      const arrForm = ['formC']
      Promise.all(arrForm.map(item => this.checkForm(item))).then(()=>{
        status(this.form.ProjGovCompletStatus).then(res=>{
            this.$message({
              message: '项目完工情况修改成功',
              type: 'success'
            });
            this.activeNames = ''
            this.isEdit(this.row)
        })
      }).catch((e)=>{
          this.$message({
            message: '请将项目完工情况按照要求填写完整',
            type: 'error'
          });
      })
    },
    //修改项目详情-项目完工情况保存新增
    isAddManageProjGovCompletStatus() {
      const arrForm = ['formC']
      Promise.all(arrForm.map(item => this.checkForm(item))).then(()=>{
        addStatus(this.form.ProjGovCompletStatus).then(res=>{
            this.$message({
              message: '项目完工情况新增成功',
              type: 'success'
            });
            this.activeNames = ''
            this.isEdit(this.row)
        })
      }).catch((e)=>{
          this.$message({
            message: '请将项目完工情况按照要求填写完整',
            type: 'error'
          });
      })
    },
    //修改项目详情-项目入库投资及资金来源情况保存修改
    isEditManageProjGovCapital() {
      const arrForm = ['formR']
      Promise.all(arrForm.map(item => this.checkForm(item))).then(()=>{
        capital(this.form.ProjGovCapital).then(res=>{
            this.$message({
              message: '项目入库投资情况修改成功',
              type: 'success'
            });
            this.activeNames = ''
            this.isEdit(this.row)
        })
      }).catch((e)=>{
          this.$message({
            message: '请将项目入库投资情况按照要求填写完整',
            type: 'error'
          });
      })
    },
    //修改项目详情-项目入库投资及资金来源情况保存新增
    isAddManageProjGovCapital() {
      const arrForm = ['formR']
      Promise.all(arrForm.map(item => this.checkForm(item))).then(()=>{
        addCapital(this.form.ProjGovCapital).then(res=>{
            this.$message({
              message: '项目详细信息项目完工情况新增成功',
              type: 'success'
            });
            this.activeNames = ''
            this.isEdit(this.row)
        })
      }).catch((e)=>{
          this.$message({
            message: '请将项目信息按照要求填写完整',
            type: 'error'
          });
      })
    },
    // 项目详情按钮
    detailedInformation(row) {
      this.wrapperClosable = true;
      this.open = true;
      this.disabled = true
      this.projectNameTitle = row.projectName
      this.queryParams.pId = row.pId;
      this.weekly.pId = row.pid;
      addSystem(this.weekly).then(res => {
        this.form.ProjGovCompletStatus = res.data.completstatus
        this.form.ProjGovProcedures = res.data.procedures
        this.form.ProjGovCapital = res.data.capital
        this.form.ProjGovProcess = res.data.process
        this.proceduresList = res.data.procedures.list
        this.processList = res.data.process.list
        this.weeklyList = res.data.weeklydata.rows
        this.weeklytotal = res.data.weeklydata.total
        // 处理图片
        this.form.ProjGovProcess.picPath.forEach((element, index) => {
          this.form.ProjGovProcess.picPath[index] = `${process.env.VUE_APP_BASE_URl}${process.env.VUE_APP_BASE_API}${element}`
        });
      })
      this.title = "项目详情";
      this.isDefine = false
      this.visibleSubmit = 'none'
    },
    // 留痕记录按钮
    logInformation(row) {
      // this.dialogLog = true;
      this.logOpen = true;
      // this.disabled = true
      this.projectNameTitle = row.projectName
      this.queryParams.pId = row.pId;
      queryLogByPid(this.queryParams.pId).then(res => {
        this.projGovBaseInfoData = res.data.projGovBaseInfo;
        this.projGovCompletStatusData = res.data.projGovCompletStatus;
        this.projGovProceduresData = res.data.projGovProcedures;
        this.projGovCapitalData = res.data.projGovCapital;
        this.projGovProcessData = res.data.projGovProcess;
      })
      this.title = "留痕记录";
      // this.isDefine = false
      // this.visibleSubmit = 'none'
    },
    // 新增详细信息取消按钮
    cancel() {
      this.open = false;
      this.reset();
      this.imageUrl = ''
      this.reset()
    },
    // 新增基本信息取消按钮
    cancelManage() {
      this.addOpen = false;
      this.addForm = {}
      this.resetForm("form");
    },
    // 新增项目基本信息表单确定按钮
    addManage() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          addCapitalManage(this.addForm).then(res => {
            console.log(res);
            this.addOpen = false;
            this.title = "新增项目详细信息";
            this.isDefine = true
            this.disabled = false
            this.projectNameTitle = this.addForm.projectName
            this.open = true
            this.form = {
                ProjGovCompletStatus: {},
                ProjGovProcedures: {},
                ProjGovCapital: {},
                ProjGovProcess: {
                  fileList: [],
                  percentFinish: 0,
                  percentAll: 0,
                  actualProcess: 0,
                }
            }
            this.form.ProjGovCapital.pId = this.addForm.pId
            this.form.ProjGovCompletStatus.pId = this.addForm.pId
            this.form.ProjGovProcedures.pId = this.addForm.pId
            this.form.ProjGovProcess.pId = this.addForm.pId
            console.log(this.form.ProjGovProcess.pId);
            console.log(this.addForm);
            this.getList(true);
          })
        } else {
          this.$message({
            message: '请将项目信息按照要求填写完整',
            type: 'error'
          });
        }
      });

    },
    // 修改表单基本信息确定按钮
    editManage() {
      editCapitalManage(this.addForm).then(res => {
        console.log(this.addForm);
        this.addOpen = false;
        this.$message({
          message: '项目基本信息修改成功',
          type: 'success'
        });
        this.getList(true)
      })
    },
    // 新增详细项目确定按钮信息
    isAddManage() {
      const arrForm = ['formP','formA','formC','formR','formS']
      Promise.all(arrForm.map(item => this.checkForm(item))).then(() => {
          if(this.isExist == 1 && this.proceduresList.length == 0){
            return
          }
          if(this.isExistProcess == 1 && this.processList.length == 0){
            return
          }
          if (this.form.ProjGovProcess.picPath!="undefined" && this.form.ProjGovProcess.picPath!=null && this.form.ProjGovProcess.picPath!="" && typeof(this.form.ProjGovProcess.picPath)=='string') {
            this.form.ProjGovProcess.picPath = this.form.ProjGovProcess.picPath.split(",");
          }else{
            this.form.ProjGovProcess.picPath = null
          }
          const APIs = [addCapital(this.form.ProjGovCapital), addStatus(this.form.ProjGovCompletStatus), addProcedures(this.form.ProjGovProcedures), addProcessList(this.form.ProjGovProcess)]; // 放多个要请求的promise接口
          axios.all(APIs).then( // 执行并发
            axios.spread((data1, data2, data3, data4) => {
              this.$message({
                message: '项目详细信息新增成功',
                type: 'success'
              });
              this.open = false
              this.reset()
            })
          );
      }).catch((e) => {
          console.log('失败', e)
          this.$message({
            message: '请将项目信息按照要求填写完整',
            type: 'error'
          });
      })
    },
    // 表单重置
    reset() {
      this.form.ProjGovCompletStatus = {
        buildCompany: null,
        undeliverReson: null,
        actualDate: null,
        isAcceptance: null,
        isFinalCost: null,
        isDeliver: null,
      };
      this.form.ProjGovProcedures = {
        designCompany: null,
        constructCompany: null,
        wTarget: null,
        mTarget: null,
        qTarget: null,
        licenceDate: null,
        isBid: null,
        isLicence: null,
      };
      this.proceduresList = []
      this.form.ProjGovCapital = {
        isIn: null,
        declareAmount: null,
        upName: null,
        upAmount: null,
        upPay: null,
        areaPay: null,
        isDeclareUp: null
      };
      this.form.ProjGovProcess = {
        percentFinish: 0,
        percentAll: null,
        actualProcess: null,
        delayReson: null,
        wTarget: null,
        mTarget: null,
        qTarget: null,
        actualStartDate: null,
        delayName: null,
      };
      this.proceduresList = []
      // this.resetForm("form");
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 分页
    handleSizeChange(v) {
      // console.log(v);
      this.queryParams.pageSize = v
      this.getList();
    },
    // 分页
    handleCurrentChange(v) {
      // console.log(v);
      this.queryParams.pageNum = v
      this.getList(true)
    },

    // 分页
    handleSizeChangeWeekly(v) {
      // console.log(v);
      this.weekly.pageSize = v
      this.getList(true)
    },
    // 分页
    handleCurrentChangeWeekly(v) {
      // console.log(v);
      this.weekly.pageNum = v
      this.getWeeklyList();
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
    increase() {
      this.form.ProjGovProcess.percentFinish += 1;
      if (this.form.ProjGovProcess.percentFinish > 100) {
        this.form.ProjGovProcess.percentFinish = 100;
      }
    },
    decrease() {
      this.form.ProjGovProcess.percentFinish -= 1
      if (this.form.ProjGovProcess.percentFinish < 0) {
        this.form.ProjGovProcess.percentFinish = 0;
      }
    },
    increaseRightBtn() {
      this.form.ProjGovProcess.percentAll += 5;
      if (this.form.ProjGovProcess.percentAll > 100) {
        this.form.ProjGovProcess.percentAll = 100;
      }
    },
    percentAllBtn() {
      this.form.ProjGovProcess.percentAll -= 5;
      if (this.form.ProjGovProcess.percentAll < 0) {
        this.form.ProjGovProcess.percentAll = 0;
      }
    },
    actualProcessRightBtn() {
      this.form.ProjGovProcess.actualProcess += 5;
      if (this.form.ProjGovProcess.actualProcess > 100) {
        this.form.ProjGovProcess.actualProcess = 100;
      }
    },
    actualProcessBtn() {
      actualProcessBtn
      this.form.ProjGovProcess.actualProcess -= 5;
      if (this.form.ProjGovProcess.actualProcess < 0) {
        this.form.ProjGovProcess.actualProcess = 0;
      }
    },
    // 头像上传
    handlePictureCardPreview() { },
    handleRemove() { },
    // 图片上传后的钩子
    handleSuccess(response, file, fileList) {
      console.log(response, file, fileList);
      if (!this.form.ProjGovProcess.fileList) {
        this.form.ProjGovProcess.fileList = []
      }
      if (response.url) {
        this.form.ProjGovProcess.fileList.push(response.url)
        this.form.ProjGovProcess.fileList.map(item => {
          return `${this.beasUrl}${item}`
        })
      }
    },
    // 监听穿梭框组件添加
    add(fromData, toData, obj) {
      // console.log("fromData:", fromData);
      // console.log("toData:", toData);
      this.columns = toData
      // console.log("obj:", obj);
    },
    // 监听穿梭框组件移除
    remove(fromData, toData, obj) {
      // console.log("fromData:", fromData);
      // console.log("toData:", toData);
      // console.log("obj:", obj);
    },
    /** 导出多选框确定按钮 */
    exportFun() {
      // console.log(JSON.stringify(this.columns));
      this.download('/system/info/export', {
        columns: JSON.stringify(this.columns)
      }, `manage${new Date().getTime()}.xlsx`)
    },
    /** 取消导出设置 */
    cancelHeader() {
      this.headerOpen = false
    },
    /** 导出按钮操作 */
    handleExport() {
      this.loading = true;
      allcolumnsExport().then(res => {
        // console.log(res);
        this.loading = false;
        this.fromData = res.data;
        this.fromData.forEach((element, index) => {
          this.fromData[index].fid = 0
        });
        this.headerOpen = true
      })
    },
    // 导入文件下载项目模版
    // 导出按钮操作
    downloadTemplate() {
      importTemplate().then(res => {
        this.download('/system/info/importTemplate', {
          res
        }, `政府投资${new Date().getTime()}.xlsx`)
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
      this.upload.open = false
      this.$modal.msgWarning("导入文件写入中，请稍后！");
      this.$refs.upload.submit();
    },
    // 填写周报
    writeReportDia(row) {
      // this.reportProblem = {}
      this.weeklyDetails = {}
      this.weeklyTrobleDetails = {}
      this.weeklyDetailsList = {}
       this.weeklyDetailsList.toubleType= 1,
      this.weeklyTrobleDetails.toubleType= 0,
      this.weeklyDetailsList.troubleId= 6,
      this.report.title = '周报填报'
      this.report.open = true
      this.report.projectNameReportTitle = row.projectName
      // this.reportProblem.pId = row.pId
      this.weeklyDetails.pId = row.pId
      this.weeklyTrobleDetails.pId = row.pId
      proceduresListWeekly(row.pId).then(res => {
        if (res.rows.length !== 0) {
          // this.reportProblem = res.rows[0]
        }
      })
    },
    // 周报确定按钮
    isEditReport() {
      const APIs = [
        // procedures(this.reportProblem),
        addProcessTable(this.weeklyDetails),
        addProcessListTable(this.weeklyTrobleDetails),
        addProcessListTable(this.weeklyDetailsList)
      ]; // 放多个要请求的promise接口
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
    },
    isEditReportCancel() {
      // this.reportProblem = {}
      this.weeklyDetails = {}
      this.weeklyTrobleDetails = {}
      this.report.open = false;
    },
    // 填报管家研判
    writeButlerReview(row, isAdd) {
      this.butlerReviewDetails= row;
      queryProcessTroubleByPid(row.pid).then(res=>{
        this.butlerReview.title = '管家研判'
        this.butlerReview.open = true;
        this.weeklyDetailsList.pid = row.pid;
        this.weeklyDetailsList.content = res.data.content;
        if(this.weeklyDetailsList.content == ''){
          this.isUnitIssues = 0
        }else{
          this.isUnitIssues = 1
        }
        this.weeklyDetailsList.deptIds = res.data.deptIds;
      })
    },
    //取消管家研判填写
    cancelButlerReview() {
      this.butlerReview.open = false;
    },
    // 添加管家研判
    async addButlerReview() {
      this.$refs.weeklyDetailsList.validate(valid=>{
        if(valid){
          // 修改管家研判成功
          if(this.isUnitIssues == 0){
            this.weeklyDetailsList.content = ''
          }
          const APIs = [
            editCapitalManage(this.butlerReviewDetails),
            addProcessListTable(this.weeklyDetailsList)
          ]; // 放多个要请求的promise接口
          axios.all(APIs).then( // 执行并发
            axios.spread((data1, data2) => {
              this.$message({
                message: '填写管家研判成功',
                type: 'success'
              });
              this.butlerReview.open = false;
            })
          );
        }
      })
    },
    // 周报开关
    async openWeeklyChange(val) {
      const params = {
        configId: 100,
        configValue: val ? '1' : '0',
        configKey: 'sys.index.forbid',
        configName: '政投',
      }
      await openWeekly(params).then(response => {
        this.weeklyAuthority = !this.weeklyAuthority;
        this.$message({
          message: '修改成功',
          type: 'success'
        });
      });
    },
    // 项目实际完工时间change
    actualDateChange(val) {
      if (!val) {
        this.form.ProjGovCompletStatus.isAcceptance = null;
        this.form.ProjGovCompletStatus.isFinalCost = null;
        this.form.ProjGovCompletStatus.isDeliver = null;
        this.form.ProjGovCompletStatus.undeliverReson = null;
      }
    },
    // 项目是否已交付change
    isDeliverChange(val) {
      if (val == 1) {
        this.form.ProjGovCompletStatus.undeliverReson = null;
        this.completRules.undeliverReson[0].required = false
      }else{
        this.completRules.undeliverReson[0].required = true
      }
    },
    // 是否申请上级资金change
    isDeclareUpChange(val) {
      if (val == 0) {
        this.form.ProjGovCapital.unhandleReson = null;
        this.form.ProjGovCapital.upPay = null;
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
        files(file.name).then(response => {
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
    // 清除部门名称
    valueChange(val) {
      console.log(val)
      if (!val) {
        this.queryParams.deptId = null;
        this.queryParams.deptName = null;
      }
    },
    isBid(){
      if(this.form.ProjGovProcedures.isBid==1){
        this.prophaseRules.bidDates[0].required = true
      }else{
        this.prophaseRules.bidDates[0].required = false
        this.$refs['formP'].clearValidate('bidDates')
      }
    },
    isLicence(){
      if(this.form.ProjGovProcedures.isLicence==1){
        this.prophaseRules.licenceDate[0].required = true
      }else{
        this.prophaseRules.licenceDate[0].required = false
        this.$refs['formP'].clearValidate('licenceDate')
      }
    },
    checkForm(arrName) { //动态生成promise，再对其坐表单校验，都通过了再去做处理
        const _self = this
        return new Promise((resolve, reject) => {
            _self.$refs[arrName].validate((valid) => {
                if (valid) {
                    resolve()
                } else { reject() }
            })
        })
    },
    actualStartDate(){
      if(this.form.ProjGovProcess.actualStartDate != null){
        this.advanceRules.buildCompany[0].required = true
        this.advanceRules.actualProcess[0].required = true
        this.advanceRules.percentFinish[0].required = true
        this.advanceRules.ecompleteTime[0].required = true
        this.advanceRules.picPath[0].required = true
      }else{
        this.advanceRules.buildCompany[0].required = false
        this.advanceRules.actualProcess[0].required = false
        this.advanceRules.percentFinish[0].required = false
        this.advanceRules.ecompleteTime[0].required = false
        this.advanceRules.picPath[0].required = false
        this.$refs['formA'].clearValidate()
      }
    },
    isOver(){
      if(this.form.ProjGovCompletStatus.isOver==1){
        this.completRules.actualDate[0].required = true
        this.completRules.isAcceptance[0].required = true
        this.completRules.isDeliver[0].required = true
        this.completRules.isFinalCost[0].required = true
      }else{
        this.completRules.actualDate[0].required = false
        this.completRules.isAcceptance[0].required = false
        this.completRules.isDeliver[0].required = false
        this.completRules.isFinalCost[0].required = false
        this.$refs['formC'].clearValidate()
      }
    },
    // 周报按钮是否禁用
    getWeeklyAuthority() {
      weeklyzt().then(res => {
        this.weeklyAuthority = res.msg == '1';
        this.openWeekly = this.weeklyAuthority;
      })
    },
    closeHandle() {
      this.getList(true)
    },
    // unitIssuesChange(val){
    //   if(val==1){
    //     this.weeklyDetailsListRules.content[0].required = true
    //   }else{
    //     this.weeklyDetailsListRules.content[0].required = false
    //   }
    // }
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
  margin-right: 20px;
}

::v-deep .collapse-title {
  flex: 1 0 90%;
  order: 1;
  display: flex;
  justify-content: space-between;
}

::v-deep .collapse-title span{
  display: inline-block;
}

::v-deep .collapse-title .el-button{
  margin: 8px 0px;
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

::v-deep .el-upload-list--picture-card .el-upload-list__item {
  overflow: hidden;
  background-color: #fff;
  border: 1px solid #c0ccda;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 90px;
  height: 90px;
  margin: 0 8px 8px 0;
  display: inline-block;
}

::v-deep .el-upload--picture-card {
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 90px;
  height: 90px;
  cursor: pointer;
  line-height: 101px;
  vertical-align: top;
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

.avatar-uploader-icon[data-v-6f9d7252] {
  font-size: 25px;
  color: #8c939d;
  line-height: 50px;
  text-align: center;
  margin-left: 100%;
  margin-top: 67%;
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
  margin:0 20px;
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
.line{
  text-align: center;
  line-height: 30px;
}
.update-time{
  margin-right: 20px;
  font-size: 14px;
}
</style>
