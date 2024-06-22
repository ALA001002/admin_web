import request from '@/utils/request'

// 查询充值奖励列表
export function listReward(query) {
  return request({
    url: '/reward/reward/list',
    method: 'get',
    params: query
  })
}

// 查询充值奖励详细
export function getReward(id) {
  return request({
    url: '/reward/reward/' + id,
    method: 'get'
  })
}

// 新增充值奖励
export function addReward(data) {
  return request({
    url: '/reward/reward',
    method: 'post',
    data: data
  })
}

// 修改充值奖励
export function updateReward(data) {
  return request({
    url: '/reward/reward',
    method: 'put',
    data: data
  })
}

// 删除充值奖励
export function delReward(id) {
  return request({
    url: '/reward/reward/' + id,
    method: 'delete'
  })
}

// 导出充值奖励
export function exportReward(query) {
  return request({
    url: '/reward/reward/export',
    method: 'get',
    params: query
  })
}