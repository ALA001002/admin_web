import request from '@/utils/request'

// 查询限时合约周期信息列表
export function listPeriod(query) {
  return request({
    url: '/contract/period/list',
    method: 'get',
    params: query
  })
}

// 查询限时合约周期信息详细
export function getPeriod(id) {
  return request({
    url: '/contract/period/' + id,
    method: 'get'
  })
}

// 新增限时合约周期信息
export function addPeriod(data) {
  return request({
    url: '/contract/period',
    method: 'post',
    data: data
  })
}

// 修改限时合约周期信息
export function updatePeriod(data) {
  return request({
    url: '/contract/period',
    method: 'put',
    data: data
  })
}

// 删除限时合约周期信息
export function delPeriod(id) {
  return request({
    url: '/contract/period/' + id,
    method: 'delete'
  })
}

// 导出限时合约周期信息
export function exportPeriod(query) {
  return request({
    url: '/contract/period/export',
    method: 'get',
    params: query
  })
}