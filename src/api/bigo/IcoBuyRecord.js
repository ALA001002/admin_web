import request from '@/utils/request'

// 查询现货预售购买记录列表
export function listIcobuyRecord(query) {
  return request({
    url: '/ico/IcobuyRecord/list',
    method: 'get',
    params: query
  })
}

// 查询现货预售购买记录详细
export function getIcobuyRecord(id) {
  return request({
    url: '/ico/IcobuyRecord/' + id,
    method: 'get'
  })
}

// 新增现货预售购买记录
export function addIcobuyRecord(data) {
  return request({
    url: '/ico/IcobuyRecord',
    method: 'post',
    data: data
  })
}

// 修改现货预售购买记录
export function updateIcobuyRecord(data) {
  return request({
    url: '/ico/IcobuyRecord',
    method: 'put',
    data: data
  })
}

// 删除现货预售购买记录
export function delIcobuyRecord(id) {
  return request({
    url: '/ico/IcobuyRecord/' + id,
    method: 'delete'
  })
}

// 导出现货预售购买记录
export function exportIcobuyRecord(query) {
  return request({
    url: '/ico/IcobuyRecord/export',
    method: 'get',
    params: query
  })
}