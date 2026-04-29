import { useState } from 'react';
import { GenericProcessingPage } from '../processing/GenericProcessingPage';
import { FileDown, FileUp } from 'lucide-react';
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

interface DatabaseRecord {
  name: string;
  category: string;
  todayCount: number;
  errorCount: number;
}

interface CivilLegalCenterPageProps {
  mode?: 'thu thập' | 'xử lý';
  context?: 'thu thập' | 'chia sẻ';
}

export function CivilLegalCenterPage({ mode = 'thu thập', context = 'thu thập', onBack }: CivilLegalCenterPageProps) {
  // Generate realistic random data for Civil Legal Center (2 types)
  const generateData = () => {
    const data = [
      { id: '1', title: 'Dữ liệu Hồ sơ ủy thác tư pháp đến', icon: FileDown, color: 'blue', lastMonth: 1845678, thisMonth: 2179200 },
      { id: '2', title: 'Dữ liệu Hồ sơ ủy thác tư pháp đi', icon: FileUp, color: 'green', lastMonth: 1687543, thisMonth: 1946447 },
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
    return <GenericProcessingPage systemName="CSDL TT Tư Pháp dân sự" datasets={stats.map((s, idx) => ({ id: s.id || `item_${idx}`, name: s.title }))} />;
  }

  const tableData: DatabaseRecord[] = [
    { name: 'Dữ liệu Hồ sơ ủy thác tư pháp đến', category: 'CSDL TT Tư Pháp dân sự', todayCount: 20000, errorCount: 30 },
    { name: 'Dữ liệu Hồ sơ ủy thác tư pháp đi', category: 'CSDL TT Tư Pháp dân sự', todayCount: 20000, errorCount: 30 },
  ];

  // Chart data matching stats totals
  const chartData = stats.map((stat, index) => {
    const names = ['Ủy thác đến', 'Ủy thác đi'];
    return {
      name: names[index],
      lastMonth: stat.lastMonth,
      thisMonth: stat.thisMonth,
    };
  });

  return (
    <DatabaseTemplate
      title="Dữ liệu CSDL TT Tư Pháp dân sự"
      stats={stats}
      chartData={chartData}
      tableData={tableData}
      context={context}
      mode={mode}
      onBack={onBack}
    />
  );
}