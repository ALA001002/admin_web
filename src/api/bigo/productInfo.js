import request from '@/utils/request'

// 查询理财产品信息列表
export function listProductInfo(query) {
  return request({
    url: '/product/productInfo/list',
    method: 'get',
    params: query
  })
}


export function listProductType(query) {
  return request({
    url: '/product/type/list',
    method: 'get',
    params: query
  })
}

// 查询理财产品信息详细
export function getProductInfo(id) {
  return request({
    url: '/product/productInfo/' + id,
    method: 'get'
  })
}

// 新增理财产品信息
export function addProductInfo(data) {
  return request({
    url: '/product/productInfo',
    method: 'post',
    data: data
  })
}

// 修改理财产品信息
export function updateProductInfo(data) {
  return request({
    url: '/product/productInfo',
    method: 'put',
    data: data
  })
}

// 删除理财产品信息
export function delProductInfo(id) {
  return request({
    url: '/product/productInfo/' + id,
    method: 'delete'
  })
}

// 导出理财产品信息
export function exportProductInfo(query) {
  return request({
    url: '/product/productInfo/export',
    method: 'get',
    params: query
  })
}
