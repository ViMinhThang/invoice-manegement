export type CreatePurchaseRequestPayload = {
  itemName: string
  quantity: number
  unit: string
  requiresDeposit: boolean
}

export type PurchaseRequestResponse = {
  id: number
  itemName: string
  quantity: number
  unit: string
  requiresDeposit: boolean
  status: 'Open'
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

export const mockCreatePurchaseRequest = async (
  payload: CreatePurchaseRequestPayload,
): Promise<PurchaseRequestResponse> => {
  await wait(700)

  if (!payload.itemName.trim() || payload.quantity <= 0 || !payload.unit.trim()) {
    throw new Error('Du lieu khong hop le. Vui long kiem tra lai form.')
  }

  return {
    id: Math.floor(Math.random() * 10_000) + 1,
    itemName: payload.itemName.trim(),
    quantity: payload.quantity,
    unit: payload.unit,
    requiresDeposit: payload.requiresDeposit,
    status: 'Open',
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
