import { useState } from 'react';
import {
  Calendar as CalendarIcon, Clock, Check, X,
  Plus, Edit2, AlertCircle, Sparkles, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import Modal from '../../../components/common/Modal';

const formatTime = (time) => {
  if (!time) return '';
  const [hour, minute] = time.split(':').map(Number);
  return new Date(2000, 0, 1, hour, minute).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

const formatHours = (item) => `${formatTime(item.start)} to ${formatTime(item.end)}${item.hasBreak ? ` | Break ${formatTime(item.breakStart)} to ${formatTime(item.breakEnd)}` : ''}`;

const defaultWeeklySchedule = [
  { day: 'Mon, Nov 17', start: '10:00', end: '17:00', hasBreak: true, breakStart: '13:00', breakEnd: '14:00', status: 'available' },
  { day: 'Tue, Nov 18', start: '10:00', end: '17:00', hasBreak: true, breakStart: '13:00', breakEnd: '14:00', status: 'booked' },
  { day: 'Wed, Nov 19', start: '14:30', end: '18:00', hasBreak: false, breakStart: '13:00', breakEnd: '14:00', status: 'available' },
  { day: 'Thu, Nov 20', start: '11:00', end: '16:00', hasBreak: true, breakStart: '13:00', breakEnd: '14:00', status: 'available' },
  { day: 'Fri, Nov 21', start: '09:00', end: '18:00', hasBreak: true, breakStart: '13:00', breakEnd: '14:00', status: 'available' },
  { day: 'Sat, Nov 22', start: '10:00', end: '16:00', hasBreak: true, breakStart: '13:00', breakEnd: '14:00', status: 'booked' },
  { day: 'Sun, Nov 23', start: '10:00', end: '16:00', hasBreak: false, breakStart: '13:00', breakEnd: '14:00', status: 'blocked' },
];

const loadWeeklySchedule = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('zorevi-designer-weekly-schedule') || 'null');
    return Array.isArray(saved) && saved.length === 7 ? saved : defaultWeeklySchedule;
  } catch {
    return defaultWeeklySchedule;
  }
};

