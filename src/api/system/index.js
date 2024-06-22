import request from '@/utils/request'

// 查询公告列表
export function getIndexInfo(type) {
  return request({
    url: '/system/index/getIndexInfo?type='+type,
    method: 'get'
  })
}
