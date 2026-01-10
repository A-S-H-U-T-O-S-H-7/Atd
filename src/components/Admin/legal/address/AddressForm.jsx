"use client";
import React from "react";

const AddressForm = ({ 
  newAddress, 
  setNewAddress, 
  isLoading, 
  isDark, 
  editingAddress, 
  handleUpdateAddress, 
  handleAddAddress, 
  setIsAddingAddress, 
  setEditingAddress, 
  resetForm 
}) => {
  const handleStatusChange = (status) => {
    setNewAddress({
      ...newAddress,
      status: status
    });
  };

  return (
    <div className={`mb-4 p-3.5 rounded-lg border ${
      isDark
        ? "bg-gray-800/40 border-gray-700"
        : "bg-gray-50 border-gray-200"
    }`}>
      <h5 className={`text-sm font-medium mb-2 ${
        isDark ? "text-emerald-300" : "text-teal-600"
      }`}>
        {editingAddress ? "Edit Address" : "Add New Address"}
      </h5>
      
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className={`block text-xs font-medium mb-1 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}>
              Type
            </label>
            <select
              value={newAddress.types}
              onChange={(e) => !isLoading && setNewAddress({
                ...newAddress,
                types: e.target.value
              })}
              disabled={isLoading}
              className={`w-full px-3 py-2 text-xs rounded border ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                  : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
              }`}
            >
              <option value="Legal Notice">Legal Notice (138)</option>
              <option value="Arbitration">Arbitration</option>
            </select>
          </div>
          
          <div>
            <label className={`block text-xs font-medium mb-1 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}>
              Status
            </label>
            <select
              value={newAddress.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={isLoading}
              className={`w-full px-3 py-2 text-xs rounded border ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                  : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
              }`}
            >
              <option value="Pending">Pending</option>
              <option value="Posted">Posted</option>
              <option value="Delivered">Delivered</option>
              <option value="Returned">Returned</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>
        </div>

        <div>
          <label className={`block text-xs font-medium mb-1 ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}>
            Address
          </label>
          <textarea
            value={newAddress.address}
            onChange={(e) => !isLoading && setNewAddress({
              ...newAddress,
              address: e.target.value
            })}
            disabled={isLoading}
            rows="2"
            className={`w-full px-3 py-2 text-xs rounded border ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            } ${
              isDark
                ? "bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
            }`}
            placeholder="Enter full address"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className={`block text-xs font-medium mb-1 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}>
              Posted Date
            </label>
            <input
              type="date"
              value={newAddress.posted_date}
              onChange={(e) => !isLoading && setNewAddress({
                ...newAddress,
                posted_date: e.target.value
              })}
              disabled={isLoading}
              className={`w-full px-3 py-2 text-xs rounded border ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                  : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
              }`}
            />
          </div>

          {/* Conditionally show Delivered Date when status is "Delivered" */}
          {newAddress.status === "Delivered" && (
            <div>
              <label className={`block text-xs font-medium mb-1 ${
                isDark ? "text-green-300" : "text-green-600"
              }`}>
                Delivered Date *
              </label>
              <input
                type="date"
                value={newAddress.delivered_date}
                onChange={(e) => !isLoading && setNewAddress({
                  ...newAddress,
                  delivered_date: e.target.value
                })}
                disabled={isLoading}
                className={`w-full px-3 py-2 text-xs rounded border ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  isDark
                    ? "bg-gray-800 border-green-700 text-gray-100 focus:border-green-500 focus:ring-1 focus:ring-green-500/30"
                    : "bg-white border-green-300 text-gray-900 focus:border-green-500 focus:ring-1 focus:ring-green-500/30"
                }`}
              />
            </div>
          )}

          {/* Conditionally show Return Date when status is "Returned" */}
          {newAddress.status === "Returned" && (
            <div>
              <label className={`block text-xs font-medium mb-1 ${
                isDark ? "text-amber-300" : "text-amber-600"
              }`}>
                Return Date *
              </label>
              <input
                type="date"
                value={newAddress.return_date}
                onChange={(e) => !isLoading && setNewAddress({
                  ...newAddress,
                  return_date: e.target.value
                })}
                disabled={isLoading}
                className={`w-full px-3 py-2 text-xs rounded border ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  isDark
                    ? "bg-gray-800 border-amber-700 text-gray-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30"
                    : "bg-white border-amber-300 text-gray-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30"
                }`}
              />
            </div>
          )}

          {/* Show Delivered Date when editing and delivered_date exists (even if status changed) */}
          {editingAddress && editingAddress.delivered_date && newAddress.status !== "Delivered" && newAddress.status !== "Returned" && (
            <div>
              <label className={`block text-xs font-medium mb-1 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}>
                Delivered Date (Previous)
              </label>
              <input
                type="text"
                value={editingAddress.delivered_date?.split('T')[0] || ''}
                disabled
                className={`w-full px-3 py-2 text-xs rounded border ${
                  isDark
                    ? "bg-gray-800/50 border-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              />
            </div>
          )}

          {/* Show Return Date when editing and return_date exists (even if status changed) */}
          {editingAddress && editingAddress.return_date && newAddress.status !== "Returned" && newAddress.status !== "Delivered" && (
            <div>
              <label className={`block text-xs font-medium mb-1 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}>
                Return Date (Previous)
              </label>
              <input
                type="text"
                value={editingAddress.return_date?.split('T')[0] || ''}
                disabled
                className={`w-full px-3 py-2 text-xs rounded border ${
                  isDark
                    ? "bg-gray-800/50 border-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className={`block text-xs font-medium mb-1 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}>
              Tracking No.
            </label>
            <input
              type="text"
              value={newAddress.tracking_no}
              onChange={(e) => !isLoading && setNewAddress({
                ...newAddress,
                tracking_no: e.target.value
              })}
              disabled={isLoading}
              className={`w-full px-3 py-2 text-xs rounded border ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                  : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
              }`}
              placeholder="Tracking number"
            />
          </div>

          <div>
            <label className={`block text-xs font-medium mb-1 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}>
              Remarks
            </label>
            <input
              type="text"
              value={newAddress.remarks}
              onChange={(e) => !isLoading && setNewAddress({
                ...newAddress,
                remarks: e.target.value
              })}
              disabled={isLoading}
              className={`w-full px-3 py-2 text-xs rounded border ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                  : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
            }`}
              placeholder="Optional remarks"
            />
          </div>
        </div>

        

        
      </div>

      <div className="flex justify-end space-x-2 mt-3">
        <button
          onClick={() => {
            setIsAddingAddress(false);
            setEditingAddress(null);
            resetForm();
          }}
          disabled={isLoading}
          className={`px-3 py-1.5 text-xs rounded transition-all ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          } ${
            isDark
              ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
          }`}
        >
          Cancel
        </button>
        <button
          onClick={editingAddress ? handleUpdateAddress : handleAddAddress}
          disabled={
            isLoading || 
            !newAddress.address.trim() ||
            (newAddress.status === "Delivered" && !newAddress.delivered_date) ||
            (newAddress.status === "Returned" && !newAddress.return_date)
          }
          className={`px-3 py-1.5 text-xs rounded text-white transition-all ${
            isLoading || 
            !newAddress.address.trim() ||
            (newAddress.status === "Delivered" && !newAddress.delivered_date) ||
            (newAddress.status === "Returned" && !newAddress.return_date)
              ? "opacity-50 cursor-not-allowed"
              : ""
          } ${
            isDark
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isLoading ? "Processing..." : editingAddress ? "Update" : "Add"}
        </button>
      </div>
    </div>
  );
};

export default AddressForm;