import { CheckCircle2, XCircle } from 'lucide-react';
import { FIELD_LABEL, FIELD_VALUE } from '../../../collection/collectionUi';

interface ReviewResultCardProps {
  status: 'approved' | 'rejected';
  comment?: string;
  label?: string;
  tone?: 'emerald' | 'red' | 'amber';
}

// Hộp kết quả phê duyệt (banner): nền nhạt + viền cùng tông, bo 8px, chữ 13px #020817, icon theo tông
const TONE_STYLES: Record<'emerald' | 'red' | 'amber', { box: string; icon: string }> = {
  emerald: { box: 'bg-[#F0FDF4] border-[#DCFCE7]', icon: 'text-[#16A34A]' },
  red: { box: 'bg-[#FEF2F2] border-[#FEE2E2]', icon: 'text-[#DC2626]' },
  amber: { box: 'bg-[#FFF7ED] border-[#FED7AA]', icon: 'text-[#D97706]' },
};

export function ReviewResultCard({ status, comment, label, tone }: ReviewResultCardProps) {
  const isApproved = status === 'approved';
  const style = TONE_STYLES[tone || (isApproved ? 'emerald' : 'red')];
  return (
    <div className={`rounded-lg border p-4 ${style.box}`}>
      <div className={`flex items-center gap-2 ${FIELD_LABEL}`}>
        {isApproved ? <CheckCircle2 className={`w-4 h-4 ${style.icon}`} /> : <XCircle className={`w-4 h-4 ${style.icon}`} />}
        {label || (isApproved ? 'Ý kiến phê duyệt' : 'Lý do từ chối')}
      </div>
      <div className={`${FIELD_VALUE} mt-1 whitespace-pre-wrap`}>
        {comment || <span className="text-[#94A3B8]">Không có ghi chú</span>}
      </div>
    </div>
  );
}
