import request from '@/utils/request'

// 查询三方支付订单表列表
export function listOrder(query) {
  return request({
    url: '/pay/order/list',
    method: 'get',
    params: query
  })
}

// 查询三方支付订单表详细
export function getOrder(id) {
  return request({
    url: '/pay/order/' + id,
    method: 'get'
  })
}

// 新增三方支付订单表
export function addOrder(data) {
  return request({
    url: '/pay/order',
    method: 'post',
    data: data
  })
}

// 修改三方支付订单表
export function updateOrder(data) {
  return request({
    url: '/pay/order',
    method: 'put',
    data: data
  })
}

// 删除三方支付订单表
export function delOrder(id) {
  return request({
    url: '/pay/order/' + id,
    method: 'delete'
  })
}

// 导出三方支付订单表
export function exportOrder(query) {
  return request({
    url: '/pay/order/export',
    method: 'get',
    params: query
  })
}