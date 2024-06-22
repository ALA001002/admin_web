import request from '@/utils/request'

// 查询限时币种配置列表
export function listTimeCurrency(query) {
  return request({
    url: '/contract/timeCurrency/list',
    method: 'get',
    params: query
  })
}

// 查询限时币种配置详细
export function getTimeCurrency(id) {
  return request({
    url: '/contract/timeCurrency/' + id,
    method: 'get'
  })
}

// 新增限时币种配置
export function addTimeCurrency(data) {
  return request({
    url: '/contract/timeCurrency',
    method: 'post',
    data: data
  })
}

// 修改限时币种配置
export function updateTimeCurrency(data) {
  return request({
    url: '/contract/timeCurrency',
    method: 'put',
    data: data
  })
}

// 删除限时币种配置
export function delTimeCurrency(id) {
  return request({
    url: '/contract/timeCurrency/' + id,
    method: 'delete'
  })
}

// 导出限时币种配置
export function exportTimeCurrency(query) {
  return request({
    url: '/contract/timeCurrency/export',
    method: 'get',
    params: query
  })
}