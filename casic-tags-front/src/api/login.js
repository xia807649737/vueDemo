
import { getToken } from '@/utils/auth'
import request from '@/utils/request'

export function modifyPassword(data) {
  return request({
    url: '/api/modify/password',
    method: 'post',
    requestType: 'form',
    data: data
  })
}
export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    requestType: 'form',
    data: data
  })
}
export function logout(data) {
  return request({
    url: '/logout',
    method: 'post',
    requestType: 'form',
    Authorization: getToken,
    data: data
  })
}
