import { CheckCircle2, XCircle } from 'lucide-react';

interface ReviewResultCardProps {
  status: 'approved' | 'rejected';
  comment?: string;
  label?: string;
  tone?: 'emerald' | 'red' | 'amber';
}

const TONE_STYLES: Record<'emerald' | 'red' | 'amber', { bg: string; border: string; text: string }> = {
  emerald: { bg: 'bg-emerald-50/60', border: 'border-emerald-200', text: 'text-emerald-700' },
  red: { bg: 'bg-red-50/60', border: 'border-red-200', text: 'text-red-600' },
  amber: { bg: 'bg-amber-50/60', border: 'border-amber-200', text: 'text-amber-700' },
};

export function ReviewResultCard({ status, comment, label, tone }: ReviewResultCardProps) {
  const isApproved = status === 'approved';
  const style = TONE_STYLES[tone || (isApproved ? 'emerald' : 'red')];
  return (
    <div className={`rounded-xl border p-4 ${style.bg} ${style.border}`}>
      <div className={`flex items-center gap-2 text-[13px] font-semibold mb-1.5 ${style.text}`}>
        {isApproved ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
        {label || (isApproved ? 'Ý kiến phê duyệt' : 'Lý do từ chối')}
      </div>
      <div className="text-[13px] text-slate-700 leading-relaxed whitespace-pre-wrap">
        {comment || <span className="text-slate-400 italic">Không có ghi chú</span>}
      </div>
    </div>
  );
}
