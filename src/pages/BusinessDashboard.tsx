import React, { useState } from 'react';
import { Users, Package, LogOut, UserPlus } from 'lucide-react';
import { useLeads } from '../store/LeadContext';
import { useAuth } from '../store/AuthContext';
import AuthModal from '../components/AuthModal';
import LeadTable from '../components/LeadTable';
import AccountSettings from '../components/AccountSettings';

const BusinessDashboard = () => {
  const { state } = useLeads();
  const { user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const availableLeads = state.leads.filter(lead => lead.status === 'New');
  const purchasedLeads = state.leads.filter(lead => lead.status === 'Purchased' && lead.purchasedBy === user?.id);

  const handleAuthClick = (signup: boolean) => {
    setIsSignUp(signup);
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {user ? (
          <>
            {/* Sign Out Button */}
            <div className="flex justify-end mb-4 sm:mb-6">
              <button
                onClick={logout}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>

            {/* Account Settings */}
            <AccountSettings />

            {/* Stats Section */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {[
                { title: "Purchased Leads", value: purchasedLeads.length.toString(), icon: Package, color: "bg-green-500" },
                { title: "Available Leads", value: availableLeads.length.toString(), icon: Users, color: "bg-blue-500" }
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">{stat.title}</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} p-2 sm:p-3 rounded-lg`}>
                      <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="max-w-2xl mx-auto mb-8 sm:mb-12 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 sm:p-8 text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">Access the Business Portal</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-8">Sign in to your account or create a new one to start purchasing leads</p>
              <button
                onClick={() => handleAuthClick(false)}
                className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Sign in / Create Account
              </button>
            </div>
          </div>
        )}

        {/* Lead Tables - Show purchased leads first for logged-in users */}
        {user && <LeadTable leads={purchasedLeads} type="purchased" />}
        <LeadTable leads={availableLeads} type="available" />

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => setShowAuthModal(false)}
          isSignUp={isSignUp}
        />
      </div>
    </div>
  );
};

export default BusinessDashboard;