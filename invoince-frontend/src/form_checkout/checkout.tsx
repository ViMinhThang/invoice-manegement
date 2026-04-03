import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ItemDetailsForm = () => {
  const navigate = useNavigate();
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('Cái');
  const [price, setPrice] = useState('');
  const [needsDeposit, setNeedsDeposit] = useState(false);

  // Hàm định dạng số: 1000 -> 1,000
  const formatNumber = (value: string) => {
    // Xóa tất cả ký tự không phải là số
    const cleanValue = value.replace(/\D/g, '');
    // Thêm dấu phẩy phân cách hàng nghìn
    return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleSave = () => {
    if (!itemName) {
      alert("Vui lòng nhập tên mặt hàng!");
      return;
    }

    // Chuyển ngược từ chuỗi có dấu phẩy về số thuần túy để lưu trữ
    const numericPrice = Number(price.replace(/,/g, ''));

    console.log("Đã lưu:", { 
      itemName, 
      quantity, 
      unit, 
      price: numericPrice, 
      needsDeposit 
    });

    navigate('/payments');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-xl w-full p-8 bg-white rounded-xl shadow-lg font-sans text-gray-700">
        

        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center uppercase tracking-tight">
          Chi tiết mặt hàng
        </h2>

        <div className="space-y-6">
          {/* Tên món hàng */}
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

          {/* Số lượng và Đơn vị */}
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
                  <option value="Cái">Cái</option>
                  <option value="KG">KG</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>
          </div>

          {/* Ô NHẬP GIÁ VỚI DẤU PHẨY TỰ ĐỘNG */}
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
                onChange={(e) => {
                  const formatted = formatNumber(e.target.value);
                  setPrice(formatted);
                }}
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400 font-bold text-xs">
                VND
              </div>
            </div>
          </div>

          {/* Checkbox */}
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

          {/* Nút Lưu */}
          <div className="pt-4">
            <button
              onClick={handleSave}
              style={{ backgroundColor: '#4B6382' }}
              className="w-full py-4 text-white font-black text-lg rounded-xl transition-all shadow-lg active:scale-[0.98] hover:opacity-90"
            >
              LƯU THÔNG TIN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsForm;