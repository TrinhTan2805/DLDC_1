import { DatabaseTemplate } from '../DatabaseTemplate';

export function LegalCenterPage({ onBack, mode, context }: { onBack?: () => void, mode?: string, context?: string }) {
  return <DatabaseTemplate title="Danh sách hồ sơ" categoryName="HTTT TG Pháp lý" onBack={onBack} />;
}
