import request from '@/utils/request'
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
