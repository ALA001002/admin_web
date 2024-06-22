import request from '@/utils/request'

// 查询借款信息列表
export function listLoansInfo(query) {
  return request({
    url: '/loans/LoansInfo/list',
    method: 'get',
    params: query
  })
}

// 查询借款信息详细
export function getLoansInfo(id) {
  return request({
    url: '/loans/LoansInfo/' + id,
    method: 'get'
  })
}

// 新增借款信息
export function addLoansInfo(data) {
  return request({
    url: '/loans/LoansInfo',
    method: 'post',
    data: data
  })
}

// 修改借款信息
export function updateLoansInfo(data) {
  return request({
    url: '/loans/LoansInfo',
    method: 'put',
    data: data
  })
}

// 删除借款信息
export function delLoansInfo(id) {
  return request({
    url: '/loans/LoansInfo/' + id,
    method: 'delete'
  })
}

// 导出借款信息
export function exportLoansInfo(query) {
  return request({
    url: '/loans/LoansInfo/export',
    method: 'get',
    params: query
  })
}
export function batchCheck(data) {
  return request({
    url: '/loans/LoansInfo/batchCheck',
    method: 'post',
    data: data
  })
}
