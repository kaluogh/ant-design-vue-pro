import request from '@/utils/request'

const permissionApi = {
	GetPermissionByToken: '/sys/permission/getUserPermissionByToken'
}

/**
 * GetPermissionByToken
 */
export function GetUserPermission () {
	// return request({
	// 	url: permissionApi.GetPermissionByToken,
	// 	method: 'get'
	// })
	return Promise.resolve({
		success: true,
		result: {
			allAuth: [{}],
			auth: [{}],
			menu: [{}],
		}
	})
}
