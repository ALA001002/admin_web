import request from '@/utils/request'

// 查询借款门槛列表
export function listLoansThreshold(query) {
  return request({
    url: '/loans/LoansThreshold/list',
    method: 'get',
    params: query
  })
}

// 查询借款门槛详细
export function getLoansThreshold(id) {
  return request({
    url: '/loans/LoansThreshold/' + id,
    method: 'get'
  })
}

// 新增借款门槛
export function addLoansThreshold(data) {
  return request({
    url: '/loans/LoansThreshold',
    method: 'post',
    data: data
  })
}

// 修改借款门槛
export function updateLoansThreshold(data) {
  return request({
    url: '/loans/LoansThreshold',
    method: 'put',
    data: data
  })
}

// 删除借款门槛
export function delLoansThreshold(id) {
  return request({
    url: '/loans/LoansThreshold/' + id,
    method: 'delete'
  })
}

// 导出借款门槛
export function exportLoansThreshold(query) {
  return request({
    url: '/loans/LoansThreshold/export',
    method: 'get',
    params: query
  })
}