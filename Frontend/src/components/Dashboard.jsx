import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { LogOut, Shield, User as UserIcon } from 'lucide-react';
import PaymentForm from './PaymentForm';
import Transactions from './Transactions';

// Load Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_REACT_APP_STRIPE_PUBLIC_KEY);

const Dashboard = ({ role, onLogout }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handlePaymentSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Payment Gateway</h1>
                <p className="text-xs text-gray-600">Secure payment processing</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
                <UserIcon className="w-4 h-4 text-blue-600" />
                <span className="px-2 py-0.5 bg-blue-200 text-blue-800 text-xs rounded-full uppercase font-semibold">
                  {role}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Section */}
          {role !== 'admin' && (
            <div>
              <Elements stripe={stripePromise}>
                <PaymentForm onPaymentSuccess={handlePaymentSuccess} />
              </Elements>
            </div>
          )}

          {/* Transactions Section */}
          <div>
            <Transactions role={role} refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;