import {
  mockGetInvoices,
  mockCreateInvoice,
  type CreateInvoicePayload,
  type CreateInvoiceResponse,
  type InvoiceItem,
} from '../mocks/purchaseRequestMockApi'

type ApiMode = 'mock' | 'real' | 'hybrid'

const RAW_MODE = (import.meta.env.VITE_API_MODE ?? 'mock').toLowerCase()
const API_MODE: ApiMode =
  RAW_MODE === 'real' || RAW_MODE === 'hybrid' ? (RAW_MODE as ApiMode) : 'mock'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

const createInvoiceReal = async (
  payload: CreateInvoicePayload,
): Promise<CreateInvoiceResponse> => {
  // Backend currently expects legacy CreateInvoiceRequest fields.
  const legacyPayload = {
    itemName: payload.customerName,
    quantity: payload.totalAmount,
    unit: 'Amount',
    requiresDeposit: false,
  }

  const response = await fetch(`${API_BASE_URL}/api/invoices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(legacyPayload),
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

  const responseBody = (await response.json()) as {
    id: number
    itemName: string
    quantity: number
    status: string
    createdAt: string
  }

  return {
    id: responseBody.id,
    invoiceNumber: `INV-${responseBody.id}`,
    customerName: responseBody.itemName,
    totalAmount: responseBody.quantity,
    status: responseBody.status,
    issuedAt: responseBody.createdAt,
    createdAt: responseBody.createdAt,
  }
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

export const createInvoice = async (
  payload: CreateInvoicePayload,
): Promise<CreateInvoiceResponse> => {
  if (API_MODE === 'mock') {
    return mockCreateInvoice(payload)
  }

  if (API_MODE === 'real') {
    return createInvoiceReal(payload)
  }

  try {
    return await createInvoiceReal(payload)
  } catch {
    return mockCreateInvoice(payload)
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
