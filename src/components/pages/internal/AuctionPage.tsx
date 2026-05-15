import { useState, useMemo } from 'react';
import { Gavel, Building, User, FileText, Package, UserCheck, ShieldAlert, Home, Briefcase, CheckSquare, UserSquare, Scale, Landmark, Globe, Users } from 'lucide-react';
import { DatabasePageTemplate } from '../collection/DatabasePageTemplate';
import { AuctionModal } from '../../auction/AuctionModal';
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

interface AuctionPageProps {
  onBack?: () => void;
  mode?: 'thu thập' | 'xử lý';
  context?: 'thu thập' | 'chia sẻ';
}

export function AuctionPage({ mode = 'thu thập', context = 'thu thập', onBack }: AuctionPageProps) {
  // Generate realistic random data for Auction Management Database (24 types)
  const stats = useMemo(() => {
    const data = [
      { id: '1', title: 'Dữ liệu Đấu giá viên', icon: Gavel, color: 'blue', lastMonth: 745678, thisMonth: 879200 },
      { id: '2', title: 'Dữ liệu Tổ chức hành nghề đấu giá', icon: Building, color: 'green', lastMonth: 687543, thisMonth: 746447 },
      { id: '3', title: 'Dữ liệu Người có tài sản đấu giá', icon: User, color: 'purple', lastMonth: 598234, thisMonth: 626644 },
      { id: '4', title: 'Dữ liệu Thông tin việc đấu giá', icon: FileText, color: 'orange', lastMonth: 556789, thisMonth: 634567 },
      { id: '5', title: 'Dữ liệu Tài sản đấu giá', icon: Package, color: 'blue', lastMonth: 534567, thisMonth: 596789 },
      { id: '6', title: 'Dữ liệu Công chứng viên', icon: UserCheck, color: 'green', lastMonth: 656789, thisMonth: 787654 },
      { id: '7', title: 'Dữ liệu Thông tin ngăn chặn', icon: ShieldAlert, color: 'purple', lastMonth: 445678, thisMonth: 579200 },
      { id: '8', title: 'Dữ liệu Tổ chức hành nghề công chứng', icon: Home, color: 'orange', lastMonth: 587543, thisMonth: 646447 },
      { id: '9', title: 'Dữ liệu Tài sản trong giao dịch công chứng', icon: Briefcase, color: 'blue', lastMonth: 698234, thisMonth: 826644 },
      { id: '10', title: 'Dữ liệu Kết quả hoạt động công chứng', icon: CheckSquare, color: 'green', lastMonth: 556789, thisMonth: 634567 },
      { id: '11', title: 'Dữ liệu Quản tài viên', icon: UserSquare, color: 'purple', lastMonth: 434567, thisMonth: 496789 },
      { id: '12', title: 'Dữ liệu Doanh nghiệp quản lý, thanh lý tài sản', icon: Building, color: 'orange', lastMonth: 556789, thisMonth: 687654 },
      { id: '13', title: 'Dữ liệu Luật sư Việt Nam', icon: Scale, color: 'blue', lastMonth: 845678, thisMonth: 979200 },
      { id: '14', title: 'Dữ liệu Người được cấp chứng chỉ hành nghề luật sư', icon: FileText, color: 'green', lastMonth: 787543, thisMonth: 846447 },
      { id: '15', title: 'Dữ liệu Tổ chức hành nghề luật sư Việt Nam', icon: Landmark, color: 'purple', lastMonth: 698234, thisMonth: 726644 },
      { id: '16', title: 'Dữ liệu Luật sư nước ngoài', icon: Globe, color: 'orange', lastMonth: 456789, thisMonth: 534567 },
      { id: '17', title: 'Dữ liệu Tổ chức hành nghề luật sư nước ngoài', icon: Building, color: 'blue', lastMonth: 434567, thisMonth: 496789 },
      { id: '18', title: 'Dữ liệu Trọng tài viên', icon: Users, color: 'green', lastMonth: 656789, thisMonth: 787654 },
      { id: '19', title: 'Dữ liệu Trung tâm trọng tài', icon: Home, color: 'purple', lastMonth: 545678, thisMonth: 679200 },
      { id: '20', title: 'Dữ liệu Chi nhánh của tổ chức trọng tài', icon: Building, color: 'orange', lastMonth: 387543, thisMonth: 446447 },
      { id: '21', title: 'Dữ liệu Văn phòng đại diện của trung tâm trọng tài', icon: Home, color: 'blue', lastMonth: 456789, thisMonth: 534567 },
      { id: '22', title: 'Dữ liệu Hòa giải viên thương mại', icon: UserCheck, color: 'green', lastMonth: 534567, thisMonth: 596789 },
      { id: '23', title: 'Dữ liệu Trung tâm hòa giải thương mại', icon: Landmark, color: 'purple', lastMonth: 445678, thisMonth: 579200 },
      { id: '24', title: 'Dữ liệu Giám định viên tư pháp', icon: UserSquare, color: 'orange', lastMonth: 587543, thisMonth: 646447 },
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
    return <GenericProcessingPage systemName="CSDL quản lý đấu giá TS" datasets={stats.map((s) => ({ id: s.id, name: s.title }))} />;
  }

  const sidebarItems = stats.map(s => ({ id: s.id, label: s.title }));

  return (
    <DatabasePageTemplate
      title="Dữ liệu CSDL quản lý đấu giá tài sản"
      description="Quản lý và xem chi tiết dữ liệu đấu giá, công chứng, luật sư và các tổ chức bổ trợ tư pháp"
      onBack={onBack}
      innerSidebarItems={sidebarItems}
      activeId={selectedId}
      onSelectDataType={(id) => setSelectedId(id)}
    >
      <div className="mt-4">
        <AuctionModal
          isOpen={true}
          onClose={() => {}}
          isInline={true}
          title={stats.find(s => s.id === selectedId)?.title || ''}
        />
      </div>
    </DatabasePageTemplate>
  );
}