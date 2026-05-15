import React from 'react';

interface StatusTagProps {
  label: string;
  variant?: 'blue' | 'purple' | 'indigo' | 'emerald' | 'amber' | 'green' | 'slate' | 'gray' | 'orange' | 'red';
  className?: string;
  icon?: React.ReactNode;
}

export function StatusTag({ label, variant = 'blue', className = '', icon }: StatusTagProps) {
  const variants = {
    blue: 'bg-blue-50 text-blue-700',
    purple: 'bg-purple-50 text-purple-700',
    indigo: 'bg-indigo-50 text-indigo-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    green: 'bg-green-50 text-green-700',
    slate: 'bg-slate-50 text-slate-600',
    gray: 'bg-gray-50 text-gray-500',
    orange: 'bg-orange-50 text-orange-700',
    red: 'bg-red-50 text-red-700',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[16px] font-medium text-center whitespace-nowrap ${variants[variant]} ${className}`}>
      {icon}
      {label}
    </span>
  );
}
