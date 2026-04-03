import {
  mockGetInvoices,
  mockCreatePurchaseRequest,
  type CreatePurchaseRequestPayload,
  type InvoiceItem,
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
    let errorMessage = `Real API failed (${response.status})`
    try {
      const errorBody = (await response.json()) as { message?: string; error?: string }
      errorMessage = errorBody.message ?? errorBody.error ?? errorMessage
    } catch {
      // keep default message when response is not JSON
    }
    throw new Error(errorMessage)
  }

  return (await response.json()) as PurchaseRequestResponse
}

const getInvoicesReal = async (): Promise<InvoiceItem[]> => {
  const response = await fetch(`${API_BASE_URL}/api/invoices`)

  if (!response.ok) {
    let errorMessage = `Real API failed (${response.status})`
    try {
      const errorBody = (await response.json()) as { message?: string; error?: string }
      errorMessage = errorBody.message ?? errorBody.error ?? errorMessage
    } catch {
      // keep default message when response is not JSON
    }
    throw new Error(errorMessage)
  }

  return (await response.json()) as InvoiceItem[]
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

export const getInvoices = async (): Promise<InvoiceItem[]> => {
  if (API_MODE === 'mock') {
    return mockGetInvoices()
  }

  if (API_MODE === 'real') {
    return getInvoicesReal()
  }

  try {
    return await getInvoicesReal()
  } catch {
    return mockGetInvoices()
  }
}
