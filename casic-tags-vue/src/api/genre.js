import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function getlb(data) {
  return request({
    url: '/people-category',
    method: 'get',
    params: data
  })
}
export function getlball(data = {}) {
  return request({
    url: '/people-category/all',
    method: 'get',
    params: data
  })
}
export function postlb(data) {
  return request({
    url: '/people-category',
    method: 'post',
    data: data,
    Authorization: getToken
  })
}

export function putlb(data) {
  return request({
    url: '/people-category',
    method: 'put',
    data: data
  })
}

export function dellb(id) {
  return request({
    url: `/people-category/${id}`,
    method: 'delete'
  })
}

export function getzl(data) {
  return request({
    url: '/people-type',
    method: 'get',
    params: data
  })
}
export function postzl(data) {
  return request({
    url: '/people-type',
    method: 'post',
    data: data,
    Authorization: getToken
  })
}

export function putzl(data) {
  return request({
    url: '/people-type',
    method: 'put',
    data: data
  })
}

export function delzl(id) {
  return request({
    url: `/people-type/${id}`,
    method: 'delete'
  })
}

export function getfj(data) {
  return request({
    url: '/attention-level',
    method: 'get',
    params: data
  })
}
export function postfj(data) {
  return request({
    url: '/attention-level',
    method: 'post',
    data: data,
    Authorization: getToken
  })
}

export function putfj(data) {
  return request({
    url: '/attention-level',
    method: 'put',
    data: data
  })
}

export function delfj(id) {
  return request({
    url: `/attention-level/${id}`,
    method: 'delete'
  })
}

