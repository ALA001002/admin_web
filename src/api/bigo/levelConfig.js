import request from '@/utils/request'

// 查询用户等级列表
export function listConfig(query) {
  return request({
    url: '/level/config/list',
    method: 'get',
    params: query
  })
}

// 查询用户等级详细
export function getConfig(id) {
  return request({
    url: '/level/config/' + id,
    method: 'get'
  })
}

// 新增用户等级
export function addConfig(data) {
  return request({
    url: '/level/config',
    method: 'post',
    data: data
  })
}

// 修改用户等级
export function updateConfig(data) {
  return request({
    url: '/level/config',
    method: 'put',
    data: data
  })
}

// 删除用户等级
export function delConfig(id) {
  return request({
    url: '/level/config/' + id,
    method: 'delete'
  })
}

// 导出用户等级
export function exportConfig(query) {
  return request({
    url: '/level/config/export',
    method: 'get',
    params: query
  })
}