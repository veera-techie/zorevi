import React from 'react';

const HeroBanner = () => {
  return (
    <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-r from-[#F6F0FE] via-[#EFE6FC] to-[#E3D6FA] border border-[#E7DCF8] shadow-zorevi min-h-[110px] sm:min-h-[120px] flex items-center">
      {/* Left Text Content */}
      <div className="relative z-10 py-5 sm:py-6 pl-6 sm:pl-8 pr-4 max-w-sm sm:max-w-md md:max-w-lg">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B2E] tracking-tight leading-tight">
          Welcome Back, Designer!
        </h1>
        <p className="text-sm sm:text-base text-[#6B7280] mt-1 font-medium">
          Your creative studio at a glance.
        </p>
      </div>

      {/* Right Graphic: FULL height and flush to top, bottom, and right edge */}
      <div className="absolute right-0 top-0 bottom-0 h-full w-[60%] sm:w-[58%] md:w-[55%] lg:w-[52%] pointer-events-none select-none overflow-hidden">
        <img
          src="/images/hero-banner-group.png"
          alt="Indian Ethnic Festive Group Banner"
          className="h-full w-full object-cover object-left sm:object-center select-none pointer-events-none"
        />
        {/* Soft gradient blend on the left edge so it smoothly melts into the text area */}
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#EFE6FC] to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

export default HeroBanner;
