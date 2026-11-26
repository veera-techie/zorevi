const image = (name) => `/assets/images/${name}`;

export const discoveryCategories = [
  { id: 'all', label: 'All Stylists', title: 'Everyday style', description: 'Find a point of view for your everyday wardrobe.', image: image('category-western.jpg'), terms: [] },
  { id: 'men', label: 'Men', title: "Men's styling", description: 'Modern, traditional and occasion looks for men.', image: image('category-men.jpg'), terms: ["men's fashion"] },
  { id: 'women', label: 'Women', title: "Women's styling", description: 'Personal style, occasion wear and wardrobe edits.', image: image('category-women.jpg'), terms: ["women's fashion"] },
  { id: 'kids', label: 'Kids', title: "Kids' styling", description: 'Comfortable looks for celebrations and everyday wear.', image: image('category-kids.jpg'), terms: ["kids' fashion"] },
  { id: 'couples', label: 'Couples', title: 'Couple styling', description: 'Bring two personal styles together with thoughtful coordination.', image: image('category-couple.jpg'), terms: ['couple styling'] },
  { id: 'families', label: 'Families', title: 'Family styling', description: 'Coordinate family looks while keeping each person themselves.', image: image('category-family.jpg'), terms: ['family styling'] },
  { id: 'bridal', label: 'Bridal & Groom', title: 'Bridal & groom', description: 'Explore wedding styling ideas for every role and celebration.', image: image('category-bridal.jpg'), terms: ['bridal & groom', 'groom styling'] },
  { id: 'traditional', label: 'Traditional', title: 'Traditional wear', description: 'Celebrate heritage with silhouettes and details that feel like you.', image: image('category-traditional.jpg'), terms: ['traditional', 'ethnic wear'] },
  { id: 'western', label: 'Western', title: 'Western wear', description: 'Discover contemporary looks for work, weekends and occasions.', image: image('category-western.jpg'), terms: ['western wear', 'formal styling'] },
];

export const designerStyleFilters = discoveryCategories.filter((category) => ['all', 'men', 'women'].includes(category.id));

const portfolio = (imageNames, titles) => imageNames.map((name, index) => ({
  id: `${titles[index].toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index}`,
  title: titles[index],
  image: image(name),
  category: titles[index],
}));

