import { Flag } from 'lucide-react';
import { DatabaseTemplate } from '../DatabaseTemplate';

export function NationalitySystemPage({ mode = 'thu thập', context = 'thu thập', onBack }: any) {
  const stats = [
    { id: '1', title: 'Hồ sơ đăng ký quốc tịch', icon: Flag, color: 'red', lastMonth: 1245, thisMonth: 2179 },
    { id: '2', title: 'Hồ sơ nhập quốc tịch', icon: Flag, color: 'blue', lastMonth: 450, thisMonth: 620 },
    { id: '3', title: 'Hồ sơ thôi quốc tịch', icon: Flag, color: 'orange', lastMonth: 300, thisMonth: 150 },
  ];

  return (
    <DatabaseTemplate
      title="Dữ liệu đăng ký quốc tịch"
      categoryName="Quốc tịch"
      stats={stats}
      context={context}
      mode={mode}
      onBack={onBack}
    />
  );
}

