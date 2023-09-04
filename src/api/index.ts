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
