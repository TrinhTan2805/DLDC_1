import { useState, useMemo } from 'react';
import { Baby } from 'lucide-react';
import { DatabasePageTemplate } from '../collection/DatabasePageTemplate';
import { ChildrenModal } from '../../children/ChildrenModal';
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

interface ChildrenGroupPageProps {
  mode?: 'thu thập' | 'xử lý';
  context?: 'thu thập' | 'chia sẻ';
}

export function ChildrenGroupPage({ mode = 'thu thập', context = 'thu thập' }: ChildrenGroupPageProps) {
  // Generate realistic random data for Children Group (1 type)
  const stats = useMemo(() => {
    const data = [
      { id: '1', title: 'Dữ liệu Trẻ em', icon: Baby, color: 'blue', lastMonth: 2345678, thisMonth: 2678901 },
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
    return <GenericProcessingPage systemName="Trẻ em" datasets={stats.map((s) => ({ id: s.id, name: s.title }))} />;
  }

  const sidebarItems = stats.map(s => ({ id: s.id, label: s.title }));

  return (
    <DatabasePageTemplate
      title="Dữ liệu Nhóm Trẻ em"
      description="Quản lý và tra cứu thông tin trẻ em từ các nguồn dữ liệu chuyên ngành"
      innerSidebarItems={sidebarItems}
      activeId={selectedId}
      onSelectDataType={(id) => setSelectedId(id)}
    >
      <div className="mt-4">
        <ChildrenModal
          isOpen={true}
          onClose={() => {}}
          isInline={true}
          title={stats.find(s => s.id === selectedId)?.title || ''}
        />
      </div>
    </DatabasePageTemplate>
  );
}