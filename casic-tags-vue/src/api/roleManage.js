
import { getToken } from '@/utils/auth'
import request from '@/utils/request'

// 获取角色列表
export function getRolesList(params) {
  return request({
    url: '/api/v1/roles',
    method: 'get',
    params: params
  })
}
// 获取角色详情
export function getRoleInfo(roleId) {
  return request({
    url: `/api/v1/roles/${roleId}`,
    method: 'get'
  })
}
// 查询角色列表（过滤）
export function getRolesByName(params) {
  return request({
    url: '/api/v1/queryRoles',
    method: 'get',
    params: params
  })
}
// 新增角色
export function addRoleInfo(data) {
  return request({
    url: `/api/v1/roles`,
    method: 'post',
    data: data
  })
}
// 编辑角色
export function editRoleInfo(roleId, data) {
  return request({
    url: `/api/v1/roles/${roleId}`,
    method: 'put',
    data: data
  })
}
// 删除角色
export function deleteRoleInfo(roleId) {
  return request({
    url: `/api/v1/roles/${roleId}`,
    method: 'delete'
  })
}
// 批量删除角色
export function deleteRoles(data) {
  return request({
    url: `/api/v1/deleteRoles`,
    method: 'delete',
    data: data
  })
}
