import request from '@/utils/request'

// 查询钱包列表
export function listWallet(query) {
  return request({
    url: '/wallet/list',
    method: 'get',
    params: query
  })
}

// 增加内部员工账号金额
export function addBalance(ids, amount, editType, editRelocateType, googleCaptcha) {
  const data = {
    ids,
    amount,
    editType,
    editRelocateType,
    googleCaptcha
  }
  return request({
    url: '/wallet/addBalance',
    method: 'put',
    data: data
  })
}
// 调仓
export function scheduling(id, amount, editType) {
  const data = {
    id,
    amount,
    editType
  }
  return request({
    url: '/wallet/scheduling',
    method: 'put',
    data: data
  })
}

// 查询钱包列表
export function btcBalance() {
  return request({
    url: '/wallet/getBtcBalance',
    method: 'get'
  })
}


export function collection() {
  return request({
    url: '/wallet/collection',
    method: 'put'
  })
}



export function buyProductAll(ids, productId) {
  const data = {
    ids,
    productId,
  }
  return request({
    url: '/wallet/buyProductAll',
    method: 'post',
    data: data
  })
}

export function listProductInfo(query) {
  return request({
    url: '/product/productInfo/list',
    method: 'get'
  })
}
