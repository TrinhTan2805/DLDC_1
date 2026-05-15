import { useState, useMemo } from 'react';
import { FileText, BookOpen, GitBranch, FileCheck, FolderTree } from 'lucide-react';
import { DatabasePageTemplate } from '../collection/DatabasePageTemplate';
import { LegalNationalModal } from '../../legal-national/LegalNationalModal';
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

interface LegalNationalPageProps {
  onBack?: () => void;
  mode?: 'thu thập' | 'xử lý';
  context?: 'thu thập' | 'chia sẻ';
}

export function LegalNationalPage({ mode = 'thu thập', context = 'thu thập', onBack }: LegalNationalPageProps) {
  // Generate realistic random data for National Legal Database (5 types)
  const stats = useMemo(() => {
    const data = [
      { id: '1', title: 'Dữ liệu Văn bản quy phạm pháp luật', icon: FileText, color: 'blue', lastMonth: 1845678, thisMonth: 2179200 },
      { id: '2', title: 'Dữ liệu Nội dung của văn bản quy phạm pháp luật', icon: BookOpen, color: 'green', lastMonth: 2587543, thisMonth: 2946447 },
      { id: '3', title: 'Dữ liệu Quan hệ giữa các điều khoản trong các văn bản quy phạm pháp luật', icon: GitBranch, color: 'purple', lastMonth: 1698234, thisMonth: 1926644 },
      { id: '4', title: 'Dữ liệu Văn bản hợp nhất', icon: FileCheck, color: 'orange', lastMonth: 1456789, thisMonth: 1734567 },
      { id: '5', title: 'Dữ liệu Hệ thống hóa văn bản quy phạm pháp luật', icon: FolderTree, color: 'blue', lastMonth: 1234567, thisMonth: 1456789 },
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
    return <GenericProcessingPage systemName="CSDL quốc gia về PL" datasets={stats.map((s) => ({ id: s.id, name: s.title }))} />;
  }

  const sidebarItems = stats.map(s => ({ id: s.id, label: s.title }));

  return (
    <DatabasePageTemplate
      title="Dữ liệu CSDL quốc gia về PL"
      description="Quản lý và xem chi tiết dữ liệu văn bản quy phạm pháp luật"
      onBack={onBack}
      innerSidebarItems={sidebarItems}
      activeId={selectedId}
      onSelectDataType={(id) => setSelectedId(id)}
    >
      <div className="mt-4">
        <LegalNationalModal
          isOpen={true}
          onClose={() => {}}
          isInline={true}
          title={stats.find(s => s.id === selectedId)?.title || ''}
        />
      </div>
    </DatabasePageTemplate>
  );
}