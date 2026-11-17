import React, { useState } from 'react';
import {
  User,
  Image as ImageIcon,
  Award,
  BookOpen,
  MapPin,
  Briefcase,
  Star,
  Plus,
  ShieldCheck,
  Check,
  ExternalLink,
  Eye,
  X,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

const ProfilePortfolio = () => {
  const { profile, portfolio, setIsEditProfileOpen, setIsUploadProjectOpen } = useApp();
  const [activeTab, setActiveTab] = useState('portfolio');
  const [portfolioCategory, setPortfolioCategory] = useState('ALL');
  const [lightboxImage, setLightboxImage] = useState(null);

  const skillsList = [
    { name: 'Bridal Couture Styling', level: 95, verified: true },
    { name: 'Color Palette & Tone Analysis', level: 90, verified: true },
    { name: 'Saree & Dupatta Draping Art', level: 98, verified: true },
    { name: 'Indo-Western Fusion', level: 88, verified: true },
    { name: 'Body Type Silhouette Matching', level: 92, verified: true },
    { name: 'Wedding Trousseau Planning', level: 96, verified: true },
    { name: 'Jewelry & Accessory Coordination', level: 89, verified: false },
    { name: 'Sustainable Wardrobe Audit', level: 82, verified: false },
  ];

  const certifications = [
    {
      title: 'Bachelor of Design in Fashion Communication',
      institution: 'National Institute of Fashion Technology (NIFT), Hyderabad',
      year: '2019',
      credentialId: 'NIFT-HYD-7721',
      badge: 'Degree',
    },
    {
      title: 'Certified Bridal & Celebrity Stylist',
      institution: 'London College of Style – Masterclass Accreditation',
      year: '2021',
      credentialId: 'LCS-UK-4491',
      badge: 'Certified',
    },
    {
      title: 'Official Stylist Partner',
      institution: 'Hyderabad Couture Fashion Week',
      year: '2023 · 2024',
      credentialId: 'HCFW-PRO-88',
      badge: 'Industry Honor',
    },
  ];

  const filteredPortfolio = portfolio.filter((item) => {
    if (portfolioCategory === 'ALL') return true;
    const cat = portfolioCategory.toLowerCase();
    return (
      item.category.toLowerCase().includes(cat) ||
      item.tags?.some((t) => t.toLowerCase().includes(cat))
    );
  });

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-300">
      {/* Top Banner Card */}
      <div className="zorevi-card p-6 bg-white flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <img
            src="/images/aarohi-portrait.png"
            alt={profile.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-[#EAE4F5] shadow-zorevi-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#1E1B2E]">
                {profile.name}
              </h1>
              <ShieldCheck className="w-5 h-5 text-[#3B82F6]" />
            </div>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">{profile.title}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#6B7280]">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#6B35D9]" /> {profile.location}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-[#6B35D9]" /> {profile.experience}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 text-[#F59E0B] font-bold">
                <Star className="w-3.5 h-3.5 fill-[#F59E0B]" /> {profile.rating} ({profile.reviewCount} reviews)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="px-4 py-2 rounded-xl bg-white border border-[#EAE4F5] hover:border-[#6B35D9]/40 text-xs sm:text-sm font-semibold text-[#1E1B2E] transition shadow-xs"
          >
            Edit Profile
          </button>
          <button
            onClick={() => setIsUploadProjectOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#6B35D9] hover:bg-[#5B29C5] text-xs sm:text-sm font-semibold text-white shadow-purple-glow transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Work</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-[#EAE4F5] gap-2 overflow-x-auto">
        {[
          { id: 'portfolio', label: 'Portfolio Gallery', icon: ImageIcon },
          { id: 'profile', label: 'Profile Bio & Details', icon: User },
          { id: 'skills', label: 'Skills & Techniques', icon: Award },
          { id: 'experience', label: 'Experience & Certifications', icon: BookOpen },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'border-[#6B35D9] text-[#6B35D9]'
                  : 'border-transparent text-[#6B7280] hover:text-[#1E1B2E]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Clean Edge-to-Edge Portfolio Gallery */}
      {activeTab === 'portfolio' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              {['ALL', 'Bridal', 'Indo-Western', 'Festive'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setPortfolioCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    portfolioCategory === cat
                      ? 'bg-[#6B35D9] text-white shadow-purple-glow'
                      : 'bg-white border border-[#EAE4F5] text-[#6B7280] hover:bg-[#FAF8FE]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <span className="text-xs text-[#6B7280]">
              Showing {filteredPortfolio.length} featured works
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPortfolio.map((item) => (
              <div
                key={item.id}
                className="zorevi-card overflow-hidden group cursor-pointer hover:-translate-y-1 transition-all duration-300"
                onClick={() => setLightboxImage(item)}
              >
                <div className="relative aspect-[4/3] bg-[#F3EEFB] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-semibold text-white">
                    {item.category}
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-base text-[#1E1B2E] group-hover:text-[#6B35D9] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#6B7280] mt-0.5">{item.client}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.tags?.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#F3EEFF] text-[#6B35D9]"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Profile Bio & Details */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="zorevi-card p-6 bg-white space-y-4">
              <h3 className="font-bold text-base text-[#1E1B2E]">About Aarohi Mehta</h3>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                {profile.bio}
              </p>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                Specializing in high-end South Indian and North Indian bridal trousseaus,
                custom drape styling, and family ensembles for multi-day weddings across
                Hyderabad, Banjara Hills, Jubilee Hills, and Gachibowli.
              </p>
            </div>

            <div className="zorevi-card p-6 bg-white space-y-3">
              <h3 className="font-bold text-base text-[#1E1B2E]">Service Offerings & Scope</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#FAF8FE] border border-[#EAE4F5]">
                  <span className="font-bold text-[#1E1B2E] block">In-Person Consultation</span>
                  <p className="text-[#6B7280] mt-1">Direct home or designer boutique accompaniment within 15 km.</p>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF8FE] border border-[#EAE4F5]">
                  <span className="font-bold text-[#1E1B2E] block">Virtual Wardrobe Styling</span>
                  <p className="text-[#6B7280] mt-1">Live 1-on-1 video call, digital moodboards & shopping links.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="zorevi-card p-5 bg-white">
              <h4 className="font-bold text-sm text-[#1E1B2E] mb-3">Languages Spoken</h4>
              <div className="flex flex-wrap gap-2">
                {profile.languages?.map((lang) => (
                  <span key={lang} className="px-3 py-1 rounded-full text-xs bg-[#FAF8FE] border border-[#EAE4F5] text-[#1E1B2E]">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div className="zorevi-card p-5 bg-white">
              <h4 className="font-bold text-sm text-[#1E1B2E] mb-3">Location & Radius</h4>
              <p className="text-xs text-[#6B7280]">
                Base Studio: Road No. 36, Jubilee Hills, Hyderabad
              </p>
              <p className="text-xs font-semibold text-[#6B35D9] mt-2">
                Covers: Banjara Hills, Madhapur, Hitech City, Gachibowli, Secunderabad (15 km)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Skills & Expertise */}
      {activeTab === 'skills' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {skillsList.map((skill, idx) => (
            <div key={idx} className="zorevi-card p-4 bg-white flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-[#1E1B2E]">{skill.name}</span>
                  {skill.verified && <ShieldCheck className="w-4 h-4 text-[#3B82F6]" />}
                </div>
                <span className="text-xs font-bold text-[#6B35D9]">{skill.level}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#EDE8F8] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#6B35D9] to-[#8B5CF6]"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Experience & Certifications */}
      {activeTab === 'experience' && (
        <div className="space-y-4">
          {certifications.map((cert, idx) => (
            <div key={idx} className="zorevi-card p-5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#F3EEFF] text-[#6B35D9] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-[#1E1B2E]">{cert.title}</h4>
                    <span className="text-[10px] bg-[#ECFDF5] text-[#065F46] font-bold px-2 py-0.5 rounded-full">
                      {cert.badge}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B7280] mt-0.5">{cert.institution}</p>
                  <span className="text-[11px] text-[#9CA3AF] mt-1 block">
                    Credential ID: {cert.credentialId} · Issued {cert.year}
                  </span>
                </div>
              </div>
              <button className="px-3.5 py-1.5 rounded-xl border border-[#EAE4F5] hover:border-[#6B35D9] text-xs font-semibold text-[#6B35D9] flex items-center gap-1 self-start sm:self-center">
                <span>Verify Credential</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-4 bg-[#F6F3FB] flex items-center justify-center">
              <img
                src={lightboxImage.image}
                alt={lightboxImage.title}
                className="max-h-[65vh] w-auto rounded-2xl shadow-md object-contain"
              />
            </div>
            <div className="p-5 bg-white border-t border-[#F3EEFB]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-[#1E1B2E]">
                    {lightboxImage.title}
                  </h3>
                  <p className="text-xs text-[#6B7280] mt-0.5">{lightboxImage.client}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F3EEFF] text-[#6B35D9]">
                  {lightboxImage.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePortfolio;
