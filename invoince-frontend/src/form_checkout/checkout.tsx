import { type FormEvent, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { createPurchaseRequest, getApiMode } from '../api/purchaseRequestApi'
import { type PurchaseRequestResponse } from '../mocks/purchaseRequestMockApi'

const ItemDetailsForm = () => {
  const [itemName, setItemName] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [unit, setUnit] = useState('Cai')
  const [needsDeposit, setNeedsDeposit] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successData, setSuccessData] = useState<PurchaseRequestResponse | null>(null)

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (quantity <= 0) {
      setErrorMessage('So luong phai lon hon 0!')
      setSuccessData(null)
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')
    setSuccessData(null)

    try {
      const response = await createPurchaseRequest({
        itemName,
        quantity,
        unit,
        requiresDeposit: needsDeposit,
      })
      setSuccessData(response)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Khong the luu thong tin. Vui long thu lai.'
      setErrorMessage(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-xl w-full p-8 bg-white rounded-xl shadow-lg font-sans text-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center uppercase tracking-tight">
          Chi tiet mat hang
        </h2>
        <p className="text-center text-xs text-gray-400 mb-8">API mode: {getApiMode()}</p>

        <form className="space-y-6" onSubmit={handleSave}>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Ten mon hang
            </label>
            <input
              type="text"
              placeholder="Nhap ten mat hang..."
              className="w-full p-3 bg-blue-50/50 border border-blue-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-gray-700"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                So luong
              </label>
              <input
                type="number"
                min={1}
                className="w-full p-3 bg-blue-50/50 border border-blue-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-gray-700"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(0, Number(e.target.value)))}
                required
              />
            </div>

            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Don vi
              </label>
              <div className="relative">
                <select
                  className="w-full p-3 bg-blue-50/50 border border-blue-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all appearance-none cursor-pointer"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                >
                  <option value="Cai">Cai</option>
                  <option value="Kg">Kg</option>
                  <option value="Gio">Gio</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              id="deposit"
              className="w-5 h-5 accent-blue-600 border-gray-300 rounded cursor-pointer"
              checked={needsDeposit}
              onChange={(e) => setNeedsDeposit(e.target.checked)}
            />
            <label htmlFor="deposit" className="font-medium text-gray-600 cursor-pointer select-none">
              Co can dat coc khong?
            </label>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ backgroundColor: '#4B6382' }}
              className="w-full py-4 text-white font-black text-lg rounded-xl transition-all shadow-lg active:scale-[0.98] hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Dang luu...' : 'LUU THONG TIN'}
            </button>
          </div>
        </form>

        {errorMessage && (
          <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600">{errorMessage}</p>
        )}

        {successData && (
          <div className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-700">
            <p>Luu thanh cong.</p>
            <p>ID: {successData.id}</p>
            <p>Status: {successData.status}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ItemDetailsForm