export default function DesignerAvailability() {
  const { addToast } = useApp();
  const [vacationMode, setVacationMode] = useState(() => {
    try { return localStorage.getItem('zorevi-designer-vacation-mode') === 'true'; }
    catch { return false; }
  });
  const [selectedDay, setSelectedDay] = useState('18');

  const [weeklySchedule, setWeeklySchedule] = useState(loadWeeklySchedule);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [draftSchedule, setDraftSchedule] = useState([]);

  const openScheduleEditor = () => {
    setDraftSchedule(weeklySchedule.map((item) => ({ ...item })));
    setIsScheduleModalOpen(true);
  };

  const saveSchedule = (e) => {
    e.preventDefault();
    const invalid = draftSchedule.find((item) => (
      item.start >= item.end || (item.hasBreak && (
        item.breakStart >= item.breakEnd || item.breakStart < item.start || item.breakEnd > item.end
      ))
    ));
    if (invalid) {
      addToast(`Check the working hours and break times for ${invalid.day.split(',')[0]}.`, 'error');
      return;
    }
    setWeeklySchedule(draftSchedule);
    try {
      localStorage.setItem('zorevi-designer-weekly-schedule', JSON.stringify(draftSchedule));
    } catch {
      addToast('Schedule updated for this session, but the browser could not store it.', 'info');
    }
    setIsScheduleModalOpen(false);
    addToast('Working hours and breaks updated.', 'success');
  };

  const handleToggleVacation = () => {
    setVacationMode(!vacationMode);
    try { localStorage.setItem('zorevi-designer-vacation-mode', String(!vacationMode)); }
    catch { addToast('Vacation mode changed for this session, but the browser could not store it.', 'info'); }
    addToast(
      !vacationMode ? 'Vacation mode activated. Your calendar is paused.' : 'Vacation mode turned off. Back online!',
      'info'
    );
  };

  return (
    <div style={{ width: '100%', paddingBottom: '60px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#1E1B4B', margin: '0 0 4px 0' }}>
            Availability Calendar & Schedule
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: 0 }}>
            Configure your working hours, recurring slots, blocked dates, and vacation mode.
          </p>
        </div>

        {/* Vacation Mode Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#FFFFFF', padding: '8px 16px', borderRadius: '14px', border: '1px solid #E5E7EB' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: vacationMode ? '#EF4444' : '#4B5563' }}>
            Vacation Mode
          </span>
          <input
            type="checkbox"
            checked={vacationMode}
            onChange={handleToggleVacation}
            style={{ width: '20px', height: '20px', accentColor: '#7C3AED', cursor: 'pointer' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px' }}>
        {/* Calendar Widget matching screenshot */}
        <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #F3F4F6', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1E1B4B', margin: 0 }}>November 2025</h3>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button className="zorevi-btn zorevi-btn--ghost zorevi-btn--sm" style={{ padding: '4px 8px' }}><ChevronLeft size={16} /></button>
              <button className="zorevi-btn zorevi-btn--ghost zorevi-btn--sm" style={{ padding: '4px 8px' }}><ChevronRight size={16} /></button>
            </div>
          </div>

          {/* Days grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center', fontSize: '0.75rem', fontWeight: '600', color: '#9CA3AF', marginBottom: '8px' }}>
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center' }}>
            {['26', '27', '28', '29', '30', '31', '1',
              '2', '3', '4', '5', '6', '7', '8',
              '9', '10', '11', '12', '13', '14', '15',
              '16', '17', '18', '19', '20', '21', '22',
              '23', '24', '25', '26', '27', '28', '29',
              '30', '1', '2', '3', '4', '5', '6'].slice(0, 35).map((d, i) => {
              const isBooked = ['18', '22', '24'].includes(d);
              const isSelected = selectedDay === d;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedDay(d)}
                  style={{
                    padding: '10px 4px',
                    borderRadius: '10px',
                    border: isSelected ? '2px solid #7C3AED' : '1px solid transparent',
                    background: isBooked ? '#F5F0FF' : '#F9FAFB',
                    color: isBooked ? '#7C3AED' : '#1E1B4B',
                    fontWeight: isBooked || isSelected ? '700' : '500',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                >
                  {d}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '14px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #F3F4F6', fontSize: '0.75rem', color: '#6B7280' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#7C3AED' }}></span> Booked
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></span> Available
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }}></span> Blocked
            </span>
          </div>
        </div>

        {/* Weekly Working Slots Schedule */}
        <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #F3F4F6', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1E1B4B', marginBottom: '16px' }}>
            Weekly Schedule & Working Hours
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {weeklySchedule.map((s, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: '#F9FAFB',
                  border: '1px solid #F3F4F6',
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.85rem', color: '#1E1B4B', display: 'block' }}>{s.day}</strong>
                  <small style={{ color: '#6B7280', fontSize: '0.78rem' }}>{formatHours(s)}</small>
                </div>

                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    background: s.status === 'available' ? '#ECFDF5' : s.status === 'booked' ? '#FAF5FF' : '#FEF2F2',
                    color: s.status === 'available' ? '#059669' : s.status === 'booked' ? '#7C3AED' : '#EF4444',
                  }}
                >
                  {s.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>

          <button
            className="zorevi-btn zorevi-btn--outline zorevi-btn--full"
            style={{ marginTop: '20px' }}
            onClick={openScheduleEditor}
          >
            <Edit2 size={14} /> Edit Working Hours & Breaks
          </button>
        </div>
      </div>

      {isScheduleModalOpen && (
        <Modal isOpen={isScheduleModalOpen} onClose={() => setIsScheduleModalOpen(false)} title="Edit Working Hours & Breaks" maxWidth="720px">
          <form onSubmit={saveSchedule}>
            <p style={{ color: '#6B7280', fontSize: '0.85rem', margin: '0 0 16px' }}>Set your regular hours and break times for each day.</p>
            <div style={{ display: 'grid', gap: '9px' }}>
              {draftSchedule.map((item, index) => (
                <div key={item.day} style={{ display: 'grid', gridTemplateColumns: 'minmax(90px, 1fr) 1fr 1fr auto', gap: '9px', alignItems: 'center', padding: '10px', border: '1px solid #EEE9F5', borderRadius: '12px', background: '#FCFBFE' }}>
                  <strong style={{ fontSize: '0.8rem', color: '#30283C' }}>{item.day.split(',')[0]}</strong>
                  <label style={{ fontSize: '0.68rem', color: '#817A89' }}>Start<input aria-label={`${item.day} start time`} type="time" value={item.start} onChange={(e) => setDraftSchedule((list) => list.map((row, i) => i === index ? { ...row, start: e.target.value } : row))} style={{ display: 'block', width: '100%', marginTop: '4px', border: '1px solid #EAE4F5', borderRadius: '7px', padding: '6px', color: '#30283C', background: '#fff' }} required /></label>
                  <label style={{ fontSize: '0.68rem', color: '#817A89' }}>End<input aria-label={`${item.day} end time`} type="time" value={item.end} onChange={(e) => setDraftSchedule((list) => list.map((row, i) => i === index ? { ...row, end: e.target.value } : row))} style={{ display: 'block', width: '100%', marginTop: '4px', border: '1px solid #EAE4F5', borderRadius: '7px', padding: '6px', color: '#30283C', background: '#fff' }} required /></label>
                  <label style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '0.72rem', color: '#5F5968', whiteSpace: 'nowrap' }}><input type="checkbox" checked={item.hasBreak} onChange={(e) => setDraftSchedule((list) => list.map((row, i) => i === index ? { ...row, hasBreak: e.target.checked } : row))} /> Break</label>
                  {item.hasBreak && <div style={{ gridColumn: '2 / -1', display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '2px' }}><label style={{ fontSize: '0.68rem', color: '#817A89' }}>Break starts<input aria-label={`${item.day} break start`} type="time" value={item.breakStart} onChange={(e) => setDraftSchedule((list) => list.map((row, i) => i === index ? { ...row, breakStart: e.target.value } : row))} style={{ display: 'block', marginTop: '4px', border: '1px solid #EAE4F5', borderRadius: '7px', padding: '6px', color: '#30283C', background: '#fff' }} required /></label><label style={{ fontSize: '0.68rem', color: '#817A89' }}>Break ends<input aria-label={`${item.day} break end`} type="time" value={item.breakEnd} onChange={(e) => setDraftSchedule((list) => list.map((row, i) => i === index ? { ...row, breakEnd: e.target.value } : row))} style={{ display: 'block', marginTop: '4px', border: '1px solid #EAE4F5', borderRadius: '7px', padding: '6px', color: '#30283C', background: '#fff' }} required /></label></div>}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '9px', marginTop: '18px' }}>
              <button type="button" className="zorevi-btn zorevi-btn--outline" onClick={() => setIsScheduleModalOpen(false)}>Cancel</button>
              <button type="submit" className="zorevi-btn zorevi-btn--primary">Save Schedule</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

