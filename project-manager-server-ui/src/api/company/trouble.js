/*
 * @Description:
 * @Author: Xu.L
 * @Date: 2023-04-07 19:33:20
 */
import request from '@/utils/request'

// 查询产业项目问题列表
export function listTrouble(query) {
  return request({
    url: '/trouble/list',
    method: 'get',
    params: query
  })
}
// 查询产业项目问题详细
export function getTrouble(id) {
  return request({
    url: '/trouble/' + id,
    method: 'get'
  })
}

// 新增产业项目问题
export function addTrouble(data) {
  return request({
    url: '/trouble',
    method: 'post',
    data: data
  })
}

// 修改产业项目问题
export function updateTrouble(data) {
  return request({
    url: '/trouble',
    method: 'put',
    data: data
  })
}

// 删除产业项目问题
export function delTrouble(id) {
  return request({
    url: '/trouble/' + id,
    method: 'delete'
  })
}

// 部门树
export function deptTree() {
  return request({
    url: '/system/user/deptTree',
    method: 'get'
  })
}
