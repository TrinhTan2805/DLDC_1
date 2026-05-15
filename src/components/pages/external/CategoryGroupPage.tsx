import { useState, useMemo } from 'react';
import { UserCircle2, Flag, MapPin, Church, Landmark, Map, Heart, FileUser } from 'lucide-react';
import { DatabasePageTemplate } from '../collection/DatabasePageTemplate';
import { CategoryGroupModal } from '../../category-group/CategoryGroupModal';
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

interface CategoryGroupPageProps {
  mode?: 'thu thập' | 'xử lý';
  context?: 'thu thập' | 'chia sẻ';
}

export function CategoryGroupPage({ mode = 'thu thập', context = 'thu thập' }: CategoryGroupPageProps) {
  // Generate realistic random data for Category Group (8 types)
  const stats = useMemo(() => {
    const data = [
      { id: '1', title: 'Dữ liệu Danh mục giới tính', icon: UserCircle2, color: 'blue', lastMonth: 145678, thisMonth: 157890 },
      { id: '2', title: 'Dữ liệu Danh mục và mã các dân tộc', icon: Flag, color: 'green', lastMonth: 1234567, thisMonth: 1456789 },
      { id: '3', title: 'Dữ liệu Danh mục và mã Quốc gia, Quốc tịch', icon: MapPin, color: 'purple', lastMonth: 987654, thisMonth: 1123456 },
      { id: '4', title: 'Dữ liệu Danh mục và mã các Tôn giáo', icon: Church, color: 'orange', lastMonth: 456789, thisMonth: 523456 },
      { id: '5', title: 'Dữ liệu Danh mục cơ quan', icon: Landmark, color: 'blue', lastMonth: 2345678, thisMonth: 2789012 },
      { id: '6', title: 'Dữ liệu Danh mục đơn vị hành chính', icon: Map, color: 'green', lastMonth: 3456789, thisMonth: 3987654 },
      { id: '7', title: 'Dữ liệu Danh mục và mã mối quan hệ trong gia đình', icon: Heart, color: 'purple', lastMonth: 678901, thisMonth: 789123 },
      { id: '8', title: 'Dữ liệu Danh mục mã giấy tờ tùy thân', icon: FileUser, color: 'orange', lastMonth: 1567890, thisMonth: 1823456 },
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
    return <GenericProcessingPage systemName="Danh mục" datasets={stats.map((s) => ({ id: s.id, name: s.title }))} />;
  }

  const sidebarItems = stats.map(s => ({ id: s.id, label: s.title }));

  return (
    <DatabasePageTemplate
      title="Dữ liệu Nhóm danh mục (CSDL ngoài ngành)"
      description="Quản lý và tra cứu các danh mục dùng chung từ hệ thống ngoài ngành"
      innerSidebarItems={sidebarItems}
      activeId={selectedId}
      onSelectDataType={(id) => setSelectedId(id)}
    >
      <div className="mt-4">
        <CategoryGroupModal
          isOpen={true}
          onClose={() => {}}
          isInline={true}
          title={stats.find(s => s.id === selectedId)?.title || ''}
        />
      </div>
    </DatabasePageTemplate>
  );
}