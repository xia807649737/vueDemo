import request from '@/utils/request'
//获取基本信息
export function system(query) {
  return request({
    url: '/system/info/list',
    method: 'get',
    params: query
  })
}
//修改周报
export function editWeekly(query) {
  return request({
    url: `/weekly` ,
    method: 'put',
    data: query
  })
}

//获取周报详情
export function getWeeklyDetails(pid) {
  return request({
    url: `/weekly/${pid}` ,
    method: 'get',
  })
}

//新增周报信息
export function addWeekly(query) {
  return request({
    url: '/weekly' ,
    method: 'post',
    data: query
  })
}

//获取周报信息
export function getWeeklyList(query) {
  return request({
    url: '/weekly/list' ,
    method: 'get',
    params: query
  })
}

// 已完工
export function addSystem(query) {
  return request({
    url: '/system/info/listDetail',
    method: 'get',
    params: query
  })
}

// 日志查询
export function queryLogByPid(pId) {
  return request({
    url: '/system/log/queryLogByPid?pId=' + pId,
    method: 'get',
  })
}


// 导出文件
export function allcolumnsExport() {
  return request({
    url: '/system/info/allcolumns',
    method: 'get',
  })
}

export function addCapitalManage(data) {
  return request({
    url: '/system/info',
    method: 'post',
    data: data
  })
}
// 修改基本信息
export function editCapitalManage(data) {
  return request({
    url: '/system/info',
    method: 'put',
    data: data
  })
}

// 项目详细信息修改接口（下方四个）
// 资金
export function capital(data) {
  return request({
    url: '/system/capital',
    method: 'put',
    data: data
  })
}
// 完成情况
export function status(data) {
  return request({
    url: 'system/status',
    method: 'put',
    data: data
  })
}
// 手续
export function procedures(data) {
  return request({
    url: '/system/procedures',
    method: 'put',
    data: data
  })
}

// 在建进度
export function processListAdd(data) {
  return request({
    url: '/system/process',
    method: 'put',
    data: data
  })
}

// 项目详细信息新增接口（下方四个）
export function addCapital(data) {
  return request({
    url: '/system/capital',
    method: 'post',
    data: data
  })
}
// 完成情况
export function addStatus(data) {
  return request({
    url: 'system/status',
    method: 'post',
    data: data
  })
}
// 手续
export function addProcedures(data) {
  return request({
    url: '/system/procetrouble',
    method: 'post',
    data: data
  })
}

export function addProceduresTrouble(data) {
  return request({
    url: '/system/procetrouble',
    method: 'post',
    data: data
  })
}
export function addProceduresTroubleList(data) {
  return request({
    url: '/system/procetrouble',
    method: 'post',
    data: data
  })
}
export function addTrouble(data) {
  return request({
    url: '/system/trouble',
    method: 'post',
    data: data
  })
}
// 周报列表
export function proceduresListWeekly(pId) {
  return request({
    url: '/system/procedures/list?pId=' + pId,
    method: 'get',
  })
}

// 在建进度
export function addProcessList(data) {
  return request({
    url: '/system/process',
    method: 'post',
    data: data
  })
}


// 在建进度内部表格新增
export function addProcessListTable(data) {
  return request({
    url: '/system/trouble',
    method: 'post',
    data: data
  })
}
// 在建进度内部表格修改
export function editProcessListTable(data) {
  return request({
    url: '/system/trouble',
    method: 'put',
    data: data
  })
}
// 在建进度内部表格删除
export function deleteProcessListTable(id,pId) {
  return request({
    url: '/system/trouble/delete?id='+ id+'&pId='+pId,
    method: 'get',
  })
}


// 手续办理内部表格新增
export function addProcessTable(data) {
  return request({
    url: '/system/procetrouble',
    method: 'post',
    data: data
  })
}
// 手续办理内部表格修改
export function editProcessTable(data) {
  return request({
    url: '/system/procetrouble',
    method: 'put',
    data: data
  })
}
// 手续办理内部表格删除
export function deleteProcessTable(pId,id) {
  return request({
    url: '/system/procetrouble/delete?pId='+pId+"&id="+id,
    method: 'get',
  })
}

// 部门树
export function deptTree() {
  return request({
    url: '/system/user/deptTree',
    method: 'get'
  })
}
// 导入下载文件模版
export function importTemplate() {
  return request({
    url: '/system/info/importTemplate',
    method: 'post'
  })
}
// 导入文件
export function importData() {
  return request({
    url: '/importData',
    method: 'post'
  })
}
// 判断按钮是否可用
export function ishandle() {
  return request({
    url: '/system/info/ishandle',
    method: 'get'
  })
}

// 删除图片
export function files(pname) {
  return request({
    url: '/file/file/pname?pname='+ pname,
    method: 'get',
  })
}

// 周报开关
export function openWeekly(params) {
  return request({
    url: '/system/config',
    method: 'put',
    data: params
  })
}

// 周报按钮开关
export function weeklyzt() {
  return request({
    url: '/weekly/zt',
    method: 'get',
  })
}

export function queryProcessTroubleByPid(pId) {
  return request({
    url: '/system/trouble/getInfoByPId?pId='+pId,
    method: 'get',
  })
}
