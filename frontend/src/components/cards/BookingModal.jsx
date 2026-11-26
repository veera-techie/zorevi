import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check, ArrowRight, ArrowLeft, Calendar, Clock, MapPin, Users,
  Sparkles, ShieldCheck, Info, CheckCircle2, AlertCircle, CreditCard,
  Building2, ChevronRight, X, ExternalLink, Sun, Sunset, Moon
} from 'lucide-react';
import Modal from '../common/Modal';
import { mockDesigners, mockMalls } from '../../services/mockData';
import { REAL_FASHION_HUBS } from '../../services/fashionHubsService';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import ImageWithFallback from '../common/ImageWithFallback';
import './BookingModal.css';

// Occasions data
export const OCCASIONS_DATA = [
  { id: 'vacation-photoshoot-shopping', label: 'Vacation/Photoshoot Shopping' },
  { id: 'wedding-shopping', label: 'Wedding Shopping' },
  { id: 'couple-shopping', label: 'Couple Shopping' },
  { id: 'festive-shopping', label: 'Festive Shopping' },
  { id: 'family-occasions', label: 'Family Occasions' },
  { id: 'nri-family-visits', label: 'NRI Family Visits' },
  { id: 'corporate-events-it-meets', label: 'Corporate Events/IT Meets' },
];

// Occasion & Category specific services
export const SERVICES_BY_OCCASION = {
  wedding: [
    { id: 'w1', name: 'Bridal Styling (Consultation + Look)', price: 1499, time: '3 hrs', desc: 'Complete bridal lehenga/saree, jewelry & veil coordination' },
    { id: 'w2', name: 'Groom Styling (Sherwani & Accessories)', price: 1299, time: '2.5 hrs', desc: 'Sherwani, safa, mojari & royalty accessory curation' },
  ],
  engagement: [
    { id: 'e1', name: 'Couple Shopping Consultation', price: 1199, time: '2.5 hrs', desc: 'Plan coordinated looks that reflect both personal styles.' },
    { id: 'e2', name: 'Couple Outfit Coordination', price: 999, time: '2 hrs', desc: 'Coordinate colors and styles for a balanced shared look.' },
    { id: 'e3', name: 'Special Occasion Couple Styling', price: 999, time: '2 hrs', desc: 'Select complementary outfits for a celebration or event.' },
  ],
  office: [
    { id: 'o1', name: 'Corporate Event Styling', price: 999, time: '2 hrs', desc: 'Plan a polished look for conferences, client meetings, and company events.' },
    { id: 'o2', name: 'IT Meet Outfit Planning', price: 699, time: '1.5 hrs', desc: 'Choose comfortable, professional looks for team and industry meets.' },
    { id: 'o3', name: 'Professional Shopping Consultation', price: 799, time: '2 hrs', desc: 'Find versatile options suited to your role, workplace, and budget.' },
  ],
  festival: [
    { id: 'f1', name: 'Festive Shopping Consultation', price: 899, time: '2 hrs', desc: 'Plan comfortable, occasion-ready looks for your festive calendar.' },
    { id: 'f2', name: 'Festive Look Coordination', price: 999, time: '2 hrs', desc: 'Bring colors, accessories, and personal style together for the celebration.' },
    { id: 'f3', name: 'Family Festive Styling', price: 1299, time: '2.5 hrs', desc: 'Coordinate celebration looks for the whole family.' },
  ],
  vacation: [
    { id: 'v1', name: 'Vacation Shopping Consultation', price: 799, time: '2 hrs', desc: 'Plan practical, coordinated outfits for your trip.' },
    { id: 'v2', name: 'Photoshoot Outfit Selection', price: 899, time: '2 hrs', desc: 'Choose looks that suit your shoot location, theme, and budget.' },
    { id: 'v3', name: 'Travel Outfit Coordination', price: 699, time: '1.5 hrs', desc: 'Coordinate versatile outfits and accessories for your itinerary.' },
  ],
  family: [
    { id: 'fa1', name: 'Family Shopping Consultation', price: 1499, time: '3 hrs', desc: 'Get outfit guidance for each family member in one shopping session.' },
    { id: 'fa2', name: 'Family Occasion Coordination', price: 899, time: '2 hrs', desc: 'Coordinate colors and styles for a shared family celebration.' },
    { id: 'fa3', name: 'Celebration Outfit Planning', price: 999, time: '2 hrs', desc: 'Plan suitable looks for your family event and shopping budget.' },
  ],
  nriFamily: [
    { id: 'nri1', name: 'Family Visit Shopping Consultation', price: 1299, time: '2.5 hrs', desc: 'Plan outfits for visits, gatherings, and time with family.' },
    { id: 'nri2', name: 'Reunion & Celebration Styling', price: 999, time: '2 hrs', desc: 'Choose coordinated looks for reunions and family celebrations.' },
    { id: 'nri3', name: 'Family Shopping Coordination', price: 1499, time: '3 hrs', desc: 'Make a shared shopping plan for visiting family members.' },
  ],
};

