import request from '@/utils/request'

// 查询滑点配置列表
export function listSlipConfig(query) {
  return request({
    url: '/marketsituation/slipConfig/list',
    method: 'get',
    params: query
  })
}

// 查询滑点配置详细
export function getSlipConfig(id) {
  return request({
    url: '/marketsituation/slipConfig/getConfig/' + id,
    method: 'get'
  })
}

export function delSlipConfig(id) {
  return request({
    url: '/marketsituation/slipConfig/remove/' + id,
    method: 'delete'
  })
}

// 新增滑点配置
export function addSlipConfig(data) {
  return request({
    url: '/marketsituation/slipConfig/save',
    method: 'post',
    data: data
  })
}

// 修改滑点配置
export function updateSlipConfig(data) {
  return request({
    url: '/marketsituation/slipConfig/edit',
    method: 'post',
    data: data
  })
}

// 修改滑点配置
export function updateStatus(id, openFlagInter) {
  const data = {
      id:id,
      openFlagInter:openFlagInter
    }
  return request({
    url: '/marketsituation/slipConfig/updateStatus',
    method: 'post',
    data: data
  })
}

export function listKlineConfig(query) {
  return request({
    url: '/bigo/kline/list',
    method: 'get',
    params: query
  })
}

// 查询滑点配置详细
export function getKlineConfig(symbol) {
  return request({
    url: '/bigo/kline/get/' + symbol,
    method: 'get'
  })
}

// 新增滑点配置
export function saveKlineConfig(data) {
  return request({
    url: '/bigo/kline/save',
    method: 'post',
    data: data
  })
}
// 修改滑点配置
export function editKlineConfig(data) {
  return request({
    url: '/bigo/kline/edit',
    method: 'put',
    data: data
  })
}
