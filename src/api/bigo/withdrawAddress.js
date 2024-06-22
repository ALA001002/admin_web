import request from '@/utils/request'

// 查询提现地址列表
export function listWithdrawAddress(query) {
  return request({
    url: '/wallet/withdrawAddress/list',
    method: 'get',
    params: query
  })
}

// 查询提现地址详细
export function getWithdrawAddress(id) {
  return request({
    url: '/wallet/withdrawAddress/' + id,
    method: 'get'
  })
}

// 新增提现地址
export function addWithdrawAddress(data) {
  return request({
    url: '/wallet/withdrawAddress',
    method: 'post',
    data: data
  })
}

// 修改提现地址
export function updateWithdrawAddress(data) {
  return request({
    url: '/wallet/withdrawAddress',
    method: 'put',
    data: data
  })
}

// 删除提现地址
export function delWithdrawAddress(id) {
  return request({
    url: '/wallet/withdrawAddress/' + id,
    method: 'delete'
  })
}

// 导出提现地址
export function exportWithdrawAddress(query) {
  return request({
    url: '/wallet/withdrawAddress/export',
    method: 'get',
    params: query
  })
}