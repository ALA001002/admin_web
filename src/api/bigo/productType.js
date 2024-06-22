import request from '@/utils/request'

// 查询理财产品类型列表
export function listType(query) {
  return request({
    url: '/product/type/list',
    method: 'get',
    params: query
  })
}

// 查询理财产品类型详细
export function getType(id) {
  return request({
    url: '/product/type/' + id,
    method: 'get'
  })
}

// 新增理财产品类型
export function addType(data) {
  return request({
    url: '/product/type',
    method: 'post',
    data: data
  })
}

// 修改理财产品类型
export function updateType(data) {
  return request({
    url: '/product/type',
    method: 'put',
    data: data
  })
}

// 删除理财产品类型
export function delType(id) {
  return request({
    url: '/product/type/' + id,
    method: 'delete'
  })
}

// 导出理财产品类型
export function exportType(query) {
  return request({
    url: '/product/type/export',
    method: 'get',
    params: query
  })
}