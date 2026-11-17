import React from 'react';

const NotificationItem = ({ title, time, message, unread }) => {
  return (
    <div className={`p-3 text-xs ${unread ? 'bg-[#FAF8FE] font-medium' : ''}`}>
      <div className="flex justify-between text-[#1E1B2E]">
        <span className="font-semibold">{title}</span>
        <span className="text-[#9CA3AF] text-[10px]">{time}</span>
      </div>
      <p className="text-[#6B7280] mt-0.5">{message}</p>
    </div>
  );
};

export default NotificationItem;
