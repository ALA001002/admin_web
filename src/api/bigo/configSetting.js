import request from '@/utils/request'


// 新增配置
export function updateConfigSetting(data) {
  return request({
    url: '/configSetting/updateConfigSetting',
    method: 'post',
    data: data
  })
}

export function getConfigSetting() {
  return request({
    url: '/configSetting/getConfigSetting',
    method: 'get'
  })
}
