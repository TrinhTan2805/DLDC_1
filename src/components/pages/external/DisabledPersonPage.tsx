import { DatabaseTemplate } from '../DatabaseTemplate';

export function DisabledPersonPage({ onBack }: { onBack?: () => void }) {
  return <DatabaseTemplate title="Danh sách hồ sơ" categoryName="CSDL BTXH & GN - Thông tin về người khuyết tật" onBack={onBack} />;
}