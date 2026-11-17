import React, { useState } from 'react';
import { Tag, Plus, Clock, IndianRupee, Edit3, Trash2, CheckCircle } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { formatCurrency } from '../../../utils/formatCurrency';

const ServicesPricing = () => {
  const { setIsAddServiceOpen, showToast } = useApp();

  const [services, setServices] = useState([
    {
      id: 1,
      title: 'Standard Personal Styling Consultation',
      duration: '2 Hours',
      price: 499,
      badge: 'Popular',
      description: 'Designer 1-on-1 consultation, style personality diagnosis, and curated outfit recommendations.',
      deliverables: ['Color analysis', 'Moodboard', 'Brand recommendations'],
      active: true,
    },
    {
      id: 2,
      title: 'Bridal Grand Couture Consultation',
      duration: '4 Hours',
      price: 4500,
      badge: 'Signature',
      description: 'End-to-end wedding trousseau curation, lehenga color matching, and boutique accompaniment.',
      deliverables: ['Jewelry matching', 'Blouse neckline design', 'Drape styling trial'],
      active: true,
    },
    {
      id: 3,
      title: 'Family Festive Ensemble Styling',
      duration: '3 Hours',
      price: 3800,
      badge: null,
      description: 'Harmonized color palette styling for the entire family (up to 5 members) for weddings/Diwali.',
      deliverables: ['Color coordination guide', 'Fabric & silhouette advice', 'Vendor assistance'],
      active: true,
    },
    {
      id: 4,
      title: 'Wardrobe Audit & Revamp',
      duration: '2 Hours',
      price: 1200,
      badge: null,
      description: 'In-home closet audit, decluttering, and creating 20+ fresh outfits from existing clothes.',
      deliverables: ['Digital lookbook of outfits', 'Shopping missing staples list'],
      active: true,
    },
  ]);

  const toggleService = (id) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
    showToast('Service availability updated');
  };

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1E1B2E]">
            Services & Pricing Management
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
            Configure your client packages, consultation rates, and deliverables
          </p>
        </div>
        <button
          onClick={() => setIsAddServiceOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#6B35D9] hover:bg-[#5B29C5] text-white text-xs sm:text-sm font-bold shadow-purple-glow flex items-center gap-2 self-start sm:self-auto transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {services.map((service) => (
          <div
            key={service.id}
            className={`zorevi-card p-5 bg-white flex flex-col justify-between border-2 transition ${
              service.active ? 'border-[#EAE4F5]' : 'border-[#F3F4F6] opacity-70'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  {service.badge && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#F3EEFF] text-[#6B35D9] mb-1.5 inline-block">
                      {service.badge}
                    </span>
                  )}
                  <h3 className="font-bold text-base text-[#1E1B2E]">{service.title}</h3>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xl font-extrabold text-[#1E1B2E] block">
                    {formatCurrency(service.price)}
                  </span>
                  <span className="text-[11px] text-[#6B7280] flex items-center justify-end gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-[#6B35D9]" />
                    {service.duration}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#6B7280] mt-3 leading-relaxed">
                {service.description}
              </p>

              <div className="mt-4 pt-3 border-t border-[#F3EEFB]">
                <span className="text-[11px] font-semibold text-[#1E1B2E] block mb-1.5">
                  Included Deliverables:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {service.deliverables.map((d, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-md text-[11px] bg-[#FAF8FE] border border-[#EAE4F5] text-[#4B5563]"
                    >
                      ✓ {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#F3EEFB] flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={service.active}
                  onChange={() => toggleService(service.id)}
                  className="rounded text-[#6B35D9] focus:ring-[#6B35D9] w-4 h-4"
                />
                <span className="text-xs font-medium text-[#1E1B2E]">
                  {service.active ? 'Accepting Bookings' : 'Paused'}
                </span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddServiceOpen(true)}
                  className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#6B35D9] hover:bg-[#F3EEFF] transition"
                  title="Edit service"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesPricing;
