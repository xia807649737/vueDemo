import request from '@/utils/request'

// // 查询库存信息列表
// export function listDrugstock(query) {
//   return request({
//     url: '/drugstock/list',
//     method: 'get',
//     params: query
//   })
// }

// 查询库存信息详细
export function getDrugstock(id) {
  return request({
    url: '/drugstock/' + id,
    method: 'get'
  })
}

// 新增库存信息
export function addDrugstock(data) {
  return request({
    url: '/drugstock',
    method: 'post',
    data: data
  })
}

// 修改库存信息
export function updateDrugstock(data) {
  return request({
    url: '/drugstock',
    method: 'put',
    data: data
  })
}

// 删除库存信息
export function delDrugstock(id) {
  return request({
    url: '/drugstock/' + id,
    method: 'delete'
  })
}

// 审批
export function approval(id) {
  return request({
    url: '/drugstock/approval/' + id,
    method: 'get'
  })
}
