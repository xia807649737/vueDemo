import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function getg(data) {
  return request({
    url: '/root-block/byPage',
    method: 'get',
    params: data
  })
}
export function postg(data) {
  return request({
    url: '/root-block',
    method: 'post',
    data: data,
    Authorization: getToken
  })
}

export function putg(data) {
  return request({
    url: '/root-block',
    method: 'put',
    data: data
  })
}

export function delg(id) {
  return request({
    url: `/root-block/${id}`,
    method: 'delete'
  })
}

export function getgall(data) {
  return request({
    url: '/root-block',
    method: 'get',
    params: data
  })
}

export function gets(data) {
  return request({
    url: '/root-block-attr/byPage',
    method: 'get',
    params: data
  })
}
export function posts(data) {
  return request({
    url: '/root-block-attr',
    method: 'post',
    data: data,
    Authorization: getToken
  })
}

export function puts(data) {
  return request({
    url: '/root-block-attr',
    method: 'put',
    data: data
  })
}

export function dels(id) {
  return request({
    url: `/root-block-attr/${id}`,
    method: 'delete'
  })
}

export function urnum(id) {
  return request({
    url: `/root-block/people-num//${id}`,
    method: 'get'
  })
}

export function urstatus(id) {
  return request({
    url: `/root-block/taskStatus/${id}/1`,
    method: 'put'
  })
}

export function getl(data) {
  return request({
    url: '/sub-block/byPage',
    method: 'get',
    params: data
  })
}
export function postl(data) {
  return request({
    url: '/sub-block',
    method: 'post',
    data: data,
    Authorization: getToken
  })
}

export function putl(data) {
  return request({
    url: '/sub-block',
    method: 'put',
    data: data
  })
}

export function dell(id) {
  return request({
    url: `/sub-block/${id}`,
    method: 'delete'
  })
}

export function jsnum(id) {
  return request({
    url: `/sub-block/people-num/${id}`,
    method: 'get'
  })
}

export function ulstatus(id) {
  return request({
    url: `/sub-block/taskStatus/${id}/1`,
    method: 'put'
  })
}

export function atrList(id) {
  return request({
    url: `/root-block-attr?rootId=${id}`,
    method: 'get'
  })
}

export function details(id) {
  return request({
    url: `/sub-block/${id}`,
    method: 'get'
  })
}

export function findTree(level) {
  return request({
    url: `/sub-block/tree/${level}`,
    method: 'get'
  })
}
