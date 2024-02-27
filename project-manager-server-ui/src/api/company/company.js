/*
 * @Description:
 * @Author: Xu.L
 * @Date: 2023-04-07 19:33:20
 */
import request from '@/utils/request'

// 查询产业项目列表
export function listCompany(query) {
  return request({
    url: '/company/list',
    method: 'get',
    params: query
  })
}

// 查询产业项目详细
export function getCompany(id) {
  return request({
    url: '/company/' + id,
    method: 'get'
  })
}

// 新增产业项目
export function addCompany(data) {
  return request({
    url: '/company',
    method: 'post',
    data: data
  })
}

// 修改产业项目
export function updateCompany(data) {
  return request({
    url: '/company',
    method: 'put',
    data: data
  })
}

// 删除产业项目
export function delCompany(id) {
  return request({
    url: '/company/' + id,
    method: 'delete'
  })
}

// 导出文件
export function allcolumnscomExport() {
  return request({
    url: '/system/info/allcolumnscom',
    method: 'get',
  })
}

// 导入下载文件模版
export function importTemplate() {
  return request({
    url: '/company/importTemplate',
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

// 周报按钮开关
export function weeklyct() {
  return request({
    url: '/weekly/ct',
    method: 'get',
  })
}

// 删除图片
export function files(pname) {
  return request({
    url: '/file/file/pname?pname='+ pname,
    method: 'get',
  })
}