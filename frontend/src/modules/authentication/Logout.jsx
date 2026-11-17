import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/designer/dashboard');
    }, 1500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F6F3FB] flex items-center justify-center p-4">
      <div className="zorevi-card p-8 bg-white max-w-sm w-full text-center space-y-3">
        <CheckCircle2 className="w-12 h-12 text-[#10B981] mx-auto" />
        <h2 className="text-xl font-bold text-[#1E1B2E]">Logged Out Successfully</h2>
        <p className="text-xs text-[#6B7280]">Redirecting back to dashboard demo...</p>
      </div>
    </div>
  );
};

export default Logout;
