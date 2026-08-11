import { useState, useMemo } from 'react';
import { UserCheck } from 'lucide-react';
import { DatabasePageTemplate } from '../collection/DatabasePageTemplate';
import { NationalityInfoModal } from '../../nationality-acquisition/NationalityInfoModal';
import { GenericProcessingPage } from '../processing/GenericProcessingPage';

interface CaseManagementPageProps {
  mode?: 'thu thập' | 'xử lý';
  context?: 'thu thập' | 'chia sẻ';
  onBack?: () => void;
}

export function CaseManagementPage({ mode = 'thu thập', context = 'thu thập', onBack }: CaseManagementPageProps) {
  const [selectedId, setSelectedId] = useState('1');

  // Generate data for 3 types of nationality records
  const stats = useMemo(() => {
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
  }, []);

  if (mode === 'xử lý') {
    return <GenericProcessingPage systemName="HT quản lý hồ sơ QT" datasets={stats.map((s) => ({ id: s.id, name: s.title }))} />;
  }

  const sidebarItems = stats.map(s => ({ id: s.id, label: s.title }));

  return (
    <DatabasePageTemplate
      title="Dữ liệu HT quản lý hồ sơ QT"
      description="Quản lý và xem chi tiết dữ liệu từ Quốc tịch"
      onBack={onBack}
      innerSidebarItems={sidebarItems}
      activeId={selectedId}
      onSelectDataType={(id) => setSelectedId(id)}
      stretchHeight
    >
      <div className="mt-4 flex-1 flex flex-col min-h-0">
        <NationalityInfoModal
          isOpen={true}
          onClose={() => {}}
          isInline={true}
          title={stats.find(s => s.id === selectedId)?.title || 'Dữ liệu Nhập Quốc tịch'}
          datasetId={selectedId}
        />
      </div>
    </DatabasePageTemplate>
  );
}