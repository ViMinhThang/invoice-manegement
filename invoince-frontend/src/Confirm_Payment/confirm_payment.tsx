import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { getApiMode, getInvoices } from '../api/purchaseRequestApi'
import type { InvoiceItem } from '../mocks/purchaseRequestMockApi'

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })

const sortInvoicesNewestFirst = (items: InvoiceItem[]) =>
  [...items].sort((a, b) => {
    const aTime = new Date(a.issuedAt).getTime()
    const bTime = new Date(b.issuedAt).getTime()
    if (aTime !== bTime) return bTime - aTime
    return b.id - a.id
  })

const PaymentQueue = () => {
  const location = useLocation()
  const [payments, setPayments] = useState<InvoiceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const newlyCreatedInvoice = (location.state as { newlyCreatedInvoice?: InvoiceItem } | null)
    ?.newlyCreatedInvoice

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true)
      setErrorMessage('')
      try {
        const data = await getInvoices()
        const merged =
          newlyCreatedInvoice && !data.some((item) => item.id === newlyCreatedInvoice.id)
            ? [newlyCreatedInvoice, ...data]
            : data

        setPayments(sortInvoicesNewestFirst(merged))
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Cannot load invoices. Please try again.'
        setErrorMessage(message)
      } finally {
        setLoading(false)
      }
    }

    void fetchInvoices()
  }, [newlyCreatedInvoice])

  return (
    <div className="min-h-screen bg-[#d1d9e2] p-8 font-sans text-[#1a2b4b]">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Payment Queue</h1>
            <p className="text-gray-600 text-sm">Invoice list from API mode: {getApiMode()}</p>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-md text-sm font-semibold shadow-sm border border-gray-200">
              All Statuses <ChevronDown size={16} />
            </button>
          </div>
        </div>

        {loading && <p className="rounded-md bg-white/70 px-4 py-3 text-sm">Loading invoices...</p>}
        {errorMessage && <p className="rounded-md bg-red-100 px-4 py-3 text-sm text-red-700">{errorMessage}</p>}

        {!loading && !errorMessage && (
          <>
            <div className="grid grid-cols-12 px-6 mb-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <div className="col-span-2">Reference ID</div>
              <div className="col-span-3">Client Entity</div>
              <div className="col-span-2 text-center">Amount</div>
              <div className="col-span-2 text-center">Issued At</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            <div className="space-y-4">
              {payments.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 items-center bg-[#aeb9c7] hover:bg-[#a4b0bf] transition-colors p-6 rounded-lg shadow-sm"
                >
                  <div className="col-span-2 font-bold text-xs">{item.invoiceNumber}</div>
                  <div className="col-span-3 font-bold text-sm">{item.customerName}</div>
                  <div className="col-span-2 text-center font-bold text-lg">
                    {formatCurrency(item.totalAmount)}
                  </div>
                  <div className="col-span-2 text-center text-sm font-medium">
                    {formatDate(item.issuedAt)}
                  </div>
                  <div className="col-span-2 flex justify-center">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-tighter bg-[#ced7e0] text-[#6b7c93]">
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="col-span-1 text-right">
                    <button className="bg-[#0f172a] text-white text-[10px] font-bold py-2 px-3 rounded leading-tight hover:bg-black transition-colors uppercase">
                      Confirm
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default PaymentQueue
