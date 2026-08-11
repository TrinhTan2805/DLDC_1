import React, { useState, useMemo } from 'react';
import { DatabasePageTemplate } from '../collection/DatabasePageTemplate';
import { GenericProcessingPage } from '../processing/GenericProcessingPage';
import { CivilLegalCenterInfoModal } from '../../civil-legal-center/CivilLegalCenterInfoModal';
import { FileDown, FileUp } from 'lucide-react';

interface CivilLegalCenterPageProps {
  onBack?: () => void;
  mode?: 'thu thập' | 'xử lý';
  context?: 'thu thập' | 'chia sẻ';
}

export function CivilLegalCenterPage({ mode = 'thu thập', context = 'thu thập', onBack }: CivilLegalCenterPageProps) {
  const [selectedId, setSelectedId] = useState('1');

  // Generate realistic random data for Civil Legal Center (2 types)
  const generateData = () => {
    const data = [
      { id: '1', title: 'Hồ sơ ủy thác tư pháp đến', icon: FileDown, color: 'blue', lastMonth: 1845678, thisMonth: 2179200 },
      { id: '2', title: 'Hồ sơ ủy thác tư pháp đi', icon: FileUp, color: 'green', lastMonth: 1687543, thisMonth: 1946447 },
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

  const stats = useMemo(() => generateData(), []);

  if (mode === 'xử lý') {
    return <GenericProcessingPage systemName="CSDL TT Tư Pháp dân sự" datasets={stats.map((s, idx) => ({ id: s.id || `item_${idx}`, name: s.title }))} />;
  }

  const sidebarItems = stats.map(s => ({ id: s.id, label: s.title }));

  return (
    <DatabasePageTemplate
      title="Dữ liệu CSDL TT Tư Pháp dân sự"
      description="Quản lý và xem chi tiết dữ liệu tương trợ tư pháp dân sự"
      onBack={onBack}
      innerSidebarItems={sidebarItems}
      activeId={selectedId}
      onSelectDataType={(id) => setSelectedId(id)}
      stretchHeight
    >
      <div className="mt-4 flex-1 flex flex-col min-h-0">
        <CivilLegalCenterInfoModal
          isOpen={true}
          onClose={() => {}}
          isInline={true}
          title={stats.find(s => s.id === selectedId)?.title || 'Hồ sơ ủy thác tư pháp đến'}
          datasetId={selectedId}
        />
      </div>
    </DatabasePageTemplate>
  );
}