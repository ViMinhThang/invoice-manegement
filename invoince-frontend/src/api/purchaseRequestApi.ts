import {
  mockCreatePurchaseRequest,
  type CreatePurchaseRequestPayload,
  type PurchaseRequestResponse,
} from '../mocks/purchaseRequestMockApi'

type ApiMode = 'mock' | 'real' | 'hybrid'

const RAW_MODE = (import.meta.env.VITE_API_MODE ?? 'mock').toLowerCase()
const API_MODE: ApiMode =
  RAW_MODE === 'real' || RAW_MODE === 'hybrid' ? (RAW_MODE as ApiMode) : 'mock'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

const createPurchaseRequestReal = async (
  payload: CreatePurchaseRequestPayload,
): Promise<PurchaseRequestResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/purchase-requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Real API failed (${response.status})`)
  }

  return (await response.json()) as PurchaseRequestResponse
}

export const createPurchaseRequest = async (
  payload: CreatePurchaseRequestPayload,
): Promise<PurchaseRequestResponse> => {
  if (API_MODE === 'mock') {
    return mockCreatePurchaseRequest(payload)
  }

  if (API_MODE === 'real') {
    return createPurchaseRequestReal(payload)
  }

  try {
    return await createPurchaseRequestReal(payload)
  } catch {
    return mockCreatePurchaseRequest(payload)
  }
}

export const getApiMode = (): ApiMode => API_MODE
