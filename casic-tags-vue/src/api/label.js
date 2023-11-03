import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function getfl(data) {
  return request({
    url: '/category/query',
    method: 'get',
    params: data
  })
}
export function gettree(data = {}) {
  return request({
    url: '/category/tree',
    method: 'get',
    params: data
  })
}
export function postfl(data) {
  return request({
    url: '/category',
    method: 'post',
    data: data,
    Authorization: getToken
  })
}

export function putfl(data) {
  return request({
    url: '/category',
    method: 'put',
    data: data
  })
}

export function delfl(categoryId) {
  return request({
    url: `/category?categoryId=${categoryId}`,
    method: 'delete',
    data: { categoryId }
  })
}

export function getkl(data) {
  return request({
    url: '/atom',
    method: 'get',
    params: data
  })
}
export function postkl(data) {
  return request({
    url: '/atom',
    method: 'post',
    data: data,
    Authorization: getToken
  })
}

export function putkl(data) {
  return request({
    url: '/atom',
    method: 'put',
    data: data
  })
}

export function delkl(atomId) {
  return request({
    url: `/atom?atomId=${atomId}`,
    method: 'delete',
    data: { atomId }
  })
}

export function automNum(data = {}) {
  return request({
    url: '/atom/automNum',
    method: 'get',
    params: data
  })
}
