import request from '@/utils/request'

// 查询药品标准列表
export function listStandard(query) {
  return request({
    url: '/standard/list',
    method: 'get',
    params: query
  })
}

// 查询药品标准详细
export function getStandard(id) {
  return request({
    url: '/standard/' + id,
    method: 'get'
  })
}

// 新增药品标准
export function addStandard(data) {
  return request({
    url: '/standard',
    method: 'post',
    data: data
  })
}

// 修改药品标准
export function updateStandard(data) {
  return request({
    url: '/standard',
    method: 'put',
    data: data
  })
}

// 删除药品标准
export function delStandard(id) {
  return request({
    url: '/standard/' + id,
    method: 'delete'
  })
}
