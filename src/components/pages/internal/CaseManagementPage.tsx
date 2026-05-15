import { useState, useMemo } from 'react';
import { UserCheck } from 'lucide-react';
import { DatabasePageTemplate } from '../collection/DatabasePageTemplate';
import { NationalityAcquisitionModal } from '../../nationality-acquisition/NationalityAcquisitionModal';

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

  const sidebarItems = stats.map(s => ({ id: s.id, label: `Bộ dữ liệu ${s.title.toLowerCase()}` }));

  return (
    <DatabasePageTemplate
      title="Dữ liệu HT quản lý hồ sơ QT"
      description="Quản lý và xem chi tiết dữ liệu từ Quốc tịch"
      onBack={onBack}
      innerSidebarItems={sidebarItems}
      activeId={selectedId}
      onSelectDataType={(id) => setSelectedId(id)}
    >
      <div className="mt-4">
        {selectedId === '1' ? (
          <NationalityAcquisitionModal
            isOpen={true}
            onClose={() => {}}
            isInline={true}
            title="Dữ liệu Nhập Quốc tịch"
          />
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <p className="text-slate-500">Giao diện cho bộ dữ liệu này đang được cập nhật...</p>
          </div>
        )}
      </div>
    </DatabasePageTemplate>
  );
}