import request from '@/utils/request'

export async function queryProse(): Promise<any> {
  return request('/project/prose')
}

export async function queryInbound(data): Promise<any> {
  return request.post('/inbound_notification/search', data)
}

export async function login(username: string, password: string): Promise<any> {
  return request.post('/login', { username, password })
}

export async function queryInboundDetail(data): Promise<any> {
  return request.post('/inbound_notification/detail', data)
}

export async function uploadPhoto(data): Promise<any> {
  return request.post('/upload_photo', data)
}

export async function inboundScan(data): Promise<any> {
  return request.post('/inbound/scan', data)
}

export async function inboundCommit(data): Promise<any> {
  return request.post('/inbound/commit', data)
}

export async function queryOutbound(data): Promise<any> {
  return request.post('/outbound_notification/search', data)
}

export async function queryOutboundDetail(data): Promise<any> {
  return request.post('/outbound_notification/detail', data)
}

export async function outboundScan(data): Promise<any> {
  return request.post('/outbound/scan', data)
}

export async function outboundCommit(data): Promise<any> {
  return request.post('/outbound/commit', data)
}

export async function outboundAdd(data): Promise<any> {
  return request.post('/stock/add_stock_outbound_info', data)
}

export async function outboundRemove(data): Promise<any> {
  return request.post('/stock/delete_stock_outbound_info', data)
}
