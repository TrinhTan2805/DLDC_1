import React from 'react';

interface StatusTagProps {
  label: string;
  variant?: 'blue' | 'purple' | 'indigo' | 'emerald' | 'amber' | 'green' | 'slate' | 'gray' | 'orange' | 'red';
  className?: string;
  icon?: React.ReactNode;
}

export function StatusTag({ label, variant = 'blue', className = '', icon }: StatusTagProps) {
  const variants = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    green: 'bg-green-50 text-green-700 border-green-100',
    slate: 'bg-slate-50 text-slate-600 border-slate-200',
    gray: 'bg-gray-50 text-gray-500 border-gray-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-100',
    red: 'bg-red-50 text-red-700 border-red-100',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-[14px] font-normal uppercase tracking-wider text-center whitespace-nowrap ${variants[variant]} ${className}`}>
      {icon}
      {label}
    </span>
  );
}
