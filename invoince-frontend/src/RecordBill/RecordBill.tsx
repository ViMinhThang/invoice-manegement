import { useEffect, useState } from 'react'
import { ChevronDown, CalendarDays, CloudUpload, CornerDownLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { createBill, getInvoices } from '../api/purchaseRequestApi'
import type { InvoiceItem } from '../mocks/purchaseRequestMockApi'

const RecordBill = () => {
  const navigate = useNavigate()
  const [invoices, setInvoices] = useState<InvoiceItem[]>([])
  const [invoiceId, setInvoiceId] = useState('')
  const [totalAmount, setTotalAmount] = useState('')
  const [deadline, setDeadline] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [loadingInvoices, setLoadingInvoices] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoadingInvoices(true)
      setErrorMessage('')
      try {
        const data = await getInvoices()
        const openInvoices = data.filter((item) => item.status === 'Open')
        setInvoices(openInvoices)
        if (openInvoices.length > 0) {
          setInvoiceId(String(openInvoices[0].id))
          setTotalAmount(String(openInvoices[0].totalAmount))
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Khong tai duoc danh sach yeu cau.'
        setErrorMessage(message)
      } finally {
        setLoadingInvoices(false)
      }
    }

    void fetchInvoices()
  }, [])

  const handleSave = async () => {
    setErrorMessage('')
    setSuccessMessage('')

    const parsedInvoiceId = Number(invoiceId)
    const parsedAmount = Number(totalAmount)
    const deadlineDate = new Date(deadline)

    if (!Number.isInteger(parsedInvoiceId) || parsedInvoiceId <= 0) {
      setErrorMessage('Vui long chon yeu cau mua hang.')
      return
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage('Tong so tien hoa don phai lon hon 0.')
      return
    }

    if (!deadline || Number.isNaN(deadlineDate.getTime())) {
      setErrorMessage('Han thanh toan khong hop le.')
      return
    }

    if (deadlineDate.getTime() <= Date.now()) {
      setErrorMessage('Han thanh toan phai o tuong lai.')
      return
    }

    setIsSubmitting(true)
    try {
      await createBill({
        invoiceId: parsedInvoiceId,
        totalAmount: parsedAmount,
        deadline: deadlineDate.toISOString(),
        file: selectedFile,
      })
      setSuccessMessage('Tao bill thanh cong. Trang thai da chuyen sang Awaiting Payment.')
      setTimeout(() => navigate('/payments'), 700)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Khong the luu bill.'
      setErrorMessage(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#d1d9e2] p-10 font-sans text-[#1a2b4b]">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-[#0f172a] mb-2 tracking-tighter">
            Ghi nhan Hoa don phai tra
          </h1>
          <p className="text-gray-600 text-lg">
            Lien ket hoa don vat ly voi yeu cau mua hang hien co de doi chieu.
          </p>
        </div>

        <div className="bg-[#aeb9c7] p-10 rounded-2xl shadow-sm space-y-8 mb-10">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Lien ket Yeu cau mua hang
            </label>
            <div className="relative">
              <select
                className="w-full p-5 bg-white rounded-xl outline-none text-[#1a2b4b] appearance-none cursor-pointer pr-12 text-sm disabled:opacity-70"
                value={invoiceId}
                disabled={loadingInvoices || invoices.length === 0}
                onChange={(e) => {
                  setInvoiceId(e.target.value)
                  const selected = invoices.find((item) => String(item.id) === e.target.value)
                  if (selected) {
                    setTotalAmount(String(selected.totalAmount))
                  }
                }}
              >
                {loadingInvoices && <option>Dang tai du lieu...</option>}
                {!loadingInvoices && invoices.length === 0 && <option>Khong co yeu cau dang Open.</option>}
                {!loadingInvoices &&
                  invoices.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.invoiceNumber} - {item.customerName}
                    </option>
                  ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                <ChevronDown size={20} />
              </div>
            </div>
            <p className="text-[11px] text-gray-600 mt-2 font-medium">
              Chi cac yeu cau mua hang trang thai Open moi duoc tao bill.
            </p>
          </div>

          <div className="flex gap-6">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Tong so tien hoa don
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                className="w-full p-5 bg-white rounded-xl outline-none text-[#1a2b4b]"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
              />
            </div>

            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Han thanh toan
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  className="w-full p-5 bg-white rounded-xl outline-none text-[#1a2b4b]"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
                <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-gray-400">
                  <CalendarDays size={20} />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Dinh kem Tai lieu Hoa don (PDF/JPG)
            </label>
            <label className="border-2 border-dashed border-gray-400 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-gray-500 hover:bg-white/10 transition-all">
              <CloudUpload size={40} className="text-gray-500 mb-4" />
              <p className="font-bold text-[#1a2b4b]">
                {selectedFile ? selectedFile.name : 'Nhan de tai len hoac keo va tha'}
              </p>
              <p className="text-xs text-gray-600 mt-1">Kich thuoc tep toi da: 10MB</p>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg,.gif,.webp"
                onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          {errorMessage && <p className="rounded-md bg-red-100 px-4 py-3 text-sm text-red-700">{errorMessage}</p>}
          {successMessage && (
            <p className="rounded-md bg-green-100 px-4 py-3 text-sm text-green-700">{successMessage}</p>
          )}
        </div>

        <div className="flex justify-between items-center px-6">
          <button
            onClick={() => navigate('/payments')}
            className="text-sm font-black uppercase text-[#0f172a] hover:underline flex items-center gap-2"
          >
            <CornerDownLeft size={16} /> Huy bo
          </button>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Trang thai sau hanh dong
              </span>
              <span className="flex items-center gap-2 font-bold text-sm text-[#0f172a]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8a6d4d]" />
                Dang cho thanh toan
              </span>
            </div>

            <button
              onClick={handleSave}
              disabled={isSubmitting || loadingInvoices || invoices.length === 0}
              className="bg-[#0f172a] text-white font-bold py-4 px-10 rounded-full hover:bg-black transition-colors flex items-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Dang luu...' : 'Luu va Hoan tat'}
              <span className="text-xs">{'->'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecordBill
