// Path: jeevansetu-frontend/src/components/dashboard/QuickStatsCard.jsx
import React from "react";
import { FiTrendingUp, FiActivity, FiClock, FiAlertCircle, FiCheckCircle } from "react-icons/fi";

const Badge = ({ children, tone = "neutral" }) => {
  const tones = {
    success: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
    warn: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
    neutral: "bg-white/10 text-white/70 border border-white/10",
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold tracking-wide ${tones[tone] || tones.neutral}`}>
      {children}
    </span>
  );
};

const KPI = ({ label, value, tooltip, infoTooltip, icon: Icon }) => (
  <div className="rounded-xl bg-black/40 border border-white/5 p-4 flex flex-col justify-between min-h-[100px] hover:border-white/10 transition-colors group">
    <div className="flex justify-between items-start">
      <div className="text-xs font-semibold text-indigo-200/50 uppercase tracking-wider flex items-center gap-1.5">
        {Icon && <Icon className="w-3.5 h-3.5 text-indigo-400" />}
        <span>{label}</span>
      </div>
      {infoTooltip && (
        <span className="text-white/30 hover:text-white/80 cursor-help transition-colors" title={infoTooltip}>
          <FiAlertCircle className="w-3.5 h-3.5" />
        </span>
      )}
    </div>
    <div className="text-2xl font-bold text-white tracking-tight mt-2 truncate" title={tooltip}>
      {value}
    </div>
  </div>
);

const QuickStatsCard = ({
  profile,
  savingAvailability,
  onToggleAvailable,
  onCopyId,
  onRefresh,
  onOpenOverview,
  onStartEditProfile,
  onOpenStatus,
  onOpenMatches,
  onOpenRequests,
  formatDateTime,
  relativeTime,
  donorMatchesCount = 0,
  recipientRequestCount = 0,
  isDonor = false,
  isRecipient = false,
}) => {
  const lastDonationDate = profile?.lastDonationAt ? new Date(profile.lastDonationAt) : null;
  const lastDonationValue = lastDonationDate
    ? `${relativeTime(profile.lastDonationAt)}`
    : "Not recorded";

  const memberSinceValue = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
    })
    : "—";

  const availabilityTone = profile?.available ? "success" : "warn";

  // Eligibility logic 
  const cooldownDays = 56;
  const formatDDMonYYYY = (d) => {
    try {
      const day = String(d.getDate()).padStart(2, "0");
      const mon = d.toLocaleString("en-GB", { month: "short" });
      const y = d.getFullYear();
      return `${day} ${mon} ${y}`;
    } catch {
      return String(d);
    }
  };

  let nextEligibleStr = "—";
  let nextEligibleTooltip = undefined;
  let eligibilityLabel = "Add date";
  let eligibilityTooltip = "Add your last donation date to track eligibility.";
  let eligibilityTone = "warn";

  if (lastDonationDate) {
    const next = new Date(lastDonationDate.getTime() + cooldownDays * 24 * 60 * 60 * 1000);
    const now = new Date();
    const msDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.ceil((next.getTime() - now.getTime()) / msDay);
    nextEligibleTooltip = next.toLocaleString();
    if (diffDays <= 0) {
      nextEligibleStr = formatDDMonYYYY(next);
      eligibilityLabel = "Eligible Now";
      eligibilityTooltip = "You're outside the 56 day cooldown window.";
      eligibilityTone = "success";
    } else {
      nextEligibleStr = `${diffDays} days`;
      eligibilityLabel = `Cooldown`;
      eligibilityTooltip = `You can donate again on ${formatDDMonYYYY(next)}.`;
      eligibilityTone = "warn";
    }
  }

  const tipToneClasses = {
    success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-100 shadow-[0_4px_20px_rgba(16,185,129,0.1)]",
    warn: "border-amber-500/20 bg-amber-500/10 text-amber-100 shadow-[0_4px_20px_rgba(245,158,11,0.1)]",
    neutral: "border-white/10 bg-white/5 text-indigo-100",
  };

  const quickTip = (() => {
    if (isDonor) {
      const hasLastDonation = Boolean(lastDonationDate);
      if (!hasLastDonation) {
        return {
          title: "Track Your Impact",
          description: "Log your last donation date to enable smart eligibility tracking.",
          tone: "warn",
          cta: "Update Date",
          onClick: onOpenStatus,
        };
      }

      const next = new Date((lastDonationDate || new Date()).getTime() + cooldownDays * 24 * 60 * 60 * 1000);
      const now = new Date();
      if (next > now) {
        return {
          title: "Recovery Period",
          description: `You're currently in cooldown until ${formatDDMonYYYY(next)}. Stay hydrated!`,
          tone: "warn",
        };
      }

      if (donorMatchesCount > 0) {
        return {
          title: "Lives Waiting",
          description: `${donorMatchesCount} people nearby need your help. You could be their hero today.`,
          tone: "success",
          cta: "View Matches",
          onClick: onOpenMatches,
        };
      }

      return {
        title: "Ready to Serve",
        description: "You are eligible to donate. Keep your availability active for urgent requests.",
        tone: "success",
      };
    }

    if (isRecipient) {
      if (recipientRequestCount <= 0) {
        return {
          title: "Request Blood",
          description: "Create a request specifying your needs to alert nearby donors instantly.",
          tone: "neutral",
          cta: "New Request",
          onClick: onOpenRequests,
        };
      }
      return {
        title: "Active Requests",
        description: `You have ${recipientRequestCount} active request(s). Check for donor responses regularly.`,
        tone: "neutral",
        cta: "Manage",
        onClick: onOpenRequests,
      };
    }

    return {
      title: "Complete Profile",
      description: "Finish setting up your profile to access all features.",
      tone: "neutral",
      cta: "Edit Profile",
      onClick: onStartEditProfile || onOpenOverview,
    };
  })();

  return (
    <div className="glass-panel p-6 sm:p-8 animate-slideUp">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <FiTrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">Quick Stats</h2>
            <p className="text-xs text-white/40 font-medium uppercase tracking-wider">Dashboard Overview</p>
          </div>
        </div>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPI
          label="Last Donation"
          value={lastDonationValue}
          tooltip={lastDonationDate ? lastDonationDate.toLocaleString() : "Not recorded"}
          icon={FiActivity}
        />
        <KPI
          label="Next Eligible"
          value={nextEligibleStr}
          tooltip={lastDonationDate ? `Cooldown until ${nextEligibleTooltip}` : undefined}
          icon={FiClock}
        />
        <KPI
          label={isDonor ? "Matches" : "Requests"}
          value={isDonor ? donorMatchesCount : recipientRequestCount}
          tooltip={isDonor ? "Pending Matches" : "Active Requests"}
          icon={isDonor ? FiCheckCircle : FiAlertCircle}
        />
        <KPI
          label="Member Since"
          value={memberSinceValue}
          tooltip={profile?.createdAt ? formatDateTime(profile.createdAt) : undefined}
          icon={FiTrendingUp}
        />
      </div>

      {/* Interactive & Tips Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Availability Control */}
        <div className="rounded-xl bg-black/40 border border-white/5 p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-indigo-200/50 uppercase tracking-wider">Current Status</span>
              <Badge tone={availabilityTone}>{profile?.available ? "Active" : "Hidden"}</Badge>
            </div>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              {profile?.available
                ? "You are visible to potential matches in your area."
                : "You are currently hidden. Switch to active when ready to donate."}
            </p>
          </div>

          <button
            onClick={onToggleAvailable}
            disabled={savingAvailability}
            className={`w-full py-3 rounded-xl text-sm font-semibold transition-all shadow-lg ${profile?.available
              ? "bg-white/5 border border-white/10 text-white hover:bg-white/10"
              : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-500/20 hover:shadow-indigo-500/30"
              }`}
          >
            {profile?.available ? "Set Unavailable" : "Activate Availability"}
          </button>
        </div>

        {/* Smart Tip */}
        {quickTip && (
          <div className={`rounded-xl border p-5 flex flex-col justify-between ${tipToneClasses[quickTip.tone]}`}>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">
                  {quickTip.tone === 'success' ? '✨' : quickTip.tone === 'warn' ? '💡' : '👋'}
                </span>
                <h4 className="font-bold text-sm tracking-wide uppercase opacity-90">{quickTip.title}</h4>
              </div>
              <p className="text-sm opacity-80 leading-relaxed mb-4">
                {quickTip.description}
              </p>
            </div>

            {quickTip.cta && quickTip.onClick && (
              <button
                onClick={quickTip.onClick}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-sm font-semibold transition-all"
              >
                {quickTip.cta}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickStatsCard;
