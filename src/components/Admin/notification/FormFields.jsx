"use client";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { Mail, Users, X, Search } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";

export default function FormFields({
  customerType,
  setCustomerType,
  emails,
  setEmails,
  subject,
  setSubject,
  emailOptions = []
}) {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const dropdownRef = useRef(null);

  // Parse emails string back to array of user objects
  useEffect(() => {
    if (emails) {
      try {
        const userIds = JSON.parse(emails);
        if (Array.isArray(userIds) && userIds.length > 0) {
          const users = userIds
            .map(userId => {
              const option = emailOptions.find(opt => opt.id === userId);
              return option ? { id: option.id, email: option.email } : null;
            })
            .filter(user => user !== null);
          setSelectedUsers(users);
        } else {
          setSelectedUsers([]);
        }
      } catch {
        setSelectedUsers([]);
      }
    } else {
      setSelectedUsers([]);
    }
  }, [emails, emailOptions]);

  // Filter email options based on search input using useMemo for performance
  const filteredOptions = useMemo(() => {
    if (!inputValue.trim()) {
      // When search is empty, show all unselected options (limit to 20 for performance)
      return emailOptions
        .filter(option => !selectedUsers.some(user => user.id === option.id))
        .slice(0, 20);
    }
    
    // When searching, filter by email and limit results
    return emailOptions
      .filter(option => 
        option.email.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedUsers.some(user => user.id === option.id)
      )
      .slice(0, 20); // Limit to 20 results for better performance
  }, [inputValue, emailOptions, selectedUsers]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddUser = (user) => {
    if (user && !selectedUsers.some(u => u.id === user.id)) {
      const newUsers = [...selectedUsers, { id: user.id, email: user.email }];
      const userIds = newUsers.map(u => u.id);
      setSelectedUsers(newUsers);
      setEmails(JSON.stringify(userIds));
      setInputValue("");
      setShowDropdown(false);
    }
  };

  const handleRemoveUser = (userId) => {
    const newUsers = selectedUsers.filter(user => user.id !== userId);
    setSelectedUsers(newUsers);
    setEmails(JSON.stringify(newUsers.map(u => u.id)));
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setShowDropdown(true);
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  const handleClearSearch = () => {
    setInputValue("");
    setShowDropdown(true);
  };

  return (
    <div className="grid gap-6">
      {/* Customer Type */}
      <div>
        <label
          className={`flex items-center space-x-2 text-sm font-bold mb-3 ${
            isDark ? "text-gray-100" : "text-gray-700"
          }`}
        >
          <div
            className={`p-1.5 rounded-lg ${
              isDark ? "bg-emerald-900/50" : "bg-emerald-100"
            }`}
          >
            <Users
              className={`w-4 h-4 ${
                isDark ? "text-emerald-400" : "text-emerald-600"
              }`}
            />
          </div>
          <span>Customer Type</span>
        </label>
        <select
          value={customerType}
          onChange={(e) => {
            setCustomerType(e.target.value);
            if (e.target.value === "all") {
              setEmails("");
              setSelectedUsers([]);
            }
          }}
          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
            isDark
              ? "bg-gray-800 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
              : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"
          } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
        >
          <option value="all">All Customers</option>
          <option value="custom">Select Specific Users</option>
        </select>
      </div>

      {/* Email Input with Multi-Select (only if custom) */}
      {customerType === "custom" && (
        <div className="transform transition-all duration-300 ease-in-out">
          <label
            className={`flex items-center space-x-2 text-sm font-bold mb-3 ${
              isDark ? "text-gray-100" : "text-gray-700"
            }`}
          >
            <div
              className={`p-1.5 rounded-lg ${
                isDark ? "bg-emerald-900/50" : "bg-emerald-100"
              }`}
            >
              <Mail
                className={`w-4 h-4 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`}
              />
            </div>
            <span>Select Users</span>
          </label>

          {/* Selected User Chips */}
          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedUsers.map((user) => (
                <div
                  key={user.id}
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm ${
                    isDark
                      ? "bg-emerald-900/50 text-emerald-300 border border-emerald-700"
                      : "bg-emerald-100 text-emerald-700 border border-emerald-300"
                  }`}
                >
                  <span className="truncate max-w-[200px]">{user.email}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveUser(user.id)}
                    className={`ml-2 p-0.5 rounded-full hover:scale-110 transition-transform ${
                      isDark ? "hover:bg-emerald-800" : "hover:bg-emerald-200"
                    }`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Search Input with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div className="relative">
              <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <input
                type="text"
                placeholder="Type email to search users..."
                value={inputValue}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                className={`w-full pl-10 pr-10 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
                  isDark
                    ? "bg-gray-800 border-emerald-600/50 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400"
                    : "bg-white border-emerald-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500"
                } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
              />
              {inputValue && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${
                    isDark
                      ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {showDropdown && filteredOptions.length > 0 && (
              <div
                className={`absolute z-10 w-full mt-1 rounded-lg shadow-lg border-2 max-h-60 overflow-y-auto ${
                  isDark
                    ? "bg-gray-800 border-emerald-600/50"
                    : "bg-white border-emerald-300"
                }`}
              >
                <div className="p-2 border-b">
                  <p className={`text-xs font-medium ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    {inputValue ? "Search results" : "All users"} ({filteredOptions.length})
                  </p>
                </div>
                {filteredOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleAddUser(option)}
                    className={`w-full text-left px-4 py-3 hover:bg-emerald-500/10 transition-colors border-b last:border-b-0 ${
                      isDark
                        ? "text-gray-200 hover:bg-emerald-900/50 border-gray-700"
                        : "text-gray-700 hover:bg-emerald-50 border-gray-200"
                    }`}
                  >
                    <div className="font-medium">{option.email}</div>
                  </button>
                ))}
              </div>
            )}

            {/* No results message */}
            {showDropdown && inputValue && filteredOptions.length === 0 && (
              <div
                className={`absolute z-10 w-full mt-1 rounded-lg shadow-lg border-2 p-4 ${
                  isDark
                    ? "bg-gray-800 border-emerald-600/50 text-gray-300"
                    : "bg-white border-emerald-300 text-gray-600"
                }`}
              >
                <p className="text-center">No users found</p>
                <p className="text-xs text-center mt-1 opacity-75">
                  Try a different email address
                </p>
              </div>
            )}
          </div>

          {/* Instructions and Stats */}
          <div
            className={`mt-2 text-xs ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <p>Type email to search and select from dropdown</p>
            <p className="mt-1">
              Selected: <span className="font-medium">{selectedUsers.length}</span> users
              {selectedUsers.length > 0 && ` (${emailOptions.length} total available)`}
            </p>
          </div>
        </div>
      )}

      {/* Subject */}
      <div>
        <label
          className={`block text-sm font-bold mb-3 ${
            isDark ? "text-gray-100" : "text-gray-700"
          }`}
        >
          Subject
        </label>
        <input
          type="text"
          placeholder="Enter notification subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
            isDark
              ? "bg-gray-800 border-emerald-600/50 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400"
              : "bg-white border-emerald-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500"
          } focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
        />
      </div>
    </div>
  );
}