import { useState, useMemo } from 'react';
import { HandHeart, UserMinus, Baby, Activity, UserCog, Accessibility, Heart } from 'lucide-react';
import { DatabasePageTemplate } from '../collection/DatabasePageTemplate';
import { SocialSecurityModal } from '../../social-security/SocialSecurityModal';
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

interface SocialSecurityGroupPageProps {
  mode?: 'thu thập' | 'xử lý';
  context?: 'thu thập' | 'chia sẻ';
}

export function SocialSecurityGroupPage({ mode = 'thu thập', context = 'thu thập' }: SocialSecurityGroupPageProps) {
  // Generate realistic random data for Social Security Group (7 types)
  const stats = useMemo(() => {
    const data = [
      { id: '1', title: 'Dữ liệu Hưởng trợ giúp XH', icon: HandHeart, color: 'blue', lastMonth: 1456789, thisMonth: 1678901 },
      { id: '2', title: 'Dữ liệu Thông tin người nghèo, cận nghèo', icon: UserMinus, color: 'green', lastMonth: 2345678, thisMonth: 2678901 },
      { id: '3', title: 'Dữ liệu Người đơn thân', icon: UserCog, color: 'purple', lastMonth: 567890, thisMonth: 656789 },
      { id: '4', title: 'Dữ liệu Trẻ em là đối tượng BTXH', icon: Baby, color: 'orange', lastMonth: 789012, thisMonth: 912345 },
      { id: '5', title: 'Dữ liệu Người có HIV', icon: Activity, color: 'blue', lastMonth: 234567, thisMonth: 278901 },
      { id: '6', title: 'Dữ liệu Người cao tuổi', icon: Heart, color: 'green', lastMonth: 1789012, thisMonth: 2034567 },
      { id: '7', title: 'Dữ liệu Thông tin về người khuyết tật', icon: Accessibility, color: 'purple', lastMonth: 1123456, thisMonth: 1345678 },
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
    return <GenericProcessingPage systemName="BHXH và Giảm nghèo" datasets={stats.map((s) => ({ id: s.id, name: s.title }))} />;
  }

  const sidebarItems = stats.map(s => ({ id: s.id, label: s.title }));

  return (
    <DatabasePageTemplate
      title="Dữ liệu Nhóm Bảo hiểm xã hội và Giảm nghèo"
      description="Quản lý và tra cứu thông tin bảo hiểm xã hội, đối tượng trợ giúp xã hội và thông tin giảm nghèo"
      innerSidebarItems={sidebarItems}
      activeId={selectedId}
      onSelectDataType={(id) => setSelectedId(id)}
    >
      <div className="mt-4">
        <SocialSecurityModal
          isOpen={true}
          onClose={() => {}}
          isInline={true}
          title={stats.find(s => s.id === selectedId)?.title || ''}
        />
      </div>
    </DatabasePageTemplate>
  );
}