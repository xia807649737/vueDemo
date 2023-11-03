
import { getToken } from '@/utils/auth'
import request from '@/utils/request'

// 获取单位列表(平级)
// export function getAllUnits(params) {
//   return request({
//     url: '/comm/unit/getAllUnits',
//     method: 'get',
//     params: params
//   })
// }
// 获取单位列表（树状）
export function getAllUnits(params) {
  return request({
    url: '/comm/unit/getUnitsTree',
    method: 'get',
    params: params
  })
}
// 获取单位详情
export function getAllUnitIdAndNames(userId) {
  return request({
    url: `/comm/unit/getAllUnitIdAndNames`,
    method: 'get',
  })
}
// 新增单位详情
export function addUnitInfo(data) {
  return request({
    url: `/comm/unit/createUnit`,
    method: 'post',
    data
  })
}
// 修改单位详情
export function editUnitInfo(unitId, data) {
  return request({
    url: `/comm/unit/${unitId}/updateUint`,
    method: 'put',
    data
  })
}
// 查询单位详情
export function queryUnits(params) {
  return request({
    url: `/comm/unit/queryUnits`,
    method: 'get',
    params
  })
}
// 批量删除单位
export function deleteUnits(data) {
  return request({
    url: `/comm/unit/deleteUnits`,
    method: 'delete',
    data
  })
}
