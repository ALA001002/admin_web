import request from '@/utils/request'

// 查询代理商列表
export function listAgent(query) {
  return request({
    url: '/agent/list',
    method: 'get',
    params: query
  })
}

// 查询代理商下级列表
export function childrenList(query) {
  return request({
    url: '/agent/childrenList',
    method: 'get',
    params: query
  })
}

// 统计
export function totalStatistics(query) {
  return request({
    url: '/agent/totalStatistics',
    method: 'get',
    params: query
  })
}

// 新增代理商
export function addAgent(data) {
  return request({
    url: '/agent/addAgent',
    method: 'post',
    data: data
  })
}

// 新增代理商
export function updateAgent(data) {
  return request({
    url: '/agent/updateAgent',
    method: 'put',
    data: data
  })
}

// 代理商状态修改
export function changeStatus(agentId, status) {
  const data = {
    agentId,
    status
  }
  return request({
    url: '/agent/changeStatus',
    method: 'put',
    data: data
  })
}

// 查询资产变更列表
export function listAssetLog(query) {
  return request({
    url: '/agent/assetlog/list',
    method: 'get',
    params: query
  })
}


// 提现
export function withdraw(data) {
  return request({
    url: '/agent/withdraw',
    method: 'post',
    data: data
  })
}

export function statistics(query) {
  return request({
    url: '/agent/statistics',
    method: 'get',
    params: query
  })
}

// 增加内部员工账号金额
export function recharge(uid, amount,currency, editType) {
  const data = {
    uid,
    amount,
    currency,
    editType
  }
  return request({
    url: '/wallet/addInsideBalance',
    method: 'put',
    data: data
  })
}



