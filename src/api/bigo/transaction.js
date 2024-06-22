import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listTransaction(query) {
  return request({
    url: '/transaction/list',
    method: 'get',
    params: query
  })
}
// 导出钱包交易状态
export function exportTransaction(query) {
  return request({
    url: '/transaction/export',
    method: 'get',
    params: query
  })
}



export function subordinateRecordList(query) {
  return request({
    url: '/transaction/subordinateRecordList',
    method: 'get',
    params: query
  })
}

// 导出钱包交易状态
export function lowerExport(query) {
  return request({
    url: '/transaction/lowerExport',
    method: 'get',
    params: query
  })
}



export function lowerRecordList(query) {
  return request({
    url: '/transaction/lowerRecordList',
    method: 'get',
    params: query
  })
}
