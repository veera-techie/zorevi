import React, { useState } from 'react';
import { X, Image as ImageIcon, Sparkles } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import InputField from '../../../components/forms/InputField';
import UploadField from '../../../components/forms/UploadField';

const UploadProjectModal = () => {
  const { isUploadProjectOpen, setIsUploadProjectOpen, addPortfolioProject } = useApp();

  const [projectTitle, setProjectTitle] = useState('');
  const [category, setCategory] = useState('Bridal Couture');
  const [client, setClient] = useState('');
  const [tags, setTags] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

  if (!isUploadProjectOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    addPortfolioProject({
      title: projectTitle || 'Festive Couture Collection',
      category: category,
      client: client || 'Private Client',
      image: previewImage || '/images/portfolio-bridal.png',
      tags: tags ? tags.split(',').map((t) => t.trim()) : ['Bespoke', 'Festive'],
    });
    setIsUploadProjectOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#EAE4F5] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#F3EEFB]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F3EEFF] text-[#6B35D9] flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#1E1B2E]">Upload Portfolio Project</h3>
              <p className="text-xs text-[#6B7280]">Showcase your latest styling transformation</p>
            </div>
          </div>
          <button
            onClick={() => setIsUploadProjectOpen(false)}
            className="p-1.5 rounded-xl text-[#6B7280] hover:bg-[#F3EEFB] hover:text-[#1E1B2E]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <UploadField
            label="Project Image"
            onFileSelect={(file, url) => setPreviewImage(url)}
            helperText="High-res portrait or outfit photo"
          />

          <InputField
            label="Project Title"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            placeholder="e.g. Royal Nizam Bridal Lehenga"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#1E1B2E]">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-sm bg-white border border-[#EAE4F5] rounded-xl py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#6B35D9]/20"
              >
                <option value="Bridal Couture">Bridal Couture</option>
                <option value="Menswear & Indo-Western">Menswear & Indo-Western</option>
                <option value="Family Festive Coordination">Family Festive</option>
                <option value="Western Contemporary">Western Contemporary</option>
              </select>
            </div>

            <InputField
              label="Client / Occasion"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="e.g. Sangeet Evening"
            />
          </div>

          <InputField
            label="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Raw Silk, Emerald, Zari"
          />

          <div className="pt-3 border-t border-[#F3EEFB] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsUploadProjectOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-[#6B7280] hover:text-[#1E1B2E]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#6B35D9] hover:bg-[#5B29C5] text-white text-sm font-semibold shadow-purple-glow transition"
            >
              Publish to Studio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadProjectModal;
