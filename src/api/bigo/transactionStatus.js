import request from '@/utils/request'

// 查询钱包交易状态列表
export function listTransactionStatus(query) {
  return request({
    url: '/wallet/transactionStatus/list',
    method: 'get',
    params: query
  })
}

// 查询钱包交易状态详细
export function getTransactionStatus(id) {
  return request({
    url: '/wallet/transactionStatus/' + id,
    method: 'get'
  })
}

// 新增钱包交易状态
export function addTransactionStatus(data) {
  return request({
    url: '/wallet/transactionStatus',
    method: 'post',
    data: data
  })
}

// 修改钱包交易状态
export function updateTransactionStatus(data) {
  return request({
    url: '/wallet/transactionStatus',
    method: 'put',
    data: data
  })
}

// 删除钱包交易状态
export function delTransactionStatus(id) {
  return request({
    url: '/wallet/transactionStatus/' + id,
    method: 'delete'
  })
}

// 导出钱包交易状态
export function exportTransactionStatus(query) {
  return request({
    url: '/wallet/transactionStatus/export',
    method: 'get',
    params: query
  })
}
  // 同步区块
export function synchronizeBlock(id) {
  return request({
    url: '/wallet/transactionStatus/synchronizeBlock/' + id,
    method: 'get'
  })
}

