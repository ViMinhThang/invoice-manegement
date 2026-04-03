import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Component/Sidebar'; 
import ItemDetailsForm from './form_checkout/checkout';
import PaymentQueue from './Confirm_Payment/confirm_payment';
import RecordBill from './RecordBill/RecordBill';

const Dashboard = () => <div className="p-8 font-bold text-2xl">Dashboard Page</div>;

function App() {
  return (
    <Router>
      {}
      <Sidebar>
        <Routes>
          <Route path="/" element={<Navigate to="/invoices" />} />
        
          <Route path="/invoices" element={<ItemDetailsForm />} />
          
          <Route path="/payments" element={<PaymentQueue />} />
          
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/record-bill" element={<RecordBill />} />
          
          <Route path="*" element={<div className="p-8">404 - Page Not Found</div>} />
        </Routes>
      </Sidebar>
    </Router>
  );
}

export default App;