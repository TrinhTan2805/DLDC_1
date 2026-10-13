"use client";

import { CircleCheck, CircleX, TriangleAlert, Info } from "lucide-react";
import { Toaster as Sonner, ToasterProps } from "sonner";

// Toast theo compomennt.md mục 5.5: góc trên phải, nền đặc theo trạng thái, chữ/icon/nút X trắng,
// [icon 20px] Nội dung 14px/500 [X]; tự ẩn 4 giây (lỗi 6 giây — truyền { duration: 6000 } khi gọi toast.error nếu cần)
const ICON = "w-5 h-5";

const Toaster = ({ ...props }: ToasterProps) => (
  <Sonner
    theme="light"
    position="top-right"
    offset={12}
    closeButton
    duration={4000}
    icons={{
      success: <CircleCheck className={ICON} />,
      error: <CircleX className={ICON} />,
      warning: <TriangleAlert className={ICON} />,
      info: <Info className={ICON} />,
    }}
    style={{ "--width": "420px" } as React.CSSProperties}
    toastOptions={{
      unstyled: true,
      classNames: {
        toast:
          "flex items-center gap-3 w-fit max-w-[420px] min-h-11 px-4 py-3 rounded-lg border-0 bg-[#334155] text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] text-[14px] font-medium leading-5 font-[inherit]",
        success: "!bg-[#16A34A]",
        error: "!bg-[#DC2626]",
        warning: "!bg-[#D97706]",
        info: "!bg-[#155DFC]",
        icon: "!m-0 !w-5 !h-5 shrink-0 flex items-center justify-center text-white",
        content: "flex-1 min-w-0",
        title: "whitespace-pre-line break-words",
        description: "text-[13px] font-normal text-white/90 whitespace-pre-line",
        actionButton: "shrink-0 h-7 px-2.5 rounded-md bg-white/20 hover:bg-white/30 text-white text-[13px] font-medium cursor-pointer",
        cancelButton: "shrink-0 h-7 px-2.5 rounded-md bg-transparent hover:bg-white/15 text-white text-[13px] cursor-pointer",
        closeButton:
          "!static !order-last !transform-none !w-6 !h-6 shrink-0 !m-0 !p-0 flex items-center justify-center !bg-transparent !border-0 !text-white rounded hover:!bg-white/15 cursor-pointer [&_svg]:!w-4 [&_svg]:!h-4",
      },
    }}
    {...props}
  />
);

export { Toaster };