export const publicDesigners = [
  {
    id: 'des-001', name: 'Aarohi Mehta', title: 'Personal Stylist & Fashion Consultant', experience: '6 years', yearsExperience: 6,
    location: 'Hyderabad', area: 'Jubilee Hills', distance: '3.2 km', rating: 4.8, reviewCount: 126, startingPrice: 799,
    isVerified: true, image: image('designer-aarohi.jpg'),
    specializations: ["Women's Fashion", 'Bridal & Groom', 'Family Styling'],
    bio: 'A sample profile focused on occasion wear, personal styling and thoughtful family looks.',
    portfolio: portfolio(['category-bridal.jpg', 'category-family.jpg', 'category-traditional.jpg'], ['Bridal Edit', 'Family Celebration', 'Modern Heritage']),
    services: [{ name: 'Personal styling', price: 799, duration: '2 hours' }, { name: 'Occasion consultation', price: 1299, duration: 'Custom' }],
  },
  {
    id: 'des-002', name: 'Sneha Kapoor', title: 'Fashion Designer', experience: '8 years', yearsExperience: 8,
    location: 'Hyderabad', area: 'Gachibowli', distance: '4.1 km', rating: 4.9, reviewCount: 94, startingPrice: 699,
    isVerified: true, image: image('designer-sneha.jpg'),
    specializations: ["Women's Fashion", "Kids' Fashion", 'Traditional'],
    bio: 'A sample profile for custom occasion pieces, traditional styling and family consultations.',
    portfolio: portfolio(['category-women.jpg', 'category-kids.jpg', 'category-traditional.jpg'], ['Saree Styling', 'Little Celebrations', 'Festive Edit']),
    services: [{ name: 'Wardrobe consultation', price: 699, duration: '2 hours' }, { name: 'Custom occasion styling', price: 1499, duration: 'Custom' }],
  },
  {
    id: 'des-003', name: 'Rohan Verma', title: 'Personal Stylist', experience: '7 years', yearsExperience: 7,
    location: 'Hyderabad', area: 'Madhapur', distance: '4.6 km', rating: 4.7, reviewCount: 88, startingPrice: 699,
    isVerified: true, image: image('designer-rohan.jpg'),
    specializations: ["Men's Fashion", 'Couple Styling', 'Western Wear'],
    bio: 'A sample profile for modern menswear, occasion edits and coordinated couple looks.',
    portfolio: portfolio(['category-men.jpg', 'category-couple.jpg', 'category-western.jpg'], ['Modern Formals', 'Couple Palette', 'Weekend Wardrobe']),
    services: [{ name: 'Personal styling', price: 699, duration: '2 hours' }, { name: 'Event look planning', price: 999, duration: 'Custom' }],
  },
  {
    id: 'des-004', name: 'Diya Sharma', title: 'Contemporary Style Consultant', experience: '4 years', yearsExperience: 4,
    location: 'Hyderabad', area: 'Kondapur', distance: '5.0 km', rating: 4.8, reviewCount: 73, startingPrice: 599,
    isVerified: true, image: image('designer-diya.jpg'),
    specializations: ["Women's Fashion", 'Personal Styling', 'Western Wear'],
    bio: 'A sample profile for contemporary outfits, closet refreshes and personal shopping.',
    portfolio: portfolio(['category-western.jpg', 'category-women.jpg'], ['Contemporary Mix', 'Day-to-Evening']),
    services: [{ name: 'Style refresh', price: 599, duration: '2 hours' }, { name: 'Personal shopping', price: 999, duration: 'Custom' }],
  },
  {
    id: 'des-005', name: 'Ananya Rao', title: 'Traditional Wear Stylist', experience: '9 years', yearsExperience: 9,
    location: 'Hyderabad', area: 'Banjara Hills', distance: '5.8 km', rating: 4.9, reviewCount: 112, startingPrice: 899,
    isVerified: true, image: image('designer-ananya.jpg'),
    specializations: ["Women's Fashion", 'Traditional', 'Personal Styling'],
    bio: 'A sample profile for traditional textiles, occasion styling and personal wardrobe edits.',
    portfolio: portfolio(['category-traditional.jpg', 'category-women.jpg'], ['Heritage Details', 'Occasion Color']),
    services: [{ name: 'Traditional wear consultation', price: 899, duration: '2 hours' }, { name: 'Festive styling', price: 1299, duration: 'Custom' }],
  },
  {
    id: 'des-006', name: 'Kabir Malhotra', title: 'Menswear & Occasion Stylist', experience: '5 years', yearsExperience: 5,
    location: 'Hyderabad', area: 'HITEC City', distance: '6.2 km', rating: 4.6, reviewCount: 61, startingPrice: 649,
    isVerified: true, image: image('designer-kabir.jpg'),
    specializations: ["Men's Fashion", 'Western Wear', 'Formal Styling'],
    bio: 'A sample profile for workwear, modern menswear and special-occasion outfits.',
    portfolio: portfolio(['category-men.jpg', 'category-western.jpg'], ['Tailored Essentials', 'After-hours']),
    services: [{ name: 'Menswear styling', price: 649, duration: '2 hours' }, { name: 'Formal wardrobe edit', price: 1099, duration: 'Custom' }],
  },
  {
    id: 'des-007', name: 'Meera Iyer', title: 'Bridal & Occasion Designer', experience: '10 years', yearsExperience: 10,
    location: 'Hyderabad', area: 'Secunderabad', distance: '7.4 km', rating: 4.9, reviewCount: 137, startingPrice: 999,
    isVerified: true, image: image('designer-meera.jpg'),
    specializations: ['Bridal & Groom', 'Traditional', "Women's Fashion"],
    bio: 'A sample profile for wedding wardrobes, traditional looks and occasion planning.',
    portfolio: portfolio(['category-bridal.jpg', 'category-traditional.jpg'], ['Wedding Palette', 'Classic Craft']),
    services: [{ name: 'Bridal consultation', price: 999, duration: '2 hours' }, { name: 'Wedding wardrobe planning', price: 1999, duration: 'Custom' }],
  },
  {
    id: 'des-008', name: 'Arjun Khanna', title: 'Groom & Menswear Stylist', experience: '6 years', yearsExperience: 6,
    location: 'Hyderabad', area: 'Film Nagar', distance: '8.1 km', rating: 4.7, reviewCount: 82, startingPrice: 799,
    isVerified: true, image: image('designer-arjun.jpg'),
    specializations: ["Men's Fashion", 'Bridal & Groom', 'Couple Styling'],
    bio: 'A sample profile for groom styling, tailored looks and coordinated wedding palettes.',
    portfolio: portfolio(['category-men.jpg', 'category-couple.jpg'], ['Groom Edit', 'Celebration Pairing']),
    services: [{ name: 'Groom styling', price: 799, duration: '2 hours' }, { name: 'Wedding party styling', price: 1499, duration: 'Custom' }],
  },
  {
    id: 'des-009', name: 'Priya Nair', title: 'Personal & Bridal Stylist', experience: '7 years', yearsExperience: 7,
    location: 'Mumbai', area: 'Bandra West', distance: '3.9 km', rating: 4.8, reviewCount: 101, startingPrice: 899,
    isVerified: true, image: image('designer-priya.jpg'),
    specializations: ["Women's Fashion", 'Bridal & Groom', 'Traditional'],
    bio: 'A sample profile for bridal looks, traditional wear and personal style consultations.',
    portfolio: portfolio(['category-bridal.jpg', 'category-traditional.jpg'], ['Bridal Details', 'Textile Stories']),
    services: [{ name: 'Personal styling', price: 899, duration: '2 hours' }, { name: 'Bridal consultation', price: 1699, duration: 'Custom' }],
  },
  {
    id: 'des-010', name: 'Dev Shah', title: 'Menswear Consultant', experience: '5 years', yearsExperience: 5,
    location: 'Mumbai', area: 'Andheri West', distance: '5.3 km', rating: 4.6, reviewCount: 55, startingPrice: 649,
    isVerified: true, image: image('designer-dev.jpg'),
    specializations: ["Men's Fashion", 'Western Wear', 'Personal Styling'],
    bio: 'A sample profile for everyday menswear, smart-casual outfits and wardrobe planning.',
    portfolio: portfolio(['category-men.jpg', 'category-western.jpg'], ['City Tailoring', 'Casual Layers']),
    services: [{ name: 'Menswear session', price: 649, duration: '2 hours' }, { name: 'Wardrobe plan', price: 1099, duration: 'Custom' }],
  },
  {
    id: 'des-011', name: 'Aisha Khan', title: 'Style & Wardrobe Consultant', experience: '6 years', yearsExperience: 6,
    location: 'Bengaluru', area: 'Indiranagar', distance: '2.7 km', rating: 4.8, reviewCount: 89, startingPrice: 749,
    isVerified: true, image: image('designer-aisha.jpg'),
    specializations: ["Women's Fashion", 'Couple Styling', 'Western Wear'],
    bio: 'A sample profile for versatile wardrobes, contemporary outfits and couple styling.',
    portfolio: portfolio(['category-western.jpg', 'category-couple.jpg'], ['City Layers', 'Shared Palette']),
    services: [{ name: 'Wardrobe consultation', price: 749, duration: '2 hours' }, { name: 'Event styling', price: 1199, duration: 'Custom' }],
  },
  {
    id: 'des-012', name: 'Vikram Rao', title: 'Groom & Occasion Stylist', experience: '8 years', yearsExperience: 8,
    location: 'Bengaluru', area: 'Koramangala', distance: '4.4 km', rating: 4.7, reviewCount: 76, startingPrice: 799,
    isVerified: true, image: image('designer-vikram.jpg'),
    specializations: ["Men's Fashion", 'Bridal & Groom', 'Family Styling'],
    bio: 'A sample profile for groom outfits, occasion wear and coordinated family looks.',
    portfolio: portfolio(['category-men.jpg', 'category-family.jpg'], ['Ceremony Styling', 'Family Celebration']),
    services: [{ name: 'Occasion styling', price: 799, duration: '2 hours' }, { name: 'Groom wardrobe plan', price: 1499, duration: 'Custom' }],
  },
];

