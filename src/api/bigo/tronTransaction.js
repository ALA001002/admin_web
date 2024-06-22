import request from '@/utils/request'

// 查询Trx充提列表
export function listTronTransaction(query) {
  return request({
    url: '/wallet/tronTransaction/list',
    method: 'get',
    params: query
  })
}

// 查询Trx充提详细
export function getTronTransaction(id) {
  return request({
    url: '/wallet/tronTransaction/' + id,
    method: 'get'
  })
}

// 新增Trx充提
export function addTronTransaction(data) {
  return request({
    url: '/wallet/tronTransaction',
    method: 'post',
    data: data
  })
}

// 修改Trx充提
export function updateTronTransaction(data) {
  return request({
    url: '/wallet/tronTransaction',
    method: 'put',
    data: data
  })
}

// 删除Trx充提
export function delTronTransaction(id) {
  return request({
    url: '/wallet/tronTransaction/' + id,
    method: 'delete'
  })
}

// 导出Trx充提
export function exportTronTransaction(query) {
  return request({
    url: '/wallet/tronTransaction/export',
    method: 'get',
    params: query
  })
}

export function collect(id) {
  return request({
    url: '/wallet/tronTransaction/collect',
    method: 'put',
    data: {id:id}
  })
}

export  function updateScore(address,uid,amount,fromAddress,txId) {
  return request({
    url: '/api/wallet/trc20/notify',
    method: 'post',
    data: {
      address,
      "balance": amount,
      fromAddress,
      "method": "changeBalance",
      "symbol": "USDT",
      "test": false,
      txId,
      "type": 1,
      uid
    }
  })
}
