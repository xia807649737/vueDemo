
import { getToken } from '@/utils/auth'
import request from '@/utils/request'

// 获取角色列表
export function getLogsList(params) {
  return request({
    url: '/api/v1/auditlogs',
    method: 'get',
    params: params
  })
}
// 查询角色列表（过滤）
export function getLogsByName(params) {
  return request({
    url: '/api/v1/audit-logs',
    method: 'get',
    params: params
  })
}