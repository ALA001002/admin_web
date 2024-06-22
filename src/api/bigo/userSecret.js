import request from '@/utils/request'

// 查询用户谷歌秘钥列表
export function listSecret(query) {
  return request({
    url: '/userinfo/secret/list',
    method: 'get',
    params: query
  })
}

// 查询用户谷歌秘钥详细
export function getSecret(id) {
  return request({
    url: '/userinfo/secret/' + id,
    method: 'get'
  })
}

// 新增用户谷歌秘钥
export function addSecret(data) {
  return request({
    url: '/userinfo/secret',
    method: 'post',
    data: data
  })
}

// 修改用户谷歌秘钥
export function updateSecret(data) {
  return request({
    url: '/userinfo/secret',
    method: 'put',
    data: data
  })
}

// 删除用户谷歌秘钥
export function delSecret(id) {
  return request({
    url: '/userinfo/secret/' + id,
    method: 'delete'
  })
}

// 导出用户谷歌秘钥
export function exportSecret(query) {
  return request({
    url: '/userinfo/secret/export',
    method: 'get',
    params: query
  })
}

export function unbundleSecret(data) {
  return request({
    url: '/userinfo/secret/unbundle',
    method: 'post',
    data: data
  })
}
