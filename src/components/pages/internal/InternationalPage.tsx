import { useState, useMemo } from 'react';
import { FileText, FolderOpen, Users, Video, BookOpen, Plane } from 'lucide-react';
import { DatabasePageTemplate } from '../collection/DatabasePageTemplate';
import { InternationalModal } from '../../international/InternationalModal';
import { GenericProcessingPage } from '../processing/GenericProcessingPage';

interface StatCard {
  id: string;
  title: string;
  value: string;
  change: string;
  icon: any;
  color: string;
  lastMonth: number;
  thisMonth: number;
}

interface InternationalPageProps {
  onBack?: () => void;
  mode?: 'thu thập' | 'xử lý';
  context?: 'thu thập' | 'chia sẻ';
}

export function InternationalPage({ mode = 'thu thập', context = 'thu thập', onBack }: InternationalPageProps) {
  // Generate realistic random data for International Cooperation Database (6 types)
  const stats = useMemo(() => {
    const data = [
      { id: '1', title: 'Dữ liệu Thông tin điều ước quốc tế, thỏa thuận quốc tế', icon: FileText, color: 'blue', lastMonth: 1245678, thisMonth: 1479200 },
      { id: '2', title: 'Dữ liệu Thông tin chương trình dự án', icon: FolderOpen, color: 'green', lastMonth: 1087543, thisMonth: 1246447 },
      { id: '3', title: 'Dữ liệu Danh sách chuyên gia', icon: Users, color: 'purple', lastMonth: 898234, thisMonth: 1026644 },
      { id: '4', title: 'Dữ liệu Thông tin hội nghị, hội thảo', icon: Video, color: 'orange', lastMonth: 956789, thisMonth: 1134567 },
      { id: '5', title: 'Dữ liệu Thông tin sản phẩm nghiên cứu, truyền thông', icon: BookOpen, color: 'blue', lastMonth: 834567, thisMonth: 996789 },
      { id: '6', title: 'Dữ liệu Thông tin Đoàn', icon: Plane, color: 'green', lastMonth: 756789, thisMonth: 887654 },
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
  }, []);

  const [selectedId, setSelectedId] = useState<string>(stats[0].id);

  if (mode === 'xử lý') {
    return <GenericProcessingPage systemName="CSDL Hợp tác quốc tế" datasets={stats.map((s) => ({ id: s.id, name: s.title }))} />;
  }

  const sidebarItems = stats.map(s => ({ id: s.id, label: s.title }));

  return (
    <DatabasePageTemplate
      title="Dữ liệu CSDL Hợp tác quốc tế"
      description="Quản lý và xem chi tiết dữ liệu điều ước quốc tế, dự án hợp tác và thông tin chuyên gia"
      onBack={onBack}
      innerSidebarItems={sidebarItems}
      activeId={selectedId}
      onSelectDataType={(id) => setSelectedId(id)}
    >
      <div className="mt-4">
        <InternationalModal
          isOpen={true}
          onClose={() => {}}
          isInline={true}
          title={stats.find(s => s.id === selectedId)?.title || ''}
        />
      </div>
    </DatabasePageTemplate>
  );
}