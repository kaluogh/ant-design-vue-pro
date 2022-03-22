import request from '@/utils/request'

const api = {
    user: '/user',
    role: '/role',
    service: '/service',
    permission: '/permission',
    permissionNoPager: '/permission/no-pager',
    orgTree: '/org/tree',
}

export default api

// post
export function postAction(url, parameter) {
    return axios({
        url: url,
        method: 'post',
        data: parameter,
    })
}

// post method= {post | put}
export function httpAction(url, parameter, method) {
    return axios({
        url: url,
        method: method,
        data: parameter
    })
}

//put
export function putAction(url, parameter) {
    return axios({
        url: url,
        method: 'put',
        data: parameter
    })
}

//get
export function getAction(url, parameter) {
    return axios({
        url: url,
        method: 'get',
        params: parameter
    })
}

//deleteAction
export function deleteAction(url, parameter) {
    return axios({
        url: url,
        method: 'delete',
        params: parameter
    })
}

export function getUserList(parameter) {
    return request({
        url: api.user,
        method: 'get',
        params: parameter,
    })
}

export function getRoleList(parameter) {
    return request({
        url: api.role,
        method: 'get',
        params: parameter,
    })
}

export function getServiceList(parameter) {
    return request({
        url: api.service,
        method: 'get',
        params: parameter,
    })
}

export function getPermissions(parameter) {
    return request({
        url: api.permissionNoPager,
        method: 'get',
        params: parameter,
    })
}

export function getOrgTree(parameter) {
    return request({
        url: api.orgTree,
        method: 'get',
        params: parameter,
    })
}

// id == 0 add     post
// id != 0 update  put
export function saveService(parameter) {
    return request({
        url: api.service,
        method: parameter.id === 0 ? 'post' : 'put',
        data: parameter,
    })
}

export function saveSub(sub) {
    return request({
        url: '/sub',
        method: sub.id === 0 ? 'post' : 'put',
        data: sub,
    })
}

/**
 * 下载文件 用于excel导出
 * @param url
 * @param parameter
 * @returns {*}
 */
export function downFile(url, parameter) {
    return axios({
        url: url,
        params: parameter,
        method: 'get',
        responseType: 'blob'
    })
}

/**
 * 下载文件
 * @param url 文件路径
 * @param fileName 文件名
 * @param parameter
 * @returns {*}
 */
export function downloadFile(url, fileName, parameter) {
    return downFile(url, parameter).then((data) => {
        if (!data || data.size === 0) {
            Vue.prototype['$message'].warning('文件下载失败')
            return
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
            window.navigator.msSaveBlob(new Blob([data]), fileName)
        } else {
            let url = window.URL.createObjectURL(new Blob([data]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link) //下载完成移除元素
            window.URL.revokeObjectURL(url) //释放掉blob对象
        }
    })
}

/**
 * 文件上传 用于富文本上传图片
 * @param url
 * @param parameter
 * @returns {*}
 */
export function uploadAction(url, parameter) {
    return axios({
        url: url,
        data: parameter,
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data', // 文件上传
        },
        timeout: 5 * 60 * 1000
    })
}

/**
 * 获取文件服务访问路径
 * @param avatar
 * @param subStr
 * @returns {*}
 */
export function getFileAccessHttpUrl(avatar, subStr) {
    if (!subStr) subStr = 'http'
    try {
        if (avatar && avatar.startsWith(subStr)) {
            return avatar;
        } else {
            if (avatar && avatar.length > 0 && avatar.indexOf('[') == -1) {
                return window._CONFIG['staticDomainURL'] + "/" + avatar;
            }
        }
    } catch (err) {
        return
    }
}