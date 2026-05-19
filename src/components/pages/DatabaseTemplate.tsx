import { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { GenericProcessingPage } from './processing/GenericProcessingPage';
import { Calendar, Download, FileUser, UserCheck, Users, Baby, Heart, UserX, UsersRound, FileEdit, FileCheck, FileX, ChevronLeft, Search, ArrowUpRight } from 'lucide-react';
import { DataDetailModal } from '../DataDetailModal';
import { DatabasePageTemplate } from './collection/DatabasePageTemplate';

interface StatCard {
  id: string;
  title: string;
  value: string;
  change: string;
  icon: any;
  color: string;
  lastMonth: number;
  thisMonth: number;
  collected?: number;
  processed?: number;
  shared?: number;
}

interface DatabaseRecord {
  name: string;
  category: string;
  todayCount: number;
  errorCount: number;
}

interface DatabaseTemplateProps {
  title?: string;
  categoryName: string;
  mode?: 'thu thập' | 'xử lý';
  context?: 'thu thập' | 'chia sẻ';
  stats?: StatCard[];
  onBack?: () => void;
}

export function DatabaseTemplate({ 
  title = 'Danh sách dữ liệu đã thu thập', 
  categoryName,
  mode = 'thu thập',
  context = 'thu thập',
  stats: providedStats,
  onBack
}: DatabaseTemplateProps) {
  const [selectedStat, setSelectedStat] = useState<StatCard | null>(null);

  // Default stats if none provided
  const generateData = () => {
    const data = [
      { id: '1', title: 'Hồ sơ khai sinh', icon: Baby, color: 'blue', lastMonth: 1245, thisMonth: 2179, collected: 3090, processed: 2987, shared: 2490 },
      { id: '2', title: 'Hồ sơ đăng ký kết hôn', icon: Heart, color: 'green', lastMonth: 1678543, thisMonth: 1746447, collected: 4567, processed: 4321, shared: 3890 },
      { id: '3', title: 'Hồ sơ cấp Giấy xác nhận tình trạng hôn nhân', icon: FileCheck, color: 'purple', lastMonth: 1598234, thisMonth: 1826644, collected: 5234, processed: 5011, shared: 4756 },
      { id: '4', title: 'Hồ sơ đăng ký khai tử', icon: FileX, color: 'orange', lastMonth: 1612345, thisMonth: 1812533, collected: 2876, processed: 2654, shared: 2398 },
      { id: '5', title: 'Hồ sơ DK nhận cha, mẹ, con', icon: Users, color: 'blue', lastMonth: 1545678, thisMonth: 1879200, collected: 6123, processed: 5876, shared: 5432 },
      { id: '6', title: 'Hồ sơ đăng ký nuôi con nuôi', icon: UserCheck, color: 'green', lastMonth: 1687234, thisMonth: 1737644, collected: 1987, processed: 1865, shared: 1654 },
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
        collected: item.collected,
        processed: item.processed,
        shared: item.shared,
      };
    });
  };

  const stats = providedStats || useMemo(() => generateData(), []);

  // Set default selected stat to the first item on mount
  useEffect(() => {
    if (stats.length > 0 && !selectedStat) {
      setSelectedStat(stats[0]);
    }
  }, [stats]);

  const [timeFilter, setTimeFilter] = useState<'thisMonth' | 'lastMonth' | '3months' | '6months'>('thisMonth');

  if (mode === 'xử lý') {
    return <GenericProcessingPage systemName={categoryName} datasets={stats.map((s, idx) => ({ id: s.id || `item_${idx}`, name: s.title }))} />;
  }

  const sidebarItems = stats.map(s => {
    if (s.title.toLowerCase().includes('tình trạng hôn nhân') || s.title.toLowerCase().includes('gđkn')) {
      return { id: s.id, label: 'Bộ dữ liệu hồ sơ cấp Giấy xác nhận tình trạng hôn nhân' };
    }
    if (s.title.startsWith('Dữ liệu ') || s.title.startsWith('Bộ dữ liệu ')) {
      return { id: s.id, label: s.title };
    }
    return { id: s.id, label: `Bộ dữ liệu ${s.title.toLowerCase()}` };
  });

  return (
    <DatabasePageTemplate
      title={title}
      description={`Quản lý và xem chi tiết dữ liệu từ ${categoryName}`}
      onBack={onBack}
      innerSidebarItems={sidebarItems}
      activeId={selectedStat?.id}
      onSelectDataType={(id) => {
        const stat = stats.find(s => s.id === id);
        if (stat) setSelectedStat(stat);
      }}
    >
      <div className="mt-4">
        {selectedStat && (
          <DataDetailModal
            isOpen={true}
            onClose={() => {}}
            isInline={true}
            title={selectedStat.title}
            totalRecords={selectedStat.lastMonth + selectedStat.thisMonth}
            newRecords={selectedStat.thisMonth}
            updatedRecords={Math.floor(selectedStat.thisMonth * 0.2)}
            errorRecords={Math.floor(selectedStat.thisMonth * 0.05)}
          />
        )}
      </div>
    </DatabasePageTemplate>
  );
}