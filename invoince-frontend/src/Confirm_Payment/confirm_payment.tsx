import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { confirmPaid, getApiMode, getBills } from '../api/purchaseRequestApi'
import type { BillItem } from '../mocks/purchaseRequestMockApi'

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })

const PaymentQueue = () => {
  const [payments, setPayments] = useState<BillItem[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [confirmingInvoiceIds, setConfirmingInvoiceIds] = useState<number[]>([])

  useEffect(() => {
    const fetchBills = async () => {
      setLoading(true)
      setErrorMessage('')
      try {
        const data = await getBills()
        setPayments(data)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Cannot load bills. Please try again.'
        setErrorMessage(message)
      } finally {
        setLoading(false)
      }
    }

    void fetchBills()
  }, [])

  const handleConfirmPaid = async (invoiceId: number) => {
    setErrorMessage('')
    setConfirmingInvoiceIds((prev) => [...prev, invoiceId])

    try {
      const result = await confirmPaid(invoiceId)
      setPayments((prev) =>
        prev.map((item) =>
          item.invoiceId === invoiceId ? { ...item, invoiceStatus: result.status } : item,
        ),
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Cannot confirm paid. Please try again.'
      setErrorMessage(message)
    } finally {
      setConfirmingInvoiceIds((prev) => prev.filter((id) => id !== invoiceId))
    }
  }

  return (
    <div className="min-h-screen bg-[#d1d9e2] p-8 font-sans text-[#1a2b4b]">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Hoa don thanh toan</h1>
            <p className="text-gray-600 text-sm">Bill list from API mode: {getApiMode()}</p>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-md text-sm font-semibold shadow-sm border border-gray-200">
              All Statuses <ChevronDown size={16} />
            </button>
          </div>
        </div>

        {loading && <p className="rounded-md bg-white/70 px-4 py-3 text-sm">Loading bills...</p>}
        {errorMessage && <p className="rounded-md bg-red-100 px-4 py-3 text-sm text-red-700">{errorMessage}</p>}

        {!loading && !errorMessage && (
          <>
            <div className="grid grid-cols-12 px-6 mb-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <div className="col-span-2">Ma giao dich</div>
              <div className="col-span-3">Khach hang</div>
              <div className="col-span-2 text-center">Tong tien</div>
              <div className="col-span-2 text-center">Han thanh toan</div>
              <div className="col-span-2 text-center">Trang thai</div>
              <div className="col-span-1 text-right">Xac nhan</div>
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
                    {formatDate(item.deadline)}
                  </div>
                  <div className="col-span-2 flex justify-center">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-tighter bg-[#ced7e0] text-[#6b7c93]">
                      {item.invoiceStatus.toUpperCase()}
                    </span>
                  </div>
                  <div className="col-span-1 text-right">
                    <button
                      disabled={
                        item.invoiceStatus !== 'Awaiting Payment' ||
                        confirmingInvoiceIds.includes(item.invoiceId)
                      }
                      onClick={() => handleConfirmPaid(item.invoiceId)}
                      className="bg-[#0f172a] text-white text-[10px] font-bold py-2 px-3 rounded leading-tight hover:bg-black transition-colors uppercase disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {confirmingInvoiceIds.includes(item.invoiceId) ? 'Confirming...' : 'Confirm'}
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
