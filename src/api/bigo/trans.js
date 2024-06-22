import request from '@/utils/request'

// 查询代付列表
export function listTrans(query) {
  return request({
    url: '/pay/trans/list',
    method: 'get',
    params: query
  })
}

// 查询代付详细
export function getTrans(id) {
  return request({
    url: '/pay/trans/' + id,
    method: 'get'
  })
}

// 新增代付
export function addTrans(data) {
  return request({
    url: '/pay/trans',
    method: 'post',
    data: data
  })
}

// 修改代付
export function updateTrans(data) {
  return request({
    url: '/pay/trans',
    method: 'put',
    data: data
  })
}



// 删除代付
export function delTrans(id) {
  return request({
    url: '/pay/trans/' + id,
    method: 'delete'
  })
}

// 导出代付
export function exportTrans(query) {
  return request({
    url: '/pay/trans/export',
    method: 'get',
    params: query
  })
}

export function getPassageList() {
  return request({
    url: '/pay/passage/list',
    method: 'get',
  })
}

// 批量审核代付
export function batchCheckTrans(data) {
  return request({
    url: '/pay/trans/batchCheckTrans',
    method: 'put',
    data: data
  })
}