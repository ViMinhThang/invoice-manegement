import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ItemDetailsForm from './form_checkout/checkout';
import PaymentQueue from './Confirm_Payment/confirm_payment';

const Dashboard = () => <div className="p-8">Dashboard Page</div>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Route mặc định hướng về trang Payment Queue */}
        <Route path="/" element={<ItemDetailsForm/>} />
        
        <Route path="/payments" element={<PaymentQueue />} />
        
        <Route path="/dashboard" element={<Dashboard />} />
        
        <Route path="*" element={<div className="p-8">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
