import request from '@/utils/request'

// 查询钱包地址列表
export function listWalletAddress(query) {
  return request({
    url: '/wallet/walletAddress/list',
    method: 'get',
    params: query
  })
}

// 查询钱包地址详细
export function getWalletAddress(id) {
  return request({
    url: '/wallet/walletAddress/' + id,
    method: 'get'
  })
}

// 获取eth手续费
export function getGasPrice(id, uid) {
  return request({
    url: '/wallet/walletAddress/getGasPrice/' + id +'/'+uid,
    method: 'get'
  })
}


export function collection(id, gasPrice) {
  const data = {
    id: id,
    gasPrice: gasPrice
  }
  return request({
    url: '/wallet/walletAddress/collection',
    method: 'post',
    data: data
  })
}

// 导出钱包地址
export function exportWalletAddress(query) {
  return request({
    url: '/wallet/walletAddress/export',
    method: 'get',
    params: query
  })
}


export function manualScoring(id, fromAddress, hash, blockNum, rechargeNum) {
  const data = {
    id: id,
    fromAddress: fromAddress,
    hash: hash,
    blockNum: blockNum,
    rechargeNum: rechargeNum
  }
  return request({
    url: '/wallet/walletAddress/manualScoring',
    method: 'post',
    data: data
  })
}
/*

// 新增钱包地址
export function addWalletAddress(data) {
  return request({
    url: '/wallet/walletAddress',
    method: 'post',
    data: data
  })
}

// 修改钱包地址
export function updateWalletAddress(data) {
  return request({
    url: '/wallet/walletAddress',
    method: 'put',
    data: data
  })
}

// 删除钱包地址
export function delWalletAddress(id) {
  return request({
    url: '/wallet/walletAddress/' + id,
    method: 'delete'
  })
}

*/
