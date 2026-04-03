import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { createInvoice } from '../api/purchaseRequestApi'

const INVOICE_STATUSES = ['Open', 'Paid', 'Overdue'] as const

const CheckoutForm = () => {
  const navigate = useNavigate()
  const [customerName, setCustomerName] = useState('')
  const [totalAmount, setTotalAmount] = useState<string>('')
  const [status, setStatus] = useState<(typeof INVOICE_STATUSES)[number]>('Open')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSave = async () => {
    setErrorMessage('')
    const normalizedCustomerName = customerName.trim()
    const parsedAmount = Number(totalAmount)

    if (!normalizedCustomerName) {
      setErrorMessage('Customer name is required.')
      return
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage('Total amount must be greater than 0.')
      return
    }

    setIsSubmitting(true)
    try {
      const createdInvoice = await createInvoice({
        customerName: normalizedCustomerName,
        totalAmount: parsedAmount,
        status,
      })
      navigate('/payments', { state: { newlyCreatedInvoice: createdInvoice } })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Cannot create invoice. Please try again.'
      setErrorMessage(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-xl w-full p-8 bg-white rounded-xl shadow-lg font-sans text-gray-700">
        <button onClick={() => navigate('/payments')} className="mb-4 text-xs text-blue-500 hover:underline">
          &larr; Back to payment queue
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center uppercase tracking-tight">
          Create Invoice
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Customer Name
            </label>
            <input
              type="text"
              placeholder="Enter customer name..."
              className="w-full p-3 bg-blue-50/50 border border-blue-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-gray-700"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Total Amount
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                className="w-full p-3 bg-blue-50/50 border border-blue-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-gray-700"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
              />
            </div>

            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Status
              </label>
              <div className="relative">
                <select
                  className="w-full p-3 bg-blue-50/50 border border-blue-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all appearance-none cursor-pointer"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as (typeof INVOICE_STATUSES)[number])}
                >
                  {INVOICE_STATUSES.map((invoiceStatus) => (
                    <option key={invoiceStatus} value={invoiceStatus}>
                      {invoiceStatus}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>
          </div>

          {errorMessage && <p className="rounded-md bg-red-100 px-4 py-3 text-sm text-red-700">{errorMessage}</p>}

          <div className="pt-4">
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              style={{ backgroundColor: '#4B6382' }}
              className="w-full py-4 text-white font-black text-lg rounded-xl transition-all shadow-lg active:scale-[0.98] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Saving...' : 'SAVE INVOICE'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutForm
