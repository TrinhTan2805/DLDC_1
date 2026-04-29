import { useState } from 'react';
import { GenericProcessingPage } from '../processing/GenericProcessingPage';
import { UserCheck } from 'lucide-react';
import { DatabaseTemplate } from '../DatabaseTemplate';

interface StatCard {
  id: string;
  title: string;
  value: string;
  change: string;
  icon: any;
  color: string;
  lastMonth: number;
  thisMonth: number;
  totalCollected?: number;
  totalProcessed?: number;
  processingRate?: number;
}

interface DatabaseRecord {
  name: string;
  category: string;
  todayCount: number;
  errorCount: number;
}

interface CaseManagementPageProps {
  mode?: 'thu thập' | 'xử lý';
  context?: 'thu thập' | 'chia sẻ';
  onBack?: () => void;
}

export function CaseManagementPage({ mode = 'thu thập', context = 'thu thập', onBack }: CaseManagementPageProps) {
  // Generate data for 3 types of nationality records
  const generateData = () => {
    const data = [
      { id: '1', title: `Dữ liệu Nhập Quốc tịch`, icon: UserCheck, color: 'blue', lastMonth: 2098, thisMonth: 3424, change: 63.2 },
      { id: '2', title: `Dữ liệu Thôi Quốc tịch`, icon: UserCheck, color: 'green', lastMonth: 189234, thisMonth: 224990, change: 4.05 },
      { id: '3', title: `Dữ liệu Trở lại Quốc tịch`, icon: UserCheck, color: 'purple', lastMonth: 155923, thisMonth: 184878, change: 14.3 },
    ];

    return data.map(item => {
      const total = item.lastMonth + item.thisMonth;
      const changeStr = item.change >= 0 ? `+${item.change.toFixed(1)}` : item.change.toFixed(1);
      
      return {
        id: item.id,
        title: item.title,
        value: total.toLocaleString(),
        change: `${changeStr}%`,
        icon: item.icon,
        color: item.color,
        lastMonth: item.lastMonth,
        thisMonth: item.thisMonth,
      };
    });
  };

  const stats = generateData();

  if (mode === 'xử lý') {
    return <GenericProcessingPage systemName="HT quản lý hồ sơ QT" datasets={stats.map((s, idx) => ({ id: s.id || `item_${idx}`, name: s.title }))} />;
  }

  const tableData: DatabaseRecord[] = [
    { name: 'Thu thập dữ liệu Nhập Quốc tịch', category: 'Quốc tịch', todayCount: 20000, errorCount: 30 },
    { name: 'Thu thập dữ liệu Thôi Quốc tịch', category: 'Quốc tịch', todayCount: 20000, errorCount: 30 },
    { name: 'Thu thập dữ liệu Trở lại Quốc tịch', category: 'Quốc tịch', todayCount: 20000, errorCount: 30 },
  ];

  return (
    <DatabaseTemplate
      title="Dữ liệu HT quản lý hồ sơ QT"
      categoryName="Quốc tịch"
      stats={stats}
      tableData={tableData}
      context={context}
      mode={mode}
      onBack={onBack}
    />
  );
}