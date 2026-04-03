import {
  mockCreateBill,
  mockConfirmPaid,
  mockGetBills,
  mockGetInvoices,
  mockCreatePurchaseRequest,
  type BillItem,
  type ConfirmPaidResponse,
  type CreateBillPayload,
  type CreateBillResponse,
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

const getBillsReal = async (): Promise<BillItem[]> => {
  const response = await fetch(`${API_BASE_URL}/api/bills`)

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

  return (await response.json()) as BillItem[]
}

const createBillReal = async (payload: CreateBillPayload): Promise<CreateBillResponse> => {
  const formData = new FormData()
  formData.append('invoiceId', String(payload.invoiceId))
  formData.append('totalAmount', String(payload.totalAmount))
  formData.append('deadline', payload.deadline)
  if (payload.file) {
    formData.append('file', payload.file)
  }

  const response = await fetch(`${API_BASE_URL}/api/bills`, {
    method: 'POST',
    body: formData,
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

  return (await response.json()) as CreateBillResponse
}

const confirmPaidReal = async (invoiceId: number): Promise<ConfirmPaidResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/invoices/${invoiceId}/confirm-paid`, {
    method: 'PATCH',
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

  const data = (await response.json()) as { id: number; status: string }
  return {
    id: data.id,
    status: data.status,
  }
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

export const getBills = async (): Promise<BillItem[]> => {
  if (API_MODE === 'mock') {
    return mockGetBills()
  }

  if (API_MODE === 'real') {
    return getBillsReal()
  }

  try {
    return await getBillsReal()
  } catch {
    return mockGetBills()
  }
}

export const createBill = async (payload: CreateBillPayload): Promise<CreateBillResponse> => {
  if (API_MODE === 'mock') {
    return mockCreateBill(payload)
  }

  if (API_MODE === 'real') {
    return createBillReal(payload)
  }

  try {
    return await createBillReal(payload)
  } catch {
    return mockCreateBill(payload)
  }
}

export const confirmPaid = async (invoiceId: number): Promise<ConfirmPaidResponse> => {
  if (API_MODE === 'mock') {
    return mockConfirmPaid(invoiceId)
  }

  if (API_MODE === 'real') {
    return confirmPaidReal(invoiceId)
  }

  try {
    return await confirmPaidReal(invoiceId)
  } catch {
    return mockConfirmPaid(invoiceId)
  }
}
