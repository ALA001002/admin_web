import request from '@/utils/request'

// 查询智能持仓产品列表
export function listProduct(query) {
  return request({
    url: '/holdings/product/list',
    method: 'get',
    params: query
  })
}

// 查询智能持仓产品详细
export function getProduct(id) {
  return request({
    url: '/holdings/product/' + id,
    method: 'get'
  })
}

// 新增智能持仓产品
export function addProduct(data) {
  return request({
    url: '/holdings/product',
    method: 'post',
    data: data
  })
}

// 修改智能持仓产品
export function updateProduct(data) {
  return request({
    url: '/holdings/product',
    method: 'put',
    data: data
  })
}

// 删除智能持仓产品
export function delProduct(id) {
  return request({
    url: '/holdings/product/' + id,
    method: 'delete'
  })
}

// 导出智能持仓产品
export function exportProduct(query) {
  return request({
    url: '/holdings/product/export',
    method: 'get',
    params: query
  })
}