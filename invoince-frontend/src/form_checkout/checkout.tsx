import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { createInvoice } from '../api/purchaseRequestApi'

const ItemDetailsForm = () => {
  const navigate = useNavigate()
  const [vendorName, setVendorName] = useState('')
  const [itemName, setItemName] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [unit, setUnit] = useState('Cai')
  const [price, setPrice] = useState('')
  const [needsDeposit, setNeedsDeposit] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formatNumber = (value: string) => {
    const cleanValue = value.replace(/\D/g, '')
    return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const handleSave = async () => {
    if (!vendorName.trim()) {
      alert('Vui lòng nhập tên nhà cung cấp!')
      return
    }

    if (!itemName.trim()) {
      alert('Vui lòng nhập tên mặt hàng!')
      return
    }

    if (quantity <= 0) {
      alert('Số lượng phải lớn hơn 0!')
      return
    }

    try {
      setIsSubmitting(true)
      await createInvoice({
        itemName: itemName.trim(),
        quantity,
        unit,
        requiresDeposit: needsDeposit,
      })

      const numericPrice = Number(price.replace(/,/g, ''))
      console.log('Đã lưu:', {
        vendorName,
        itemName,
        quantity,
        unit,
        price: Number.isFinite(numericPrice) ? numericPrice : 0,
        needsDeposit,
      })

      navigate('/payments')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Lưu thất bại'
      alert(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-xl w-full p-8 bg-white rounded-xl shadow-lg font-sans text-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center uppercase tracking-tight">
          Chi tiết mặt hàng
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Tên nhà cung cấp
            </label>
            <input
              type="text"
              placeholder="Nhập tên công ty, đại lý..."
              className="w-full p-3 bg-blue-50/50 border border-blue-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Tên món hàng
            </label>
            <input
              type="text"
              placeholder="Nhập tên mặt hàng..."
              className="w-full p-3 bg-blue-50/50 border border-blue-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Số lượng
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
                Đơn vị
              </label>
              <div className="relative">
                <select
                  className="w-full p-3 bg-blue-50/50 border border-blue-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none cursor-pointer"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                >
                  <option value="Cai">Cái</option>
                  <option value="KG">KG</option>
                  <option value="Bo">Bộ</option>
                  <option value="Chiec">Chiếc</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Giá đơn vị
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="0"
                className="w-full p-3 bg-blue-50/50 border border-blue-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-gray-700 font-medium"
                value={price}
                onChange={(e) => setPrice(formatNumber(e.target.value))}
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
              Xác nhận đặt cọc
            </label>
          </div>

          <div className="pt-4">
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              style={{ backgroundColor: '#4B6382' }}
              className="w-full py-4 text-white font-black text-lg rounded-xl transition-all shadow-lg active:scale-[0.98] hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Đang lưu...' : 'LƯU THÔNG TIN'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ItemDetailsForm
