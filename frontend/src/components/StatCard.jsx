import React from 'react';

const StatCard = ({ title, value, icon: Icon, colorClass, borderClass }) => {
  return (
    <div className={`p-6 rounded-2xl glass-card border shadow-premium flex items-center justify-between transition-all duration-300 hover:scale-[1.02] ${borderClass}`}>
      <div>
        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{title}</span>
        <h3 className="text-3xl font-extrabold text-brand-navy mt-1">{value}</h3>
      </div>
      <div className={`p-4 rounded-xl flex items-center justify-center ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};

export default StatCard;
