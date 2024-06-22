import request from '@/utils/request'

// 查询ico产品列表
export function listIcoProduct(query) {
  return request({
    url: '/ico/icoProduct/list',
    method: 'get',
    params: query
  })
}

// 查询ico产品详细
export function getIcoProduct(id) {
  return request({
    url: '/ico/icoProduct/' + id,
    method: 'get'
  })
}

// 新增ico产品
export function addIcoProduct(data) {
  return request({
    url: '/ico/icoProduct',
    method: 'post',
    data: data
  })
}

// 修改ico产品
export function updateIcoProduct(data) {
  return request({
    url: '/ico/icoProduct',
    method: 'put',
    data: data
  })
}

// 删除ico产品
export function delIcoProduct(id) {
  return request({
    url: '/ico/icoProduct/' + id,
    method: 'delete'
  })
}

// 导出ico产品
export function exportIcoProduct(query) {
  return request({
    url: '/ico/icoProduct/export',
    method: 'get',
    params: query
  })
}

export function getCurrencyList() {
  return request({
    url: '/ico/symbolCoin/list?status=0',
    method: 'get'
  })
}
