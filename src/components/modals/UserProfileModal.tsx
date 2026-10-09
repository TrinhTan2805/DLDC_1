import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { Portal } from '../common/Portal';
import { Badge, BTN_OUTLINE, BTN_GHOST_ICON, FIELD_LABEL, FIELD_VALUE, SECTION_TITLE } from '../pages/collection/collectionUi';
import { CURRENT_USER } from '../user/currentUser';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Thông tin cá nhân — cùng bố cục, trường dữ liệu với "Chi tiết người dùng" (Quản lý người dùng):
// modal xem chi tiết chiều cao cố định, thân tự cuộn (5.4); cặp Nhãn – Giá trị (5.17); Badge (5.8)
export function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  if (!isOpen) return null;
  const user = CURRENT_USER;

  const Field = ({ label, children }: { label: string; children: ReactNode }) => (
    <div className="space-y-1">
      <div className={FIELD_LABEL}>{label}</div>
      {children}
    </div>
  );

  return (
    <Portal>
      <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="user-profile-title"
          // Modal ít trường → cao theo nội dung (ngoại lệ mục 5.4), tối đa 90vh rồi thân tự cuộn
          className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <div className="shrink-0 px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4">
            <h3 id="user-profile-title" className="text-[16px] font-semibold text-[#020817]">Thông tin cá nhân</h3>
            <button type="button" onClick={onClose} className={BTN_GHOST_ICON} title="Đóng" aria-label="Đóng">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-6 py-4 space-y-4">
            {/* Thông tin cơ bản */}
            <div className="rounded-2xl border border-[#E2E8F0] p-4">
              <h4 className={SECTION_TITLE}>
                <span className="w-1 h-4 bg-blue-600 rounded-full shrink-0" />
                Thông tin cơ bản
              </h4>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <Field label="Họ và tên"><div className={`${FIELD_VALUE} break-words`}>{user.name || '-'}</div></Field>
                <Field label="Tên đăng nhập"><div className={`${FIELD_VALUE} break-words`}>{user.username || '-'}</div></Field>
                <Field label="Email"><div className={`${FIELD_VALUE} break-words`}>{user.email || '-'}</div></Field>
                <Field label="Số điện thoại"><div className={FIELD_VALUE}>{user.phone || '-'}</div></Field>
                <Field label="Đơn vị"><div className={`${FIELD_VALUE} break-words`}>{user.department || '-'}</div></Field>
                <Field label="Vai trò">
                  {user.role ? <Badge label={user.role} variant="blue" /> : <div className={FIELD_VALUE}>-</div>}
                </Field>
                <Field label="Trạng thái">
                  <Badge
                    label={user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    variant={user.status === 'active' ? 'green' : 'slate'}
                  />
                </Field>
                <Field label="Đăng nhập gần nhất"><div className={FIELD_VALUE}>{user.lastLogin || '-'}</div></Field>
                <Field label="Ngày tạo tài khoản"><div className={FIELD_VALUE}>{user.createdDate || '-'}</div></Field>
              </div>
            </div>
          </div>

          <div className="shrink-0 px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3">
            <button type="button" onClick={onClose} className={BTN_OUTLINE}>Đóng</button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
