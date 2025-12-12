// jeevansetu-frontend/src/components/dashboard/DonorMatches.jsx

import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiDroplet, FiClock, FiMapPin, FiPhone, FiUser, FiFilter, FiHeart, FiSearch } from "react-icons/fi";
import useRequests from "../../hooks/useRequests";
import useRequestActions from "../../hooks/useRequestActions";
import toast from "../../lib/toast";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const URGENCY_LEVELS = [
  { label: "Is Urgent", value: "" },
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const renderSocialLink = (label, href) => {
  if (!href || typeof href !== "string" || href.trim().length === 0) {
    return null;
  }

  return (
    <a
      key={label}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 text-xs text-indigo-200/70 hover:bg-white/10 hover:text-white border border-white/10 transition-all"
    >
      <span>{label}</span>
    </a>
  );
};

export default function DonorMatches({ profile, onSummaryChange }) {
  const [filters, setFilters] = useState({
    bloodGroup: profile?.bloodGroup || "",
    location: profile?.city || "",
    urgencyLevel: "",
  });

  const {
    requests,
    loading,
    error,
    refresh,
    setFilters: updateFilters,
  } = useRequests({
    status: "open",
    bloodGroup: filters.bloodGroup,
    location: filters.location,
  });

  const {
    loading: actionLoading,
    error: actionError,
    matchRequest,
  } = useRequestActions({ refresh });

  const onFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    updateFilters({ ...filters, [key]: value });
  };

  const formattedRequests = useMemo(() => requests, [requests]);

  const prevCountRef = useRef(requests.length);
  useEffect(() => {
    if (!onSummaryChange) return;
    if (prevCountRef.current === requests.length) return;
    prevCountRef.current = requests.length;
    onSummaryChange({ total: requests.length });
  }, [onSummaryChange, requests.length]);

  const handleMatch = async (id) => {
    try {
      await matchRequest(id);
      toast.success("Request matched! Contact the recipient soon.");
    } catch (err) {
      const message = err?.response?.data?.message || "Unable to match request";
      toast.error(message);
    }
  };

  return (
    <div className="glass-panel p-6 sm:p-8 animate-slideUp">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3 self-start">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
            <FiHeart className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-wide">
              Open Requests
            </h3>
            <p className="text-xs text-white/40 font-medium uppercase tracking-wider">
              Near You
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-indigo-200 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 font-medium shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          <span>
            {formattedRequests.length || 0} active request
            {formattedRequests.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      <div className="bg-white/5 rounded-xl border border-white/10 p-4 mb-8">
        <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-white/40 uppercase tracking-widest">
          <FiFilter className="text-indigo-400" /> Filters
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-indigo-200/50 ml-1">Blood Group</label>
            <div className="relative">
              <select
                className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-indigo-500/50 appearance-none transition-all"
                value={filters.bloodGroup}
                onChange={(e) => onFilterChange("bloodGroup", e.target.value)}
              >
                <option value="" className="bg-gray-900 text-white">Any Group</option>
                {BLOOD_GROUPS.map((group) => (
                  <option key={group} value={group} className="bg-gray-900 text-white">
                    {group}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-indigo-200/50 ml-1">Urgency</label>
            <div className="relative">
              <select
                className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-indigo-500/50 appearance-none transition-all"
                value={filters.urgencyLevel}
                onChange={(e) => onFilterChange("urgencyLevel", e.target.value)}
              >
                {URGENCY_LEVELS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-gray-900 text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-indigo-200/50 ml-1">Location</label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all"
                value={filters.location}
                onChange={(e) => onFilterChange("location", e.target.value)}
                placeholder="Search city..."
              />
            </div>
          </div>
        </div>
      </div>

      {(error || actionError) && (
        <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-200 text-sm p-4 mb-6 flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
          {actionError || error}
        </div>
      )}

      {loading && (
        <div className="text-center py-10">
          <div className="w-8 h-8 mx-auto mb-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-indigo-200/60 font-medium">Scanning for requests...</p>
        </div>
      )}

      {!loading && !formattedRequests.length && (
        <div className="text-center py-12 px-6 border border-dashed border-white/10 rounded-2xl bg-white/5">
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiDroplet className="w-6 h-6 text-white/20" />
          </div>
          <p className="text-white/80 font-medium mb-1">No matching requests found</p>
          <p className="text-sm text-white/40 max-w-xs mx-auto">Try adjusting filters or check back later. Your willingness to help saves lives.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {formattedRequests.map((req) => {
          const requester = req.requestedBy || {};
          const socialLinks = [
            { label: "Instagram", href: requester?.social?.instagram },
            { label: "X", href: requester?.social?.x },
            { label: "Facebook", href: requester?.social?.facebook },
          ]
            .map(({ label, href }) => renderSocialLink(label, href))
            .filter(Boolean);

          return (
            <div
              key={req._id || req.id}
              className="group bg-black/20 hover:bg-black/30 rounded-2xl border border-white/10 p-5 transition-all hover:border-indigo-500/30 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-3">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${req.urgencyLevel === 'high' ? 'bg-rose-500/10 text-rose-300 border-rose-500/20' :
                    req.urgencyLevel === 'medium' ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' :
                      'bg-blue-500/10 text-blue-300 border-blue-500/20'
                  }`}>
                  {req.urgencyLevel || "NORMAL"} Priority
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-4 pr-12">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/20">
                  <FiDroplet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg leading-tight mb-1">{req.patientName}</h4>
                  <p className="text-xs text-white/50 flex items-center gap-1.5">
                    <FiClock className="text-indigo-400" />
                    Needed by <span className="text-indigo-200">{new Date(req.neededBy).toLocaleString()}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                <div className="p-3 rounded-lg bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors">
                  <span className="text-[10px] uppercase text-white/40 font-semibold">Blood Group</span>
                  <div className="text-rose-300 font-bold text-sm mt-0.5">{req.bloodGroup}</div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors">
                  <span className="text-[10px] uppercase text-white/40 font-semibold">Quantity</span>
                  <div className="text-white font-bold text-sm mt-0.5">{req.quantityRequired} ml</div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors col-span-2 sm:col-span-1">
                  <span className="text-[10px] uppercase text-white/40 font-semibold">Location</span>
                  <div className="text-white/90 font-medium text-sm mt-0.5 truncate flex items-center gap-1.5">
                    <FiMapPin className="text-sky-400 text-xs shrink-0" /> {req.location}
                  </div>
                </div>
                {req.contactPhone && (
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors col-span-2 sm:col-span-1">
                    <span className="text-[10px] uppercase text-white/40 font-semibold">Contact</span>
                    <div className="text-white/90 font-medium text-sm mt-0.5 truncate flex items-center gap-1.5">
                      <FiPhone className="text-emerald-400 text-xs shrink-0" /> {req.contactPhone}
                    </div>
                  </div>
                )}
              </div>

              {req.hospitalName && (
                <div className="mb-4 text-sm bg-indigo-500/5 px-3 py-2 rounded-lg border border-indigo-500/10 inline-block text-indigo-200/80">
                  <span className="text-indigo-400 font-semibold mr-1">Hospital:</span> {req.hospitalName}
                </div>
              )}

              {req.notes && (
                <p className="text-xs sm:text-sm text-white/60 bg-black/20 p-3 rounded-lg mb-4 italic border-l-2 border-white/10">
                  "{req.notes}"
                </p>
              )}

              {(requester?.email || socialLinks.length > 0) && (
                <div className="border-t border-white/10 pt-3 mb-4">
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-emerald-500"></span> Requested By
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    {requester?.email && (
                      <a href={`mailto:${requester.email}`} className="text-xs text-indigo-300 hover:text-white transition-colors flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center"><FiUser className="w-3 h-3" /></span>
                        {requester.email}
                      </a>
                    )}
                    <div className="flex gap-2">
                      {socialLinks}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => handleMatch(req._id || req.id)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={actionLoading}
                >
                  {actionLoading ? "Matching..." : "Match & Offer Help"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
