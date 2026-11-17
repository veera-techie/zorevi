import React from 'react';
import { DESIGNER_PROFILE } from '../../../constants';
import DesignerCard from '../../../components/cards/DesignerCard';

const Designers = () => {
  return (
    <div className="space-y-6 pb-10">
      <h1 className="text-xl sm:text-2xl font-extrabold text-[#1E1B2E]">Designer Management</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <DesignerCard designer={DESIGNER_PROFILE} />
      </div>
    </div>
  );
};

export default Designers;
