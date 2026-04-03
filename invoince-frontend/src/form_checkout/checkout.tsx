import { type FormEvent, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import {
  createPurchaseRequest,
  getApiMode,
} from '../api/purchaseRequestApi'
import {
  type PurchaseRequestResponse,
} from '../mocks/purchaseRequestMockApi'

const ItemDetailsForm = () => {
  const [itemName, setItemName] = useState('')
  const [quantity, setQuantity] = useState<number>(1)
  const [unit, setUnit] = useState('Cai')
  const [requiresDeposit, setRequiresDeposit] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successData, setSuccessData] = useState<PurchaseRequestResponse | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')
    setSuccessData(null)

    try {
      const response = await createPurchaseRequest({
        itemName,
        quantity,
        unit,
        requiresDeposit,
      })
      setSuccessData(response)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Khong the submit form. Vui long thu lai.'
      setErrorMessage(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-xl p-6 bg-white rounded-lg shadow-sm font-sans">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Chi tiet mat hang</h2>
      <p className="mb-4 text-xs text-gray-500">API mode: {getApiMode()}</p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Ten mon hang
          </label>
          <input
            type="text"
            placeholder="Vi du: Laptop Dell"
            className="w-full p-3 bg-blue-50/50 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all placeholder-gray-400 text-gray-700"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              So luong
            </label>
            <input
              type="number"
              min={1}
              className="w-full p-3 bg-blue-50/50 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all text-gray-700"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />
          </div>

          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Don vi
            </label>
            <div className="relative">
              <select
                className="w-full p-3 bg-blue-50/50 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all appearance-none text-gray-700 cursor-pointer"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              >
                <option value="Cai">Cai</option>
                <option value="Kg">Kg</option>
                <option value="Gio">Gio</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                <ChevronDown size={18} />
              </div>
            </div>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={requiresDeposit}
            onChange={(e) => setRequiresDeposit(e.target.checked)}
          />
          Co can dat coc khong?
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-blue-600 px-4 py-3 text-white font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {errorMessage && (
        <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600">{errorMessage}</p>
      )}

      {successData && (
        <div className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-700">
          <p>Submit thanh cong.</p>
          <p>ID: {successData.id}</p>
          <p>Status: {successData.status}</p>
        </div>
      )}
    </div>
  )
}

export default ItemDetailsForm
