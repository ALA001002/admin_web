import request from '@/utils/request'

// 查询理财产品订单列表
export function listProductOrder(query) {
  return request({
    url: '/product/productOrder/list',
    method: 'get',
    params: query
  })
}

// 查询理财产品订单详细
export function getProductOrder(id) {
  return request({
    url: '/product/productOrder/' + id,
    method: 'get'
  })
}

// 新增理财产品订单
export function addProductOrder(data) {
  return request({
    url: '/product/productOrder',
    method: 'post',
    data: data
  })
}

// 修改理财产品订单
export function updateProductOrder(data) {
  return request({
    url: '/product/productOrder',
    method: 'put',
    data: data
  })
}

// 删除理财产品订单
export function delProductOrder(id) {
  return request({
    url: '/product/productOrder/' + id,
    method: 'delete'
  })
}

// 导出理财产品订单
export function exportProductOrder(query) {
  return request({
    url: '/product/productOrder/export',
    method: 'get',
    params: query
  })
}

// 删除理财产品订单
export function stopRelease(id) {
  return request({
    url: '/product/productOrder/stopRelease/' + id,
    method: 'get'
  })
}



// 批量中断理财订单
export function batchStopRelease(ids,googleCaptcha) {
  const data = {
    ids,
    googleCaptcha
  }
  return request({
    url: '/product/productOrder/batchStopRelease',
    method: 'post',
    data: data
  })
}
