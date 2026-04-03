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
