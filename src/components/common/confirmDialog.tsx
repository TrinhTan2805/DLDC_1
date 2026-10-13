import { useEffect, useState, type ReactNode } from 'react';
import { ConfirmModal } from './ConfirmModal';

// Popup xác nhận gọi kiểu hàm (thay window.confirm của trình duyệt) — compomennt.md mục 5.4.1.
//   if (await confirmDialog('Bạn có chắc chắn muốn xóa…?', { type: 'delete', title: 'Xác nhận xóa', confirmText: 'Xóa' })) { … }
// <ConfirmDialogHost /> đặt 1 lần ở App.tsx.

export interface ConfirmDialogOptions {
  type?: 'delete' | 'warning' | 'info' | 'success';
  title?: string;
  subtitle?: string;
  confirmText?: string;
  cancelText?: string;
}

interface PendingDialog extends ConfirmDialogOptions {
  message: ReactNode;
  resolve: (ok: boolean) => void;
}

let showDialog: ((d: PendingDialog) => void) | null = null;

export function confirmDialog(message: ReactNode, options: ConfirmDialogOptions = {}): Promise<boolean> {
  return new Promise(resolve => {
    if (!showDialog) { resolve(false); return; }
    showDialog({ message, resolve, ...options });
  });
}

export function ConfirmDialogHost() {
  const [dialog, setDialog] = useState<PendingDialog | null>(null);

  useEffect(() => {
    showDialog = (d) => setDialog(prev => { prev?.resolve(false); return d; });
    return () => { showDialog = null; };
  }, []);

  if (!dialog) return null;

  // ConfirmModal gọi onConfirm rồi onClose → chỉ lấy kết quả đầu tiên
  let settled = false;
  const finish = (ok: boolean) => {
    if (settled) return;
    settled = true;
    dialog.resolve(ok);
    setDialog(null);
  };

  return (
    <ConfirmModal
      isOpen
      type={dialog.type ?? 'info'}
      title={dialog.title ?? 'Xác nhận'}
      subtitle={dialog.subtitle ?? ''}
      message={dialog.message}
      confirmText={dialog.confirmText ?? 'Đồng ý'}
      cancelText={dialog.cancelText ?? 'Hủy'}
      onConfirm={() => finish(true)}
      onClose={() => finish(false)}
    />
  );
}
