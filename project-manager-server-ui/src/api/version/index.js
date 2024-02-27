import request from '@/utils/request'

// 查询版本管理 列表
export function listVersion(query) {
  return request({
    url: '/version/list',
    method: 'get',
    params: query
  })
}

// 查询版本管理 详细
export function getVersion(id) {
  return request({
    url: '/version/' + id,
    method: 'get'
  })
}

// 新增版本管理
export function addVersion(data) {
  return request({
    url: '/version',
    method: 'post',
    data: data
  })
}

// 修改版本管理
export function updateVersion(data) {
  return request({
    url: '/version',
    method: 'put',
    data: data
  })
}

// 删除版本管理
export function delVersion(id) {
  return request({
    url: '/version/' + id,
    method: 'post'
  })
}
export function updatingVersion(data) {
  return request({
    url: '/version/doVersionDiff',
    method: 'post',
    data: data
  })
}

