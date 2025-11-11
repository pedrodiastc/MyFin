import React, { useState, useMemo } from 'react';
import Uploader from '../components/Uploader';
import TransactionTable from '../components/TransactionTable';
import TransactionModal from '../components/TransactionModal';
import { Search, ListFilter, FilterX } from 'lucide-react';

const getTransactionTypes = (transactions) => {
  return ['All', ...new Set(transactions.map((t) => t.type))].sort();
};

// --- 1. ACCEPT filters AND setFilters AS PROPS ---
// Remove setTransactions, as it's passed from App.js
function TransactionsPage({
  transactions,
  setTransactions,
  filters,
  setFilters,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // --- Memoize categories and types ---
  const allCategories = useMemo(() => {
    return ['All', ...new Set(transactions.map((t) => t.category))].sort();
  }, [transactions]);

  const allTypes = useMemo(
    () => getTransactionTypes(transactions),
    [transactions]
  );

  const filteredTransactions = useMemo(() => {
    const min = parseFloat(filters.minAmount);
    const max = parseFloat(filters.maxAmount);

    return transactions.filter((tx) => {
      const txAmount = parseFloat(tx.amount);
      const categoryMatch =
        filters.category === 'All' || tx.category === filters.category;
      const typeMatch = filters.type === 'All' || tx.type === filters.type;
      const searchMatch =
        !filters.searchTerm ||
        (tx.details &&
          tx.details.toLowerCase().includes(filters.searchTerm.toLowerCase()));
      const startDateMatch =
        !filters.startDate || (tx.date && tx.date >= filters.startDate);
      const endDateMatch =
        !filters.endDate || (tx.date && tx.date <= filters.endDate);
      const minAmountMatch = isNaN(min) || txAmount >= min;
      const maxAmountMatch = isNaN(max) || txAmount <= max;

      return (
        categoryMatch &&
        typeMatch &&
        searchMatch &&
        startDateMatch &&
        endDateMatch &&
        minAmountMatch &&
        maxAmountMatch
      );
    });
  }, [transactions, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      category: 'All',
      type: 'All',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
    });
  };

  const handleDataLoaded = (loadedTransactions) => {
    const transactionsWithIds = loadedTransactions.map((tx, index) =>
      tx.id ? tx : { ...tx, id: Date.now() + index }
    );
    setTransactions(transactionsWithIds);
  };
  const handleOpenModal = (tx = null) => {
    setEditingTransaction(tx);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };
  const handleSaveTransaction = (txToSave) => {
    if (txToSave.id) {
      setTransactions((prev) =>
        prev.map((tx) => (tx.id === txToSave.id ? txToSave : tx))
      );
    } else {
      setTransactions((prev) => [{ ...txToSave, id: Date.now() }, ...prev]);
    }
    handleCloseModal();
  };
  const handleDeleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    handleCloseModal();
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-extrabold text-text-primary">
        Transactions
      </h1>

      <Uploader onDataLoaded={handleDataLoaded} />

      {/* All the inputs here already use 'filters' and 'handleFilterChange' */}
      {/* so they will work perfectly with the new props. */}
      {transactions.length > 0 && (
        <section className="bg-card p-6 rounded-lg shadow">
          {/* ... (existing filter section JSX) ... */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-text-primary flex items-center">
              <ListFilter className="mr-2 h-6 w-6" />
              Filter Transactions
            </h3>
            <button
              onClick={clearFilters}
              className="text-sm text-primary-600 hover:text-primary-800 font-medium flex items-center"
            >
              <FilterX className="mr-1 h-4 w-4" />
              Clear All Filters
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative">
              <label
                htmlFor="searchTerm"
                className="block text-sm font-medium text-text-secondary mb-1"
              >
                Search Details
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 pt-6 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-text-secondary" />
              </div>
              <input
                type="text"
                id="searchTerm"
                name="searchTerm"
                placeholder="e.g., Coffee shop..."
                value={filters.searchTerm}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-text-secondary mb-1"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full py-2 pl-3 pr-10 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white"
              >
                {allCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 pt-6 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-text-secondary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* Type Filter */}
            <div className="relative">
              <label
                htmlFor="type"
                className="block text-sm font-medium text-text-secondary mb-1"
              >
                Type
              </label>
              <select
                id="type"
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full py-2 pl-3 pr-10 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white"
              >
                {allTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 pt-6 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-text-secondary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* Date Filters */}
            <div className="relative">
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-text-secondary mb-1"
              >
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="relative">
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-text-secondary mb-1"
              >
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Amount Filters */}
            <div className="lg:col-span-1 grid grid-cols-2 gap-4">
              <div className="relative">
                <label
                  htmlFor="minAmount"
                  className="block text-sm font-medium text-text-secondary mb-1"
                >
                  Min Amount
                </label>
                <input
                  type="number"
                  id="minAmount"
                  name="minAmount"
                  placeholder="0.00"
                  step="0.01"
                  value={filters.minAmount}
                  onChange={handleFilterChange}
                  className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div className="relative">
                <label
                  htmlFor="maxAmount"
                  className="block text-sm font-medium text-text-secondary mb-1"
                >
                  Max Amount
                </label>
                <input
                  type="number"
                  id="maxAmount"
                  name="maxAmount"
                  placeholder="100.00"
                  step="0.01"
                  value={filters.maxAmount}
                  onChange={handleFilterChange}
                  className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* --- Pass filtered transactions to the table --- */}
      <TransactionTable
        transactions={filteredTransactions}
        onEdit={handleOpenModal}
        onAdd={() => handleOpenModal(null)}
      />

      {/* --- Modal --- */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTransaction}
        onDelete={handleDeleteTransaction}
        tx={editingTransaction}
        categories={allCategories.filter((cat) => cat !== 'All')}
      />
    </div>
  );
}

export default TransactionsPage;
