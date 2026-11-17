import React from 'react';

const PaymentBadge = ({ status }) => {
  const isSettled = status?.toLowerCase().includes('settled') || status?.toLowerCase().includes('completed');
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
        isSettled ? 'bg-[#ECFDF5] text-[#059669]' : 'bg-[#FEF3C7] text-[#D97706]'
      }`}
    >
      {status || 'Escrow Secured'}
    </span>
  );
};

export default PaymentBadge;
