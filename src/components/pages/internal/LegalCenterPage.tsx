import { DatabaseTemplate } from '../DatabaseTemplate';

export function LegalCenterPage({ onBack }: { onBack?: () => void }) {
  return <DatabaseTemplate title="Danh sách hồ sơ" categoryName="HTTT TG Pháp lý" onBack={onBack} />;
}
