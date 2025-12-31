'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Shield, Save, CheckSquare, Square } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { adminService } from '@/lib/services/AdminServices';

const PERMISSION_GROUPS = {
  "Dashboard & Applications": [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'manage_application', label: 'Manage Applications' },
    { key: 'disburse_application', label: 'Disburse Applications' },
    { key: 'credit_approval', label: 'Credit Approval' },
    { key: 'sanction_application', label: 'Sanction Application' },
    { key: 'inprocess_application', label: 'In-process Application' },
    { key: 'followup_application', label: 'Follow-up Application' },
    { key: 'complete_application', label: 'Complete Application' },
    { key: 'pending_application', label: 'Pending Application' },
    { key: 'rejected_application', label: 'Rejected Application' },
    { key: 'all_enquiries', label: 'All Enquiries' },
  ],
  "Reporting & Collection": [
    { key: 'disburse_reporting', label: 'Disburse Reporting' },
    { key: 'collection_reporting', label: 'Collection Reporting' },
    { key: 'auto_collection', label: 'Auto Collection' },
    { key: 'ledger', label: 'Ledger' },
    { key: 'bank_ledger', label: 'Bank Ledger' },
    { key: 'cibil_report', label: 'CIBIL Report' },
    { key: 'tally_ledger', label: 'Tally Ledger' },
    { key: 'tally_export', label: 'Tally Export' },
    { key: 'overdue_applicants', label: 'Overdue Applicants' },
    { key: 'payment_receipt', label: 'Payment Receipt' },
    { key: 'profit_and_loss', label: 'Profit & Loss' },
  ],
  "Master Settings": [
    { key: 'master_setting', label: 'Master Setting' },
    { key: 'manage_advocate', label: 'Manage Advocate' },
    { key: 'manage_bank', label: 'Manage Bank' },
    { key: 'manage_admin', label: 'Manage Admin' },
    { key: 'statement_of_account', label: 'Statement of Account' },
  ],
  "Deposit & Legal": [
    { key: 'cash_deposit', label: 'Cash Deposit' },
    { key: 'cheque_deposit', label: 'Cheque Deposit' },
    { key: 'emandate_deposit', label: 'E-mandate Deposit' },
    { key: 'legal', label: 'Legal' },
    { key: 'complaints', label: 'Complaints' },
    { key: 'rbi_guidelines', label: 'RBI Guidelines' },
  ],
  "Client & Marketing": [
    { key: 'clients_history', label: 'Clients History' },
    { key: 'register_from_app', label: 'Register from App' },
    { key: 'download_app', label: 'Download App' },
    { key: 'notification', label: 'Notification' },
    { key: 'references', label: 'References' },
    { key: 'help_ticket', label: 'Help Ticket' },
    { key: 'blogs', label: 'Blogs' },
    { key: 'reviews', label: 'Reviews' },
    { key: 'send_sms', label: 'Send SMS' },
    { key: 'create_myastro_account', label: 'Create MyAstro Account' },
    { key: 'business_loan_enquiry', label: 'Business Loan Enquiry' },
  ],
  "Collection & Application": [
    { key: 'collection', label: 'Collection' },
    { key: 'application', label: 'Application' },
    { key: 'noc', label: 'NOC' },
    { key: 'refund_pdc', label: 'Refund PDC' },
    { key: 'appraisal', label: 'Appraisal' },
    { key: 'eligibility', label: 'Eligibility' },
    { key: 'replace_kyc', label: 'Replace KYC' },
    { key: 'disburse_status', label: 'Disburse Status' },
    { key: 'bank_verify', label: 'Bank Verify' },
    { key: 'disburse_approval_by', label: 'Disburse Approval By' },
    { key: 'ready_to_disburse', label: 'Ready to Disburse' },
  ],
  "Disbursement & Documents": [
    { key: 'ready_to_verify', label: 'Ready to Verify' },
    { key: 'check_no', label: 'Check No' },
    { key: 'send_to_courier', label: 'Send to Courier' },
    { key: 'courier_picked', label: 'Courier Picked' },
    { key: 'original_document_received', label: 'Original Document Received' },
    { key: 'disburse_behalf_of_emandate', label: 'Disburse Behalf of E-mandate' },
    { key: 'sanction_mail', label: 'Sanction Mail' },
    { key: 'original_document_status_change', label: 'Original Document Status Change' },
    { key: 'loan_approved', label: 'Loan Approved' },
    { key: 'transaction', label: 'Transaction' },
    { key: 'adjustment', label: 'Adjustment' },
    { key: 'settle', label: 'Settle' },
  ],
};

