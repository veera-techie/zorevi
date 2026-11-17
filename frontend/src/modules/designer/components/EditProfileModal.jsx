import React, { useState } from 'react';
import { X, Check, User, MapPin, Briefcase, Sparkles, Upload } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import InputField from '../../../components/forms/InputField';

const EditProfileModal = () => {
  const { profile, updateProfileData, isEditProfileOpen, setIsEditProfileOpen } = useApp();

  const [formData, setFormData] = useState({
    name: profile.name,
    title: profile.title,
    location: profile.location,
    serviceRadius: profile.serviceRadius,
    experience: profile.experience,
    specializations: profile.specializations.join(', '),
    bio: profile.bio || '',
  });

  if (!isEditProfileOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfileData({
      ...formData,
      specializations: formData.specializations
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    });
    setIsEditProfileOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#EAE4F5] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#F3EEFB]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F3EEFF] text-[#6B35D9] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#1E1B2E]">Edit Designer Profile</h3>
              <p className="text-xs text-[#6B7280]">Update studio information visible to clients</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditProfileOpen(false)}
            className="p-1.5 rounded-xl text-[#6B7280] hover:bg-[#F3EEFB] hover:text-[#1E1B2E]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <InputField
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            icon={User}
            required
          />

          <InputField
            label="Professional Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              icon={MapPin}
              required
            />
            <InputField
              label="Service Radius"
              value={formData.serviceRadius}
              onChange={(e) => setFormData({ ...formData, serviceRadius: e.target.value })}
              placeholder="e.g. 15 km service radius"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Experience"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              icon={Briefcase}
              required
            />
            <InputField
              label="Specializations (comma separated)"
              value={formData.specializations}
              onChange={(e) => setFormData({ ...formData, specializations: e.target.value })}
              placeholder="Bridal, Western, Indo-Western"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#1E1B2E]">Designer Bio</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full text-sm bg-white border border-[#EAE4F5] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#6B35D9]/20 focus:border-[#6B35D9]"
              placeholder="Tell clients about your design background and personal styling process..."
            />
          </div>

          <div className="pt-3 border-t border-[#F3EEFB] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditProfileOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-[#6B7280] hover:text-[#1E1B2E]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#6B35D9] hover:bg-[#5B29C5] text-white text-sm font-semibold shadow-purple-glow transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
