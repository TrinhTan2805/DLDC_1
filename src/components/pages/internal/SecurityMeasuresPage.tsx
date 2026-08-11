import React, { useState, useMemo } from 'react';
import { DatabasePageTemplate } from '../collection/DatabasePageTemplate';
import { GenericProcessingPage } from '../processing/GenericProcessingPage';
import { SecurityMeasuresInfoModal } from '../../security-measures/SecurityMeasuresInfoModal';
import { FileText, UserCheck, Shield, Package } from 'lucide-react';

interface SecurityMeasuresPageProps {
  mode?: 'thu thập' | 'xử lý';
  context?: 'thu thập' | 'chia sẻ';
  onBack?: () => void;
}

export function SecurityMeasuresPage({ mode = 'thu thập', context = 'thu thập', onBack }: SecurityMeasuresPageProps) {
  const [selectedId, setSelectedId] = useState('1');

  const items = [
    { id: '1', title: 'Thông tin chung (Bao gồm người đăng ký và Hợp đồng bảo đảm)', icon: FileText, color: 'blue', lastMonth: 2345678, thisMonth: 2879200, collected: 5224878, processed: 5120400, shared: 4890000 },
    { id: '2', title: 'Bên bảo đảm', icon: UserCheck, color: 'green', lastMonth: 1987543, thisMonth: 2346447, collected: 4333990, processed: 4210500, shared: 3950000 },
    { id: '3', title: 'Bên nhận bảo đảm', icon: Shield, color: 'purple', lastMonth: 2198234, thisMonth: 2526644, collected: 4724878, processed: 4620000, shared: 4320000 },
    { id: '4', title: 'Tài sản bảo đảm', icon: Package, color: 'orange', lastMonth: 1756789, thisMonth: 2134567, collected: 3891356, processed: 3790200, shared: 3540000 },
  ];

  const stats = useMemo(() => {
    return items.map(item => {
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
        collected: item.collected,
        processed: item.processed,
        shared: item.shared,
      };
    });
  }, []);

  if (mode === 'xử lý') {
    return <GenericProcessingPage systemName="CSDL về biện pháp BD" datasets={stats.map((s) => ({ id: s.id, name: s.title }))} />;
  }

  // Sidebar items directly use item title without 'Bộ dữ liệu ' or 'Dữ liệu ' prefix
  const sidebarItems = stats.map(s => ({
    id: s.id,
    label: s.title
  }));

  return (
    <DatabasePageTemplate
      title="Danh sách dữ liệu"
      description="Quản lý và xem chi tiết dữ liệu CSDL về biện pháp BD"
      onBack={onBack}
      innerSidebarItems={sidebarItems}
      activeId={selectedId}
      onSelectDataType={(id) => setSelectedId(id)}
      stretchHeight
    >
      <div className="mt-4 flex-1 flex flex-col min-h-0">
        <SecurityMeasuresInfoModal
          isOpen={true}
          onClose={() => {}}
          isInline={true}
          title={stats.find(s => s.id === selectedId)?.title || 'Thông tin chung'}
          datasetId={selectedId}
        />
      </div>
    </DatabasePageTemplate>
  );
}