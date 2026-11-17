import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F6F3FB] flex items-center justify-center p-4">
      <div className="zorevi-card p-8 bg-white max-w-md w-full text-center space-y-5">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6B35D9] to-[#8B5CF6] flex items-center justify-center mx-auto shadow-purple-glow">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-[#1E1B2E]">Zorevi Login</h1>
          <p className="text-xs text-[#6B7280] mt-1">Fashion for Everyone</p>
        </div>
        <button
          onClick={() => navigate('/designer/dashboard')}
          className="w-full py-2.5 rounded-xl bg-[#6B35D9] text-white font-bold text-sm shadow-purple-glow"
        >
          Enter Aarohi Mehta Studio Dashboard
        </button>
      </div>
    </div>
  );
};

export default Login;
