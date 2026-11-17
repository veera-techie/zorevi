import React from 'react';
import { Image as ImageIcon, ArrowRight, Plus, Eye } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const PortfolioHighlightsCard = () => {
  const { portfolio, setIsUploadProjectOpen } = useApp();
  const navigate = useNavigate();

  // Show top 3 portfolio items
  const items = portfolio.slice(0, 3);

  return (
    <div className="zorevi-card p-5 bg-white flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#F3EEFF] text-[#6B35D9] flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#1E1B2E]">Portfolio highlights</h3>
          </div>
          <button
            onClick={() => navigate('/designer/profile-portfolio')}
            className="text-xs font-semibold text-[#6B35D9] hover:underline flex items-center gap-1"
          >
            <span>View portfolio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Thumbnails Grid with Full Aspect Ratio */}
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate('/designer/profile-portfolio')}
              className="group cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[88/98] rounded-xl overflow-hidden border border-[#EAE4F5] bg-[#F3EEFB]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-[#6B35D9]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
              <span className="text-[11px] font-medium text-[#4B5563] group-hover:text-[#6B35D9] mt-1.5 truncate text-center transition-colors">
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Project Button */}
      <button
        onClick={() => setIsUploadProjectOpen(true)}
        className="mt-4 w-full py-2 px-3 rounded-xl border border-dashed border-[#C4B5FD] bg-[#FAF8FE] hover:bg-[#F3EEFF] text-[#6B35D9] text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-xs"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Upload project</span>
      </button>
    </div>
  );
};

export default PortfolioHighlightsCard;
