import request from '@/utils/request'

// 查询提币列表
export function listWithdraw(query) {
  return request({
    url: '/withdraw/list',
    method: 'get',
    params: query
  })
}


// 查询审核记录
export function auditRecord(query) {
  return request({
    url: '/withdraw/auditRecord',
    method: 'get',
    params: query
  })
}

// 线下打款
export function offlinePay(data) {
  return request({
    url: '/withdraw/offlinePay',
    method: 'post',
    data: data
  })
}

// 用户提币审核
export function checkWithdraw(data) {
  return request({
    url: '/withdraw/checkWithdraw',
    method: 'put',
    data: data
  })
}

//批量审核
export function batchCheckWithdraw(data) {
  return request({
    url: '/withdraw/batchCheckWithdraw',
    method: 'put',
    data: data
  })
}
// 查询沖币列表
export function listRecharge(query) {
  return request({
    url: '/withdraw/listRecharge',
    method: 'get',
    params: query
  })
}

// 用户充值审核
export function checkRecharge(id, checkStatus,error) {
  const data = {
    id,
    checkStatus,
    error
  }
  return request({
    url: '/withdraw/checkRecharge',
    method: 'put',
    data: data
  })
}

//批量审核
export function batchCheckRecharge(ids, checkStatus,error) {
  const data = {
    ids,
    checkStatus,
    error
  }
  return request({
    url: '/withdraw/batchCheckRecharge/',
    method: 'put',
    data: data
  })
}

//批量审核
export function agentPayWithdraw(data) {
  return request({
    url: '/withdraw/agentPayWithdraw/',
    method: 'post',
    data: data
  })
}


// 添加日期范围
/*export function addWithdrawDateRange(params, dateRange, auditDateRange) {
  var search = params;
  search.beginTime = "";
  search.endTime = "";
  if (null != dateRange && '' != dateRange) {
    search.beginTime = this.dateRange[0];
    search.endTime = this.dateRange[1];
  }
  search.auditBeginTime = "";
  search.auditEndTime = "";
  if (null != auditDateRange && '' != auditDateRange) {
    search.auditBeginTime = this.auditDateRange[0];
    search.auditEndTime = this.auditDateRange[1];
  }
  return search;
}*/

