// await getAuthsList()
import { getToken } from '@/utils/auth'
import request from '@/utils/request'

// 获取权限列表
export function getAuthsList(params) {
  return request({
    url: '/api/v1/roles',
    method: 'get',
    params: params
  })
}
// 获取权限详情
export function getAuthInfo(roleId) {
  return request({
    url: `/api/v1/roles/${roleId}`,
    method: 'get',
  })
}
// 查询权限列表（过滤）
export function getAuthsByName(params) {
  return request({
    url: '/api/v1/queryRoles',
    method: 'get',
    params: params
  })
}
// 新增权限
export function addAuthInfo(data) {
  return request({
    url: `/api/v1/roles`,
    method: 'post',
    data: data
  })
}
// 编辑权限
export function editAuthInfo(roleId, data) {
  return request({
    url: `/api/v1/roles/${roleId}`,
    method: 'put',
    data: data
  })
}
// 删除权限
export function deleteAuthInfo(roleId) {
  return request({
    url: `/api/v1/roles/${roleId}`,
    method: 'delete',
  })
}
// 批量删除权限
export function deleteAuths(data) {
  return request({
    url: `/api/v1/roles/permissions`,
    method: 'delete',
    data: data
  })
}

// 查询所有权限列表
export function getPermissions(params) {
  return request({
    url: `/api/v1/permissions`,
    method: 'get',
    params
  })
}

// 查询某角色组,拥有的权限列表
export function getRolePermissions(roleId, params) {
  return request({
    url: `/api/v1/roles/${roleId}/permissions`,
    method: 'get',
    params
  })
}

// 修改某角色组,拥有的权限列表
export function editRolePermissions(roleId, data) {
  return request({
    url: `/api/v1/roles/${roleId}/permissions`,
    method: 'put',
    data
  })
}
