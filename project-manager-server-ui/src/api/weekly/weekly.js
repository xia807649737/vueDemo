import request from '@/utils/request'

// 查询项目周报列表
export function listWeekly(query) {
  return request({
    url: '/weekly/list',
    method: 'get',
    params: query
  })
}

// 查询项目周报详细
export function getWeekly(id) {
  return request({
    url: '/weekly/' + id,
    method: 'get'
  })
}

// 新增项目周报
export function addWeekly(data) {
  return request({
    url: '/weekly',
    method: 'post',
    data: data
  })
}

// 修改项目周报
export function updateWeekly(data) {
  return request({
    url: '/weekly',
    method: 'put',
    data: data
  })
}

// 删除项目周报
export function delWeekly(id) {
  return request({
    url: '/weekly/' + id,
    method: 'delete'
  })
}
