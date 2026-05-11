import { useState } from 'react';
import { GenericProcessingPage } from '../processing/GenericProcessingPage';
import { FileText, FileCheck, FileSearch, Users, BookOpen, MessageSquare, Scale, UserCheck, Stamp, FileBarChart, ClipboardList, Briefcase, Eye, Gavel, Package, Shield } from 'lucide-react';
import { DatabaseTemplate } from '../DatabaseTemplate';

interface StatCard {
  id: string;
  title: string;
  value: string;
  change: string;
  icon: any;
  color: string;
  lastMonth: number;
  thisMonth: number;
  totalCollected: number;
  totalProcessed: number;
  processingRate: number;
}

interface StatisticsCollectionPageProps {
  mode?: 'thu thập' | 'xử lý';
  context?: 'thu thập' | 'chia sẻ';
  onBack?: () => void;
}

export function StatisticsCollectionPage({ mode = 'thu thập', context = 'thu thập', onBack }: StatisticsCollectionPageProps) {
  
  // Generate realistic random data for Statistics Collection (21 types)
  const generateData = () => {
    const data = [
      { id: '1', title: 'Xây dựng văn bản quy phạm pháp luật', icon: FileText, color: 'blue', lastMonth: 856234, thisMonth: 989123 },
      { id: '2', title: 'Kiểm tra văn bản quy phạm pháp luật', icon: FileCheck, color: 'green', lastMonth: 945678, thisMonth: 1078456 },
      { id: '3', title: 'Rà soát văn bản quy phạm pháp luật', icon: FileSearch, color: 'purple', lastMonth: 823456, thisMonth: 956789 },
      { id: '4', title: 'Tổ chức và người làm công tác pháp chế', icon: Users, color: 'orange', lastMonth: 678234, thisMonth: 789456 },
      { id: '5', title: 'Phổ biến, giáo dục pháp luật', icon: BookOpen, color: 'blue', lastMonth: 1234567, thisMonth: 1456789 },
      { id: '6', title: 'Hòa giải ở cơ sở', icon: MessageSquare, color: 'green', lastMonth: 567890, thisMonth: 678901 },
      { id: '7', title: 'Chuẩn tiếp cận pháp luật', icon: Scale, color: 'purple', lastMonth: 445678, thisMonth: 534567 },
      { id: '8', title: 'Hộ tịch', icon: UserCheck, color: 'orange', lastMonth: 2345678, thisMonth: 2789012 },
      { id: '9', title: 'Chứng thực', icon: Stamp, color: 'blue', lastMonth: 1789234, thisMonth: 2123456 },
      { id: '10', title: 'Lý lịch tư pháp', icon: FileBarChart, color: 'green', lastMonth: 987654, thisMonth: 1156789 },
      { id: '11', title: 'Nuôi con nuôi', icon: Users, color: 'purple', lastMonth: 234567, thisMonth: 278901 },
      { id: '12', title: 'Trợ giúp pháp lý', icon: MessageSquare, color: 'orange', lastMonth: 678901, thisMonth: 789123 },
      { id: '13', title: 'Đăng ký giao dịch bảo đảm', icon: ClipboardList, color: 'blue', lastMonth: 1456789, thisMonth: 1678901 },
      { id: '14', title: 'Luật sư', icon: Briefcase, color: 'green', lastMonth: 567890, thisMonth: 645678 },
      { id: '15', title: 'Công chứng', icon: Stamp, color: 'purple', lastMonth: 1234567, thisMonth: 1456789 },
      { id: '16', title: 'Giám định tư pháp', icon: Eye, color: 'orange', lastMonth: 345678, thisMonth: 412345 },
      { id: '17', title: 'Đấu giá tài sản', icon: Gavel, color: 'blue', lastMonth: 789012, thisMonth: 923456 },
      { id: '18', title: 'Trọng tài thương mại', icon: Scale, color: 'green', lastMonth: 456789, thisMonth: 534567 },
      { id: '19', title: 'Hòa giải thương mại', icon: MessageSquare, color: 'purple', lastMonth: 345678, thisMonth: 412345 },
      { id: '20', title: 'Quản lý thanh lý tài sản', icon: Package, color: 'orange', lastMonth: 567890, thisMonth: 656789 },
      { id: '21', title: 'Tương trợ tư pháp', icon: Shield, color: 'blue', lastMonth: 456789, thisMonth: 545678 },
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

  const stats = generateData();

  if (mode === 'xử lý') {
    return <GenericProcessingPage systemName="Thu thập số liệu thống kê" datasets={stats.map((s, idx) => ({ id: s.id || `item_${idx}`, name: s.title }))} />;
  }

  return (
    <DatabaseTemplate
      title="Dữ liệu Thu thập số liệu thống kê"
      categoryName="Thống kê"
      stats={stats}
      context={context}
      mode={mode}
      onBack={onBack}
    />
  );
}
