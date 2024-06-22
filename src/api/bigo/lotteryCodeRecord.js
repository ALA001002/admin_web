import request from '@/utils/request'

// 查询抽奖码使用记录列表
export function listLotteryCodeRecord(query) {
  return request({
    url: '/luck/lotteryCodeRecord/list',
    method: 'get',
    params: query
  })
}

// 查询抽奖码使用记录详细
export function getLotteryCodeRecord(id) {
  return request({
    url: '/luck/lotteryCodeRecord/' + id,
    method: 'get'
  })
}

// 新增抽奖码使用记录
export function addLotteryCodeRecord(data) {
  return request({
    url: '/luck/lotteryCodeRecord',
    method: 'post',
    data: data
  })
}

// 修改抽奖码使用记录
export function updateLotteryCodeRecord(data) {
  return request({
    url: '/luck/lotteryCodeRecord',
    method: 'put',
    data: data
  })
}

// 删除抽奖码使用记录
export function delLotteryCodeRecord(id) {
  return request({
    url: '/luck/lotteryCodeRecord/' + id,
    method: 'delete'
  })
}

// 导出抽奖码使用记录
export function exportLotteryCodeRecord(query) {
  return request({
    url: '/luck/lotteryCodeRecord/export',
    method: 'get',
    params: query
  })
}