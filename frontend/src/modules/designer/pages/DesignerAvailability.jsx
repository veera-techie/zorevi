import { useEffect, useRef, useState } from 'react';
import {
  Calendar as CalendarIcon, Clock, Check, X,
  Plus, Edit2, AlertCircle, Sparkles, ChevronDown, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import Modal from '../../../components/common/Modal';

const formatTime = (time) => {
  if (!time) return '';
  const [hour, minute] = time.split(':').map(Number);
  return new Date(2000, 0, 1, hour, minute).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

const formatHours = (item) => `${formatTime(item.start)} to ${formatTime(item.end)}${item.hasBreak ? ` | Break ${formatTime(item.breakStart)} to ${formatTime(item.breakEnd)}` : ''}`;
const MONTH_NAMES = Array.from({ length: 12 }, (_, month) => new Date(2000, month, 1).toLocaleString('en-US', { month: 'long' }));
const BOOKED_DATES = new Set(['2025-11-18', '2025-11-22', '2025-11-24']);

const makeCalendarCells = (year, month) => {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cellCount = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
  return Array.from({ length: cellCount }, (_, index) => {
    const day = index - firstWeekday + 1;
    return day >= 1 && day <= daysInMonth ? new Date(year, month, day) : null;
  });
};

const dateKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

function SearchableDropdown({ label, value, options, onSelect, width, numeric = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const listId = `availability-${label.toLowerCase()}-options`;
  const filteredOptions = options.filter((option) => String(option).toLowerCase().startsWith(query.toLowerCase()));

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setIsOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [isOpen, value, filteredOptions.length]);

  const openDropdown = () => {
    setQuery('');
    setIsOpen(true);
  };

  const closeDropdown = () => {
    setQuery('');
    setIsOpen(false);
  };

  const chooseOption = (option) => {
    onSelect(option);
    closeDropdown();
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width, flex: '0 0 auto' }}>
      <input
        ref={inputRef}
        aria-label={`Calendar ${label.toLowerCase()}`}
        aria-controls={listId}
        aria-expanded={isOpen}
        aria-autocomplete="list"
        role="combobox"
        type="text"
        inputMode={numeric ? 'numeric' : 'text'}
        value={isOpen ? query : value}
        onFocus={openDropdown}
        onChange={(event) => {
          setIsOpen(true);
          setQuery(numeric ? event.target.value.replace(/\D/g, '').slice(0, 4) : event.target.value);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') closeDropdown();
          if (event.key === 'Enter' && filteredOptions.length) {
            event.preventDefault();
            chooseOption(filteredOptions[0]);
          }
        }}
        style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #E5E7EB', borderRadius: '9px', padding: '8px 30px 8px 10px', color: '#1E1B4B', fontSize: '0.95rem', fontWeight: 700, background: '#fff' }}
      />
      <button
        type="button"
        aria-label={`Show ${label.toLowerCase()} options`}
        aria-expanded={isOpen}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => {
          if (isOpen) closeDropdown();
          else {
            openDropdown();
            inputRef.current?.focus();
          }
        }}
        style={{ position: 'absolute', top: '50%', right: '7px', transform: 'translateY(-50%)', display: 'grid', placeItems: 'center', border: 0, padding: '3px', background: 'transparent', color: '#6B7280', cursor: 'pointer' }}
      >
        <ChevronDown size={15} />
      </button>
      {isOpen && (
        <div ref={listRef} id={listId} role="listbox" aria-label={`${label} options`} style={{ position: 'absolute', zIndex: 30, top: 'calc(100% + 5px)', left: 0, width: '100%', maxHeight: '220px', overflowY: 'auto', padding: '4px', border: '1px solid #E5E7EB', borderRadius: '10px', background: '#fff', boxShadow: '0 8px 24px rgba(31, 24, 45, 0.14)' }}>
          {filteredOptions.length ? filteredOptions.map((option) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={String(option) === String(value)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => chooseOption(option)}
              style={{ display: 'block', width: '100%', border: 0, borderRadius: '7px', padding: '8px 9px', background: String(option) === String(value) ? '#F5F0FF' : '#fff', color: '#30283C', textAlign: 'left', fontSize: '0.84rem', cursor: 'pointer' }}
            >
              {option}
            </button>
          )) : <div style={{ padding: '8px 9px', color: '#817A89', fontSize: '0.8rem' }}>No matches</div>}
        </div>
      )}
    </div>
  );
}

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
  const [calendarMonth, setCalendarMonth] = useState(() => new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(() => new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState(() => dateKey(new Date()));

  const [weeklySchedule, setWeeklySchedule] = useState(loadWeeklySchedule);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [draftSchedule, setDraftSchedule] = useState([]);
  const calendarCells = makeCalendarCells(calendarYear, calendarMonth);
  const yearOptions = Array.from({ length: 201 }, (_, index) => 1900 + index);
  const todayKey = dateKey(new Date());

  const changeCalendarMonth = (offset) => {
    const nextMonth = new Date(calendarYear, calendarMonth + offset, 1);
    setCalendarMonth(nextMonth.getMonth());
    setCalendarYear(nextMonth.getFullYear());
    setSelectedDay(null);
  };

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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <SearchableDropdown
                label="Month"
                value={MONTH_NAMES[calendarMonth]}
                options={MONTH_NAMES}
                width="124px"
                onSelect={(month) => {
                  setCalendarMonth(MONTH_NAMES.indexOf(month));
                  setSelectedDay(null);
                }}
              />
              <SearchableDropdown
                label="Year"
                value={String(calendarYear)}
                options={yearOptions}
                width="100px"
                numeric
                onSelect={(year) => {
                  setCalendarYear(Number(year));
                  setSelectedDay(null);
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button type="button" aria-label="Previous month" onClick={() => changeCalendarMonth(-1)} className="zorevi-btn zorevi-btn--ghost zorevi-btn--sm" style={{ padding: '4px 8px' }}><ChevronLeft size={16} /></button>
              <button type="button" aria-label="Next month" onClick={() => changeCalendarMonth(1)} className="zorevi-btn zorevi-btn--ghost zorevi-btn--sm" style={{ padding: '4px 8px' }}><ChevronRight size={16} /></button>
            </div>
          </div>

          {/* Days grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center', fontSize: '0.75rem', fontWeight: '600', color: '#9CA3AF', marginBottom: '8px' }}>
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center' }}>
            {calendarCells.map((date, index) => {
              if (!date) return <span key={`empty-${index}`} aria-hidden="true" />;
              const key = dateKey(date);
              const isBooked = BOOKED_DATES.has(key);
              const isSelected = selectedDay === key;
              const isToday = todayKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  aria-label={date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedDay(key)}
                  style={{
                    display: 'grid',
                    placeItems: 'center',
                    width: '38px',
                    height: '38px',
                    margin: 'auto',
                    padding: 0,
                    borderRadius: isToday ? '50%' : '10px',
                    border: isToday || isSelected ? '2px solid #7C3AED' : '1px solid transparent',
                    background: isToday ? '#7C3AED' : isBooked ? '#F5F0FF' : '#F9FAFB',
                    color: isToday ? '#FFFFFF' : isBooked ? '#7C3AED' : '#1E1B4B',
                    fontWeight: isBooked || isSelected || isToday ? '700' : '500',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                >
                  {date.getDate()}
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

