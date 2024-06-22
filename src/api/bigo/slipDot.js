import request from '@/utils/request'

// 查询滑点列表
export function listSlipDot(query) {
  return request({
    url: '/slipdot/list',
    method: 'get',
    params: query
  })
}

// 新建滑点
export function addSlipDot(symbol, adjustPrice) {
  const data = {
    symbol,
    adjustPrice
  }
  return request({
    url: '/slipdot/add',
    method: 'post',
    data: data
  })
}

// 删除滑点
export function delSlipDot(id) {
  const data = {
    id
  }
  return request({
    url: '/slipdot/del',
    method: 'put',
    data: data
  })
}

// 开始滑点
export function startSlipDot(id) {
  const data = {
    id
  }
  return request({
    url: '/slipdot/startSlipDot',
    method: 'put',
    data: data
  })
}

// 停止滑点
export function stopSlipDot(id) {
  const data = {
    id
  }
  return request({
    url: '/slipdot/stopSlipDot',
    method: 'put',
    data: data
  })
}