const PermissionsModal = ({ isOpen, onClose, adminId, adminName, isDark, onSavePermissions }) => {
  // Initialize permissions with all keys set to 0 (false) to prevent uncontrolled inputs
  const initializePermissions = () => {
    const initialPermissions = {};
    Object.values(PERMISSION_GROUPS).forEach(group => {
      group.forEach(item => {
        initialPermissions[item.key] = 0; // Initialize all to false (0)
      });
    });
    return initialPermissions;
  };

  const [permissions, setPermissions] = useState(initializePermissions());
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectAllState, setSelectAllState] = useState({});
  const modalRef = useRef(null);

  const loadPermissions = async () => {
    try {
      setIsLoading(true);
      const response = await adminService.getPermissions(adminId);
      
      if (response.success) {
        const normalizedPermissions = initializePermissions(); // Start with all false
        
        // Update with actual values from API
        Object.keys(response.data).forEach(key => {
          if (['id', 'admin_id', 'created_at', 'updated_at'].includes(key)) return;
          normalizedPermissions[key] = response.data[key] ? 1 : 0;
        });
        
        setPermissions(normalizedPermissions);
        updateSelectAllStates(normalizedPermissions);
      } else {
        throw new Error(response.message || 'Failed to load permissions');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load permissions');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSelectAllStates = (perms) => {
    const newSelectAllState = {};
    Object.keys(PERMISSION_GROUPS).forEach(groupKey => {
      const groupPermissions = PERMISSION_GROUPS[groupKey];
      const allChecked = groupPermissions.every(item => perms[item.key]);
      const someChecked = groupPermissions.some(item => perms[item.key]);
      newSelectAllState[groupKey] = allChecked ? 'all' : someChecked ? 'some' : 'none';
    });
    setSelectAllState(newSelectAllState);
  };

  const handlePermissionChange = (key) => {
    const newPermissions = { 
      ...permissions, 
      [key]: permissions[key] ? 0 : 1 
    };
    setPermissions(newPermissions);
    updateSelectAllForGroup(key, newPermissions);
  };

  const updateSelectAllForGroup = (changedKey, currentPermissions) => {
    const groupKey = Object.keys(PERMISSION_GROUPS).find(gKey => 
      PERMISSION_GROUPS[gKey].some(item => item.key === changedKey)
    );
    
    if (groupKey) {
      const groupPermissions = PERMISSION_GROUPS[groupKey];
      const allChecked = groupPermissions.every(item => currentPermissions[item.key]);
      const someChecked = groupPermissions.some(item => currentPermissions[item.key]);
      
      setSelectAllState(prev => ({
        ...prev,
        [groupKey]: allChecked ? 'all' : someChecked ? 'some' : 'none'
      }));
    }
  };

  const handleSelectAll = (groupKey, select = true) => {
    const updatedPermissions = { ...permissions };
    PERMISSION_GROUPS[groupKey].forEach(item => {
      updatedPermissions[item.key] = select ? 1 : 0;
    });
    
    setPermissions(updatedPermissions);
    setSelectAllState(prev => ({
      ...prev,
      [groupKey]: select ? 'all' : 'none'
    }));
  };

  const handleSelectAllGlobal = (select = true) => {
    const updatedPermissions = { ...permissions };
    const newSelectAllState = {};
    
    Object.keys(PERMISSION_GROUPS).forEach(groupKey => {
      PERMISSION_GROUPS[groupKey].forEach(item => {
        updatedPermissions[item.key] = select ? 1 : 0;
      });
      newSelectAllState[groupKey] = select ? 'all' : 'none';
    });
    
    setPermissions(updatedPermissions);
    setSelectAllState(newSelectAllState);
  };

  const handleSave = async () => {
    if (!adminId) {
      toast.error('No admin selected');
      return;
    }
    
    try {
      setIsSaving(true);
      await onSavePermissions(adminId, permissions);
      toast.success('Permissions updated successfully!');
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to save permissions');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) onClose();
    };
    
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && adminId) {
      loadPermissions();
    } else {
      // Reset to initialized state when modal closes
      setPermissions(initializePermissions());
      setSelectAllState({});
    }
  }, [isOpen, adminId]);

  if (!isOpen) return null;

  const allowedCount = Object.keys(permissions).filter(key => permissions[key]).length;
  const totalCount = Object.values(PERMISSION_GROUPS).flat().length;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div ref={modalRef} className={`relative w-full max-w-6xl rounded-xl shadow-2xl ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`} onClick={e => e.stopPropagation()}>
            
            {/* Header */}
            <div className={`sticky top-0 z-10 px-6 py-4 border-b rounded-t-xl ${
              isDark ? 'border-emerald-600/50 bg-gray-900' : 'border-emerald-300 bg-emerald-50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${isDark ? 'bg-emerald-900/50' : 'bg-emerald-100'}`}>
                    <Shield className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  </div>
                  <div>
                    <h2 className={`font-bold text-lg ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
                      Manage Permissions
                    </h2>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {adminName} - Set access permissions
                    </p>
                  </div>
                </div>
                <button onClick={onClose} className={`p-2 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-500'
                }`}>
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Global Actions */}
            <div className={`sticky top-16 z-10 p-4 border-b ${
              isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <div className={`p-1.5 rounded ${isDark ? 'bg-emerald-900/30' : 'bg-emerald-100'}`}>
                    <CheckSquare className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  </div>
                  <span className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
                    Global Permissions
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => handleSelectAllGlobal(true)} className={`px-3 py-1.5 text-sm rounded-lg flex items-center space-x-1 ${
                    isDark ? 'bg-emerald-900/30 hover:bg-emerald-800/50 text-emerald-300 border border-emerald-700' 
                    : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border border-emerald-300'
                  }`}>
                    <CheckSquare className="w-4 h-4" />
                    <span>Select All</span>
                  </button>
                  <button onClick={() => handleSelectAllGlobal(false)} className={`px-3 py-1.5 text-sm rounded-lg flex items-center space-x-1 ${
                    isDark ? 'bg-red-900/30 hover:bg-red-800/50 text-red-300 border border-red-700' 
                    : 'bg-red-100 hover:bg-red-200 text-red-700 border border-red-300'
                  }`}>
                    <Square className="w-4 h-4" />
                    <span>Deselect All</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Permissions Grid */}
            <div className={`max-h-[60vh] overflow-y-auto p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className={`w-10 h-10 border-2 border-t-transparent rounded-full animate-spin ${
                    isDark ? 'border-emerald-400' : 'border-emerald-600'
                  }`}></div>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Loading permissions...
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(PERMISSION_GROUPS).map(([groupKey, groupItems]) => (
                    <div key={groupKey} className={`rounded-lg border ${
                      isDark ? 'border-emerald-600/30 bg-gray-900/30' : 'border-emerald-300 bg-emerald-50/30'
                    }`}>
                      <div className={`p-4 border-b flex justify-between items-center ${
                        isDark ? 'border-emerald-600/20' : 'border-emerald-300'
                      }`}>
                        <h3 className={`font-semibold ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
                          {groupKey}
                        </h3>
                        <div className="flex space-x-2">
                          <button onClick={() => handleSelectAll(groupKey, true)} className={`p-1.5 rounded ${
                            selectAllState[groupKey] === 'all' 
                              ? isDark ? 'bg-emerald-900/50 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                              : isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                          }`}>
                            <CheckSquare className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleSelectAll(groupKey, false)} className={`p-1.5 rounded ${
                            isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                          }`}>
                            <Square className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="space-y-2">
                          {groupItems.map((item) => {
                            const isChecked = Boolean(permissions[item.key]); // Ensure boolean
                            return (
                              <div key={item.key} className="flex items-center justify-between hover:bg-gray-100/10 dark:hover:bg-gray-700/10 p-2 rounded">
                                <label className={`flex items-center space-x-3 cursor-pointer w-full ${
                                  isDark ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => handlePermissionChange(item.key)}
                                    className={`w-4 h-4 rounded cursor-pointer ${
                                      isDark ? 'bg-gray-700 border-emerald-500 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-gray-800'
                                      : 'border-emerald-400 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-white'
                                    }`}
                                  />
                                  <span className="text-sm">{item.label}</span>
                                </label>
                                <div className={`px-2 py-1 text-xs rounded ${
                                  isChecked
                                    ? isDark ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                                    : isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700'
                                }`}>
                                  {isChecked ? 'Allowed' : 'Denied'}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={`sticky bottom-0 px-6 py-4 border-t rounded-b-xl ${
              isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {allowedCount} of {totalCount} permissions allowed
                </p>
                <div className="flex space-x-3">
                  <button onClick={onClose} className={`px-4 py-2 rounded-lg font-medium ${
                    isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}>
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={isSaving} className={`px-6 py-2 rounded-lg font-medium text-white flex items-center space-x-2 ${
                    isSaving ? 'bg-gray-400 cursor-not-allowed'
                    : isDark 
                      ? 'bg-gradient-to-r from-emerald-700 to-emerald-900 hover:from-emerald-600 hover:to-emerald-800'
                      : 'bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600'
                  }`}>
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Permissions</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PermissionsModal;