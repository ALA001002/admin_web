import request from '@/utils/request'

// 查询发币列表
export function listSymbolCoin(query) {
  return request({
    url: '/ico/symbolCoin/list',
    method: 'get',
    params: query
  })
}

// 查询发币详细
export function getSymbolCoin(id) {
  return request({
    url: '/ico/symbolCoin/' + id,
    method: 'get'
  })
}

// 新增发币
export function addSymbolCoin(data) {
  return request({
    url: '/ico/symbolCoin',
    method: 'post',
    data: data
  })
}

// 修改发币
export function updateSymbolCoin(data) {
  return request({
    url: '/ico/symbolCoin',
    method: 'put',
    data: data
  })
}

// 删除发币
export function delSymbolCoin(id) {
  return request({
    url: '/ico/symbolCoin/' + id,
    method: 'delete'
  })
}

// 导出发币
export function exportSymbolCoin(query) {
  return request({
    url: '/ico/symbolCoin/export',
    method: 'get',
    params: query
  })
}