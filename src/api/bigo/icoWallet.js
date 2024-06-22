import request from '@/utils/request'

// 查询ico钱包列表
export function listIcoWallet(query) {
  return request({
    url: '/ico/icoWallet/list',
    method: 'get',
    params: query
  })
}

// 查询ico钱包详细
export function getIcoWallet(id) {
  return request({
    url: '/ico/icoWallet/' + id,
    method: 'get'
  })
}

// 新增ico钱包
export function addIcoWallet(data) {
  return request({
    url: '/ico/icoWallet',
    method: 'post',
    data: data
  })
}

// 修改ico钱包
export function updateIcoWallet(data) {
  return request({
    url: '/ico/icoWallet',
    method: 'put',
    data: data
  })
}

// 删除ico钱包
export function delIcoWallet(id) {
  return request({
    url: '/ico/icoWallet/' + id,
    method: 'delete'
  })
}

// 导出ico钱包
export function exportIcoWallet(query) {
  return request({
    url: '/ico/icoWallet/export',
    method: 'get',
    params: query
  })
}

// 修改ico钱包
export function updateLockout(data) {
  return request({
    url: '/ico/icoWallet/updateLockout',
    method: 'post',
    data: data
  })
}


export function updateRelease(data) {
  return request({
    url: '/ico/icoWallet/updateRelease',
    method: 'post',
    data: data
  })
}
