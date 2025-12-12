// Path: jeevansetu-frontend/src/components/dashboard/PersonalInfoCard.jsx
import React from "react";
import AddressBlock from "./AddressBlock";
import SocialLinks from "./SocialLinks";
import { FiEdit2 } from "react-icons/fi";

const PersonalInfoCard = ({ profile, formatDateTime, onEdit }) => {
  return (
    <div className="glass-panel p-6 sm:p-8 animate-slideUp">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">Personal Information</h2>
            <p className="text-xs text-white/40 font-medium uppercase tracking-wider">Profile Details</p>
          </div>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all"
            title="Edit Profile"
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="space-y-6">
          <div className="group">
            <label className="text-xs font-semibold text-indigo-200/50 uppercase tracking-wider mb-1 block">Full Name</label>
            <p className="text-lg text-white font-medium tracking-tight group-hover:text-indigo-300 transition-colors">{profile?.name || "Not provided"}</p>
          </div>
          <div className="group">
            <label className="text-xs font-semibold text-indigo-200/50 uppercase tracking-wider mb-1 block">Email Address</label>
            <p className="text-white/80 group-hover:text-white transition-colors break-all">{profile?.email || "Not provided"}</p>
          </div>
          <div className="group">
            <label className="text-xs font-semibold text-indigo-200/50 uppercase tracking-wider mb-1 block">Phone Number</label>
            <p className="text-white/80 group-hover:text-white transition-colors">{profile?.phone || "Not provided"}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="group">
              <label className="text-xs font-semibold text-indigo-200/50 uppercase tracking-wider mb-1 block">City</label>
              <p className="text-white/80 group-hover:text-white transition-colors">{profile?.city || "—"}</p>
            </div>
            <div className="group">
              <label className="text-xs font-semibold text-indigo-200/50 uppercase tracking-wider mb-1 block">State</label>
              <p className="text-white/80 group-hover:text-white transition-colors">{profile?.state || "—"}</p>
            </div>
          </div>

          <div className="group">
            <label className="text-xs font-semibold text-indigo-200/50 uppercase tracking-wider mb-1 block">Full Address</label>
            <div className="text-white/80 text-sm leading-relaxed">
              <AddressBlock address={profile?.address} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="group">
              <label className="text-xs font-semibold text-indigo-200/50 uppercase tracking-wider mb-1 block">Blood Group</label>
              <span className="inline-block px-3 py-1 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-300 font-bold text-sm">
                {profile?.bloodGroup || "—"}
              </span>
            </div>
            <div className="group">
              <label className="text-xs font-semibold text-indigo-200/50 uppercase tracking-wider mb-1 block">Joined</label>
              <p className="text-white/60 text-sm">{formatDateTime(profile?.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      {profile?.message?.trim() && (
        <div className="mt-8 pt-6 border-t border-white/5">
          <label className="text-xs font-semibold text-indigo-200/50 uppercase tracking-wider mb-2 block">Personal Message</label>
          <div className="bg-black/20 rounded-xl p-4 border border-white/5">
            <p className="text-white/80 text-sm italic leading-relaxed">"{profile.message}"</p>
          </div>
        </div>
      )}

      {/* Social Links */}
      <div className="mt-6 pt-6 border-t border-white/5">
        <label className="text-xs font-semibold text-indigo-200/50 uppercase tracking-wider mb-4 block">Social Connections</label>
        <SocialLinks social={profile?.social} />
      </div>
    </div>
  );
};

export default PersonalInfoCard;
