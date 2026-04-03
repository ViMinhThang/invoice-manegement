import { useEffect, useState } from 'react'
import { ChevronDown, Pencil, Trash2, X, AlertCircle } from 'lucide-react'
import { getApiMode, getInvoices } from '../api/purchaseRequestApi'
import type { InvoiceItem } from '../mocks/purchaseRequestMockApi'

// Format tiền tệ VNĐ (Hoặc USD tùy bạn chọn, ở đây tôi để VNĐ cho đồng bộ tiếng Việt)
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })

const PaymentQueue = () => {
  const [payments, setPayments] = useState<InvoiceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  // State cho Modal Chỉnh sửa
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InvoiceItem | null>(null)

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true)
      setErrorMessage('')
      try {
        const data = await getInvoices()
        setPayments(data)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Không thể tải hóa đơn. Vui lòng thử lại.'
        setErrorMessage(message)
      } finally {
        setLoading(false)
      }
    }
    void fetchInvoices()
  }, [])

  // Hàm mở modal chỉnh sửa
  const openEditModal = (item: InvoiceItem) => {
    setEditingItem({ ...item }) // Tạo bản sao để sửa
    setIsEditModalOpen(true)
  }

  // Hàm lưu thay đổi từ modal
  const handleSaveEdit = () => {
    if (editingItem) {
      setPayments(prev => prev.map(p => p.id === editingItem.id ? editingItem : p))
      setIsEditModalOpen(false)
      setEditingItem(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#d1d9e2] p-8 font-sans text-[#1a2b4b]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-black mb-1 tracking-tighter uppercase">Hóa đơn thanh toán</h1>
            <p className="text-gray-600 text-sm italic">Chế độ API: {getApiMode()}</p>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-md text-sm font-semibold shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors">
              Tất cả trạng thái <ChevronDown size={16} />
            </button>
          </div>
        </div>

        {/* Thông báo lỗi/Loading */}
        {loading && <div className="bg-white/50 p-4 rounded-xl animate-pulse text-center">Đang tải dữ liệu...</div>}
        {errorMessage && (
          <div className="bg-red-100 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
            <AlertCircle size={20} /> {errorMessage}
          </div>
        )}

        {/* Bảng dữ liệu */}
        {!loading && !errorMessage && (
          <div className="mt-4">
            {/* Header của bảng */}
            <div className="grid grid-cols-12 px-6 mb-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
              <div className="col-span-2">Mã giao dịch</div>
              <div className="col-span-3">Nhà cung cấp</div>
              <div className="col-span-2 text-center">Thành tiền</div>
              <div className="col-span-2 text-center">Ngày lập</div>
              <div className="col-span-1 text-center">Trạng thái</div>
              <div className="col-span-2 text-right">Thao tác</div>
            </div>

            {/* Danh sách các dòng */}
            <div className="space-y-4">
              {payments.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 items-center bg-[#aeb9c7] hover:bg-[#a4b0bf] transition-all p-6 rounded-2xl shadow-sm border border-transparent hover:border-white/20"
                >
                  <div className="col-span-2 font-bold text-xs tracking-tight">{item.invoiceNumber}</div>
                  <div className="col-span-3 font-bold text-sm truncate pr-4">{item.customerName}</div>
                  <div className="col-span-2 text-center font-black text-lg">
                    {formatCurrency(item.totalAmount)}
                  </div>
                  <div className="col-span-2 text-center text-sm font-medium">
                    {formatDate(item.issuedAt)}
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-tighter bg-[#ced7e0] text-[#4b5563] uppercase">
                      {item.status}
                    </span>
                  </div>
                  
                  {/* Nút Hành động */}
                  <div className="col-span-2 flex justify-end items-center gap-4">
              
                    <button className="bg-[#0f172a] text-white text-[10px] font-bold py-2 px-4 rounded-lg hover:bg-black transition-colors uppercase ml-2">
                      Xác nhận
                    </button>

                    <button 
                      onClick={() => openEditModal(item)}
                      className="p-2 hover:bg-blue-100/30 rounded-full text-[#1a2b4b] transition-colors"
                      title="Sửa"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      className="p-2 hover:bg-red-100/30 rounded-full text-red-700 transition-colors"
                      title="Xóa"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* --- POPUP CHỈNH SỬA (MODAL) --- */}
      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-black text-[#0f172a] uppercase tracking-tight">Chỉnh sửa thông tin</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Nhà cung cấp</label>
                <input 
                  type="text" 
                  value={editingItem.customerName}
                  onChange={(e) => setEditingItem({...editingItem, customerName: e.target.value})}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Số tiền (VNĐ)</label>
                <input 
                  type="number" 
                  value={editingItem.totalAmount}
                  onChange={(e) => setEditingItem({...editingItem, totalAmount: Number(e.target.value)})}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none font-bold text-lg"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Trạng thái</label>
                <div className="relative">
                  <select 
                    value={editingItem.status}
                    onChange={(e) => setEditingItem({...editingItem, status: e.target.value})}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none appearance-none font-semibold cursor-pointer"
                  >
                    <option value="pending">PENDING (Chờ duyệt)</option>
                    <option value="paid">PAID (Đã thanh toán)</option>
                    <option value="cancelled">CANCELLED (Hủy bỏ)</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gray-50 flex gap-4">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 py-4 font-bold text-gray-500 hover:bg-gray-200 rounded-2xl transition-all"
              >
                HỦY
              </button>
              <button 
                onClick={handleSaveEdit}
                className="flex-1 py-4 bg-[#0f172a] text-white font-bold rounded-2xl hover:bg-black shadow-lg shadow-blue-900/20 transition-all"
              >
                LƯU THÔNG TIN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentQueue