import { useState } from 'react';
import { GenericProcessingPage } from '../processing/GenericProcessingPage';
import { FileText, Gavel, User, Shield, FileCheck, Receipt, Package, Scale, Megaphone, MessageSquare, BookOpen, Search as SearchIcon } from 'lucide-react';
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

interface DatabaseRecord {
  name: string;
  category: string;
  todayCount: number;
  errorCount: number;
}

interface CivilJudgmentPageProps {
  mode?: 'thu thập' | 'xử lý';
  context?: 'thu thập' | 'chia sẻ';
  onBack?: () => void;
}

export function CivilJudgmentPage({ mode = 'thu thập', context = 'thu thập', onBack }: CivilJudgmentPageProps) {
  // Generate realistic random data for 16 categories
  const generateData = () => {
    const data = [
      { id: '1', title: 'Dữ liệu Yêu cầu thi hành án của cá nhân, cơ quan, tổ chức', icon: FileText, color: 'blue', lastMonth: 145678, thisMonth: 179200 },
      { id: '2', title: 'Dữ liệu Quyết định thi hành án dân sự', icon: Gavel, color: 'green', lastMonth: 187543, thisMonth: 214647 },
      { id: '3', title: 'Dữ liệu Người phải thi hành án, người được thi hành án, người có quyền lợi nghĩa vụ liên quan', icon: User, color: 'purple', lastMonth: 298234, thisMonth: 326644 },
      { id: '4', title: 'Dữ liệu Nghĩa vụ thi hành án', icon: FileCheck, color: 'orange', lastMonth: 112345, thisMonth: 181253 },
      { id: '5', title: 'Dữ liệu Trạng thái thi hành án', icon: Shield, color: 'blue', lastMonth: 245678, thisMonth: 279200 },
      { id: '6', title: 'Dữ liệu Tài sản thi hành án', icon: Package, color: 'green', lastMonth: 187234, thisMonth: 237644 },
      { id: '7', title: 'Dữ liệu Xác minh điều kiện trong thi hành án dân sự', icon: SearchIcon, color: 'purple', lastMonth: 134567, thisMonth: 190311 },
      { id: '8', title: 'Dữ liệu Cưỡng chế thi hành án trong thi hành án dân sự', icon: Shield, color: 'orange', lastMonth: 123456, thisMonth: 170142 },
      { id: '9', title: 'Dữ liệu Áp dụng biện pháp bảo đảm trong thi hành án dân sự', icon: FileCheck, color: 'blue', lastMonth: 156789, thisMonth: 168089 },
      { id: '10', title: 'Dữ liệu Chứng từ nghiệp vụ trong thi hành án dân sự', icon: FileText, color: 'green', lastMonth: 134567, thisMonth: 149031 },
      { id: '11', title: 'Dữ liệu Biên lai thu tiền thi hành án dân sự', icon: Receipt, color: 'purple', lastMonth: 145678, thisMonth: 196808 },
      { id: '12', title: 'Dữ liệu Vật chứng trong thi hành án dân sự', icon: Package, color: 'orange', lastMonth: 189234, thisMonth: 153554 },
      { id: '13', title: 'Dữ liệu Thẩm định giá tài sản trong thi hành án dân sự', icon: Scale, color: 'blue', lastMonth: 167890, thisMonth: 198765 },
      { id: '14', title: 'Dữ liệu Đấu giá tài sản trong thi hành án dân sự', icon: Megaphone, color: 'green', lastMonth: 145234, thisMonth: 176543 },
      { id: '15', title: 'Dữ liệu Giải quyết khiếu nại, tố cáo trong thi hành án dân sự', icon: MessageSquare, color: 'purple', lastMonth: 123678, thisMonth: 145890 },
      { id: '16', title: 'Dữ liệu Hướng dẫn nghiệp vụ trong thi hành án dân sự', icon: BookOpen, color: 'orange', lastMonth: 112345, thisMonth: 134567 },
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
    return <GenericProcessingPage systemName="CSDL thi hành án dân sự" datasets={stats.map((s, idx) => ({ id: s.id || `item_${idx}`, name: s.title }))} />;
  }

  const tableData: DatabaseRecord[] = [
    { name: 'Dữ liệu Yêu cầu thi hành án', category: 'CSDL thi hành án dân sự', todayCount: 20000, errorCount: 30 },
    { name: 'Dữ liệu Quyết định thi hành án', category: 'CSDL thi hành án dân sự', todayCount: 20000, errorCount: 30 },
    { name: 'Dữ liệu Người phải thi hành án', category: 'CSDL thi hành án dân sự', todayCount: 20000, errorCount: 30 },
    { name: 'Dữ liệu Nghĩa vụ thi hành án', category: 'CSDL thi hành án dân sự', todayCount: 20000, errorCount: 30 },
  ];

  // Chart data matching stats totals
  const chartData = stats.map((stat, index) => {
    const names = ['Yêu cầu THA', 'Quyết định THA', 'Người THA', 'Nghĩa vụ THA', 'Trạng thái THA', 'Tài sản THA', 'Xác minh', 'Cưỡng chế', 'Biện pháp BĐ', 'Chứng từ', 'Biên lai', 'Vật chứng', 'Thẩm định giá', 'Đấu giá', 'Khiếu nại', 'Hướng dẫn'];
    return {
      name: names[index] || `Dữ liệu ${index + 1}`,
      lastMonth: stat.lastMonth,
      thisMonth: stat.thisMonth,
    };
  });

  return (
    <DatabaseTemplate
      title="Dữ liệu CSDL thi hành án dân sự"
      categoryName="Thi hành án dân sự"
      stats={stats}
      context={context}
      mode={mode}
      onBack={onBack}
    />
  );
}