import request from '@/utils/request'

export function listAssetLog(query) {
  return request({
    url: '/assetlog/list',
    method: 'get',
    params: query
  })
}


export function getTotalForm(query) {
  return request({
    url: '/assetlog/getTotalForm',
    method: 'get',
    params: query
  })
}

// 查询部门列表
export function childrenAssetLog(query) {
  return request({
    url: '/agent/childrenAssetLog',
    method: 'get',
    params: query
  })
}


export function exportBigoUser(query) {
  return request({
    url: '/assetlog/export',
    method: 'get',
    params: query
  })
}
