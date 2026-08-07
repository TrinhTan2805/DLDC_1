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
  dataType: 'Dữ liệu nghiệp vụ' | 'Dữ liệu danh mục';
}

interface CivilLegalInfoPageProps {
  onBack?: () => void;
  mode?: 'thu thập' | 'xử lý';
  context?: 'thu thập' | 'chia sẻ';
}

export function CivilLegalInfoPage({ mode = 'thu thập', context = 'thu thập', onBack }: CivilLegalInfoPageProps) {
  // Danh mục dùng chung (Master Data) và Luồng nghiệp vụ của HTTT trợ giúp pháp lý [Unverified]
  const stats = useMemo(() => {
    const data: { id: string; title: string; icon: any; color: string; lastMonth: number; thisMonth: number; dataType: 'Dữ liệu nghiệp vụ' | 'Dữ liệu danh mục' }[] = [
      // A. Danh mục dùng chung (Master Data)
      { id: 'a1', title: 'Nhóm tổ chức', icon: Building2, color: 'blue', lastMonth: 12, thisMonth: 12, dataType: 'Dữ liệu danh mục' },
      { id: 'a2', title: 'Loại nhân sự', icon: User, color: 'blue', lastMonth: 8, thisMonth: 8, dataType: 'Dữ liệu danh mục' },
      { id: 'a3', title: 'Hình thức trợ giúp pháp lý', icon: FileSignature, color: 'blue', lastMonth: 6, thisMonth: 6, dataType: 'Dữ liệu danh mục' },
      { id: 'a4', title: 'Lĩnh vực trợ giúp pháp lý', icon: FileText, color: 'blue', lastMonth: 15, thisMonth: 15, dataType: 'Dữ liệu danh mục' },
      { id: 'a5', title: 'Trạng thái vụ việc', icon: GitBranch, color: 'blue', lastMonth: 9, thisMonth: 9, dataType: 'Dữ liệu danh mục' },
      { id: 'a6', title: 'Diện người được trợ giúp pháp lý', icon: User, color: 'blue', lastMonth: 11, thisMonth: 11, dataType: 'Dữ liệu danh mục' },
      { id: 'a7', title: 'Giới tính', icon: User, color: 'blue', lastMonth: 2, thisMonth: 2, dataType: 'Dữ liệu danh mục' },
      { id: 'a8', title: 'Dân tộc', icon: User, color: 'blue', lastMonth: 54, thisMonth: 54, dataType: 'Dữ liệu danh mục' },
      { id: 'a9', title: 'Chức danh / chức vụ', icon: Building2, color: 'blue', lastMonth: 18, thisMonth: 18, dataType: 'Dữ liệu danh mục' },
      { id: 'a10', title: 'Hạng viên chức', icon: Building2, color: 'blue', lastMonth: 5, thisMonth: 5, dataType: 'Dữ liệu danh mục' },
      { id: 'a11', title: 'Trình độ nghiệp vụ', icon: FileText, color: 'blue', lastMonth: 7, thisMonth: 7, dataType: 'Dữ liệu danh mục' },
      { id: 'a12', title: 'Địa bàn hành chính', icon: Home, color: 'blue', lastMonth: 705, thisMonth: 705, dataType: 'Dữ liệu danh mục' },
      { id: 'a13', title: 'Giai đoạn vụ việc', icon: GitBranch, color: 'blue', lastMonth: 6, thisMonth: 6, dataType: 'Dữ liệu danh mục' },
      { id: 'a14', title: 'Nguồn yêu cầu', icon: FileSignature, color: 'blue', lastMonth: 4, thisMonth: 4, dataType: 'Dữ liệu danh mục' },
      // B. Luồng nghiệp vụ
      { id: 'b1', title: 'Tổ chức thực hiện TGPL', icon: Building2, color: 'green', lastMonth: 1345678, thisMonth: 1579200, dataType: 'Dữ liệu nghiệp vụ' },
      { id: 'b2', title: 'Trung tâm TGPL nhà nước', icon: Home, color: 'green', lastMonth: 1256789, thisMonth: 1434567, dataType: 'Dữ liệu nghiệp vụ' },
      { id: 'b3', title: 'Chi nhánh TGPL', icon: GitBranch, color: 'green', lastMonth: 1134567, thisMonth: 1296789, dataType: 'Dữ liệu nghiệp vụ' },
      { id: 'b4', title: 'Tổ chức đăng ký tham gia trợ giúp pháp lý', icon: FileSignature, color: 'green', lastMonth: 1187543, thisMonth: 1346447, dataType: 'Dữ liệu nghiệp vụ' },
      { id: 'b5', title: 'Người thực hiện TGPL', icon: User, color: 'green', lastMonth: 1456789, thisMonth: 1687654, dataType: 'Dữ liệu nghiệp vụ' },
      { id: 'b6', title: 'Hồ sơ vụ việc TGPL', icon: FileText, color: 'green', lastMonth: 1598234, thisMonth: 1826644, dataType: 'Dữ liệu nghiệp vụ' },
      { id: 'b7', title: 'Người được TGPL', icon: User, color: 'green', lastMonth: 1678234, thisMonth: 1912644, dataType: 'Dữ liệu nghiệp vụ' },
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
        dataType: item.dataType,
      };
    });
  }, []);

  const [selectedId, setSelectedId] = useState<string>(stats[0].id);

  if (mode === 'xử lý') {
    return <GenericProcessingPage systemName="HTTT trợ giúp pháp lý" datasets={stats.map((s) => ({ id: s.id, name: s.title }))} />;
  }

  const sidebarItems = stats.map(s => ({ id: s.id, label: s.title, dataType: s.dataType }));

  return (
    <DatabasePageTemplate
      title="Dữ liệu HTTT trợ giúp pháp lý"
      description="Quản lý và xem chi tiết thông tin trợ giúp pháp lý dân sự"
      onBack={onBack}
      innerSidebarItems={sidebarItems}
      activeId={selectedId}
      onSelectDataType={(id) => setSelectedId(id)}
      stretchHeight
    >
      <div className="mt-4 flex-1 flex flex-col min-h-0">
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