const BOOKING_SERVICES_BY_OCCASION = {
  'vacation-photoshoot-shopping': SERVICES_BY_OCCASION.vacation,
  'wedding-shopping': SERVICES_BY_OCCASION.wedding,
  'couple-shopping': SERVICES_BY_OCCASION.engagement,
  'festive-shopping': SERVICES_BY_OCCASION.festival,
  'family-occasions': SERVICES_BY_OCCASION.family,
  'nri-family-visits': SERVICES_BY_OCCASION.nriFamily,
  'corporate-events-it-meets': SERVICES_BY_OCCASION.office,
};

const SHOPPING_BUDGETS = [
  { id: '10k', label: 'Up to ₹10,000', desc: 'High-street & smart essentials' },
  { id: '20k', label: 'Up to ₹20,000', desc: 'Premium retail & festive' },
  { id: '50k', label: 'Up to ₹50,000', desc: 'Designer boutique & luxury' },
  { id: '100k', label: 'Up to ₹1,00,000', desc: 'Bespoke bridal & couture' },
  { id: 'custom', label: 'Custom Budget', desc: 'Specify own amount' },
];

// Comprehensive time slots
const TIME_SLOTS = {
  morning: ['09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
  afternoon: ['12:30 PM', '01:30 PM', '02:00 PM', '03:00 PM', '03:30 PM', '04:30 PM'],
  evening: ['05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM'],
};

function getLocalIsoDate(offsetDays = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function buildQuickDateOptions() {
  return [0, 1, 2, 3, 4].map((offset) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    const label =
      offset === 0
        ? 'Today'
        : offset === 1
        ? 'Tomorrow'
        : d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    return { label, date: getLocalIsoDate(offset) };
  });
}

export default function BookingModal({
  isOpen,
  onClose,
  initialDesigner = null,
  bookingToPay = null,
  initialStep = 1,
  preselectedHub = null,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast, createBookingRequest, payAdvancePayment } = useApp();

  // Mode: 'form' | 'payment'
  const [viewMode, setViewMode] = useState(bookingToPay || initialStep === 9 || initialStep === 8 ? 'payment' : 'form');

  // Designer
  const [designer, setDesigner] = useState(initialDesigner || mockDesigners[0]);

  // Section 1: Occasion
  const [selectedOccasion, setSelectedOccasion] = useState(OCCASIONS_DATA[0]);

  // Section 2: Services (Multi-select)
  const [selectedServices, setSelectedServices] = useState([BOOKING_SERVICES_BY_OCCASION[OCCASIONS_DATA[0].id][0]]);

  // Default category retained for existing booking records.
  const fashionCategory = 'Women';

  // Section 3: Total Shopping Budget
  const [shoppingBudget, setShoppingBudget] = useState('Up to ₹20,000');
  const [customBudgetValue, setCustomBudgetValue] = useState('35,000');

  // Section 4: Date, Venue & Times
  const quickDateOptions = useMemo(() => buildQuickDateOptions(), []);
  const [bookingDate, setBookingDate] = useState(() => getLocalIsoDate(0));
  const [bookingTime, setBookingTime] = useState('11:00 AM');
  const [isCustomTime, setIsCustomTime] = useState(false);
  const [customTimeInput, setCustomTimeInput] = useState('');
  const [meetingType, setMeetingType] = useState('Mall Styling Session');
  const [selectedMall, setSelectedMall] = useState(preselectedHub || REAL_FASHION_HUBS[0] || mockMalls[0]);
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Submission & validation states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  // Post-submit & Payment states
  const [createdBooking, setCreatedBooking] = useState(bookingToPay || null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  // Sync initial designer or bookingToPay changes
  useEffect(() => {
    if (initialDesigner) {
      setDesigner(initialDesigner);
    }
    if (preselectedHub) {
      setSelectedMall(preselectedHub);
      setMeetingType('Mall Styling Session');
    }
    if (bookingToPay || initialStep === 9 || initialStep === 8) {
      setCreatedBooking(bookingToPay);
      setViewMode('payment');
    } else {
      setViewMode('form');
    }
    setFormErrors({});
    setSubmitError('');
    setIsSubmitting(false);
  }, [initialDesigner, preselectedHub, bookingToPay, initialStep, isOpen]);

  // Available services for current occasion
  const availableServices = useMemo(() => {
    return BOOKING_SERVICES_BY_OCCASION[selectedOccasion.id];
  }, [selectedOccasion]);

  // Update selected services when occasion changes if none selected
  const handleSelectOccasion = (occ) => {
    setSelectedOccasion(occ);
    const servicesForOcc = BOOKING_SERVICES_BY_OCCASION[occ.id];
    if (servicesForOcc && servicesForOcc.length > 0) {
      setSelectedServices([servicesForOcc[0]]);
    }
  };

  // Toggle service selection
  const toggleService = (srv) => {
    if (selectedServices.some((s) => s.id === srv.id)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((s) => s.id !== srv.id));
      } else {
        addToast('Please select at least one styling service.', 'warning');
      }
    } else {
      setSelectedServices([...selectedServices, srv]);
    }
  };

  // Calculated fees
  const calculatedServiceFee = useMemo(() => {
    return selectedServices.reduce((sum, s) => sum + s.price, 0) || designer?.startingPrice || 999;
  }, [selectedServices, designer]);

  const advanceAmount30 = Math.round(calculatedServiceFee * 0.3);
  const remainingAmount70 = calculatedServiceFee - advanceAmount30;

  // Active booking for payment mode
  const activeBooking = createdBooking || bookingToPay;
  const activeFee = activeBooking?.designerFee || calculatedServiceFee;
  const activeAdvance = Math.round(activeFee * 0.3);
  const activeRemaining = activeFee - activeAdvance;

  // Validate required booking fields
  const validateBookingForm = () => {
    const errors = {};
    if (!designer?.id && !designer?.name) {
      errors.designer = 'Please select a designer.';
    }
    if (!selectedOccasion?.id) {
      errors.occasion = 'Please select an occasion.';
    }
    if (!selectedServices || selectedServices.length === 0) {
      errors.services = 'Please select at least one styling service.';
    }
    if (!shoppingBudget) {
      errors.budget = 'Please select your estimated shopping budget.';
    } else if (shoppingBudget === 'Custom Budget') {
      const numericBudget = Number(String(customBudgetValue || '').replace(/[^0-9.]/g, ''));
      if (!numericBudget || numericBudget <= 0) {
        errors.budget = 'Please enter a valid custom wardrobe budget amount.';
      }
    }
    if (!meetingType) {
      errors.venue = 'Please select a session experience & meeting venue.';
    } else if (meetingType === 'Mall Styling Session' && !selectedMall?.id) {
      errors.venue = 'Please select a fashion hub or shopping mall.';
    }
    if (!bookingDate || Number.isNaN(new Date(`${bookingDate}T00:00:00`).getTime())) {
      errors.date = 'Please choose a valid session date.';
    }
    const finalTime = isCustomTime ? customTimeInput.trim() : bookingTime;
    if (!finalTime) {
      errors.time = isCustomTime
        ? 'Please enter your preferred custom time slot.'
        : 'Please select a preferred time slot.';
    }
    return errors;
  };

  // Submit Booking Request
  const handleSubmitBookingRequest = async (e) => {
    e?.preventDefault();
    if (isSubmitting) return;

    const errors = validateBookingForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setSubmitError('Please review the highlighted fields before submitting.');
      addToast(Object.values(errors)[0], 'error');
      return;
    }

    setFormErrors({});
    setSubmitError('');
    setIsSubmitting(true);

    const finalBudget = shoppingBudget === 'Custom Budget' ? `Custom (₹${customBudgetValue})` : shoppingBudget;
    const finalTime = isCustomTime ? customTimeInput.trim() : bookingTime;
    const resolvedVenue =
      meetingType === 'Mall Styling Session'
        ? selectedMall.name
        : meetingType === 'Designer Studio'
        ? `${designer.name}'s Studio Atelier`
        : 'Online Video Consultation';

    const draft = {
      customerId: user?.id || 'cust-001',
      customerName: user?.name || 'Praveen Kumar',
      customerAvatar: user?.avatar || '/images/customer-praveen.png',
      customerPhone: user?.phone || '+91 98765 43210',
      customerEmail: user?.email || 'praveen.kumar@email.com',
      designer,
      designerFee: calculatedServiceFee,
      occasion: selectedOccasion.label,
      services: selectedServices.map((s) => s.name),
      category: fashionCategory,
      preferences: {
        clothingPreference: 'Contemporary & Occasion Wear',
        preferredStyles: ['Modern', 'Tailored Regular'],
        colorPreferences: 'Palette tailored to selected occasion',
        outfitRequirements: additionalNotes.trim() || 'Curated styling matching the selected occasion and schedule.',
        specialInstructions: additionalNotes.trim() || 'Private trial lounge coordination requested.',
        referenceImages: [],
      },
      shoppingBudget: finalBudget,
      date: bookingDate,
      time: finalTime,
      meetingType,
      mall: meetingType === 'Mall Styling Session' ? selectedMall : { name: resolvedVenue, locality: designer?.location || 'Hyderabad' },
      meetingLocation: resolvedVenue,
      notes: additionalNotes.trim(),
    };

    try {
      const newBooking = await createBookingRequest(draft);
      setCreatedBooking(newBooking);
      setIsSubmitting(false);
      // Automatically close the booking modal & form after successful submission
      onClose();
    } catch (err) {
      setIsSubmitting(false);
      const errMessage = err?.message || 'Unable to submit booking request. Please try again.';
      setSubmitError(errMessage);
      addToast(errMessage, 'error');
    }
  };

  // Pay 30% advance
  const handlePayAdvance = () => {
    if (!activeBooking) return;
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentDone(true);
      payAdvancePayment(activeBooking.id, paymentMethod);
      addToast(`₹${activeAdvance} advance payment confirmed! Appointment locked.`, 'success');
    }, 1200);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setPaymentDone(false);
    setFormErrors({});
    setSubmitError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        viewMode === 'payment'
          ? (paymentDone ? 'Booking Confirmed!' : '30% Advance Payment')
          : `Book Styling Session with ${designer?.name || 'Designer'}`
      }
      maxWidth="820px"
    >
      <div className="zorevi-booking-modal-body">
        {/* =========================================================
            MODE 1: UNIFIED SINGLE BOOKING FORM
            ========================================================= */}
        {viewMode === 'form' && (
          <form onSubmit={handleSubmitBookingRequest} className="zorevi-single-booking-form">
            {/* Designer Header Banner */}
            <div className="zorevi-booking-designer-banner">
              <ImageWithFallback
                src={designer.avatar}
                alt={designer.name}
                className="zorevi-booking-banner-avatar"
                fallbackType="designer"
              />
              <div className="zorevi-booking-banner-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#1E1B4B' }}>
                    {designer.name}
                  </h3>
                  {designer.isVerified && <CheckCircle2 size={16} color="#7C3AED" />}
                </div>
                <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: '#6B7280' }}>
                  {designer.title} • {designer.experience} • <MapPin size={12} style={{ display: 'inline' }} /> {designer.location}
                </p>
              </div>
              <div className="zorevi-booking-banner-rate">
                <small style={{ color: '#6B7280', fontSize: '0.72rem' }}>Consultation From</small>
                <strong style={{ color: '#7C3AED', fontSize: '1.05rem', fontWeight: 800 }}>
                  ₹{designer.startingPrice || 499}
                </strong>
              </div>
            </div>

            {/* SECTION 1: OCCASION SELECTION */}
            <div className="zorevi-form-section">
              <div className="zorevi-section-title-row">
                <span className="zorevi-section-badge">1</span>
                <div>
                  <h4 className="zorevi-section-title">Select Occasion</h4>
                  <small className="zorevi-section-sub">What event or celebration are you styling for?</small>
                </div>
              </div>

              <div className="zorevi-occasions-chip-wrap">
                {OCCASIONS_DATA.map((occ) => {
                  const isSelected = selectedOccasion.id === occ.id;
                  return (
                    <button
                      key={occ.id}
                      type="button"
                      className={`zorevi-pill-btn ${isSelected ? 'is-active' : ''}`}
                      onClick={() => handleSelectOccasion(occ)}
                    >
                      {occ.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECTION 2: SERVICES SELECTION (Multi-select) */}
            <div className="zorevi-form-section">
              <div className="zorevi-section-title-row">
                <span className="zorevi-section-badge">2</span>
                <div>
                  <h4 className="zorevi-section-title">Select Styling Services</h4>
                  <small className="zorevi-section-sub">Choose one or more services needed for this session</small>
                </div>
              </div>

              <div className="zorevi-services-compact-grid">
                {availableServices.map((srv) => {
                  const isChecked = selectedServices.some((s) => s.id === srv.id);
                  return (
                    <div
                      key={srv.id}
                      className={`zorevi-service-compact-card ${isChecked ? 'is-selected' : ''}`}
                      onClick={() => toggleService(srv)}
                    >
                      <div className="zorevi-service-checkbox">
                        {isChecked && <Check size={13} color="#FFFFFF" strokeWidth={3} />}
                      </div>
                      <div className="zorevi-service-compact-body">
                        <div className="zorevi-service-compact-head">
                          <strong>{srv.name}</strong>
                          <span className="zorevi-service-price-pill">₹{srv.price}</span>
                        </div>
                        <p>{srv.desc}</p>
                        <span className="zorevi-service-duration"><Clock size={11} /> {srv.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION 3: ESTIMATED SHOPPING BUDGET */}
            <div className="zorevi-form-section">
              <div className="zorevi-section-title-row">
                <span className="zorevi-section-badge">3</span>
                <div>
                  <h4 className="zorevi-section-title">Estimated Shopping Purchase Budget</h4>
                  <small className="zorevi-section-sub">
                    Estimated budget for purchasing outfits at stores (Designer fee is separate)
                  </small>
                </div>
              </div>

              <div className="zorevi-budget-chips-row">
                {SHOPPING_BUDGETS.map((b) => {
                  const isSelected = shoppingBudget === b.label;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      className={`zorevi-budget-chip-btn ${isSelected ? 'is-active' : ''}`}
                      onClick={() => setShoppingBudget(b.label)}
                    >
                      <strong>{b.label}</strong>
                      <small>{b.desc}</small>
                    </button>
                  );
                })}
              </div>

              {shoppingBudget === 'Custom Budget' && (
                <div style={{ marginTop: '12px' }}>
                  <label className="zorevi-form-label">Enter Custom Wardrobe Budget (₹)</label>
                  <input
                    type="number"
                    min="1"
                    className="zorevi-input"
                    value={customBudgetValue}
                    onChange={(e) => {
                      setCustomBudgetValue(e.target.value);
                      if (formErrors.budget) setFormErrors((prev) => ({ ...prev, budget: undefined }));
                    }}
                    placeholder="e.g. 75000"
                    style={{ maxWidth: '240px' }}
                  />
                </div>
              )}
              {formErrors.budget && <span className="zorevi-field-error">{formErrors.budget}</span>}
            </div>

            {/* SECTION 4: DATE, VENUE & TIMES (EXTENSIVE TIMES INCLUDED) */}
            <div className="zorevi-form-section">
              <div className="zorevi-section-title-row">
                <span className="zorevi-section-badge">4</span>
                <div>
                  <h4 className="zorevi-section-title">Session Schedule, Venue & Times</h4>
                  <small className="zorevi-section-sub">Select preferred date, meeting spot, and exact time slot</small>
                </div>
              </div>

              {/* Experience / Venue Type */}
              <div className="zorevi-form-group">
                <label className="zorevi-form-label">Session Experience & Meeting Venue</label>
                <div className="zorevi-meeting-type-tabs">
                  {[
                    { id: 'Mall Styling Session', label: 'Fashion Hub / Shopping Mall', icon: Building2 },
                    { id: 'Designer Studio', label: 'Designer Studio Atelier', icon: Sparkles },
                    { id: 'Online Consultation', label: '1:1 Video Consultation', icon: Clock },
                  ].map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      className={`zorevi-meeting-type-btn ${meetingType === type.id ? 'active' : ''}`}
                      onClick={() => {
                        setMeetingType(type.id);
                        if (formErrors.venue) setFormErrors((prev) => ({ ...prev, venue: undefined }));
                      }}
                    >
                      <type.icon size={15} />
                      <span>{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Venue Dropdown if Mall Styling is chosen */}
              {meetingType === 'Mall Styling Session' && (
                <div className="zorevi-form-group">
                  <label className="zorevi-form-label">Select Fashion Hub / Venue</label>
                  <select
                    className="zorevi-select"
                    value={selectedMall.id}
                    onChange={(e) => {
                      const allHubs = [...REAL_FASHION_HUBS, ...mockMalls];
                      const m = allHubs.find((item) => item.id === e.target.value);
                      if (m) setSelectedMall(m);
                      if (formErrors.venue) setFormErrors((prev) => ({ ...prev, venue: undefined }));
                    }}
                  >
                    {REAL_FASHION_HUBS.map((hub) => (
                      <option key={hub.id} value={hub.id}>
                        {hub.name} ({hub.category || 'Fashion Hub'} • {hub.locality || hub.city})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {formErrors.venue && <span className="zorevi-field-error">{formErrors.venue}</span>}

              {/* Preferred Date */}
              <div className="zorevi-form-group">
                <label className="zorevi-form-label">Preferred Date</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                  {quickDateOptions.map((d) => (
                    <button
                      key={d.date}
                      type="button"
                      className={`zorevi-pill-btn ${bookingDate === d.date ? 'is-active' : ''}`}
                      onClick={() => {
                        setBookingDate(d.date);
                        if (formErrors.date) setFormErrors((prev) => ({ ...prev, date: undefined }));
                      }}
                    >
                      {d.label}
                    </button>
                  ))}

                  {/* Native Date Picker */}
                  <input
                    type="date"
                    className="zorevi-input"
                    value={bookingDate}
                    onChange={(e) => {
                      setBookingDate(e.target.value);
                      if (formErrors.date) setFormErrors((prev) => ({ ...prev, date: undefined }));
                    }}
                    style={{ maxWidth: '170px', padding: '6px 10px', fontSize: '0.85rem' }}
                    title="Choose specific date"
                  />
                </div>
                {formErrors.date && <span className="zorevi-field-error">{formErrors.date}</span>}
              </div>

              {/* Times Section - Extensive Slots Added */}
              <div className="zorevi-form-group" style={{ marginTop: '16px' }}>
                <label className="zorevi-form-label">
                  <Clock size={14} style={{ display: 'inline', marginRight: '6px' }} />
                  Select Preferred Time Slot
                </label>

                <div className="zorevi-time-periods">
                {/* Morning Slots */}
                <div className="zorevi-time-section">
                  <div className="zorevi-time-heading">
                    <Sun size={13} color="#D97706" /> <span>Morning Slots (09:00 AM – 12:00 PM)</span>
                  </div>
                  <select
                    className="zorevi-input"
                    aria-label="Select morning time"
                    value={!isCustomTime && TIME_SLOTS.morning.includes(bookingTime) ? bookingTime : ''}
                    onChange={(e) => {
                      setBookingTime(e.target.value);
                      setIsCustomTime(false);
                      if (formErrors.time) setFormErrors((prev) => ({ ...prev, time: undefined }));
                    }}
                    style={{ width: '100%', padding: '8px 12px', fontSize: '0.85rem' }}
                  >
                    <option value="">Select a morning time</option>
                    {TIME_SLOTS.morning.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                  </select>
                </div>

                {/* Afternoon Slots */}
                <div className="zorevi-time-section">
                  <div className="zorevi-time-heading">
                    <Sunset size={13} color="#EA580C" /> <span>Afternoon Slots (12:00 PM – 05:00 PM)</span>
                  </div>
                  <select
                    className="zorevi-input"
                    aria-label="Select afternoon time"
                    value={!isCustomTime && TIME_SLOTS.afternoon.includes(bookingTime) ? bookingTime : ''}
                    onChange={(e) => {
                      setBookingTime(e.target.value);
                      setIsCustomTime(false);
                      if (formErrors.time) setFormErrors((prev) => ({ ...prev, time: undefined }));
                    }}
                    style={{ width: '100%', padding: '8px 12px', fontSize: '0.85rem' }}
                  >
                    <option value="">Select an afternoon time</option>
                    {TIME_SLOTS.afternoon.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                  </select>
                </div>

                {/* Evening Slots */}
                <div className="zorevi-time-section">
                  <div className="zorevi-time-heading">
                    <Moon size={13} color="#7C3AED" /> <span>Evening Slots (05:00 PM – 09:00 PM)</span>
                  </div>
                  <select
                    className="zorevi-input"
                    aria-label="Select evening time"
                    value={!isCustomTime && TIME_SLOTS.evening.includes(bookingTime) ? bookingTime : ''}
                    onChange={(e) => {
                      setBookingTime(e.target.value);
                      setIsCustomTime(false);
                      if (formErrors.time) setFormErrors((prev) => ({ ...prev, time: undefined }));
                    }}
                    style={{ width: '100%', padding: '8px 12px', fontSize: '0.85rem' }}
                  >
                    <option value="">Select an evening time</option>
                    {TIME_SLOTS.evening.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                  </select>
                </div>
                </div>

                {/* Custom Time Slot Option */}
                <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    className={`zorevi-time-chip ${isCustomTime ? 'is-active' : ''}`}
                    onClick={() => {
                      setIsCustomTime(true);
                      if (formErrors.time) setFormErrors((prev) => ({ ...prev, time: undefined }));
                    }}
                  >
                    Custom Time
                  </button>
                  {isCustomTime && (
                    <input
                      type="text"
                      className="zorevi-input"
                      placeholder="e.g. 11:15 AM or 04:15 PM"
                      value={customTimeInput}
                      onChange={(e) => {
                        setCustomTimeInput(e.target.value);
                        if (formErrors.time) setFormErrors((prev) => ({ ...prev, time: undefined }));
                      }}
                      style={{ maxWidth: '200px', padding: '6px 12px', fontSize: '0.85rem' }}
                      autoFocus
                    />
                  )}
                </div>
                {formErrors.time && <span className="zorevi-field-error">{formErrors.time}</span>}
              </div>

              {/* Special Instructions / Notes */}
              <div className="zorevi-form-group" style={{ marginTop: '16px' }}>
                <label className="zorevi-form-label">Specific Styling Notes or Instructions (Optional)</label>
                <textarea
                  className="zorevi-textarea"
                  rows={2}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Tell the designer any specific preferences, color choices, partner matching ideas, or sizing details..."
                />
              </div>
            </div>

            {/* LIVE SUMMARY & ADVANCE FEE DISCLOSURE */}
            <div className="zorevi-form-fee-summary-card">
              <div className="zorevi-fee-summary-details">
                <div>
                  <strong>Session Summary:</strong>
                  <span style={{ display: 'block', fontSize: '0.84rem', color: '#4B5563', marginTop: '2px' }}>
                    {selectedOccasion.label} • {fashionCategory}'s Styling • {selectedServices.length} Service(s)
                  </span>
                  <span style={{ display: 'block', fontSize: '0.82rem', color: '#6B7280', marginTop: '2px' }}>
                    📅 {bookingDate} at {isCustomTime && customTimeInput ? customTimeInput : bookingTime} • {meetingType === 'Mall Styling Session' ? selectedMall.name : meetingType}
                  </span>
                </div>

                <div className="zorevi-fee-summary-amount">
                  <span>Total Designer Fee</span>
                  <strong>₹{calculatedServiceFee}</strong>
                </div>
              </div>

              <div className="zorevi-fee-summary-advance-notice">
                <ShieldCheck size={18} color="#059669" style={{ flexShrink: 0 }} />
                <span>
                  <strong>No advance payment required right now.</strong> Once {designer.name} reviews and confirms
                  your schedule, you will be invited to pay a <strong>30% advance (₹{advanceAmount30})</strong> to confirm.
                </span>
              </div>
            </div>

            {submitError && (
              <div className="zorevi-form-error-banner" role="alert">
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
                <span>{submitError}</span>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <div className="zorevi-step-actions" style={{ marginTop: '12px' }}>
              <button
                type="button"
                className="zorevi-btn zorevi-btn--ghost"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="zorevi-btn zorevi-btn--primary"
                style={{ padding: '12px 28px', fontSize: '0.95rem' }}
                disabled={isSubmitting}
              >
                <span>{isSubmitting ? 'Submitting Request...' : `Submit Booking Request (₹${calculatedServiceFee})`}</span>
                <Check size={17} strokeWidth={3} />
              </button>
            </div>
          </form>
        )}

        {/* =========================================================
            MODE 2: 30% ADVANCE PAYMENT (ONCE CONFIRMED)
            ========================================================= */}
        {viewMode === 'payment' && !paymentDone && (
          <div className="zorevi-step-pane zorevi-advance-payment-pane">
            <div className="zorevi-step-header">
              <div className="confirmed-header-badge">
                <CheckCircle2 size={16} color="#059669" />
                <span>Designer Confirmed Your Slot</span>
              </div>
              <h3 className="zorevi-step-title">30% Advance Payment</h3>
              <p className="zorevi-step-desc">
                {activeBooking?.designerName || designer.name} has confirmed your appointment.
                Pay the 30% advance now to lock in your styling session.
              </p>
            </div>

            {/* Split breakdown card */}
            <div className="zorevi-payment-breakdown-card">
              <div className="breakdown-header">
                <div>
                  <strong>Booking #{activeBooking?.id || 'ZV-8403'}</strong>
                  <span>{activeBooking?.occasion || selectedOccasion.label} Styling</span>
                </div>
                <span className="breakdown-date">{activeBooking?.date || bookingDate} • {activeBooking?.time || bookingTime}</span>
              </div>

              <div className="breakdown-calculation">
                <div className="calc-row">
                  <span>Designer Consultation Fee:</span>
                  <strong>₹{activeFee}</strong>
                </div>

                <div className="calc-row highlight">
                  <div>
                    <strong>30% Advance Due Now:</strong>
                    <small>Required to reserve the designer's schedule</small>
                  </div>
                  <strong className="advance-bold">₹{activeAdvance}</strong>
                </div>

                <div className="calc-row muted">
                  <div>
                    <span>Remaining 70% Balance:</span>
                    <small>Payable directly on the day of styling session</small>
                  </div>
                  <span>₹{activeRemaining}</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="zorevi-form-group" style={{ marginTop: '20px' }}>
              <label className="zorevi-form-label">Select Payment Gateway / Method</label>
              <div className="zorevi-pay-methods-grid">
                {[
                  { id: 'UPI', label: 'UPI (GPay / PhonePe / Paytm)', icon: '⚡' },
                  { id: 'Card', label: 'Credit / Debit Card', icon: '💳' },
                  { id: 'NetBanking', label: 'Net Banking', icon: '🏛️' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className={`zorevi-pay-method-btn ${paymentMethod === m.id ? 'active' : ''}`}
                    onClick={() => setPaymentMethod(m.id)}
                  >
                    <span className="pay-icon">{m.icon}</span>
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="zorevi-secure-badge">
              <ShieldCheck size={16} color="#059669" />
              <span>256-bit Encrypted Payment • 100% Refundable if cancelled 24 hrs prior</span>
            </div>

            <div className="zorevi-step-actions">
              <button type="button" className="zorevi-btn zorevi-btn--ghost" onClick={handleClose}>
                Pay Later
              </button>
              <button
                type="button"
                className="zorevi-btn zorevi-btn--primary zorevi-btn--pay"
                disabled={isProcessingPayment}
                onClick={handlePayAdvance}
              >
                {isProcessingPayment ? (
                  <span>Verifying Transaction...</span>
                ) : (
                  <>
                    <span>Pay ₹{activeAdvance} Advance & Confirm</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* PAYMENT SUCCESS RECEIPT */}
        {viewMode === 'payment' && paymentDone && (
          <div className="zorevi-step-pane zorevi-step-status-pane">
            <div className="zorevi-status-icon-wrap confirmed">
              <CheckCircle2 size={44} color="#059669" />
            </div>

            <h3 className="zorevi-status-title">Appointment Confirmed!</h3>
            <span className="zorevi-status-badge confirmed">Status: Confirmed • Advance Paid</span>

            <p className="zorevi-status-lead">
              Your 30% advance of <strong>₹{activeAdvance}</strong> has been received.
              Your styling session with <strong>{activeBooking?.designerName || designer.name}</strong> is fully locked in!
            </p>

            <div className="zorevi-status-info-card">
              <div className="status-row">
                <span>Booking ID:</span>
                <strong>#{activeBooking?.id || 'ZV-8403'}</strong>
              </div>
              <div className="status-row">
                <span>Date & Time:</span>
                <span>{activeBooking?.date || bookingDate} at {activeBooking?.time || bookingTime}</span>
              </div>
              <div className="status-row">
                <span>Advance Paid:</span>
                <strong style={{ color: '#059669' }}>₹{activeAdvance}</strong>
              </div>
              <div className="status-row">
                <span>Remaining 70% at Session:</span>
                <span>₹{activeRemaining}</span>
              </div>
            </div>

            <div className="zorevi-step-actions centered">
              <button
                type="button"
                className="zorevi-btn zorevi-btn--primary"
                onClick={() => {
                  handleClose();
                  navigate('/customer/bookings');
                }}
              >
                <span>View in My Bookings</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
