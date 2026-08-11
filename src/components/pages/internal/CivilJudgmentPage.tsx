import { useState, useMemo } from 'react';
import { GenericProcessingPage } from '../processing/GenericProcessingPage';
import { FileText, Gavel, User, Shield, FileCheck, Receipt, Package, Scale, Megaphone, MessageSquare, BookOpen, Search as SearchIcon } from 'lucide-react';
import { DatabasePageTemplate } from '../collection/DatabasePageTemplate';
import { CivilJudgmentInfoModal } from '../../civil-judgment/CivilJudgmentInfoModal';

interface CivilJudgmentPageProps {
  mode?: 'thu thập' | 'xử lý';
  context?: 'thu thập' | 'chia sẻ';
  onBack?: () => void;
}

export function CivilJudgmentPage({ mode = 'thu thập', context = 'thu thập', onBack }: CivilJudgmentPageProps) {
  const [selectedId, setSelectedId] = useState('1');

  // Generate realistic random data for 16 categories
  const generateData = () => {
    const data = [
      { id: '1', title: 'Yêu cầu thi hành án của cá nhân, cơ quan, tổ chức', icon: FileText, color: 'blue', lastMonth: 145678, thisMonth: 179200 },
      { id: '2', title: 'Quyết định thi hành án dân sự', icon: Gavel, color: 'green', lastMonth: 187543, thisMonth: 214647 },
      { id: '3', title: 'Người phải thi hành án, người được thi hành án, người có quyền lợi nghĩa vụ liên quan', icon: User, color: 'purple', lastMonth: 298234, thisMonth: 326644 },
      { id: '4', title: 'Nghĩa vụ thi hành án', icon: FileCheck, color: 'orange', lastMonth: 112345, thisMonth: 181253 },
      { id: '5', title: 'Trạng thái thi hành án', icon: Shield, color: 'blue', lastMonth: 245678, thisMonth: 279200 },
      { id: '6', title: 'Tài sản thi hành án', icon: Package, color: 'green', lastMonth: 187234, thisMonth: 237644 },
      { id: '7', title: 'Xác minh điều kiện trong thi hành án dân sự', icon: SearchIcon, color: 'purple', lastMonth: 134567, thisMonth: 190311 },
      { id: '8', title: 'Cưỡng chế thi hành án trong thi hành án dân sự', icon: Shield, color: 'orange', lastMonth: 123456, thisMonth: 170142 },
      { id: '9', title: 'Áp dụng biện pháp bảo đảm trong thi hành án dân sự', icon: FileCheck, color: 'blue', lastMonth: 156789, thisMonth: 168089 },
      { id: '10', title: 'Chứng từ nghiệp vụ trong thi hành án dân sự', icon: FileText, color: 'green', lastMonth: 134567, thisMonth: 149031 },
      { id: '11', title: 'Biên lai thu tiền thi hành án dân sự', icon: Receipt, color: 'purple', lastMonth: 145678, thisMonth: 196808 },
      { id: '12', title: 'Vật chứng trong thi hành án dân sự', icon: Package, color: 'orange', lastMonth: 189234, thisMonth: 153554 },
      { id: '13', title: 'Thẩm định giá tài sản trong thi hành án dân sự', icon: Scale, color: 'blue', lastMonth: 167890, thisMonth: 198765 },
      { id: '14', title: 'Đấu giá tài sản trong thi hành án dân sự', icon: Megaphone, color: 'green', lastMonth: 145234, thisMonth: 176543 },
      { id: '15', title: 'Giải quyết khiếu nại, tố cáo trong thi hành án dân sự', icon: MessageSquare, color: 'purple', lastMonth: 123678, thisMonth: 145890 },
      { id: '16', title: 'Hướng dẫn nghiệp vụ trong thi hành án dân sự', icon: BookOpen, color: 'orange', lastMonth: 112345, thisMonth: 134567 },
    ];

    return data.map(item => {
      const total = item.lastMonth + item.thisMonth;
      const change = ((item.thisMonth - item.lastMonth) / item.lastMonth * 100).toFixed(1);
      const changeStr = change.startsWith('-') ? change : `+${change}`;
      
      const totalCollected = total;
      const totalProcessed = Math.floor(total * (0.95 + Math.random() * 0.04));
      const processingRate = Math.floor((totalProcessed / totalCollected) * 100);
      
      return {
        id: item.id,
        title: item.title,
        value: total.toLocaleString(),
        change: `${changeStr}%`,
        icon: item.icon,
        color: item.color,
        lastMonth: item.lastMonth,
        thisMonth: item.thisMonth,
        totalCollected,
        totalProcessed,
        processingRate,
      };
    });
  };

  const stats = useMemo(() => generateData(), []);

  if (mode === 'xử lý') {
    return <GenericProcessingPage systemName="CSDL thi hành án dân sự" datasets={stats.map((s, idx) => ({ id: s.id || `item_${idx}`, name: s.title }))} />;
  }

  const sidebarItems = stats.map(s => ({
    id: s.id,
    label: s.title
  }));

  return (
    <DatabasePageTemplate
      title="Dữ liệu CSDL thi hành án dân sự"
      description="Quản lý và xem chi tiết dữ liệu thi hành án dân sự"
      onBack={onBack}
      innerSidebarItems={sidebarItems}
      activeId={selectedId}
      onSelectDataType={(id) => setSelectedId(id)}
      stretchHeight
    >
      <div className="mt-4 flex-1 flex flex-col min-h-0">
        <CivilJudgmentInfoModal
          isOpen={true}
          onClose={() => {}}
          isInline={true}
          title={stats.find(s => s.id === selectedId)?.title || 'Dữ liệu CSDL thi hành án dân sự'}
          datasetId={selectedId}
        />
      </div>
    </DatabasePageTemplate>
  );
}