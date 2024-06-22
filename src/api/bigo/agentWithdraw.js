import request from '@/utils/request'

// 查询提币列表
export function listWithdraw(query) {
  return request({
    url: '/agentWithdraw/list',
    method: 'get',
    params: query
  })
}

// 用户提币审核
export function checkWithdraw(id, status,hash) {
  const data = {
    id,
    status,
    hash
  }
  return request({
    url: '/agentWithdraw/checkWithdraw',
    method: 'put',
    data: data
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



