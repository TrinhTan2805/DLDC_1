import React from 'react';
import { createPortal } from 'react-dom';
import { X, Check } from 'lucide-react';
import { BTN_GHOST_ICON, BTN_OUTLINE, BTN_PRIMARY, INPUT_CLS as BASE_INPUT_CLS, VIEW_FIELD_CLS, LABEL_CLS, REQUIRED_MARK } from '../../collection/collectionUi';
// Ô nhập chuẩn + quy tắc ô bị khóa ở màn Xem chi tiết (giá trị đen, placeholder xám)
const INPUT_CLS = `${BASE_INPUT_CLS} ${VIEW_FIELD_CLS}`;

const SELECT_CLS = INPUT_CLS + ' cursor-pointer';

interface ProvisionReconciliationApiModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiData?: any;
  onSave?: (data: any) => void;
}

export function ProvisionReconciliationApiModal({ isOpen, onClose, apiData, onSave }: ProvisionReconciliationApiModalProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        id: apiData?.id || Math.random().toString(36).substr(2, 9),
        name: (e.target as any).name.value,
        targetSystem: (e.target as any).targetSystem.value,
        schedule: (e.target as any).schedule.value,
        linkedApi: (e.target as any).linkedApi.value,
        status: (e.target as any).status.value,
      });
    }
    onClose();
  };

  return createPortal(
    <div style={{ zIndex: 999999 }} className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-[#E2E8F0]">
          <h2 className="text-[16px] font-semibold text-[#020817]">
            {apiData ? 'Cập nhật API Đối soát' : 'Thêm mới API Đối soát'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className={BTN_GHOST_ICON}
            title="Đóng"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="md:col-span-2">
                <label className={LABEL_CLS}>
                  Tên tiến trình đối soát <span className={REQUIRED_MARK}>*</span>
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  className={INPUT_CLS}
                  placeholder="Nhập tên tiến trình đối soát..."
                  defaultValue={apiData ? apiData.name : ''}
                />
              </div>

              <div className="md:col-span-2">
                <label className={LABEL_CLS}>
                  Hệ thống đối tác đối soát <span className={REQUIRED_MARK}>*</span>
                </label>
                <input
                  name="targetSystem"
                  type="text"
                  required
                  className={INPUT_CLS}
                  placeholder="Ví dụ: Hệ thống Bộ Tư pháp, Bộ Tài chính..."
                  defaultValue={apiData ? apiData.targetSystem : ''}
                />
              </div>

              <div>
                <label className={LABEL_CLS}>
                  Lịch trình chạy đối soát <span className={REQUIRED_MARK}>*</span>
                </label>
                <select
                  name="schedule"
                  className={SELECT_CLS}
                  defaultValue={apiData ? apiData.schedule : 'Định kỳ (Hàng ngày) / Theo yêu cầu'}
                >
                  <option value="Định kỳ (Hàng ngày) / Theo yêu cầu">Định kỳ (Hàng ngày) / Theo yêu cầu</option>
                  <option value="Định kỳ (Hàng tuần) / Theo yêu cầu">Định kỳ (Hàng tuần) / Theo yêu cầu</option>
                  <option value="Định kỳ (Hàng tháng) / Theo yêu cầu">Định kỳ (Hàng tháng) / Theo yêu cầu</option>
                  <option value="Theo yêu cầu">Chỉ chạy theo yêu cầu</option>
                </select>
              </div>

              <div>
                <label className={LABEL_CLS}>
                  Trạng thái hoạt động <span className={REQUIRED_MARK}>*</span>
                </label>
                <select
                  name="status"
                  className={SELECT_CLS}
                  defaultValue={apiData ? apiData.status : 'active'}
                >
                  <option value="active">Kích hoạt (Hoạt động)</option>
                  <option value="inactive">Tạm ngưng</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className={LABEL_CLS}>
                  API Cung cấp dữ liệu liên kết đối soát
                </label>
                <select
                  name="linkedApi"
                  className={SELECT_CLS}
                  defaultValue={apiData ? apiData.linkedApi : 'Lấy danh sách Hộ tịch'}
                >
                  <option value="Lấy danh sách Hộ tịch">Lấy danh sách Hộ tịch (/api/v1/hotich/list)</option>
                  <option value="Đồng bộ dữ liệu THADS">Đồng bộ dữ liệu THADS (/api/v1/thads/sync)</option>
                  <option value="Đọc thông tin Biện pháp bảo đảm">Đọc thông tin Biện pháp bảo đảm (/api/v1/bpbd/get)</option>
                  <option value="Tra cứu Cơ sở dữ liệu Pháp luật">Tra cứu Cơ sở dữ liệu Pháp luật (/api/v1/phapluat/search)</option>
                </select>
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className={BTN_OUTLINE}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className={BTN_PRIMARY}
            >
              <Check className="w-4 h-4" />
              {apiData ? 'Lưu thay đổi' : 'Tạo mới'}
            </button>
          </div>
        </form>

      </div>
    </div>
  , document.body);
}
