import React from 'react';
import { Filter, ChevronDown, Building2, Factory, Network } from 'lucide-react';

const PaymentQueue = () => {
  // Dữ liệu mẫu dựa theo ảnh
  const payments = [
    {
      id: 'TXN-8842-A',
      client: 'Stellar Dynamics Corp',
      icon: <Building2 className="w-5 h-5 text-gray-600" />,
      amount: '$42,900.00',
      dueDate: 'Oct 24, 2023',
      status: 'AWAITING PAYMENT',
      statusType: 'default'
    },
    {
      id: 'TXN-8845-B',
      client: 'Vertex Manufacturing',
      icon: <Factory className="w-5 h-5 text-gray-600" />,
      amount: '$8,400.00',
      dueDate: 'Oct 26, 2023',
      status: 'AWAITING PAYMENT',
      statusType: 'default'
    },
    {
      id: 'TXN-7731-I',
      client: 'Nexa Network Solutions',
      icon: <Network className="w-5 h-5 text-gray-600" />,
      amount: '$67,000.00',
      dueDate: 'Nov 02, 2023',
      status: 'INVOICED',
      statusType: 'warning'
    }
  ];

  return (
    <div className="min-h-screen bg-[#d1d9e2] p-8 font-sans text-[#1a2b4b]">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Payment Queue</h1>
            <p className="text-gray-600 text-sm">
              Manage and confirm incoming transfers from enterprise clients.
            </p>
          </div>
          
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-md text-sm font-semibold shadow-sm border border-gray-200">
              All Statuses <ChevronDown size={16} />
            </button>
            <button className="flex items-center gap-2 bg-[#0f172a] text-white px-4 py-2 rounded-md text-sm font-semibold shadow-sm">
              Filter View
            </button>
          </div>
        </div>

        {/* Table Headers */}
        <div className="grid grid-cols-12 px-6 mb-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
          <div className="col-span-2">Reference ID</div>
          <div className="col-span-3">Client Entity</div>
          <div className="col-span-2 text-center">Amount</div>
          <div className="col-span-2 text-center">Due Date</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* List Items */}
        <div className="space-y-4">
          {payments.map((item, index) => (
            <div 
              key={index} 
              className="grid grid-cols-12 items-center bg-[#aeb9c7] hover:bg-[#a4b0bf] transition-colors p-6 rounded-lg shadow-sm"
            >
              {/* Reference ID */}
              <div className="col-span-2 font-bold text-xs">
                {item.id}
              </div>

              {/* Client Entity */}
              <div className="col-span-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-white/50 rounded flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="font-bold text-sm">{item.client}</span>
              </div>

              {/* Amount */}
              <div className="col-span-2 text-center font-bold text-lg">
                {item.amount}
              </div>

              {/* Due Date */}
              <div className="col-span-2 text-center text-sm font-medium">
                {item.dueDate}
              </div>

              {/* Status */}
              <div className="col-span-2 flex justify-center">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-tighter ${
                  item.statusType === 'warning' 
                    ? 'bg-[#e5c49e] text-[#8a6d4d]' 
                    : 'bg-[#ced7e0] text-[#6b7c93]'
                }`}>
                  {item.status}
                </span>
              </div>

              {/* Actions */}
              <div className="col-span-1 text-right">
                <button className="bg-[#0f172a] text-white text-[10px] font-bold py-2 px-3 rounded leading-tight hover:bg-black transition-colors uppercase">
                  Confirm <br /> Paid
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentQueue;
