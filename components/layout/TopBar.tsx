import React from "react";

export default function TopBar() {
  const tickerText = "Join Our Community Group Today Send Your Name, City & Area to 0300-1234567      |      Join Our Community Group Today Send Your Name, City & Area to 0300-1234567      |      Join Our Community Group Today Send Your Name, City & Area to 0300-1234567";

  return (
    <div className="bg-[#009473] text-white text-[11.5px] py-2 px-4 font-medium select-none overflow-hidden relative border-b border-emerald-700/30">
      {/* Type-safe CSS keyframe animation for smooth scrolling ticker */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ticker-scroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.33%, 0, 0); }
        }
        .ticker-wrap {
          display: flex;
          width: max-content;
          animation: ticker-scroll 25s linear infinite;
        }
      `}} />
      <div className="max-w-7xl mx-auto overflow-hidden relative w-full flex">
        <div className="ticker-wrap whitespace-nowrap flex gap-12">
          <span>{tickerText}</span>
          <span>{tickerText}</span>
          <span>{tickerText}</span>
        </div>
      </div>
    </div>
  );
}
