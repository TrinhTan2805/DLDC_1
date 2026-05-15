import { useState, useMemo } from 'react';
import { Medal, Shield, Users2 } from 'lucide-react';
import { DatabasePageTemplate } from '../collection/DatabasePageTemplate';
import { MeritoriousModal } from '../../meritorious/MeritoriousModal';
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

interface MeritoriousGroupPageProps {
  mode?: 'thu thập' | 'xử lý';
  context?: 'thu thập' | 'chia sẻ';
}

export function MeritoriousGroupPage({ mode = 'thu thập', context = 'thu thập' }: MeritoriousGroupPageProps) {
  // Generate realistic random data for Meritorious Group (3 types)
  const stats = useMemo(() => {
    const data = [
      { id: '1', title: 'Dữ liệu Hồ sơ công nhận người có công', icon: Medal, color: 'blue', lastMonth: 1234567, thisMonth: 1456789 },
      { id: '2', title: 'Dữ liệu Hồ sơ liệt sĩ', icon: Shield, color: 'green', lastMonth: 987654, thisMonth: 1123456 },
      { id: '3', title: 'Dữ liệu Hồ sơ công nhận thân nhân người có công', icon: Users2, color: 'purple', lastMonth: 789012, thisMonth: 912345 },
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
    return <GenericProcessingPage systemName="Người có công" datasets={stats.map((s) => ({ id: s.id, name: s.title }))} />;
  }

  const sidebarItems = stats.map(s => ({ id: s.id, label: s.title }));

  return (
    <DatabasePageTemplate
      title="Dữ liệu Nhóm Người có công"
      description="Quản lý và tra cứu hồ sơ người có công, hồ sơ liệt sĩ và thân nhân người có công"
      innerSidebarItems={sidebarItems}
      activeId={selectedId}
      onSelectDataType={(id) => setSelectedId(id)}
    >
      <div className="mt-4">
        <MeritoriousModal
          isOpen={true}
          onClose={() => {}}
          isInline={true}
          title={stats.find(s => s.id === selectedId)?.title || ''}
        />
      </div>
    </DatabasePageTemplate>
  );
}