// Path: jeevansetu-frontend/src/components/dashboard/StatusCard.jsx

import React from "react";
import { FiEdit2, FiCheck, FiX } from "react-icons/fi";

const StatusCard = ({
  profile,
  savingAvail,
  savingDate,
  lastDonationInput,
  inlineMsg,
  roleBadgeClasses,
  formatDateTime,
  relativeTime,
  onToggleAvailable,
  onSaveLastDonation,
  onClearLastDonation,
  onCopyId,
  onRefresh,
  onDateChange,
}) => {
  return (
    <div className="glass-panel p-6 sm:p-8 animate-slideUp">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-3 h-3 rounded-full ${profile?.available ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"}`}></div>
            {profile?.available && <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-500 animate-ping opacity-75"></div>}
          </div>
          <h3 className="text-lg font-bold text-white tracking-wide">Account Status</h3>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase border ${roleBadgeClasses(profile?.role)}`}>
          {profile?.role || "GUEST"}
        </div>
      </div>

      <div className="space-y-8">
        {/* Availability Toggle */}
        <div className="bg-black/20 rounded-xl p-4 border border-white/5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-indigo-200/70 font-medium">Availability</span>
            <span className={`text-xs font-bold uppercase tracking-wider ${profile?.available ? "text-emerald-400" : "text-white/40"}`}>
              {profile?.available ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-white/40 max-w-[60%]">
              {profile?.available ? "You are visible for matches." : "You are hidden from matches."}
            </p>
            <button
              onClick={onToggleAvailable}
              disabled={savingAvail}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${profile?.available ? "bg-emerald-500/80" : "bg-white/10"
                }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${profile?.available ? "translate-x-6" : "translate-x-1"
                  }`}
              />
            </button>
          </div>
        </div>

        {/* User ID */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-indigo-200/60 uppercase tracking-wider">User ID</span>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 font-mono tracking-tight overflow-hidden text-ellipsis">
              #{profile?.id || profile?._id || "—"}
            </code>
            <button
              onClick={onCopyId}
              className="px-3 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium hover:bg-indigo-500/20 transition-all"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Last Donation */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-medium text-indigo-200/60 uppercase tracking-wider">Last Donation</span>
            <span className="text-xs text-white/50">
              {profile?.lastDonationAt ? new Date(profile.lastDonationAt).toLocaleDateString() : "Never"}
            </span>
          </div>

          <div className="flex gap-2">
            <input
              type="date"
              value={lastDonationInput}
              onChange={(e) => onDateChange(e.target.value)}
              className="flex-1 bg-black/40 border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all [color-scheme:dark]"
            />
            <button
              onClick={onSaveLastDonation}
              disabled={savingDate}
              className="px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20 transition-all"
            >
              <FiCheck className="w-4 h-4" />
            </button>
            <button
              onClick={() => onClearLastDonation && onClearLastDonation()}
              disabled={savingDate}
              className="px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 hover:bg-rose-500/20 transition-all"
              title="Clear date"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Updated At */}
        <div className="pt-4 border-t border-white/5 flex justify-between items-center text-xs">
          <span className="text-white/40">Last Updated</span>
          <span className="text-white/60 font-medium" title={relativeTime(profile?.updatedAt)}>
            {formatDateTime(profile?.updatedAt)}
          </span>
        </div>
      </div>

      {/* Inline Feedback */}
      {inlineMsg && (
        <div className="absolute top-4 right-8 transform translate-x-2">
          <div className="bg-indigo-600 text-white text-xs py-1.5 px-3 rounded-full shadow-lg shadow-indigo-500/30 animate-fadeIn">
            {inlineMsg}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusCard;
