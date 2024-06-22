import request from '@/utils/request'

// 查询支付通道列表
export function listPassage(query) {
  return request({
    url: '/pay/passage/list',
    method: 'get',
    params: query
  })
}

// 查询支付通道详细
export function getPassage(id) {
  return request({
    url: '/pay/passage/' + id,
    method: 'get'
  })
}

// 新增支付通道
export function addPassage(data) {
  return request({
    url: '/pay/passage',
    method: 'post',
    data: data
  })
}

// 修改支付通道
export function updatePassage(data) {
  return request({
    url: '/pay/passage',
    method: 'put',
    data: data
  })
}

// 删除支付通道
export function delPassage(id) {
  return request({
    url: '/pay/passage/' + id,
    method: 'delete'
  })
}

// 导出支付通道
export function exportPassage(query) {
  return request({
    url: '/pay/passage/export',
    method: 'get',
    params: query
  })
}

export function listInterface() {
  return request({
    url: '/pay/interface/list',
    method: 'get'
  })
}
// 修改支付通道
export function addPassageParam(data) {
  return request({
    url: '/pay/passage/updateParam',
    method: 'post',
    data: data
  })
}
