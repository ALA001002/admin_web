import request from '@/utils/request'

// 查询提币列表
export function listOrders(query) {
  return request({
    url: '/api/periodOrder/orders',
    method: 'post',
    data: query
  })
}
export function listCurrentOrders(query) {
  return request({
    url: '/api/periodOrder/currentOrders',
    method: 'post',
    data: query
  })
}
export function statics(query) {
  return request({
    url: '/api/assetLogs/statics',
    method: 'post',
    data: query
  })
}
export function userStats(query) {
  return request({
    url: '/api/assetLogs/userStats',
    method: 'post',
    data: query
  })
}
export function queryPeriod(unit,symbol) {
  return request({
    url: '/api/periodOrder/current',
    method: 'post',
    data: {unit,symbol}
  })
}

export function queryControl(queryParam) {
  return request({
    url: '/api/periodConfig/handleControl/list',
    method: 'post',
    data: queryParam
  })
}
export function listConfig(queryParam) {
  return request({
    url: '/api/periodConfig/config/list',
    method: 'post',
    data: queryParam
  })
}
export function saveGlobalControl(queryParam) {
  return request({
    url: '/api/periodConfig/globalControl/save',
    method: 'post',
    data: queryParam
  })
}

export function globalControlCurrent() {
  return request({
    url: '/api/periodConfig/globalControl/current',
    method: 'post',
    data: {}
  })
}
export function updateControl(symbol,unit,period,smallOrBig,oddOrEven,status) {
  return request({
    url: '/api/periodConfig/handleControl/save',
    method: 'post',
    data: {symbol,unit,period,smallOrBig,oddOrEven,status,delFlag:false}
  })
}
export function updateConfig(data) {
  return request({
    url: '/api/periodConfig/config/save',
    method: 'post',
    data: data
  })
}
export function stat(unit,symbol,period) {
  return request({
    url: '/api/periodOrder/stat',
    method: 'post',
    data: {unit,symbol,period}
  })
}
export function history(queryParam) {
  return request({
    url: '/api/periodOrder/historys',
    method: 'post',
    data: queryParam
  })
}
export function sync(dayNo) {
  return request({
    url: '/api/periodConfig/sync',
    method: 'post',
    data: {dayNo}
  })
}
export function saveBigControl(symbol,unit,openFlag,maxPrice) {
  return request({
    url: '/api/periodConfig/bigConfig/save',
    method: 'post',
    data: {symbol,unit,maxPrice,openFlag}
  })
}

export function queryBigControl(params) {
  return request({
    url: '/api/periodConfig/bigConfig/query',
    method: 'post',
    data: {...params}
  })
}
export function collect(rowId) {
  return request({
    url: '/transaction/collect',
    method: 'post',
    data: {rowId}
  })
}
export function updateScore(address,uid,amount,fromAddress,txId) {
  return request({
    url: '/api/wallet/trc20/notify',
    method: 'post',
    data: {
      address,
      "balance": amount,
      fromAddress,
      "method": "changeBalance",
      "symbol": "USDT",
      "test": false,
      txId,
      "type": 1,
      uid
    }
  })
}
export function userStat(query) {
  return request({
    url: '/api/periodConfig/stat',
    method: 'post',
    data: query
  })
}


export function recharges(queryParam) {
  return request({
    url: '/transaction/recharges',
    method: 'post',
    data: queryParam
  })
}
export function withdraws(queryParam) {
  return request({
    url: '/transaction/withdraws',
    method: 'post',
    data: queryParam
  })
}
