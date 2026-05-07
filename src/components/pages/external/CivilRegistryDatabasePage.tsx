import * as React from 'react';
import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { Calendar, Download, FileUser, UserCheck, Users, Baby, Heart, UserX, UsersRound, FileEdit, FileCheck, FileX, ChevronLeft, Search, ArrowUpRight } from 'lucide-react';
import { DatabasePageTemplate } from '../collection/DatabasePageTemplate';
import { DataDetailModal } from '../../DataDetailModal';
import { BirthCertDetailModal } from '../../BirthCertDetailModal';
import { MarriageDetailModal } from '../../MarriageDetailModal';
import { MaritalStatusCertModal } from '../../MaritalStatusCertModal';
import { DeathCertModal } from '../../DeathCertModal';
import { ParentChildRecognitionModal } from '../../ParentChildRecognitionModal';
import { AdoptionCertModal } from '../../AdoptionCertModal';
import { GuardianshipCertModal } from '../../GuardianshipCertModal';
import { TerminationGuardianshipCertModal } from '../../TerminationGuardianshipCertModal';
import { CivilRegistryChangeModal } from '../../CivilRegistryChangeModal';
import { GuardianshipMonitoringModal } from '../../GuardianshipMonitoringModal';
import { TerminationGuardianshipMonitoringModal } from '../../TerminationGuardianshipMonitoringModal';

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
  collected?: number;
  processed?: number;
  shared?: number;
}

interface CivilRegistryDatabasePageProps {
  mode?: 'thu thập' | 'xử lý';
  context?: 'thu thập' | 'chia sẻ';
  onBack?: () => void;
}

