import request from '@/utils/request'

// 查询奖池列表
export function listJackpot(query) {
  return request({
    url: '/luck/jackpot/list',
    method: 'get',
    params: query
  })
}

// 查询奖池详细
export function getJackpot(id) {
  return request({
    url: '/luck/jackpot/' + id,
    method: 'get'
  })
}

// 新增奖池
export function addJackpot(data) {
  return request({
    url: '/luck/jackpot',
    method: 'post',
    data: data
  })
}

// 修改奖池
export function updateJackpot(data) {
  return request({
    url: '/luck/jackpot',
    method: 'put',
    data: data
  })
}

// 删除奖池
export function delJackpot(id) {
  return request({
    url: '/luck/jackpot/' + id,
    method: 'delete'
  })
}

// 导出奖池
export function exportJackpot(query) {
  return request({
    url: '/luck/jackpot/export',
    method: 'get',
    params: query
  })
}

// 查询抽奖码列表
export function listLotteryCode(query) {
  return request({
    url: '/luck/lotteryCode/list',
    method: 'get',
    params: query
  })
}

// 查询抽奖码详细
export function getLotteryCode(id) {
  return request({
    url: '/luck/lotteryCode/' + id,
    method: 'get'
  })
}

// 新增抽奖码
export function addLotteryCode(data) {
  return request({
    url: '/luck/lotteryCode',
    method: 'post',
    data: data
  })
}

// 修改抽奖码
export function updateLotteryCode(data) {
  return request({
    url: '/luck/lotteryCode',
    method: 'put',
    data: data
  })
}

// 删除抽奖码
export function delLotteryCode(id) {
  return request({
    url: '/luck/lotteryCode/' + id,
    method: 'delete'
  })
}

// 导出抽奖码
export function exportLotteryCode(query) {
  return request({
    url: '/luck/lotteryCode/export',
    method: 'get',
    params: query
  })
}

// 查询中奖记录列表
export function listRecord(query) {
  return request({
    url: '/luck/record/list',
    method: 'get',
    params: query
  })
}

// 查询中奖记录详细
export function getRecord(id) {
  return request({
    url: '/luck/record/' + id,
    method: 'get'
  })
}

// 新增中奖记录
export function addRecord(data) {
  return request({
    url: '/luck/record',
    method: 'post',
    data: data
  })
}

// 修改中奖记录
export function updateRecord(data) {
  return request({
    url: '/luck/record',
    method: 'put',
    data: data
  })
}

// 删除中奖记录
export function delRecord(id) {
  return request({
    url: '/luck/record/' + id,
    method: 'delete'
  })
}

// 导出中奖记录
export function exportRecord(query) {
  return request({
    url: '/luck/record/export',
    method: 'get',
    params: query
  })
}
