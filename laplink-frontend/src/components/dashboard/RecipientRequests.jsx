// jeevansetu-frontend/src/components/dashboard/RecipientRequests.jsx

import React, { useEffect, useMemo } from "react";
import { FiDroplet, FiClock, FiMapPin, FiPhone, FiUser, FiActivity, FiAlertCircle } from "react-icons/fi";
import { useForm } from "react-hook-form";
import useRequests from "../../hooks/useRequests";
import useRequestActions from "../../hooks/useRequestActions";
import toast from "../../lib/toast";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const URGENCY_LEVELS = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "Critical", value: "high" },
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
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-indigo-200/70 hover:bg-white/10 hover:text-white transition-all"
    >
      <span>{label}</span>
    </a>
  );
};

const statusBadge = {
  open: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  matched: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  fulfilled: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  cancelled: "bg-rose-500/10 text-rose-300 border-rose-500/20",
};

export default function RecipientRequests({ profile, onSummaryChange }) {
  const {
    requests,
    loading: loadingRequests,
    error: listError,
    refresh,
  } = useRequests({ mine: true, status: "all" });
  const {
    loading: actionLoading,
    error: actionError,
    createRequest,
    updateStatus,
  } = useRequestActions({ refresh });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      patientName: profile?.name || "",
      hospitalName: "",
      contactPhone: profile?.phone || "",
      neededBy: "",
      bloodGroup: profile?.bloodGroup || "A+",
      quantityRequired: 500,
      location:
        [profile?.city, profile?.state].filter(Boolean).join(", ") || "",
      urgencyLevel: "medium",
      notes: "",
    },
  });

  const groupedRequests = useMemo(() => {
    const sections = {
      open: [],
      matched: [],
      fulfilled: [],
      cancelled: [],
    };
    requests.forEach((req) => {
      (sections[req.status] || sections.open).push(req);
    });
    return sections;
  }, [requests]);

  useEffect(() => {
    onSummaryChange?.({
      total: requests.length,
      open: groupedRequests.open.length,
      matched: groupedRequests.matched.length,
      fulfilled: groupedRequests.fulfilled.length,
    });
  }, [
    onSummaryChange,
    requests.length,
    groupedRequests.open.length,
    groupedRequests.matched.length,
    groupedRequests.fulfilled.length,
  ]);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      patientName: data.patientName.trim(),
      hospitalName: data.hospitalName.trim(),
      contactPhone: data.contactPhone.trim(),
      location: data.location.trim(),
      notes: (data.notes || "").trim(),
      quantityRequired: Number(data.quantityRequired),
    };
    try {
      await createRequest(payload);
      toast.success("Plasma request published successfully");
      reset();
    } catch (err) {
      const message =
        err?.response?.data?.message || "Unable to create plasma request";
      toast.error(message);
    }
  };

  const handleStatusChange = async (reqId, status, successMessage) => {
    try {
      await updateStatus(reqId, status);
      toast.success(successMessage);
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to update status";
      toast.error(message);
    }
  };

  const renderRequests = (items, title) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-px flex-1 bg-white/10"></div>
        <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest px-2">
          {title} ({items.length})
        </h4>
        <div className="h-px flex-1 bg-white/10"></div>
      </div>

      {!items.length ? (
        <p className="text-white/30 text-sm text-center py-4 bg-white/5 rounded-xl border border-dashed border-white/10">No requests in this state.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {items.map((req) => {
            const donor = req.matchedDonor || {};
            const donorSocial = [
              { label: "Instagram", href: donor?.social?.instagram },
              { label: "X", href: donor?.social?.x },
              { label: "Facebook", href: donor?.social?.facebook },
            ]
              .map(({ label, href }) => renderSocialLink(label, href))
              .filter(Boolean);

            return (
              <div
                key={req._id || req.id}
                className="bg-black/20 hover:bg-black/30 w-full rounded-2xl border border-white/10 p-5 transition-all group hover:border-indigo-500/30 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]"
              >
                <div className="flex flex-wrap justify-between gap-4 mb-4">
                  <div className="space-y-1">
                    <h5 className="text-white font-semibold flex items-center gap-2 text-lg">
                      <FiUser className="text-indigo-400" />
                      <span>{req.patientName}</span>
                    </h5>
                    <p className="text-xs text-indigo-200/60 flex items-center gap-1">
                      <FiClock className="text-indigo-400/50" />
                      <span className="font-medium">
                        Needed by {new Date(req.neededBy).toLocaleString()}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge[req.status] ||
                        "bg-white/10 text-white/70 border-white/20"
                        }`}
                    >
                      {req.status.toUpperCase()}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-200 border border-indigo-500/20">
                      Your Request
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-white/5 border border-white/5 mb-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase text-white/40 tracking-wider">Group</span>
                    <div className="flex items-center gap-2 text-rose-300 font-bold">
                      <FiDroplet /> {req.bloodGroup}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase text-white/40 tracking-wider">Quantity</span>
                    <div className="flex items-center gap-2 text-white font-medium">
                      {req.quantityRequired} ml
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
                    <span className="text-[10px] uppercase text-white/40 tracking-wider">Location</span>
                    <div className="flex items-center gap-2 text-white/80 text-sm truncate">
                      <FiMapPin className="shrink-0 text-sky-400/70" /> {req.location}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
                    <span className="text-[10px] uppercase text-white/40 tracking-wider">Contact</span>
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <FiPhone className="shrink-0 text-emerald-400/70" /> {req.contactPhone || "—"}
                    </div>
                  </div>
                </div>

                {req.hospitalName && (
                  <div className="mb-3 flex items-center gap-2 text-sm text-white/70 bg-white/5 px-3 py-2 rounded-lg inline-block border border-white/5">
                    <span className="font-semibold text-white/90">Hospital:</span>
                    {req.hospitalName}
                  </div>
                )}

                {req.notes && (
                  <div className="mb-4 text-sm text-indigo-100/70 italic border-l-2 border-indigo-500/30 pl-3 py-1">
                    "{req.notes}"
                  </div>
                )}

                {req.status === "matched" && donor?.name && (
                  <div className="mt-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 p-4 space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                      <FiUser className="w-24 h-24 text-white" />
                    </div>

                    <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
                      <FiActivity className="animate-pulse" /> Matched Donor Found
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm relative z-10">
                      <div className="space-y-1">
                        <span className="text-xs text-indigo-200/50 uppercase">Name</span>
                        <p className="text-white font-medium">{donor.name}</p>
                      </div>
                      {donor.bloodGroup && (
                        <div className="space-y-1">
                          <span className="text-xs text-indigo-200/50 uppercase">Blood Group</span>
                          <p className="text-white font-medium">{donor.bloodGroup}</p>
                        </div>
                      )}
                      {donor.phone && (
                        <div className="space-y-1">
                          <span className="text-xs text-indigo-200/50 uppercase">Phone</span>
                          <p className="text-white font-medium selectable">{donor.phone}</p>
                        </div>
                      )}
                      {donor.email && (
                        <div className="space-y-1">
                          <span className="text-xs text-indigo-200/50 uppercase">Email</span>
                          <a href={`mailto:${donor.email}`} className="text-indigo-300 hover:text-white underline decoration-dashed underline-offset-4 block truncate">
                            {donor.email}
                          </a>
                        </div>
                      )}
                      {(donor.city || donor.state) && (
                        <div className="space-y-1 col-span-2">
                          <span className="text-xs text-indigo-200/50 uppercase">Location</span>
                          <p className="text-white/80">{[donor.city, donor.state].filter(Boolean).join(", ")}</p>
                        </div>
                      )}
                    </div>

                    {donorSocial.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-indigo-500/20">
                        {donorSocial}
                      </div>
                    )}

                    <div className="text-[11px] text-indigo-200/60 flex gap-2 items-start bg-indigo-500/20 p-2 rounded-lg mt-2">
                      <FiAlertCircle className="shrink-0 mt-0.5" />
                      Coordinate directly with the donor. Once the donation is complete, please mark this request as fulfilled.
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5 mt-2 justify-end">
                  {req.status !== "fulfilled" && req.status !== "cancelled" && (
                    <>
                      <button
                        onClick={() =>
                          handleStatusChange(
                            req._id || req.id,
                            "fulfilled",
                            "Marked as fulfilled"
                          )
                        }
                        className="px-4 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold transition-all hover:scale-105 active:scale-95"
                        disabled={actionLoading}
                      >
                        Mark Fulfilled
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(
                            req._id || req.id,
                            "cancelled",
                            "Request cancelled"
                          )
                        }
                        className="px-4 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs sm:text-sm font-semibold transition-all hover:scale-105 active:scale-95"
                        disabled={actionLoading}
                      >
                        Cancel Request
                      </button>
                    </>
                  )}
                  {req.status === "cancelled" && (
                    <button
                      onClick={() =>
                        handleStatusChange(
                          req._id || req.id,
                          "open",
                          "Request reopened"
                        )
                      }
                      className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs sm:text-sm font-semibold transition-all"
                      disabled={actionLoading}
                    >
                      Reopen Request
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="glass-panel p-6 sm:p-8 animate-slideUp">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <FiActivity className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">My Requests</h2>
            <p className="text-xs text-white/40 font-medium uppercase tracking-wider">Manage Donation Requests</p>
          </div>
        </div>
      </div>

      <div className="bg-black/30 rounded-xl p-6 border border-white/5 mb-10 shadow-inner">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-1">Create New Request</h3>
          <p className="text-sm text-indigo-200/50">Details provided here will be visible to eligible donors nearby.</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="space-y-1">
            <label className="text-xs text-indigo-200/60 uppercase tracking-widest font-semibold ml-1">Patient Name</label>
            <input
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              placeholder="Full name of patient"
              {...register("patientName", { required: "Patient name is required" })}
            />
            {errors.patientName && <p className="text-xs text-rose-400 mt-1 ml-1">{errors.patientName.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs text-indigo-200/60 uppercase tracking-widest font-semibold ml-1">Hospital Name</label>
            <input
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              placeholder="Admitted hospital"
              {...register("hospitalName")}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-indigo-200/60 uppercase tracking-widest font-semibold ml-1">Contact Phone</label>
            <input
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              placeholder="Primary contact number"
              {...register("contactPhone")}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-indigo-200/60 uppercase tracking-widest font-semibold ml-1">Needed By</label>
            <input
              type="datetime-local"
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all [color-scheme:dark]"
              {...register("neededBy", { required: "Date is required" })}
            />
            {errors.neededBy && <p className="text-xs text-rose-400 mt-1 ml-1">{errors.neededBy.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs text-indigo-200/60 uppercase tracking-widest font-semibold ml-1">Blood Group</label>
            <select
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all appearance-none"
              {...register("bloodGroup", { required: true })}
            >
              {BLOOD_GROUPS.map((group) => (
                <option key={group} value={group} className="bg-gray-900 text-white">
                  {group}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-indigo-200/60 uppercase tracking-widest font-semibold ml-1">Quantity (ml)</label>
            <input
              type="number"
              min={100}
              step={50}
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              {...register("quantityRequired", {
                required: "Quantity is required",
                min: { value: 100, message: "Min 100ml" },
              })}
            />
            {errors.quantityRequired && <p className="text-xs text-rose-400 mt-1 ml-1">{errors.quantityRequired.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs text-indigo-200/60 uppercase tracking-widest font-semibold ml-1">Location</label>
            <input
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              placeholder="City, Area"
              {...register("location", { required: "Location is required" })}
            />
            {errors.location && <p className="text-xs text-rose-400 mt-1 ml-1">{errors.location.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs text-indigo-200/60 uppercase tracking-widest font-semibold ml-1">Urgency</label>
            <select
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all appearance-none"
              {...register("urgencyLevel")}
            >
              {URGENCY_LEVELS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-gray-900 text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-xs text-indigo-200/60 uppercase tracking-widest font-semibold ml-1">Additional Notes</label>
            <textarea
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none"
              placeholder="Any specific instructions or medical details..."
              {...register("notes")}
            />
          </div>

          <div className="md:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10 mt-2">
            <div className="text-sm text-white/40">
              All requests are verified before being broadcasted.
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {(listError || actionError) && (
                <span className="text-xs text-rose-300 animate-pulse">
                  {actionError || listError}
                </span>
              )}
              <button
                type="submit"
                disabled={actionLoading}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all"
              >
                {actionLoading ? "Publishing..." : "Publish Request"}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="space-y-8">
        {renderRequests(groupedRequests.open, "Open Requests")}
        {renderRequests(groupedRequests.matched, "Matched Requests")}
        {renderRequests(groupedRequests.fulfilled, "Fulfilled Requests")}
        {renderRequests(groupedRequests.cancelled, "Cancelled Requests")}
      </div>

      {loadingRequests && (
        <div className="text-center py-6">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-white/40">Syncing...</p>
        </div>
      )}
    </div>
  );
}
