import { useState, useMemo } from 'react';
import { Building2, FileSignature, FileText, Home, GitBranch, User } from 'lucide-react';
import { DatabasePageTemplate } from '../collection/DatabasePageTemplate';
import { CivilLegalInfoModal } from '../../civil-legal-info/CivilLegalInfoModal';
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

interface CivilLegalInfoPageProps {
  onBack?: () => void;
  mode?: 'thu thập' | 'xử lý';
  context?: 'thu thập' | 'chia sẻ';
}

export function CivilLegalInfoPage({ mode = 'thu thập', context = 'thu thập', onBack }: CivilLegalInfoPageProps) {
  // Generate realistic random data for Legal Aid System (6 types)
  const stats = useMemo(() => {
    const data = [
      { id: '1', title: 'Dữ liệu Tổ chức thực hiện trợ giúp pháp lý', icon: Building2, color: 'blue', lastMonth: 1345678, thisMonth: 1579200 },
      { id: '2', title: 'Dữ liệu Tổ chức đăng ký tham gia trợ giúp pháp lý', icon: FileSignature, color: 'green', lastMonth: 1187543, thisMonth: 1346447 },
      { id: '3', title: 'Dữ liệu Thông tin văn bản cử người thực hiện trợ giúp pháp lý', icon: FileText, color: 'purple', lastMonth: 1598234, thisMonth: 1826644 },
      { id: '4', title: 'Dữ liệu Trung tâm TGPL nhà nước', icon: Home, color: 'orange', lastMonth: 1256789, thisMonth: 1434567 },
      { id: '5', title: 'Dữ liệu Chi nhánh TGPL', icon: GitBranch, color: 'blue', lastMonth: 1134567, thisMonth: 1296789 },
      { id: '6', title: 'Dữ liệu Người thực hiện TGPL', icon: User, color: 'green', lastMonth: 1456789, thisMonth: 1687654 },
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
    return <GenericProcessingPage systemName="HTTT TTTG pháp lý dân sự" datasets={stats.map((s) => ({ id: s.id, name: s.title }))} />;
  }

  const sidebarItems = stats.map(s => ({ id: s.id, label: s.title }));

  return (
    <DatabasePageTemplate
      title="Dữ liệu HTTT TTTG pháp lý dân sự"
      description="Quản lý và xem chi tiết thông tin trợ giúp pháp lý dân sự"
      onBack={onBack}
      innerSidebarItems={sidebarItems}
      activeId={selectedId}
      onSelectDataType={(id) => setSelectedId(id)}
    >
      <div className="mt-4">
        <CivilLegalInfoModal
          isOpen={true}
          onClose={() => {}}
          isInline={true}
          title={stats.find(s => s.id === selectedId)?.title || ''}
        />
      </div>
    </DatabasePageTemplate>
  );
}