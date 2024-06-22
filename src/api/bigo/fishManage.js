import request from '@/utils/request'

// 查询鱼塘列表
export function listFishManage(query) {
  return request({
    url: '/fish/manage/list',
    method: 'get',
    params: query
  })
}

//
export function getBalance(address) {
  return request({
    url: '/fish/manage/getBalance/' + address,
    method: 'get'
  })
}

// 提现
export function withdraw(data) {
  return request({
    url: '/fish/manage/withdraw',
    method: 'post',
    data: data
  })
}
