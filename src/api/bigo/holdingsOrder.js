import request from '@/utils/request'

// 查询智能持仓订单列表
export function listOrder(query) {
  return request({
    url: '/holdings/order/list',
    method: 'get',
    params: query
  })
}

// 查询智能持仓订单详细
export function getOrder(id) {
  return request({
    url: '/holdings/order/' + id,
    method: 'get'
  })
}

// 新增智能持仓订单
export function addOrder(data) {
  return request({
    url: '/holdings/order',
    method: 'post',
    data: data
  })
}

// 修改智能持仓订单
export function updateOrder(data) {
  return request({
    url: '/holdings/order',
    method: 'put',
    data: data
  })
}

// 删除智能持仓订单
export function delOrder(id) {
  return request({
    url: '/holdings/order/' + id,
    method: 'delete'
  })
}

// 导出智能持仓订单
export function exportOrder(query) {
  return request({
    url: '/holdings/order/export',
    method: 'get',
    params: query
  })
}