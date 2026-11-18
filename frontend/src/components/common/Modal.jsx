<<<<<<< HEAD
import { useEffect, useId, useRef } from 'react';
=======
import { useEffect } from 'react';
>>>>>>> origin/sai
import { X } from 'lucide-react';
import './Modal.css';

export default function Modal({ isOpen, onClose, title, children, maxWidth = '560px' }) {
<<<<<<< HEAD
  const modalRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const modal = modalRef.current;
    const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const getFocusable = () => Array.from(modal?.querySelectorAll(focusableSelector) || [])
      .filter((element) => element.getClientRects().length > 0);

    document.body.style.overflow = 'hidden';
    (getFocusable()[0] || modal)?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab') return;
      const focusable = getFocusable();
      if (!focusable.length) {
        event.preventDefault();
        modal?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !modal?.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !modal?.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };
  }, [isOpen]);
=======
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);
>>>>>>> origin/sai

  if (!isOpen) return null;

  return (
<<<<<<< HEAD
    <div className="zorevi-modal-overlay" onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div
        ref={modalRef}
=======
    <div className="zorevi-modal-overlay" onClick={onClose}>
      <div
>>>>>>> origin/sai
        className="zorevi-modal-content"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
<<<<<<< HEAD
        aria-labelledby={titleId}
        tabIndex="-1"
      >
        <div className="zorevi-modal-header">
          <h3 className="zorevi-modal-title" id={titleId}>{title}</h3>
          <button
            type="button"
=======
      >
        <div className="zorevi-modal-header">
          <h3 className="zorevi-modal-title">{title}</h3>
          <button
>>>>>>> origin/sai
            className="zorevi-modal-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>
        <div className="zorevi-modal-body">{children}</div>
      </div>
    </div>
  );
}

