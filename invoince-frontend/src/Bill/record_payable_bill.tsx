import React, { useState } from 'react';
// Import các icons cần thiết từ lucide-react
import { ChevronDown, CalendarDays, CloudUpload, CornerDownLeft } from 'lucide-react';

const GhiNhanHoaDon = () => {
  // State để quản lý tệp tin được chọn (tùy chọn mở rộng sau này)
  const [selectedFile, setSelectedFile] = useState(null);

  return (
    // Container chính với màu nền xám xanh nhạt
    <div className="min-h-screen bg-[#d1d9e2] p-10 font-sans text-[#1a2b4b]">
      <div className="max-w-4xl mx-auto">
        
        {/* Phần Tiêu đề */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-[#0f172a] mb-2 tracking-tighter">
            Ghi nhận Hóa đơn phải trả
          </h1>
          <p className="text-gray-600 text-lg">
            Liên kết hóa đơn vật lý với yêu cầu mua hàng hiện có để đối chiếu.
          </p>
        </div>

        {/* Phần Thẻ Form (Card) */}
        <div className="bg-[#aeb9c7] p-10 rounded-2xl shadow-sm space-y-8 mb-10">
          
          {/* Trường 1: Liên kết Yêu cầu mua hàng */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Liên kết Yêu cầu mua hàng
            </label>
            <div className="relative">
              <select className="w-full p-5 bg-white rounded-xl outline-none text-[#1a2b4b] appearance-none cursor-pointer pr-12 text-sm">
                <option>Chọn một yêu cầu đang chờ xử lý...</option>
                <option>YCMH-2023-01: Văn phòng phẩm tháng 10</option>
                <option>YCMH-2023-02: Thiết bị Server</option>
              </select>
              {/* Icon mũi tên xuống custom */}
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                <ChevronDown size={20} />
              </div>
            </div>
            <p className="text-[11px] text-gray-600 mt-2 font-medium">
              Chỉ các yêu cầu mua hàng đã được phê duyệt và có hóa đơn đang chờ mới được liệt kê.
            </p>
          </div>

          {/* Dòng 2: Tổng số tiền và Hạn thanh toán */}
          <div className="flex gap-6">
            {/* Tổng số tiền hóa đơn */}
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Tổng số tiền hóa đơn
              </label>
              <div className="relative">
                {/* Ký hiệu tiền tệ cố định */}
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-700 font-bold">
                  $
                </div>
                <input
                  type="text"
                  placeholder="0.00"
                  className="w-full p-5 pl-10 bg-white rounded-xl outline-none text-[#1a2b4b]"
                />
              </div>
            </div>
            
            {/* Hạn thanh toán */}
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Hạn thanh toán
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="ngày/tháng/năm" // Định dạng tiếng Việt
                  className="w-full p-5 bg-white rounded-xl outline-none text-[#1a2b4b]"
                />
                {/* Icon lịch custom */}
                <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-gray-400">
                  <CalendarDays size={20} />
                </div>
              </div>
            </div>
          </div>

          {/* Trường 3: Đính kèm Tài liệu */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Đính kèm Tài liệu Hóa đơn (PDF/JPG)
            </label>
            {/* Vùng Drag & Drop */}
            <div className="border-2 border-dashed border-gray-400 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-gray-500 hover:bg-white/10 transition-all">
              <CloudUpload size={40} className="text-gray-500 mb-4" />
              <p className="font-bold text-[#1a2b4b]">Nhấp để tải lên hoặc kéo và thả</p>
              <p className="text-xs text-gray-600 mt-1">Kích thước tệp tối đa: 15MB</p>
            </div>
          </div>
        </div>

        {/* Phần Các nút hành động bên dưới */}
        <div className="flex justify-between items-center px-6">
          {/* Nút Hủy bỏ bên trái */}
          <button className="text-sm font-black uppercase text-[#0f172a] hover:underline flex items-center gap-2">
            <CornerDownLeft size={16} /> Hủy bỏ
          </button>
          
          {/* Phần bên phải: Trạng thái và Nút Lưu */}
          <div className="flex items-center gap-8">
            {/* Trạng thái sau hành động */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Trạng thái sau hành động
              </span>
              <span className="flex items-center gap-2 font-bold text-sm text-[#0f172a]">
                {/* Dấu chấm màu nâu giống ảnh */}
                <div className="w-2.5 h-2.5 rounded-full bg-[#8a6d4d]"></div>
                Đang chờ thanh toán
              </span>
            </div>
            
            {/* Nút Lưu và Hoàn tất */}
            <button className="bg-[#0f172a] text-white font-bold py-4 px-10 rounded-full hover:bg-black transition-colors flex items-center gap-2 text-sm">
              Lưu và Hoàn tất
              <span className="text-xs">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GhiNhanHoaDon;