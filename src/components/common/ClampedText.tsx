import { useRef, useState } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';

interface ClampedTextProps {
  text: string;
  className?: string;
}

// Văn bản tối đa 2 dòng, vượt quá hiển thị "..." và chỉ khi bị cắt mới hiện tooltip nội dung đầy đủ
export function ClampedText({ text, className = '' }: ClampedTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  // Kiểm tra lúc rê chuột để luôn đúng sau khi font tải xong hoặc độ rộng cột thay đổi
  const isTruncated = () => !!ref.current && ref.current.scrollHeight > ref.current.clientHeight + 1;

  return (
    <Tooltip open={open} onOpenChange={(next) => setOpen(next && isTruncated())}>
      <TooltipTrigger asChild>
        <div ref={ref} className={`line-clamp-2 ${className}`}>{text}</div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[360px] bg-slate-900 text-white text-[12px] break-words">{text}</TooltipContent>
    </Tooltip>
  );
}
