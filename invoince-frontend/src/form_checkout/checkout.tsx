import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { createInvoice } from '../api/purchaseRequestApi'

const ItemDetailsForm = () => {
  const navigate = useNavigate()
  const [itemName, setItemName] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [unit, setUnit] = useState('Cai')
  const [price, setPrice] = useState('')
  const [needsDeposit, setNeedsDeposit] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const formatNumber = (value: string) => {
    const cleanValue = value.replace(/\D/g, '')
    return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const handleSave = async () => {
    setErrorMessage('')

    const normalizedName = itemName.trim()
    if (!normalizedName) {
      setErrorMessage('Vui long nhap ten mat hang.')
      return
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      setErrorMessage('So luong phai lon hon 0.')
      return
    }

    if (!unit.trim()) {
      setErrorMessage('Don vi khong duoc de trong.')
      return
    }

    setIsSubmitting(true)
    try {
      await createInvoice({
        itemName: normalizedName,
        quantity,
        unit,
        requiresDeposit: needsDeposit,
      })

      // keep local computed price usage for UI parity/logging
      const numericPrice = Number(price.replace(/,/g, ''))
      console.log('Da luu purchase request', {
        itemName: normalizedName,
        quantity,
        unit,
        price: Number.isFinite(numericPrice) ? numericPrice : 0,
        needsDeposit,
      })

      navigate('/payments')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Khong the luu du lieu. Vui long thu lai.'
      setErrorMessage(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-xl w-full p-8 bg-white rounded-xl shadow-lg font-sans text-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center uppercase tracking-tight">
          Chi tiet mat hang
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Ten mon hang
            </label>
            <input
              type="text"
              placeholder="Nhap ten mat hang..."
              className="w-full p-3 bg-blue-50/50 border border-blue-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                So luong
              </label>
              <input
                type="number"
                min="1"
                className="w-full p-3 bg-blue-50/50 border border-blue-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>

            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Don vi
              </label>
              <div className="relative">
                <select
                  className="w-full p-3 bg-blue-50/50 border border-blue-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none cursor-pointer"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                >
                  <option value="Cai">Cai</option>
                  <option value="KG">KG</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Gia don vi
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="0"
                className="w-full p-3 bg-blue-50/50 border border-blue-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-gray-700 font-medium"
                value={price}
                onChange={(e) => {
                  const formatted = formatNumber(e.target.value)
                  setPrice(formatted)
                }}
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400 font-bold text-xs">
                VND
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
              Xac nhan dat coc
            </label>
          </div>

          {errorMessage && <p className="rounded-md bg-red-100 px-4 py-3 text-sm text-red-700">{errorMessage}</p>}

          <div className="pt-4">
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              style={{ backgroundColor: '#4B6382' }}
              className="w-full py-4 text-white font-black text-lg rounded-xl transition-all shadow-lg active:scale-[0.98] hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Dang luu...' : 'LUU THONG TIN'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ItemDetailsForm
