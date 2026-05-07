import { useState } from 'react';
import { Scale } from 'lucide-react';
import { GenericProcessingPage } from '../processing/GenericProcessingPage';
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
  totalCollected: number;
  totalProcessed: number;
  processingRate: number;
}

interface CourtJudgmentPageProps {
  mode?: 'thu thập' | 'xử lý';
  context?: 'thu thập' | 'chia sẻ';
  onBack?: () => void;
}

export function CourtJudgmentPage({ mode = 'thu thập', context = 'thu thập', onBack }: CourtJudgmentPageProps) {
  
  // Only 1 database for Court Judgment
  const generateData = () => {
    const data = [
      { id: '1', title: 'Dữ liệu Thông tin Bản án, quyết định từ TAND tối cao', icon: Scale, color: 'blue', lastMonth: 3456789, thisMonth: 3987654 },
    ];

    return data.map(item => {
      const total = item.lastMonth + item.thisMonth;
      const change = ((item.thisMonth - item.lastMonth) / item.lastMonth * 100).toFixed(1);
      const changeStr = change.startsWith('-') ? change : `+${change}`;
      
      const totalCollected = total;
      const totalProcessed = Math.floor(total * (0.95 + Math.random() * 0.04));
      const processingRate = Math.floor((totalProcessed / totalCollected) * 100);
      
      return {
        id: item.id,
        title: item.title,
        value: total.toLocaleString(),
        change: `${changeStr}%`,
        icon: item.icon,
        color: item.color,
        lastMonth: item.lastMonth,
        thisMonth: item.thisMonth,
        totalCollected,
        totalProcessed,
        processingRate,
      };
    });
  };

  const stats = generateData();

  if (mode === 'xử lý') {
    return <GenericProcessingPage systemName="CSDL Thông tin Bản án" datasets={stats.map((s, idx) => ({ id: s.id || `item_${idx}`, name: s.title }))} />;
  }

  return (
    <DatabaseTemplate
      title="Dữ liệu Thông tin Bản án, quyết định"
      categoryName="TAND tối cao"
      stats={stats}
      context={context}
      mode={mode}
      onBack={onBack}
    />
  );
}