import request from '@/utils/request'

// 查询重要环节完成情况列表
export function listProcess(query) {
  return request({
    url: '/process/list',
    method: 'get',
    params: query
  })
}

// 查询重要环节完成情况详细
export function getProcess(id) {
  return request({
    url: '/process/' + id,
    method: 'get'
  })
}

// 新增重要环节完成情况
export function addProcess(data) {
  return request({
    url: '/process',
    method: 'post',
    data: data
  })
}

// 修改重要环节完成情况
export function updateProcess(data) {
  return request({
    url: '/process',
    method: 'put',
    data: data
  })
}

// 删除重要环节完成情况
export function delProcess(id) {
  return request({
    url: '/process/' + id,
    method: 'delete'
  })
}