const mapsSearch = (name) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, Hyderabad, Telangana`)}`;

export const publicMalls = [
  {
    id: 'sarath-city-capital-mall',
    name: 'Sarath City Capital Mall',
    location: 'Hyderabad, Telangana',
    image: image('mall-illustrative-01.jpg'),
    officialUrl: 'https://sarathcitycapitalmall.com/',
    sourceUrl: 'https://sarathcitycapitalmall.com/',
    mapsUrl: mapsSearch('Sarath City Capital Mall'),
  },
  {
    id: 'inorbit-mall-cyberabad',
    name: 'Inorbit Mall Cyberabad',
    location: 'Hyderabad, Telangana',
    image: image('mall-illustrative-02.jpg'),
    officialUrl: 'https://www.inorbit.in/inorbit-mall-cyberabad',
    sourceUrl: 'https://www.inorbit.in/inorbit-mall-cyberabad',
    mapsUrl: mapsSearch('Inorbit Mall Cyberabad'),
  },
  {
    id: 'gvk-one',
    name: 'GVK One',
    location: 'Hyderabad, Telangana',
    image: image('mall-illustrative-03.jpg'),
    officialUrl: 'https://gvkone.com/',
    sourceUrl: 'https://gvkone.com/',
    mapsUrl: mapsSearch('GVK One Mall'),
  },
];

export const discoveryDemoNotice = 'Stylish and Smarter way to shop with Zorevi';
