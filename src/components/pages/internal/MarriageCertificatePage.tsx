import { Heart } from 'lucide-react';
import { DatabaseTemplate } from '../DatabaseTemplate';

export function MarriageCertificatePage({ mode = 'thu thập', context = 'thu thập', onBack }: any) {
  const stats = [
    { id: '1', title: 'Giấy đăng ký kết hôn', icon: Heart, color: 'red', lastMonth: 1245, thisMonth: 2179 },
    { id: '2', title: 'Bản khai hôn nhân', icon: Heart, color: 'blue', lastMonth: 850, thisMonth: 1120 },
  ];

  return (
    <DatabaseTemplate
      title="Dữ liệu đăng ký kết hôn"
      categoryName="Hôn nhân"
      stats={stats}
      context={context}
      mode={mode}
      onBack={onBack}
    />
  );
}

