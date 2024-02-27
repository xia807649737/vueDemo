import request from '@/utils/request'
//获取药房信息
export function firstPageHome() {
  return request({
    url: '/drugstore/firstPage',
    method: 'get'
  })
}
//获取药房信息
export function getPharmacy(pharmacyId) {
  return request({
    url: '/drugstore/' + pharmacyId,
    method: 'get'
  })
}
//修改药房信息
export function modifyPharmacy(data) {
    return request({
      url: '/drugstore',
      method: 'PUT',
      data:data
    })
}
//修改药房图片
export function uploadFileOk(data) {
    return request({
      url: '/drugstock/importData',
      method: 'POST',
      headers:{
        'Content-type': 'multipart/form-data'
      },
      data:data
    })
}
export function u() {
    return request({
      url: '/prod-api/common/upload',
      method: 'POST',
    })
}
//获取历史记录
export function getHistory(pharmacyId) {
    return request({
      url: '/recode/list?pharmacyId=' +pharmacyId,
      method: 'get'
    })
}

// // 查询库存信息列表
// export function listDrugstock(pharmacyId,actualName,pageNum,pageSize) {
//      return request({
//       url: '/drugstock/list?pharmacyId='+pharmacyId+'&actualName='+actualName+'&pageNum='+pageNum+'&pageSize='+pageSize,
//       method: 'get',
//      })
// }


//修改药房信息
export function EditPassWordFun(data) {
  return request({
    url: '/system/user/profile/updatePwd',
    method: 'post',
    data:data
  })
}

/*
 * 药房管理----获取药房列表
 */
export function getPharmacyList(pageNum,pageSize,name,creditCode,medicareCode,address,deptId) {
  return request({
    url: '/drugstore/list?&pageNum='+pageNum+'&pageSize='+pageSize+'&name='+name+'&creditCode='+creditCode+'&medicareCode='+medicareCode+'&address='+address+'&deptId='+deptId,
    method: 'get',
  })
}
/*
 * 药房管理----药房列表上下线
 */
export function updateStatus(id,status) {
  return request({
    url: '/drugstore/updateStatus?id='+id+'&status='+status,
    method: 'get',
  })
}

/*
 * 库存查询----获取药房列表
 */
export function getStoreNameByComp(name) {
  return request({
    url: '/drugstore/getStoreNameByComp?name='+name,
    method: 'get',
  })
}
/*
 * 库存查询----获取药品总库存列表
 */
export function getAreaCount(pageNum,pageSize) {
  return request({
    url: '/drugstore/getAreaCount?pageNum='+pageNum+'&pageSize='+pageSize,
    method: 'get',
  })
}


// 查询部门列表
export function listDept(query) {
  return request({
    url: '/system/dept/list',
    method: 'get',
    params: query
  })
}

// 查询部门列表
export function findRegionStores(query) {
  return request({
    url: '/drugstore/findRegionStores',
    method: 'get',
    params: query
  })
}
// 新增药房
export function drugstore(data) {
  return request({
    url: '/drugstore',
    method: 'post',
    data: data
  })
}
// 新增药房
export function system(data) {
  return request({
    url: '/system/dept/list',
    method: 'get',
    data: data
  })
}


// 查询部门下拉树结构
export function deptTreeSelect() {
  return request({
    url: '/system/user/deptTree',
    method: 'get'
  })
}
