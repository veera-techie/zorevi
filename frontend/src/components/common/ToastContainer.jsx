import { useApp } from '../../context/AppContext';
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import './Toast.css';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="zorevi-toast-container">
      {toasts.map((toast) => {
        let Icon = CheckCircle;
        if (toast.type === 'error') Icon = AlertCircle;
        if (toast.type === 'warning') Icon = AlertTriangle;
        if (toast.type === 'info') Icon = Info;

        return (
          <div key={toast.id} className={`zorevi-toast zorevi-toast--${toast.type}`}>
            <Icon size={18} className="zorevi-toast__icon" />
            <span className="zorevi-toast__message">{toast.message}</span>
            <button
              className="zorevi-toast__close"
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

