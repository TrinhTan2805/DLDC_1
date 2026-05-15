import { useState, useMemo } from 'react';
import { User, Users, FileText, Building2, FolderOpen, Video, MessageSquare, Handshake, UserCheck, Wallet, Target, CheckCircle, Megaphone, Trophy } from 'lucide-react';
import { DatabasePageTemplate } from '../collection/DatabasePageTemplate';
import { FamilyBaseModal } from '../../family-base/FamilyBaseModal';
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

interface FamilyBasePageProps {
  onBack?: () => void;
  mode?: 'thu thập' | 'xử lý';
  context?: 'thu thập' | 'chia sẻ';
}

export function FamilyBasePage({ mode = 'thu thập', context = 'thu thập', onBack }: FamilyBasePageProps) {
  // Generate realistic random data for Family Base Database (16 types)
  const stats = useMemo(() => {
    const data = [
      { id: '1', title: 'Dữ liệu Báo cáo viên pháp luật', icon: User, color: 'blue', lastMonth: 845678, thisMonth: 979200 },
      { id: '2', title: 'Dữ liệu Tuyên truyền viên pháp luật', icon: Users, color: 'green', lastMonth: 787543, thisMonth: 846447 },
      { id: '3', title: 'Dữ liệu Chương trình, kế hoạch về phổ biến, giáo dục pháp luật', icon: FileText, color: 'purple', lastMonth: 698234, thisMonth: 726644 },
      { id: '4', title: 'Dữ liệu Hội đồng phối hợp phổ biến, giáo dục pháp luật', icon: Building2, color: 'orange', lastMonth: 656789, thisMonth: 734567 },
      { id: '5', title: 'Dữ liệu Đề án', icon: FolderOpen, color: 'blue', lastMonth: 634567, thisMonth: 696789 },
      { id: '6', title: 'Dữ liệu Hội nghị tập huấn (trực tuyến, trực tiếp)', icon: Video, color: 'green', lastMonth: 756789, thisMonth: 887654 },
      { id: '7', title: 'Dữ liệu Hội thảo', icon: MessageSquare, color: 'purple', lastMonth: 545678, thisMonth: 679200 },
      { id: '8', title: 'Dữ liệu Tổ hoà giải', icon: Handshake, color: 'orange', lastMonth: 587543, thisMonth: 646447 },
      { id: '9', title: 'Dữ liệu Hoà giải viên', icon: UserCheck, color: 'blue', lastMonth: 898234, thisMonth: 1026644 },
      { id: '10', title: 'Dữ liệu Vụ việc hoà giải', icon: FileText, color: 'green', lastMonth: 756789, thisMonth: 834567 },
      { id: '11', title: 'Dữ liệu Tập huấn viên', icon: User, color: 'purple', lastMonth: 534567, thisMonth: 596789 },
      { id: '12', title: 'Dữ liệu Kinh phí phổ biến giáo dục pháp luật', icon: Wallet, color: 'orange', lastMonth: 656789, thisMonth: 787654 },
      { id: '13', title: 'Dữ liệu Tiêu chí, chỉ tiêu tiếp cận pháp luật', icon: Target, color: 'blue', lastMonth: 445678, thisMonth: 579200 },
      { id: '14', title: 'Dữ liệu Đánh giá cấp xã đạt chuẩn tiếp cận pháp luật', icon: CheckCircle, color: 'green', lastMonth: 387543, thisMonth: 446447 },
      { id: '15', title: 'Dữ liệu Cuộc PBGDPL', icon: Megaphone, color: 'purple', lastMonth: 698234, thisMonth: 826644 },
      { id: '16', title: 'Dữ liệu Cuộc thi tìm hiểu về pháp luật', icon: Trophy, color: 'orange', lastMonth: 556789, thisMonth: 634567 },
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
    return <GenericProcessingPage systemName="CSDL PB, GĐ và HG cơ sở" datasets={stats.map((s) => ({ id: s.id, name: s.title }))} />;
  }

  const sidebarItems = stats.map(s => ({ id: s.id, label: s.title }));

  return (
    <DatabasePageTemplate
      title="Dữ liệu CSDL PB, GĐ và HG cơ sở"
      description="Quản lý và xem chi tiết dữ liệu phổ biến, giáo dục pháp luật và hòa giải cơ sở"
      onBack={onBack}
      innerSidebarItems={sidebarItems}
      activeId={selectedId}
      onSelectDataType={(id) => setSelectedId(id)}
    >
      <div className="mt-4">
        <FamilyBaseModal
          isOpen={true}
          onClose={() => {}}
          isInline={true}
          title={stats.find(s => s.id === selectedId)?.title || ''}
        />
      </div>
    </DatabasePageTemplate>
  );
}