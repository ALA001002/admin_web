import request from '@/utils/request'

// 查询支付接口类型列表
export function listInterface(query) {
  return request({
    url: '/pay/interface/list',
    method: 'get',
    params: query
  })
}

// 查询支付接口类型详细
export function getInterface(ifTypeCode) {
  return request({
    url: '/pay/interface/' + ifTypeCode,
    method: 'get'
  })
}

// 新增支付接口类型
export function addInterface(data) {
  return request({
    url: '/pay/interface',
    method: 'post',
    data: data
  })
}

// 修改支付接口类型
export function updateInterface(data) {
  return request({
    url: '/pay/interface',
    method: 'put',
    data: data
  })
}

// 删除支付接口类型
export function delInterface(ifTypeCode) {
  return request({
    url: '/pay/interface/' + ifTypeCode,
    method: 'delete'
  })
}

// 导出支付接口类型
export function exportInterface(query) {
  return request({
    url: '/pay/interface/export',
    method: 'get',
    params: query
  })
}


export function updateInterfaceParam(data) {
  return request({
    url: '/pay/interface/updateParam',
    method: 'put',
    data: data
  })
}