export function CivilRegistryDatabasePage({ mode = 'thu thập', context = 'thu thập', onBack }: CivilRegistryDatabasePageProps) {

  // Generate realistic random data
  const generateData = () => {
    const data = [
      { id: '1', title: 'Hồ sơ khai sinh', icon: Baby, color: 'blue', lastMonth: 1245, thisMonth: 2179, collected: 3090, processed: 2987, shared: 2490 },
      { id: '2', title: 'Hồ sơ đăng ký kết hôn', icon: Heart, color: 'green', lastMonth: 1678543, thisMonth: 1746447, collected: 4567, processed: 4321, shared: 3890 },
      { id: '3', title: 'Hồ sơ cấp GĐKN kết hôn', icon: FileCheck, color: 'purple', lastMonth: 1598234, thisMonth: 1826644, collected: 5234, processed: 5011, shared: 4756 },
      { id: '4', title: 'Hồ sơ đăng ký khai tử', icon: FileX, color: 'orange', lastMonth: 1612345, thisMonth: 1812533, collected: 2876, processed: 2654, shared: 2398 },
      { id: '5', title: 'Hồ sơ DK nhận cha, mẹ, con', icon: Users, color: 'blue', lastMonth: 1545678, thisMonth: 1879200, collected: 6123, processed: 5876, shared: 5432 },
      { id: '6', title: 'Hồ sơ đăng ký nuôi con nuôi', icon: UserCheck, color: 'green', lastMonth: 1687234, thisMonth: 1737644, collected: 1987, processed: 1865, shared: 1654 },
      { id: '7', title: 'Hồ sơ đăng ký giám hộ', icon: FileUser, color: 'purple', lastMonth: 2234567, thisMonth: 1190311, collected: 3456, processed: 3298, shared: 2987 },
      { id: '8', title: 'Hồ sơ DK chấm dứt giám hộ', icon: UserX, color: 'orange', lastMonth: 1723456, thisMonth: 1701422, collected: 2345, processed: 2198, shared: 1976 },
      { id: '9', title: 'Hồ sơ DK thay đổi TT hộ tịch, văn danh dự dân tộc', icon: FileEdit, color: 'blue', lastMonth: 2156789, thisMonth: 1268089, collected: 4876, processed: 4632, shared: 4123 },
      { id: '10', title: 'Hồ sơ đăng ký chấm dứt giám sát việc giám hộ', icon: FileCheck, color: 'green', lastMonth: 1934567, thisMonth: 1490311, collected: 3765, processed: 3543, shared: 3198 },
      { id: '11', title: 'Hồ sơ đăng ký giám sát việc giám hộ', icon: FileCheck, color: 'purple', lastMonth: 1456789, thisMonth: 1968089, collected: 5432, processed: 5187, shared: 4876 },
      { id: '12', title: 'Hồ sơ ly hôn/hủy kết hôn ở nước ngoài', icon: UsersRound, color: 'orange', lastMonth: 1889234, thisMonth: 1535644, collected: 2654, processed: 2487, shared: 2198 },
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
        collected: item.collected,
        processed: item.processed,
        shared: item.shared,
      };
    });
  };

  const stats = useMemo(() => generateData(), []);

  // Set default selected stat to the first item
  const [selectedStat, setSelectedStat] = useState<StatCard | null>(stats[0]);
  const [timeFilter, setTimeFilter] = useState<'thisMonth' | 'lastMonth' | '3months' | '6months'>('thisMonth');

  const sidebarItems = stats.map(s => ({ id: s.id, label: `Bộ dữ liệu ${s.title.toLowerCase()}` }));

  return (
    <DatabasePageTemplate
      title="Danh sách dữ liệu"
      description="Quản lý và xem chi tiết dữ liệu hộ tịch điện tử"
      onBack={onBack}
      innerSidebarItems={sidebarItems}
      activeId={selectedStat?.id}
      onSelectDataType={(id) => {
        const stat = stats.find(s => s.id === id);
        if (stat) setSelectedStat(stat);
      }}
    >
      <div className="mt-4">
        {selectedStat && selectedStat.id === '1' && (
          <BirthCertDetailModal
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

        {selectedStat && selectedStat.id === '2' && (
          <MarriageDetailModal
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

        {selectedStat && selectedStat.id === '3' && (
          <MaritalStatusCertModal
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

        {selectedStat && selectedStat.id === '4' && (
          <DeathCertModal
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

        {selectedStat && selectedStat.id === '5' && (
          <ParentChildRecognitionModal
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

        {selectedStat && selectedStat.id === '6' && (
          <AdoptionCertModal
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

        {selectedStat && selectedStat.id === '7' && (
          <GuardianshipCertModal
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

        {selectedStat && selectedStat.id === '8' && (
          <TerminationGuardianshipCertModal
            isOpen={true}
            onClose={() => {}}
            title={selectedStat.title}
            totalRecords={selectedStat.lastMonth + selectedStat.thisMonth}
            newRecords={selectedStat.thisMonth}
            updatedRecords={Math.floor(selectedStat.thisMonth * 0.2)}
            errorRecords={Math.floor(selectedStat.thisMonth * 0.05)}
          />
        )}

        {selectedStat && selectedStat.id === '9' && (
          <CivilRegistryChangeModal
            isOpen={true}
            onClose={() => {}}
            title={selectedStat.title}
            totalRecords={selectedStat.lastMonth + selectedStat.thisMonth}
            newRecords={selectedStat.thisMonth}
            updatedRecords={Math.floor(selectedStat.thisMonth * 0.2)}
            errorRecords={Math.floor(selectedStat.thisMonth * 0.05)}
          />
        )}

        {selectedStat && selectedStat.id === '10' && (
          <TerminationGuardianshipMonitoringModal
            isOpen={true}
            onClose={() => {}}
            title={selectedStat.title}
            totalRecords={selectedStat.lastMonth + selectedStat.thisMonth}
            newRecords={selectedStat.thisMonth}
            updatedRecords={Math.floor(selectedStat.thisMonth * 0.2)}
            errorRecords={Math.floor(selectedStat.thisMonth * 0.05)}
          />
        )}
        
        {selectedStat && selectedStat.id === '11' && (
          <GuardianshipMonitoringModal
            isOpen={true}
            onClose={() => {}}
            title={selectedStat.title}
            totalRecords={selectedStat.lastMonth + selectedStat.thisMonth}
            newRecords={selectedStat.thisMonth}
            updatedRecords={Math.floor(selectedStat.thisMonth * 0.2)}
            errorRecords={Math.floor(selectedStat.thisMonth * 0.05)}
          />
        )}

        {selectedStat && selectedStat.id !== '1' && selectedStat.id !== '2' && selectedStat.id !== '3' && selectedStat.id !== '4' && selectedStat.id !== '5' && selectedStat.id !== '6' && selectedStat.id !== '7' && selectedStat.id !== '8' && selectedStat.id !== '9' && selectedStat.id !== '10' && selectedStat.id !== '11' && (
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