// Path: jeevansetu-frontend/src/components/dashboard/SocialLinks.jsx
import React from "react";
import { FiInstagram, FiTwitter, FiFacebook, FiLink } from "react-icons/fi";

const SocialPill = ({ label, href, icon: Icon }) => {
  const has = typeof href === "string" && href.trim().length > 0;
  if (!has) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-indigo-500/20 hover:border-indigo-500/30 text-indigo-200/80 hover:text-white transition-all group"
      title={`${label} profile`}
    >
      <div className="p-1.5 rounded-md bg-white/5 group-hover:bg-white/10 transition-colors">
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-xs font-medium truncate max-w-[150px]">{label}</span>
      <FiLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-50 transition-opacity" />
    </a>
  );
};

const SocialLinks = ({ social }) => {
  if (!social?.instagram && !social?.x && !social?.facebook) {
    return <p className="text-white/40 italic text-sm">No social profiles linked.</p>;
  }

  return (
    <div className="mt-2 flex flex-wrap gap-3">
      <SocialPill label="Instagram" href={social?.instagram} icon={FiInstagram} />
      <SocialPill label="X (Twitter)" href={social?.x} icon={FiTwitter} />
      <SocialPill label="Facebook" href={social?.facebook} icon={FiFacebook} />
    </div>
  );
};

export default SocialLinks;
