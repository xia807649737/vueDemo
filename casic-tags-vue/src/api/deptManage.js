import { getToken } from '@/utils/auth'
import request from '@/utils/request'

// 获取单位树
export function getUnitsTree() {
  return request({
    url: `/comm/unit/theUnitsTree`,
    method: 'get'
  })
}
// 点击单位，获取所有部门列表
export function getUnitDepts(params) {
  return request({
    url: `/comm/dept/getUnitDepts`,
    method: 'get',
    params
  })
}
// 新增部门
export function addDeptInfo(data) {
  return request({
    url: `/comm/dept/createDept`,
    method: 'post',
    data
  })
}
// 修改部门
export function editDeptInfo(deptId, data) {
  return request({
    url: `/comm/dept/${deptId}/updateDept`,
    method: 'put',
    data
  })
}
// 查询部门
export function queryDepts(deptId, params) {
  return request({
    url: `/comm/dept/${deptId}/queryDepts`,
    method: 'get',
    params
  })
}
// 查询部门
export function deleteDepts(data) {
  return request({
    url: `/comm/dept/deleteDepts`,
    method: 'delete',
    data
  })
}
