import React, { useEffect, useState } from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react'; 

function TransactionModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  tx,
  categories,
}) {
  const [formData, setFormData] = useState({});

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (tx) {
        setFormData(tx); 
      } else {
  
        setFormData({
          date: new Date().toISOString().split('T')[0],
          details: '',
          amount: '',
          category: categories[0] || 'Uncategorized',
          type: 'Not Fixed',
        });
      }
    }
    
    setIsConfirmingDelete(false);
  }, [tx, isOpen, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      amount: parseFloat(formData.amount) || 0,
    });
  };


  const handleDeleteClick = () => {
    setIsConfirmingDelete(true);
  };
 
  const handleConfirmDelete = () => {
    onDelete(formData.id);
  };

  const handleCancelDelete = () => {
    setIsConfirmingDelete(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 transition-opacity duration-300 opacity-100 z-50">
      <div className="modal-content bg-card w-full max-w-lg rounded-lg shadow-xl transform transition-transform duration-300 scale-100 overflow-hidden">
       
        {isConfirmingDelete ? (
          <div className="p-8">
            <div className="flex flex-col items-center text-center">
              <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
              <h2 className="text-2xl font-bold text-text-primary mb-2">Are you sure?</h2>
              <p className="text-text-secondary mb-6">
                This transaction will be permanently deleted.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleCancelDelete}
                className="bg-gray-200 hover:bg-gray-300 text-text-primary font-bold py-3 px-4 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>

        ) : (
          <form
            id="transactionForm"
            className="p-8 space-y-6"
            onSubmit={handleSubmit}
          >
            <div className="flex justify-between items-center">
              <h2
                id="modalTitle"
                className="text-2xl font-bold text-text-primary"
              >
                {tx ? 'Edit Transaction' : 'Add Transaction'}
              </h2>

              <button
                type="button"
                onClick={onClose}
                className="text-text-secondary hover:text-text-primary"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Form fields (no changes here) */}
            <div>
              <label
                htmlFor="transactionDate"
                className="block text-sm font-medium text-text-primary"
              >
                Date
              </label>
              <input
                type="date"
                id="transactionDate"
                name="date"
                value={formData.date || ''}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label
                htmlFor="transactionDetails"
                className="block text-sm font-medium text-text-primary"
              >
                Details
              </label>
              <input
                type="text"
                id="transactionDetails"
                name="details"
                value={formData.details || ''}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label
                htmlFor="transactionAmount"
                className="block text-sm font-medium text-text-primary"
              >
                Amount (use - for expenses)
              </label>
              <input
                type="number"
                step="0.01"
                id="transactionAmount"
                name="amount"
                value={formData.amount || ''}
                onChange={handleChange}
                required
                placeholder="-12.99"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label
                htmlFor="transactionCategory"
                className="block text-sm font-medium text-text-primary"
              >
                Category
              </label>
              <input
                list="category-list"
                id="transactionCategory"
                name="category"
                value={formData.category || ''}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
              />
              <datalist id="category-list">
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="Uncategorized">Uncategorized</option>
              </datalist>
            </div>
            <div>
              <label
                htmlFor="transactionType"
                className="block text-sm font-medium text-text-primary"
              >
                Type
              </label>
              <select
                id="transactionType"
                name="type"
                value={formData.type || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="Not Fixed">Not Fixed</option>
                <option value="Fixed">Fixed</option>
                <option value="Income">Income</option>
                <option value="Not Applicable">Not Applicable</option>
              </select>
            </div>

            <div className="flex justify-between items-center pt-4">
              <div>
                {tx && (
                  <button
                    type="button"
                    id="deleteTransactionBtn"
                       onClick={handleDeleteClick}
                    className="text-red-600 hover:text-red-800 font-semibold transition flex items-center"
                  >
                    <Trash2 className="mr-1 h-4 w-4" /> Delete
                  </button>
                )}
              </div>
              <div>
                <button
                  type="button"
                  id="cancelBtn"
                  onClick={onClose}
                  className="bg-gray-200 hover:bg-gray-300 text-text-primary font-bold py-2 px-4 rounded-lg transition mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default TransactionModal;