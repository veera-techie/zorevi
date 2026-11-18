import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check, ArrowRight, ArrowLeft, Calendar, Clock, MapPin, Users,
  Sparkles, ShieldCheck, Info
} from 'lucide-react';
import Modal from '../common/Modal';
import { mockDesigners, mockServices, mockMalls } from '../../services/mockData';
import { OCCASIONS, SPECIALIZATIONS } from '../../constants';
import { useApp } from '../../context/AppContext';
import './BookingModal.css';

export default function BookingModal({ isOpen, onClose, initialDesigner = null }) {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { addToast } = useApp();

  // Booking state
  const [selectedDesigner, setSelectedDesigner] = useState(initialDesigner || mockDesigners[0]);
  const [selectedService, setSelectedService] = useState(mockServices[0]);
  const [selectedSpecialization, setSelectedSpecialization] = useState(SPECIALIZATIONS[0]);
  const [selectedOccasion, setSelectedOccasion] = useState(OCCASIONS[0]);
  const [requirements, setRequirements] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [bookingDate, setBookingDate] = useState('2025-11-25');
  const [bookingTime, setBookingTime] = useState('11:00');
  const [durationHours, setDurationHours] = useState(2);
  const [locationType, setLocationType] = useState('mall'); // 'mall' or 'online'
  const [selectedMall, setSelectedMall] = useState(mockMalls[0]);
  const [customMeetingPoint, setCustomMeetingPoint] = useState('');

  // Price calculations
  const basePrice = selectedService.basePrice || 499;
  const durationMultiplier = durationHours / 2;
  const peopleAddition = (numberOfPeople - 1) * 200;
  const subtotal = Math.round(basePrice * durationMultiplier + peopleAddition);
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const handleNext = () => {
    if (step < 7) {
      setStep(step + 1);
    } else if (step === 7) {
      // Step 8: Proceed to mock checkout
      const bookingDraft = {
        designer: selectedDesigner,
        service: selectedService,
        specialization: selectedSpecialization,
        occasion: selectedOccasion,
        requirements,
        numberOfPeople,
        date: bookingDate,
        time: bookingTime,
        duration: durationHours,
        locationType,
        mall: selectedMall,
        meetingPoint: customMeetingPoint || selectedMall.meetingPoints?.[0] || 'Main Entrance',
        subtotal,
        gst,
        total,
      };

      sessionStorage.setItem('zorevi_checkout_draft', JSON.stringify(bookingDraft));
      onClose();
      addToast('Proceeding to quote checkout...', 'info');
      navigate('/customer/checkout');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Book a Styling Session"
      maxWidth="720px"
    >
      {/* Progress Steps Header */}
      <div className="zorevi-booking-steps">
        {[1, 2, 3, 4, 5, 6, 7].map((s) => (
          <div
            key={s}
            className={`zorevi-booking-step-dot ${step === s ? 'active' : ''} ${step > s ? 'completed' : ''}`}
          >
            <span className="dot-num">{step > s ? <Check size={12} /> : s}</span>
          </div>
        ))}
      </div>

      <div className="zorevi-booking-content">
        {/* Step 1: Select Designer */}
        {step === 1 && (
          <div className="zorevi-step-pane">
            <h4 className="zorevi-step-title">Step 1: Select a Designer</h4>
            <p className="zorevi-step-desc">Choose an expert fashion designer or stylist for your session.</p>

            <div className="zorevi-designer-select-grid">
              {mockDesigners.map((des) => (
                <div
                  key={des.id}
                  className={`zorevi-designer-select-card ${selectedDesigner.id === des.id ? 'selected' : ''}`}
                  onClick={() => setSelectedDesigner(des)}
                >
                  <img src={des.avatar} alt={des.name} className="zorevi-designer-select-img" />
                  <div className="zorevi-designer-select-info">
                    <strong>{des.name}</strong>
                    <span>{des.title}</span>
                    <small>★ {des.rating} • Starting ₹{des.startingPrice || 499}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Service & Specialization */}
        {step === 2 && (
          <div className="zorevi-step-pane">
            <h4 className="zorevi-step-title">Step 2: Select Service & Specialization</h4>
            <p className="zorevi-step-desc">Pick the styling package and the focus specialization.</p>

            <label className="zorevi-form-label">Service Package</label>
            <div className="zorevi-service-select-grid">
              {mockServices.map((svc) => (
                <div
                  key={svc.id}
                  className={`zorevi-service-card ${selectedService.id === svc.id ? 'selected' : ''}`}
                  onClick={() => setSelectedService(svc)}
                >
                  <div className="zorevi-service-card__header">
                    <strong>{svc.name}</strong>
                    <span className="zorevi-service-card__price">₹{svc.basePrice}</span>
                  </div>
                  <p>{svc.description}</p>
                  <small>Typical duration: {svc.duration}</small>
                </div>
              ))}
            </div>

            <label className="zorevi-form-label" style={{ marginTop: '16px' }}>
              Specialization
            </label>
            <div className="zorevi-chip-group">
              {SPECIALIZATIONS.map((spec) => (
                <button
                  type="button"
                  key={spec}
                  className={`zorevi-chip ${selectedSpecialization === spec ? 'active' : ''}`}
                  onClick={() => setSelectedSpecialization(spec)}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Select Occasion */}
        {step === 3 && (
          <div className="zorevi-step-pane">
            <h4 className="zorevi-step-title">Step 3: Select an Occasion</h4>
            <p className="zorevi-step-desc">What event or purpose are you dressing for?</p>

            <div className="zorevi-chip-group zorevi-chip-group--lg">
              {OCCASIONS.map((occ) => (
                <button
                  type="button"
                  key={occ}
                  className={`zorevi-chip zorevi-chip--lg ${selectedOccasion === occ ? 'active' : ''}`}
                  onClick={() => setSelectedOccasion(occ)}
                >
                  <Sparkles size={14} /> {occ}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Requirements & Number of People */}
        {step === 4 && (
          <div className="zorevi-step-pane">
            <h4 className="zorevi-step-title">Step 4: Requirements & People</h4>
            <p className="zorevi-step-desc">Tell the designer about your styling needs and how many people will be styled.</p>

            <div className="zorevi-form-group">
              <label className="zorevi-form-label">Number of People to be Styled</label>
              <div className="zorevi-counter">
                <button
                  type="button"
                  className="zorevi-counter-btn"
                  onClick={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}
                >
                  -
                </button>
                <span className="zorevi-counter-val">
                  <Users size={16} /> {numberOfPeople} {numberOfPeople === 1 ? 'Person' : 'People'}
                </span>
                <button
                  type="button"
                  className="zorevi-counter-btn"
                  onClick={() => setNumberOfPeople(numberOfPeople + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="zorevi-form-group" style={{ marginTop: '16px' }}>
              <label className="zorevi-form-label">Styling Requirements or Preferences (Optional)</label>
              <textarea
                className="zorevi-textarea"
                rows="4"
                placeholder="e.g. Prefer pastel shades, need help picking accessories, destination wedding theme..."
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 5: Date, Time & Duration */}
        {step === 5 && (
          <div className="zorevi-step-pane">
            <h4 className="zorevi-step-title">Step 5: Select Date, Time & Duration</h4>
            <p className="zorevi-step-desc">Pick your preferred slot for the styling session.</p>

            <div className="zorevi-form-grid-2">
              <div className="zorevi-form-group">
                <label className="zorevi-form-label">Session Date</label>
                <div className="zorevi-input-icon-wrap">
                  <Calendar size={16} />
                  <input
                    type="date"
                    className="zorevi-input"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="zorevi-form-group">
                <label className="zorevi-form-label">Start Time</label>
                <div className="zorevi-input-icon-wrap">
                  <Clock size={16} />
                  <select
                    className="zorevi-input"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                  >
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="18:00">06:00 PM</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="zorevi-form-group" style={{ marginTop: '16px' }}>
              <label className="zorevi-form-label">Session Duration</label>
              <div className="zorevi-duration-grid">
                {[1, 2, 3, 4, 5].map((hrs) => (
                  <button
                    type="button"
                    key={hrs}
                    className={`zorevi-duration-btn ${durationHours === hrs ? 'active' : ''}`}
                    onClick={() => setDurationHours(hrs)}
                  >
                    {hrs} {hrs === 1 ? 'Hour' : 'Hours'}
                    {hrs === 2 && <span className="zorevi-pop-badge">Standard</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Location or Online */}
        {step === 6 && (
          <div className="zorevi-step-pane">
            <h4 className="zorevi-step-title">Step 6: Confirm Service Location</h4>
            <p className="zorevi-step-desc">Meet at a shopping mall or conduct an online video session.</p>

            <div className="zorevi-location-type-row">
              <button
                type="button"
                className={`zorevi-location-tab ${locationType === 'mall' ? 'active' : ''}`}
                onClick={() => setLocationType('mall')}
              >
                <MapPin size={16} /> In-Person at Mall
              </button>
              <button
                type="button"
                className={`zorevi-location-tab ${locationType === 'online' ? 'active' : ''}`}
                onClick={() => setLocationType('online')}
              >
                <Clock size={16} /> Online Video Consultation
              </button>
            </div>

            {locationType === 'mall' ? (
              <div style={{ marginTop: '16px' }}>
                <label className="zorevi-form-label">Select Shopping Mall</label>
                <div className="zorevi-mall-select-list">
                  {mockMalls.map((mall) => (
                    <div
                      key={mall.id}
                      className={`zorevi-mall-select-item ${selectedMall.id === mall.id ? 'selected' : ''}`}
                      onClick={() => setSelectedMall(mall)}
                    >
                      <MapPin size={16} color="#7C3AED" />
                      <div>
                        <strong>{mall.name}</strong>
                        <small>{mall.address}</small>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="zorevi-form-group" style={{ marginTop: '14px' }}>
                  <label className="zorevi-form-label">Meeting Point inside Mall</label>
                  <input
                    type="text"
                    className="zorevi-input"
                    placeholder="e.g. Ground Floor, Main Atrium (near Central Fountain)"
                    value={customMeetingPoint}
                    onChange={(e) => setCustomMeetingPoint(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="zorevi-online-box" style={{ marginTop: '16px' }}>
                <Sparkles size={20} color="#7C3AED" />
                <div>
                  <strong>Live Video Styling Session</strong>
                  <p>You will receive a secure video session link right inside the booking chat upon confirmation.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 7: Review Itemized Quote & Terms */}
        {step === 7 && (
          <div className="zorevi-step-pane">
            <h4 className="zorevi-step-title">Step 7: Review Itemized Quote</h4>
            <p className="zorevi-step-desc">Transparent pricing with zero hidden charges.</p>

            <div className="zorevi-quote-card">
              <div className="zorevi-quote-row">
                <span>{selectedService.name} (Base {selectedService.duration})</span>
                <span>₹{basePrice}</span>
              </div>
              {durationHours > 2 && (
                <div className="zorevi-quote-row">
                  <span>Additional Duration ({durationHours - 2} extra hrs)</span>
                  <span>₹{Math.round(basePrice * (durationHours - 2) / 2)}</span>
                </div>
              )}
              {numberOfPeople > 1 && (
                <div className="zorevi-quote-row">
                  <span>Additional People ({numberOfPeople - 1} × ₹200)</span>
                  <span>₹{peopleAddition}</span>
                </div>
              )}
              <div className="zorevi-quote-row">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="zorevi-quote-row">
                <span>Taxes & Platform GST (18%)</span>
                <span>₹{gst}</span>
              </div>
              <div className="zorevi-quote-row zorevi-quote-row--total">
                <strong>Total Payable</strong>
                <strong>₹{total}</strong>
              </div>
            </div>

            <div className="zorevi-cancellation-terms">
              <div className="zorevi-cancellation-terms__title">
                <ShieldCheck size={16} color="#10B981" />
                <strong>Flexible Cancellation Terms</strong>
              </div>
              <p>Free cancellation up to 24 hours before the session. 100% refund processed within 2–3 business days.</p>
            </div>

            <div className="zorevi-pricing-note">
              <Info size={14} />
              <span>
                Standard package starts at <strong>₹499 / 2 hours</strong>. Custom pricing varies based on designer skills, experience, travel, and requirements.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="zorevi-booking-footer">
        {step > 1 ? (
          <button type="button" className="zorevi-btn zorevi-btn--outline" onClick={handleBack}>
            <ArrowLeft size={16} /> Back
          </button>
        ) : <div></div>}

        <button type="button" className="zorevi-btn zorevi-btn--primary" onClick={handleNext}>
          {step === 7 ? 'Proceed to Checkout' : 'Next Step'} <ArrowRight size={16} />
        </button>
      </div>
    </Modal>
  );
}

