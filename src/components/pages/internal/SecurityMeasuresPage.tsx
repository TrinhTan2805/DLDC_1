import { useState } from 'react';
import { GenericProcessingPage } from '../processing/GenericProcessingPage';
import { FileText, Shield, UserCheck, Package } from 'lucide-react';
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

interface SecurityMeasuresPageProps {
  mode?: 'thu thập' | 'xử lý';
  context?: 'thu thập' | 'chia sẻ';
  onBack?: () => void;
}

export function SecurityMeasuresPage({ mode = 'thu thập', context = 'thu thập', onBack }: SecurityMeasuresPageProps) {
  // Generate realistic random data for Security Measures data (4 types)
  const generateData = () => {
    const data = [
      { id: '1', title: 'Dữ liệu Thông tin chung (Bao gồm người đăng ký và Hợp đồng bảo đảm)', icon: FileText, color: 'blue', lastMonth: 2345678, thisMonth: 2879200 },
      { id: '2', title: 'Dữ liệu Bên bảo đảm', icon: UserCheck, color: 'green', lastMonth: 1987543, thisMonth: 2346447 },
      { id: '3', title: 'Dữ liệu Bên nhận bảo đảm', icon: Shield, color: 'purple', lastMonth: 2198234, thisMonth: 2526644 },
      { id: '4', title: 'Dữ liệu Tài sản bảo đảm', icon: Package, color: 'orange', lastMonth: 1756789, thisMonth: 2134567 },
    ];

    return data.map(item => {
      const total = item.lastMonth + item.thisMonth;
      const change = ((item.thisMonth - item.lastMonth) / item.lastMonth * 100).toFixed(1);
      const changeStr = change.startsWith('-') ? change : `+${change}`;
      
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
    return <GenericProcessingPage systemName="CSDL về biện pháp BD" datasets={stats.map((s, idx) => ({ id: s.id || `item_${idx}`, name: s.title }))} />;
  }

  const tableData: DatabaseRecord[] = [
    { name: 'Dữ liệu Thông tin chung', category: 'CSDL về biện pháp BD', todayCount: 20000, errorCount: 30 },
    { name: 'Dữ liệu Bên bảo đảm', category: 'CSDL về biện pháp BD', todayCount: 20000, errorCount: 30 },
    { name: 'Dữ liệu Bên nhận bảo đảm', category: 'CSDL về biện pháp BD', todayCount: 20000, errorCount: 30 },
    { name: 'Dữ liệu Tài sản bảo đảm', category: 'CSDL về biện pháp BD', todayCount: 20000, errorCount: 30 },
  ];

  return (
    <DatabaseTemplate
      title="Dữ liệu CSDL về biện pháp BD"
      categoryName="Biện pháp bảo đảm"
      stats={stats}
      tableData={tableData}
      context={context}
      mode={mode}
      onBack={onBack}
    />
  );
}