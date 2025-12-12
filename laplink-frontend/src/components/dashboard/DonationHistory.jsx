// Path: jeevansetu-frontend/src/components/dashboard/DonationHistory.jsx
import React from "react";
import { FiClock, FiCheckCircle } from "react-icons/fi";

const DonationHistory = ({ donationHistory = [], loading = false, error = "", onRefresh, role }) => {
  const isDonor = role === "donor";

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center text-white/50 animate-pulse">
          <div className="w-10 h-10 rounded-full bg-white/5 mb-3"></div>
          <p className="text-sm font-medium">Loading history...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-6 text-center">
          <p className="text-rose-200 text-sm mb-3">{error}</p>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-4 py-2 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-semibold hover:bg-rose-500/30 transition-all"
            >
              Retry
            </button>
          )}
        </div>
      );
    }

    if (!donationHistory.length) {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
            <FiClock className="w-8 h-8 text-white/20" />
          </div>
          <h4 className="text-white font-medium mb-1">No Activity Yet</h4>
          <p className="text-white/40 text-sm max-w-xs mx-auto">
            {isDonor
              ? "Your donation journey begins here. Document your first donation to start tracking your impact."
              : "No donation history found."
            }
          </p>
        </div>
      );
    }

    return (
      <div className="relative border-l border-white/10 ml-3 space-y-8 py-2">
        {donationHistory.map((d, idx) => (
          <div key={d?._id || idx} className="relative pl-6 group">
            <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 border border-black shadow-[0_0_10px_rgba(99,102,241,0.5)] group-hover:scale-125 transition-transform"></div>

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div>
                <h4 className="text-white font-medium text-sm flex items-center gap-2">
                  Donation Completed
                  <FiCheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                </h4>
                <p className="text-xs text-indigo-200/50 mt-1">
                  {d?.dateOfDonation || d?.date
                    ? new Date(d.dateOfDonation || d.date).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                    : "Date not recorded"}
                </p>
              </div>

              {(d?.notes?.trim() || d?.followUpNotes?.trim()) && (
                <div className="text-xs text-white/60 bg-white/5 border border-white/5 rounded-lg px-3 py-2 max-w-sm italic">
                  "{d?.notes?.trim() ? d.notes : d.followUpNotes}"
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="glass-panel p-6 sm:p-8 animate-slideUp">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <FiClock className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">History</h2>
            <p className="text-xs text-white/40 font-medium uppercase tracking-wider">Activity Timeline</p>
          </div>
        </div>
        {onRefresh && !loading && (
          <button
            onClick={onRefresh}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all text-xs font-medium uppercase tracking-wider"
          >
            Refresh
          </button>
        )}
      </div>
      {renderContent()}
    </div>
  );
};

export default DonationHistory;
