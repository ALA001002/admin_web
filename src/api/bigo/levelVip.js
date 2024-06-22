import request from '@/utils/request'

// 查询vip等级返佣列表
export function listLevelVip(query) {
  return request({
    url: '/level/levelVip/list',
    method: 'get',
    params: query
  })
}

export function levelConfigList(query) {
  return request({
    url: '/level/config/list',
    method: 'get',
    params: query
  })
}

// 查询vip等级返佣详细
export function getLevelVip(id) {
  return request({
    url: '/level/levelVip/' + id,
    method: 'get'
  })
}

// 新增vip等级返佣
export function addLevelVip(data) {
  return request({
    url: '/level/levelVip',
    method: 'post',
    data: data
  })
}

// 修改vip等级返佣
export function updateLevelVip(data) {
  return request({
    url: '/level/levelVip',
    method: 'put',
    data: data
  })
}

// 删除vip等级返佣
export function delLevelVip(id) {
  return request({
    url: '/level/levelVip/' + id,
    method: 'delete'
  })
}

// 导出vip等级返佣
export function exportLevelVip(query) {
  return request({
    url: '/level/levelVip/export',
    method: 'get',
    params: query
  })
}
