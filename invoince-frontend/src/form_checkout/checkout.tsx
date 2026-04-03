import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react'; // Cài đặt: npm install lucide-react

const ItemDetailsForm = () => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState('Chiếc (Units)');

  return (
    <div className="max-w-xl p-6 bg-white rounded-lg shadow-sm font-sans">
      {/* Tiêu đề chính */}
      <h2 className="text-xl font-bold text-gray-800 mb-6">Chi tiết mặt hàng</h2>

      <div className="space-y-4">
        {/* Tên món hàng */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Tên món hàng
          </label>
          <input
            type="text"
            placeholder="e.g. Dell Latitude 7420 Laptop"
            className="w-full p-3 bg-blue-50/50 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all placeholder-gray-400 text-gray-700"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
        </div>

        {/* Số lượng và Đơn vị */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Số lượng
            </label>
            <input
              type="number"
              className="w-full p-3 bg-blue-50/50 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all text-gray-700"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>

          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Đơn vị
            </label>
            <div className="relative">
              <select
                className="w-full p-3 bg-blue-50/50 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all appearance-none text-gray-700 cursor-pointer"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              >
                <option>Chiếc (Units)</option>
                <option>Cái</option>
                <option>Bộ</option>
              </select>
              {/* Icon mũi tên xuống */}
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                <ChevronDown size={18} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsForm;