// Path :- jeevansetu-frontend/src/pages/Footer.jsx

import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { BiDonateBlood } from "react-icons/bi";

export default function Footer() {
  const team = [
    {
      name: "Amruth Badi",
      linkedin: "https://www.linkedin.com/in/amruth-badi",
      github: "https://github.com/amruthbadi0999",
    },
  ];

  return (
    <footer className="mt-20 border-t border-white/5 bg-black/20 backdrop-blur-xl text-white relative overflow-hidden">
      {/* Footer Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-center flex-col text-center gap-4 mb-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)] animate-float">
            <BiDonateBlood className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Contributors</h3>
            <p className="text-sm text-indigo-200/70 mt-1">Gajanan Computers — laptop software and hardware solutions.</p>
          </div>
        </div>

        {/* Team grid (Single Item Centered) */}
        <div className="flex justify-center">
          {team.map((m) => (
            <div
              key={m.name}
              className="group glass-panel rounded-2xl p-6 w-full max-w-sm hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">{m.name}</p>
                  <p className="text-xs text-indigo-200/50">Lead Developer</p>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={m.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${m.name} on LinkedIn`}
                    className="p-2 rounded-lg bg-white/5 hover:bg-indigo-500/20 text-white/70 hover:text-indigo-300 transition-all border border-transparent hover:border-indigo-500/30"
                  >
                    <FaLinkedin className="w-5 h-5" />
                  </a>
                  <a
                    href={m.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${m.name} on GitHub`}
                    className="p-2 rounded-lg bg-white/5 hover:bg-purple-500/20 text-white/70 hover:text-purple-300 transition-all border border-transparent hover:border-purple-500/30"
                  >
                    <FaGithub className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-indigo-200/60">
            Contributed by <span className="font-semibold text-indigo-300">Amruth Badi</span> with <span className="text-purple-400 animate-pulse">❤️</span>
          </p>
          <p className="text-xs text-white/30"> {new Date().getFullYear()} Gajanan Computers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}