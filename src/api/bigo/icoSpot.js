import request from '@/utils/request'

// 查询现货交易记录列表
export function listSpot(query) {
  return request({
    url: '/ico/spot/list',
    method: 'get',
    params: query
  })
}

// 查询现货交易记录详细
export function getSpot(id) {
  return request({
    url: '/ico/spot/' + id,
    method: 'get'
  })
}

// 新增现货交易记录
export function addSpot(data) {
  return request({
    url: '/ico/spot',
    method: 'post',
    data: data
  })
}

// 修改现货交易记录
export function updateSpot(data) {
  return request({
    url: '/ico/spot',
    method: 'put',
    data: data
  })
}

// 删除现货交易记录
export function delSpot(id) {
  return request({
    url: '/ico/spot/' + id,
    method: 'delete'
  })
}

// 导出现货交易记录
export function exportSpot(query) {
  return request({
    url: '/ico/spot/export',
    method: 'get',
    params: query
  })
}