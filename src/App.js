import React, { useState, useEffect } from 'react';
// --- 1. IMPORT THE 'Settings' ICON ---
import { LayoutDashboard, Receipt, BarChartHorizontal, Menu, Settings } from 'lucide-react'; 

import Sidebar from './components/Sidebar.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import TransactionsPage from './pages/TransactionsPage.jsx';
import InvestmentsPage from './pages/InvestmentsPage.jsx';
// --- 2. IMPORT THE NEW 'SettingsPage' ---
import SettingsPage from './pages/SettingsPage.jsx';

// --- Mobile-only header component (Unchanged) ---
function MobileHeader({ onMenuClick }) {
  // ... (existing code) ...
  return (
    <header className="bg-card p-4 shadow-md md:hidden sticky top-0 z-20">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
            <svg className="h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            <span className="text-2xl font-bold text-text-primary">MyFin</span>
        </div>
        {/* Menu Button */}
        <button onClick={onMenuClick} className="text-text-primary p-2">
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
}

// --- MAIN APP COMPONENT ---
export default function App() {
  // --- STATE (Unchanged) ---
  const [page, setPage] = useState('dashboard');
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [transactions, setTransactions] = useState(() => {
    try {
      const savedData = localStorage.getItem('financial-app-transactions');
      return savedData ? JSON.parse(savedData) : [];
    } catch (e) {
      console.error('Failed to load transactions from localStorage', e);
      return [];
    }
  });

  const [filters, setFilters] = useState({
    searchTerm: '',
    category: 'All',
    type: 'All',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
  });

  // --- EFFECTS (Unchanged) ---
  useEffect(() => {
    try {
      localStorage.setItem(
        'financial-app-transactions',
        JSON.stringify(transactions)
      );
    } catch (e) {
      console.error('Failed to save transactions to localStorage', e);
    }
  }, [transactions]);

  // --- NAVIGATION ---
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'investments', label: 'Investments', icon: BarChartHorizontal },
    // --- 3. ADD 'Settings' TO THE NAV ---
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (pageId) => {
    setPage(pageId);
    setIsMobileSidebarOpen(false); 
  };
  
  const handleCategoryDrilldown = (categoryName) => {
    // ... (existing code) ...
    setFilters({
      searchTerm: '',
      category: categoryName,
      type: 'All',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
    });
    setPage('transactions');
    setIsMobileSidebarOpen(false);
  };


  // --- RENDER ---
  return (
    <div className="flex h-screen bg-background font-sans">
      {/* --- SIDEBARS (Unchanged) --- */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={() => setIsMobileSidebarOpen(false)}
        ></div>
      )}
      <div 
        className={`
          fixed top-0 left-0 h-full z-40 md:hidden 
          transition-transform duration-300 ease-in-out
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <Sidebar 
          currentPage={page} 
          onNavClick={handleNavClick} 
          navItems={navItems} 
          isSidebarOpen={true} 
          onToggleSidebar={() => setIsMobileSidebarOpen(false)}
          isMobile={true}
        />
      </div>
      <div className="hidden md:block">
        <Sidebar 
          currentPage={page} 
          onNavClick={handleNavClick} 
          navItems={navItems} 
          isSidebarOpen={isDesktopSidebarOpen}
          onToggleSidebar={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
          isMobile={false}
        />
      </div>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto">
        <MobileHeader onMenuClick={() => setIsMobileSidebarOpen(true)} />

        <div className="max-w-7xl mx-auto p-4 sm:p-8">
          {page === 'dashboard' && (
            <DashboardPage 
              transactions={transactions} 
              onCategoryDrilldown={handleCategoryDrilldown} 
            />
          )}
          {page === 'transactions' && (
            <TransactionsPage
              transactions={transactions}
              setTransactions={setTransactions}
              filters={filters}
              setFilters={setFilters}
            />
          )}
          {page === 'investments' && <InvestmentsPage />}
          
          {/* --- 4. RENDER THE NEW 'SettingsPage' --- */}
          {page === 'settings' && <SettingsPage />}
        </div>
      </main>
    </div>
  );
}
