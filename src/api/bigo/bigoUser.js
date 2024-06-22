import request from '@/utils/request'

// 查询用户列表
export function listBigoUser(query) {
  return request({
    url: '/bigouser/list',
    method: 'get',
    params: query
  })
}

export function authListBigoUser(query) {
  return request({
    url: '/bigouser/authList',
    method: 'get',
    params: query
  })
}

// 导出用户
export function exportBigoUser(query) {
  return request({
    url: '/bigouser/export',
    method: 'get',
    params: query
  })
}

export function childrenList(query) {
  return request({
    url: '/agent/childrenList',
    method: 'get',
    params: query
  })
}

// 用户状态修改
export function changeUserStatus(uid, status) {
  const data = {
    uid,
    status
  }
  return request({
    url: '/bigouser/changeStatus',
    method: 'put',
    data: data
  })
}

// 用户认证审核
export function checkAuthStatus(uid, authStatus) {
  const data = {
    uid,
    authStatus
  }
  return request({
    url: '/bigouser/checkAuthStatus',
    method: 'put',
    data: data
  })
}

// 设置邀请人
export function setParentUid(uid, parentUid) {
  const data = {
    uid,
    parentUid
  }
  return request({
    url: '/bigouser/setParentUid',
    method: 'put',
    data: data
  })
}


export function editParent(uid, newParentUid) {
  const data = {
    uid,
    newParentUid
  }
  return request({
    url: '/bigouser/editParent',
    method: 'put',
    data: data
  })
}


export function batchCheckAuthStatus(ids, authStatus, authRationale) {
  const data = {
    uids: ids,
    authStatus: authStatus,
    authRationale: authRationale
  }
  return request({
    url: '/bigouser/batchCheckAuthStatus',
    method: 'post',
    data: data
  })
}

export function batchEditUserStatus(uids, status) {
  const data = {
    uids: uids,
    status: status
  }
  return request({
    url: '/bigouser/batchEditUserStatus',
    method: 'post',
    data: data
  })
}



export function getBigoUser(uid) {
  return request({
    url: '/bigouser/getUser/'+uid,
    method: 'get'
  })
}



export function editUser(form) {
  return request({
    url: '/bigouser/editUser',
    method: 'put',
    data: form
  })
}


export function editUserStatus(form) {
  return request({
    url: '/bigouser/editUserStatus',
    method: 'put',
    data: form
  })
}

export function lowerList(query) {
  return request({
    url: '/bigouser/lowerList/',
    method: 'get',
    params: query
  })
}
