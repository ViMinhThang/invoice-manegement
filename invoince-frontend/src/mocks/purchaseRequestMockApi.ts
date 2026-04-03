export type CreateInvoicePayload = {
  customerName: string
  totalAmount: number
  status: string
}

export type CreateInvoiceResponse = {
  id: number
  invoiceNumber: string
  customerName: string
  totalAmount: number
  status: string
  issuedAt: string
  createdAt: string
}

export type InvoiceItem = {
  id: number
  invoiceNumber: string
  customerName: string
  totalAmount: number
  status: string
  issuedAt: string
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockCreateInvoice = async (
  payload: CreateInvoicePayload,
): Promise<CreateInvoiceResponse> => {
  await wait(700)

  if (!payload.customerName.trim() || payload.totalAmount <= 0 || !payload.status.trim()) {
    throw new Error('Invalid invoice data. Please review the form values.')
  }

  return {
    id: Math.floor(Math.random() * 10_000) + 1,
    invoiceNumber: `INV-MOCK${Math.floor(1000 + Math.random() * 9000)}`,
    customerName: payload.customerName.trim(),
    totalAmount: payload.totalAmount,
    status: payload.status,
    issuedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }
}

export const mockGetInvoices = async (): Promise<InvoiceItem[]> => {
  await wait(500)

  return [
    {
      id: 1,
      invoiceNumber: 'INV-MOCK0001',
      customerName: 'Stellar Dynamics Corp',
      totalAmount: 42900,
      status: 'Open',
      issuedAt: new Date().toISOString(),
    },
    {
      id: 2,
      invoiceNumber: 'INV-MOCK0002',
      customerName: 'Vertex Manufacturing',
      totalAmount: 8400,
      status: 'Open',
      issuedAt: new Date().toISOString(),
    },
    {
      id: 3,
      invoiceNumber: 'INV-MOCK0003',
      customerName: 'Nexa Network Solutions',
      totalAmount: 67000,
      status: 'Invoiced',
      issuedAt: new Date().toISOString(),
    },
  ]
}
