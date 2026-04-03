import { useEffect, useState } from 'react'
// Thêm Pencil và Trash2 vào import
import { ChevronDown, Pencil, Trash2 } from 'lucide-react'
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

const PaymentQueue = () => {
  const [payments, setPayments] = useState<InvoiceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true)
      setErrorMessage('')
      try {
        const data = await getInvoices()
        setPayments(data)
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Cannot load invoices. Please try again.'
        setErrorMessage(message)
      } finally {
        setLoading(false)
      }
    }

    void fetchInvoices()
  }, [])

  return (
    <div className="min-h-screen bg-[#d1d9e2] p-8 font-sans text-[#1a2b4b]">
      <div className="max-w-7xl mx-auto"> {/* Tăng max-width nhẹ để không bị chật */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Hóa đơn thanh toán</h1>
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
            {/* Header: Chỉnh lại col-span */}
            <div className="grid grid-cols-12 px-6 mb-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <div className="col-span-2">Mã giao dịch</div>
              <div className="col-span-2">Nhà cung cấp</div>
              <div className="col-span-2 text-center">Thành tiền</div>
              <div className="col-span-2 text-center">Ngày thanh toán</div>
              <div className="col-span-2 text-center">Trạng thái</div>
              <div className="col-span-1 text-center">Xác nhận</div>
              <div className="col-span-1 text-right">Thao tác</div>
            </div>

            <div className="space-y-4">
              {payments.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 items-center bg-[#aeb9c7] hover:bg-[#a4b0bf] transition-colors p-6 rounded-lg shadow-sm"
                >
                  <div className="col-span-2 font-bold text-xs">{item.invoiceNumber}</div>
                  <div className="col-span-2 font-bold text-sm truncate pr-2">{item.customerName}</div>
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
                  
                  {/* Cột Confirm */}
                  <div className="col-span-1 text-center">
                    <button className="bg-[#0f172a] text-white text-[10px] font-bold py-2 px-3 rounded leading-tight hover:bg-black transition-colors uppercase">
                      Confirm
                    </button>
                  </div>

                  {/* Cột Thao tác mới */}
                  <div className="col-span-1 flex justify-end gap-3">
                    <button 
                      className="text-[#1a2b4b] hover:text-blue-700 transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      className="text-[#1a2b4b] hover:text-red-700 transition-colors"
                      title="Xóa"
                    >
                      <Trash2 size={18} />
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