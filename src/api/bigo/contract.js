import request from '@/utils/request'

// 查询订单列表
export function listContract(query) {
  return request({
    url: '/contract/list',
    method: 'get',
    params: query
  })
}

// 一键平仓
export function oneKeyClose(type, id) {
  return request({
    url: '/timeContract/oneKeyClose/' + type + '/'+ id,
    method: 'get'
  })
}

export function batchOneKeyClose(type, id) {
  return request({
    url: '/timeContract/batchOneKeyClose/' + type + '/'+ id,
    method: 'get'
  })
}

// 一键止盈
// export function stopTimeSurplus(id) {
//   const data = {
//     id
//   }
//   return request({
//     url: '/timeContract/oneKeyStopSurplus',
//     method: 'put',
//     data: data
//   })
// }

// 查询订单列表
export function listFrame(query) {
  return request({
    url: '/contract/frameList',
    method: 'get',
    params: query
  })
}

// 查询限时合约列表
export function listTimeContract(query) {
  return request({
    url: '/timeContract/list',
    method: 'get',
    params: query
  })
}
