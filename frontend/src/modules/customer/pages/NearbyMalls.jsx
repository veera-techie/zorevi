import React from 'react';
import MallCard from '../../../components/cards/MallCard';

const NearbyMalls = () => {
  const malls = [
    {
      id: 1,
      name: 'Sarath City Capital Mall',
      location: 'Gachibowli - Miyapur Rd, Hyderabad',
      designersCount: 18,
      storesCount: '150+',
      image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 2,
      name: 'Inorbit Mall Cyberabad',
      location: 'Mindspace, Madhapur, Hyderabad',
      designersCount: 14,
      storesCount: '100+',
      image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 3,
      name: 'GVK One Mall',
      location: 'Banjara Hills, Hyderabad',
      designersCount: 12,
      storesCount: '70+ Luxury Boutiques',
      image: 'https://images.unsplash.com/photo-1582037928769-181f2644ecb7?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 4,
      name: 'Nexus Hyderabad (Forum Sujana)',
      location: 'Kukatpally, Hyderabad',
      designersCount: 10,
      storesCount: '90+',
      image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#1E1B2E]">Nearby Malls & Shopping Centers</h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
          Select a partner mall in Hyderabad to meet with your personal stylist in-person
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {malls.map((m) => (
          <MallCard key={m.id} mall={m} />
        ))}
      </div>
    </div>
  );
};

export default NearbyMalls;
