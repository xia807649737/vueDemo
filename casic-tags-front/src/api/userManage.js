
import { getToken } from '@/utils/auth'
import request from '@/utils/request'

// 获取用户列表
export function getUsersList(params) {
  return request({
    url: '/api/v1/users',
    method: 'get',
    params: params
  })
}
// 获取用户详情
export function getUserInfo(userId) {
  return request({
    url: `/api/v1/users/${userId}`,
    method: 'get',
  })
}
// 查询用户列表（过滤）
export function getUsersByName(params) {
  return request({
    url: '/api/v1/queryUsers',
    method: 'get',
    params: params
  })
}
// 新增用户
export function addUserInfo(data) {
  return request({
    url: `/api/v1/users`,
    method: 'post',
    data: data
  })
}
// 编辑用户
export function editUserInfo(userId, data) {
  return request({
    url: `/api/v1/users/${userId}`,
    method: 'put',
    data: data
  })
}
// 删除用户
export function deleteUserInfo(userId) {
  return request({
    url: `/api/v1/users/${userId}`,
    method: 'delete',
  })
}
// 批量删除用户
export function deleteUsers(data) {
  return request({
    url: `/api/v1/deleteUsers`,
    method: 'delete',
    data: data
  })
}
// 重置密码
export function resetPassword(userId) {
  return request({
    url: `/api/v1/users/${userId}/reset-password`,
    method: 'put',
    data: {"password": "resetpassword"}
  })
}
