"use client";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { Mail, Users } from "lucide-react";

export default function FormFields({
  customerType,
  setCustomerType,
  emails,
  setEmails,
  subject,
  setSubject
}) {
const { theme } = useThemeStore();
 const isDark = theme === "dark";
  return (
    <div className="grid gap-6">
      {/* Customer Type */}
      <div>
        <label
          className={`flex items-center space-x-2 text-sm font-bold mb-3 ${isDark
            ? "text-gray-100"
            : "text-gray-700"}`}
        >
          <div
            className={`p-1.5 rounded-lg ${isDark
              ? "bg-emerald-900/50"
              : "bg-emerald-100"}`}
          >
            <Users
              className={`w-4 h-4 ${isDark
                ? "text-emerald-400"
                : "text-emerald-600"}`}
            />
          </div>
          <span>Customer Type</span>
        </label>
        <select
          value={customerType}
          onChange={e => setCustomerType(e.target.value)}
          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${isDark
            ? "bg-gray-800 border-emerald-600/50 text-white hover:border-emerald-500 focus:border-emerald-400"
            : "bg-white border-emerald-300 text-gray-900 hover:border-emerald-400 focus:border-emerald-500"} focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
        >
          <option value="all">All Customers</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {/* Email Input (only if custom) */}
      {customerType === "custom" &&
        <div className="transform transition-all duration-300 ease-in-out">
          <label
            className={`flex items-center space-x-2 text-sm font-bold mb-3 ${isDark
              ? "text-gray-100"
              : "text-gray-700"}`}
          >
            <div
              className={`p-1.5 rounded-lg ${isDark
                ? "bg-emerald-900/50"
                : "bg-emerald-100"}`}
            >
              <Mail
                className={`w-4 h-4 ${isDark
                  ? "text-emerald-400"
                  : "text-emerald-600"}`}
              />
            </div>
            <span>Email Addresses</span>
          </label>
          <input
            type="text"
            placeholder="Enter emails separated by commas (e.g., user1@email.com, user2@email.com)"
            value={emails}
            onChange={e => setEmails(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${isDark
              ? "bg-gray-800 border-emerald-600/50 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400"
              : "bg-white border-emerald-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500"} focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
          />
        </div>}

      {/* Subject */}
      <div>
        <label
          className={`block text-sm font-bold mb-3 ${isDark
            ? "text-gray-100"
            : "text-gray-700"}`}
        >
          Subject
        </label>
        <input
          type="text"
          placeholder="Enter notification subject"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${isDark
            ? "bg-gray-800 border-emerald-600/50 text-white placeholder-gray-400 hover:border-emerald-500 focus:border-emerald-400"
            : "bg-white border-emerald-300 text-gray-900 placeholder-gray-500 hover:border-emerald-400 focus:border-emerald-500"} focus:ring-4 focus:ring-emerald-500/20 focus:outline-none`}
        />
      </div>
    </div>
  );
}
