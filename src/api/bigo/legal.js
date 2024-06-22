import request from '@/utils/request'

// 查询法币列表
export function listLegalCurrency(query) {
  return request({
    url: '/legalCurrency/list',
    method: 'get',
    params: query
  })
}

// 新增
export function addLegal(data) {
  return request({
    url: '/legalCurrency/addLegal',
    method: 'post',
    data: data
  })
}

// 修改
export function updateLegal(data) {
  return request({
    url: '/legalCurrency/updateLegal',
    method: 'put',
    data: data
  })
}

// 删除法币
export function delLegal(id) {
  return request({
    url: '/legalCurrency/' + id,
    method: 'delete'
  })
}

