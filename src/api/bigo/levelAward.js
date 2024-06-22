import request from '@/utils/request'

// 查询等级赠送奖励列表
export function listAward(query) {
  return request({
    url: '/level/award/list',
    method: 'get',
    params: query
  })
}

// 查询等级赠送奖励详细
export function getAward(id) {
  return request({
    url: '/level/award/' + id,
    method: 'get'
  })
}

// 新增等级赠送奖励
export function addAward(data) {
  return request({
    url: '/level/award',
    method: 'post',
    data: data
  })
}

// 修改等级赠送奖励
export function updateAward(data) {
  return request({
    url: '/level/award',
    method: 'put',
    data: data
  })
}

// 删除等级赠送奖励
export function delAward(id) {
  return request({
    url: '/level/award/' + id,
    method: 'delete'
  })
}

// 导出等级赠送奖励
export function exportAward(query) {
  return request({
    url: '/level/award/export',
    method: 'get',
    params: query
  })
}