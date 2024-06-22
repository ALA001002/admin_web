import request from '@/utils/request'

// 查询OTC订单列表
export function listOrder(query) {
  return request({
    url: '/otc/order/list',
    method: 'get',
    params: query
  })
}

// 订单状态修改
export function changeOrderStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/otc/order/changeStatus',
    method: 'put',
    data: data
  })
}

// 查询OTC申诉列表
export function listAppeal(query) {
  return request({
    url: '/otc/appeal/list',
    method: 'get',
    params: query
  })
}

// 订单状态修改
export function changeAppealStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/otc/appeal/changeStatus',
    method: 'put',
    data: data
  })
}


