import React, { useState } from 'react';
import { X, Shirt, IndianRupee, Clock, Sparkles } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import InputField from '../../../components/forms/InputField';

const AddServiceModal = () => {
  const { isAddServiceOpen, setIsAddServiceOpen, showToast } = useApp();

  const [serviceName, setServiceName] = useState('');
  const [duration, setDuration] = useState('2 Hours');
  const [price, setPrice] = useState('499');
  const [description, setDescription] = useState('');
  const [serviceType, setServiceType] = useState('Personal Consultation');

  if (!isAddServiceOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast(`New service "${serviceName || 'Custom Styling'}" published to your studio!`);
    setIsAddServiceOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#EAE4F5] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#F3EEFB]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F3EEFF] text-[#6B35D9] flex items-center justify-center">
              <Shirt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#1E1B2E]">Add a New Service</h3>
              <p className="text-xs text-[#6B7280]">Offer bespoke styling or bridal packages</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddServiceOpen(false)}
            className="p-1.5 rounded-xl text-[#6B7280] hover:bg-[#F3EEFB] hover:text-[#1E1B2E]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <InputField
            label="Service Title"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            placeholder="e.g. Sangeet Outfit & Jewelry Styling"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Starting Price (₹ INR)"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="499"
              icon={IndianRupee}
              required
            />
            <InputField
              label="Standard Duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 2 Hours"
              icon={Clock}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#1E1B2E]">Service Category</label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full text-sm bg-white border border-[#EAE4F5] rounded-xl py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#6B35D9]/20"
            >
              <option value="Personal Consultation">Personal Consultation (₹499 base)</option>
              <option value="Bridal Styling">Bridal Styling & Trouseau</option>
              <option value="Family Festive">Family Festive Styling</option>
              <option value="Wardrobe Audit">Wardrobe Audit & Declutter</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#1E1B2E]">Description & Deliverables</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Details about consultation format, moodboards provided, trial assistance..."
              className="w-full text-sm bg-white border border-[#EAE4F5] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#6B35D9]/20"
            />
          </div>

          <div className="pt-3 border-t border-[#F3EEFB] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddServiceOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-[#6B7280] hover:text-[#1E1B2E]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#6B35D9] hover:bg-[#5B29C5] text-white text-sm font-semibold shadow-purple-glow transition"
            >
              Publish Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddServiceModal;
